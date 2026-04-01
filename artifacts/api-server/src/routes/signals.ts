import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { signalsTable, usersTable } from "@workspace/db/schema";
import { eq, desc, and } from "drizzle-orm";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): req is Request & { user: Express.User } {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Authentication required" });
    return false;
  }
  return true;
}

async function isProUser(userId: string): Promise<boolean> {
  const [user] = await db
    .select({ tier: usersTable.tier })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  return user?.tier === "pro" || user?.tier === "elite";
}

function mapSignal(s: typeof signalsTable.$inferSelect, isPro: boolean) {
  return {
    id: s.id,
    ticker: s.ticker,
    type: s.type,
    action: s.action,
    description: s.description,
    convictionScore: s.convictionScore,
    winRate: s.winRate,
    valueUsd: s.valueUsd,
    filerName: s.filerName,
    expiryDate: s.expiryDate,
    strikePrice: s.strikePrice,
    optionType: s.optionType,
    sentiment: s.sentiment,
    aiInsight: isPro ? s.aiInsight : null,
    source: s.source,
    reportedAt: s.reportedAt,
  };
}

router.get("/signals", async (req, res) => {
  if (!requireAuth(req, res)) return;
  const isPro = await isProUser(req.user!.id);

  try {
    const { type, ticker, limit } = req.query as { type?: string; ticker?: string; limit?: string };
    const limitNum = limit ? parseInt(limit) : 50;

    let conditions = [];
    if (type && type !== "all") {
      conditions.push(eq(signalsTable.type, type));
    }
    if (ticker) {
      conditions.push(eq(signalsTable.ticker, ticker.toUpperCase()));
    }

    const signals = await db
      .select()
      .from(signalsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(signalsTable.reportedAt))
      .limit(limitNum);

    res.json(signals.map(s => mapSignal(s, isPro)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch signals" });
  }
});

router.get("/signals/top", async (req, res) => {
  if (!requireAuth(req, res)) return;
  const isPro = await isProUser(req.user!.id);

  try {
    const signals = await db
      .select()
      .from(signalsTable)
      .orderBy(desc(signalsTable.convictionScore))
      .limit(10);

    res.json(signals.map(s => mapSignal(s, isPro)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top signals" });
  }
});

router.get("/signals/:ticker/history", async (req, res) => {
  if (!requireAuth(req, res)) return;
  const isPro = await isProUser(req.user!.id);

  try {
    const ticker = req.params.ticker.toUpperCase();
    const signals = await db
      .select()
      .from(signalsTable)
      .where(eq(signalsTable.ticker, ticker))
      .orderBy(desc(signalsTable.reportedAt))
      .limit(100);

    res.json(signals.map(s => mapSignal(s, isPro)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch signal history" });
  }
});

export default router;
