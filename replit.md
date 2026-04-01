# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Authentication: Replit Auth (OpenID Connect with PKCE) via `openid-client`, session cookies, DB-backed sessions
- OIDC handshake state (code_verifier, nonce, state, returnTo) is stored server-side in `oidc_state` table (not cookies) to avoid third-party cookie issues in iframe contexts
- Auth routes: `/api/login`, `/api/callback`, `/api/logout`, `/api/auth/user`
- Auth middleware in `src/middlewares/authMiddleware.ts` populates `req.user` / `req.isAuthenticated()`
- CORS: `cors({ credentials: true, origin: true })` — reflects any origin for cookie-based auth through Replit proxy
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/auth.ts` — `usersTable` (with `tier` column for pro status), `sessionsTable`, `oidcStateTable`
- `src/schema/signals.ts` — `signalsTable`, `watchlistTable` (per-user with `userId` FK and composite unique on `userId+ticker`)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `artifacts/edgeiq` (`@workspace/edgeiq`)

React + Vite frontend for the EdgeIQ market intelligence platform.

- **Multi-language (i18n)**: 5 languages (EN, FR, DE, ES, NL) via custom React context (`src/i18n/`). `useI18n()` hook provides `{ locale, setLocale, t }`. Language persisted in `localStorage` key `edgeiq_locale`, auto-detects browser language. Language switcher in sidebar (desktop) and mobile menu.
- **Pages**: Landing, Dashboard, Signals (with paywall), Watchlist, TickerDetail, NotFound — all fully translated.
- **Auth**: Uses `@workspace/replit-auth-web` `useAuth()` hook. Sign-in/out in sidebar + header.
- **Stripe**: €9/month Early, €19/month Pro, and €49/month Elite checkout via `/api/checkout/create-session`. Pro status persisted in `users.tier` DB column (updated by Stripe webhook on `checkout.session.completed`). Frontend checks `user.tier` from `/api/auth/user`.
- **Signals**: 20 demo signals seeded, FREE_SIGNAL_LIMIT = 3, blurred paywall for locked signals.
- **AI Insights**: Each signal includes an `aiInsight` field with institutional-grade analysis explaining the signal's significance. Displayed in a styled box with sparkle icon on the SignalCard. Free users see blurred AI insights with "Upgrade to unlock" button overlay.
- **High Conviction Badge**: Signals with `convictionScore >= 85` show a "HIGH CONVICTION" flame badge, primary-colored top border glow, and percentage next to the action badge.
- **Activation Flow Components**:
  - `UpgradeModal.tsx` — Triggered from locked content, shows feature list + calls backend `/api/checkout/create-session` to create Stripe checkout.
  - `FeaturedSignal.tsx` — Prominent high-conviction signal card at top of Dashboard with conviction score ring, AI insight (locked/unlocked), and "View Full Analysis" CTA.
  - `LiveActivityTicker.tsx` — Animated ticker showing "+N signals detected in the last hour" and "N traders upgraded recently" with randomized realistic counts.
  - `SignalCard.tsx` — Accepts `lockInsight` and `onUpgradeClick` props to blur AI insights for free users with an upgrade button overlay.
- **Layout sidebar**: Shows "Free Plan" badge and "Unlock All Signals" CTA button for non-unlocked users.
- **Landing page**: Aggressive conversion-optimized copy — "Start Free — Get 3 Live Signals" CTA, "Most traders choose this" Pro badge, urgency text under Pro/Elite buttons, friction triggers (X marks) on Free plan showing limitations, stronger final CTA "Get Your First Winning Signal in Seconds". All copy translated across 5 languages.
- **i18n keys**: Full activation flow translated in all 5 locales — `upgradeModal.*`, `signalCard.aiInsight/upgradeToUnlock`, `dashboard.featuredSignal/highConvictionSignal/viewFullAnalysis/signalsDetected/tradersUpgraded/freePlan/unlockAllSignals`, `proUrgency`, `eliteUrgency`, `freeLimitation1`, `freeLimitation2`, `tradersBadge`.
- **date-fns locales**: Signal timestamps use locale-aware `formatDistanceToNow`.

### `lib/replit-auth-web` (`@workspace/replit-auth-web`)

Browser-side auth hook for React. Exports `useAuth()` which returns `{ user, isLoading, isAuthenticated, login, logout }`. The `user` object includes `tier` field (from DB). Fetches `/api/auth/user` with credentials. No external dependencies beyond React.

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
