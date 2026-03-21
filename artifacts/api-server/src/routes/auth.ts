import * as oidc from "openid-client";
import { Router, type IRouter, type Request, type Response } from "express";
import { db, usersTable, oidcStateTable } from "@workspace/db";
import { eq, lt } from "drizzle-orm";
import {
  clearSession,
  getOidcConfig,
  getSessionId,
  createSession,
  SESSION_COOKIE,
  SESSION_TTL,
  type SessionData,
} from "../lib/auth";

const OIDC_STATE_TTL = 10 * 60 * 1000;

const router: IRouter = Router();

function getOrigin(req: Request): string {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host =
    req.headers["x-forwarded-host"] || req.headers["host"] || "localhost";
  return `${proto}://${host}`;
}

function setSessionCookie(res: Response, sid: string) {
  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

function getSafeReturnTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

async function upsertUser(claims: Record<string, unknown>) {
  const userData = {
    id: claims.sub as string,
    email: (claims.email as string) || null,
    firstName: (claims.first_name as string) || null,
    lastName: (claims.last_name as string) || null,
    profileImageUrl: (claims.profile_image_url || claims.picture) as string | null,
  };

  const [user] = await db
    .insert(usersTable)
    .values(userData)
    .onConflictDoUpdate({
      target: usersTable.id,
      set: {
        ...userData,
        updatedAt: new Date(),
      },
    })
    .returning();
  return user;
}

router.get("/auth/user", (req: Request, res: Response) => {
  res.json({
    user: req.isAuthenticated() ? req.user : null,
  });
});

router.get("/login", async (req: Request, res: Response) => {
  try {
    const config = await getOidcConfig();
    const callbackUrl = `${getOrigin(req)}/api/callback`;
    const returnTo = getSafeReturnTo(req.query.returnTo);

    const state = oidc.randomState();
    const nonce = oidc.randomNonce();
    const codeVerifier = oidc.randomPKCECodeVerifier();
    const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);

    await db.delete(oidcStateTable).where(lt(oidcStateTable.expire, new Date()));

    await db.insert(oidcStateTable).values({
      state,
      codeVerifier,
      nonce,
      returnTo,
      expire: new Date(Date.now() + OIDC_STATE_TTL),
    });

    const redirectTo = oidc.buildAuthorizationUrl(config, {
      redirect_uri: callbackUrl,
      scope: "openid email profile offline_access",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      prompt: "login consent",
      state,
      nonce,
    });

    res.redirect(redirectTo.href);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to initiate login" });
  }
});

router.get("/callback", async (req: Request, res: Response) => {
  const config = await getOidcConfig();
  const callbackUrl = `${getOrigin(req)}/api/callback`;

  const incomingState = req.query.state as string | undefined;
  if (!incomingState) {
    console.error("Auth callback: no state parameter in callback URL");
    res.redirect("/api/login");
    return;
  }

  const [oidcRow] = await db
    .select()
    .from(oidcStateTable)
    .where(eq(oidcStateTable.state, incomingState));

  if (!oidcRow || oidcRow.expire < new Date()) {
    console.error("Auth callback: OIDC state not found or expired");
    if (oidcRow) {
      await db.delete(oidcStateTable).where(eq(oidcStateTable.state, incomingState));
    }
    res.redirect("/api/login");
    return;
  }

  await db.delete(oidcStateTable).where(eq(oidcStateTable.state, incomingState));

  const currentUrl = new URL(
    `${callbackUrl}?${new URL(req.url, `http://${req.headers.host}`).searchParams}`,
  );

  let tokens: oidc.TokenEndpointResponse & oidc.TokenEndpointResponseHelpers;
  try {
    tokens = await oidc.authorizationCodeGrant(config, currentUrl, {
      pkceCodeVerifier: oidcRow.codeVerifier,
      expectedNonce: oidcRow.nonce,
      expectedState: oidcRow.state,
      idTokenExpected: true,
    });
  } catch (err) {
    console.error("Auth callback: token exchange failed:", err);
    res.redirect("/api/login");
    return;
  }

  const returnTo = getSafeReturnTo(oidcRow.returnTo);

  const claims = tokens.claims();
  if (!claims) {
    console.error("Auth callback: no claims in ID token");
    res.redirect("/api/login");
    return;
  }

  try {
    const dbUser = await upsertUser(claims as unknown as Record<string, unknown>);

    const now = Math.floor(Date.now() / 1000);
    const sessionData: SessionData = {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        profileImageUrl: dbUser.profileImageUrl,
      },
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expiresIn() ? now + tokens.expiresIn()! : claims.exp,
    };

    const sid = await createSession(sessionData);
    setSessionCookie(res, sid);
    res.redirect(returnTo);
  } catch (err) {
    console.error("Auth callback: session/user creation failed:", err);
    res.redirect("/api/login");
  }
});

router.get("/logout", async (req: Request, res: Response) => {
  try {
    const config = await getOidcConfig();
    const origin = getOrigin(req);

    const sid = getSessionId(req);
    await clearSession(res, sid);

    const endSessionUrl = oidc.buildEndSessionUrl(config, {
      client_id: process.env.REPL_ID!,
      post_logout_redirect_uri: origin,
    });

    res.redirect(endSessionUrl.href);
  } catch (err) {
    console.error("Logout error:", err);
    res.clearCookie(SESSION_COOKIE, { path: "/" });
    res.redirect("/");
  }
});

export default router;
