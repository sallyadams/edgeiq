import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { watchlistTable, signalsTable } from "@workspace/db/schema";
import { eq, desc, and } from "drizzle-orm";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): req is Request & { user: Express.User } {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Authentication required" });
    return false;
  }
  return true;
}

router.get("/watchlist", async (req, res) => {
  if (!requireAuth(req, res)) return;
  const userId = req.user!.id;

  try {
    const items = await db
      .select()
      .from(watchlistTable)
      .where(eq(watchlistTable.userId, userId))
      .orderBy(desc(watchlistTable.addedAt));

    const enriched = await Promise.all(items.map(async (item) => {
      const latestSignal = await db
        .select({ score: signalsTable.convictionScore })
        .from(signalsTable)
        .where(eq(signalsTable.ticker, item.ticker))
        .orderBy(desc(signalsTable.reportedAt))
        .limit(1);

      return {
        id: item.id,
        ticker: item.ticker,
        addedAt: item.addedAt,
        latestSignalScore: latestSignal[0]?.score ?? null,
      };
    }));

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

router.post("/watchlist", async (req, res) => {
  if (!requireAuth(req, res)) return;
  const userId = req.user!.id;

  try {
    const { ticker } = req.body as { ticker: string };
    if (!ticker) {
      return res.status(400).json({ error: "ticker is required" });
    }

    const [item] = await db
      .insert(watchlistTable)
      .values({ userId, ticker: ticker.toUpperCase() })
      .onConflictDoNothing()
      .returning();

    if (!item) {
      const existing = await db
        .select()
        .from(watchlistTable)
        .where(and(eq(watchlistTable.userId, userId), eq(watchlistTable.ticker, ticker.toUpperCase())))
        .limit(1);
      return res.status(201).json({ ...existing[0], latestSignalScore: null });
    }

    return res.status(201).json({ ...item, latestSignalScore: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add to watchlist" });
  }
});

router.delete("/watchlist/:ticker", async (req, res) => {
  if (!requireAuth(req, res)) return;
  const userId = req.user!.id;

  try {
    const ticker = req.params.ticker.toUpperCase();
    await db
      .delete(watchlistTable)
      .where(and(eq(watchlistTable.userId, userId), eq(watchlistTable.ticker, ticker)));
    res.json({ success: true, message: `${ticker} removed from watchlist` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove from watchlist" });
  }
});

export default router;
