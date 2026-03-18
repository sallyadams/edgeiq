import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { signalsTable } from "@workspace/db/schema";
import { eq, desc, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/signals", async (req, res) => {
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

    res.json(signals.map(s => ({
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
      source: s.source,
      reportedAt: s.reportedAt,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch signals" });
  }
});

router.get("/signals/top", async (_req, res) => {
  try {
    const signals = await db
      .select()
      .from(signalsTable)
      .orderBy(desc(signalsTable.convictionScore))
      .limit(10);

    res.json(signals.map(s => ({
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
      source: s.source,
      reportedAt: s.reportedAt,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top signals" });
  }
});

router.get("/signals/:ticker/history", async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const signals = await db
      .select()
      .from(signalsTable)
      .where(eq(signalsTable.ticker, ticker))
      .orderBy(desc(signalsTable.reportedAt))
      .limit(100);

    res.json(signals.map(s => ({
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
      source: s.source,
      reportedAt: s.reportedAt,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch signal history" });
  }
});

export default router;
