import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { signalsTable } from "@workspace/db/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

const router: IRouter = Router();

const MOCK_PRICES: Record<string, { price: number; change: number; changePercent: number; volume: number; marketCap: string; pe: number; high52w: number; low52w: number }> = {
  NVDA: { price: 875.32, change: 12.45, changePercent: 1.44, volume: 45_200_000, marketCap: "2.16T", pe: 65.2, high52w: 974.00, low52w: 405.00 },
  TSLA: { price: 248.50, change: -3.20, changePercent: -1.27, volume: 89_100_000, marketCap: "791B", pe: 72.1, high52w: 299.29, low52w: 138.80 },
  AAPL: { price: 213.18, change: 1.85, changePercent: 0.87, volume: 52_400_000, marketCap: "3.28T", pe: 33.4, high52w: 237.23, low52w: 164.08 },
  MSFT: { price: 415.20, change: -1.10, changePercent: -0.26, volume: 18_900_000, marketCap: "3.08T", pe: 36.8, high52w: 468.35, low52w: 366.50 },
  META: { price: 556.84, change: 8.23, changePercent: 1.50, volume: 14_300_000, marketCap: "1.42T", pe: 28.4, high52w: 589.00, low52w: 352.48 },
  AMZN: { price: 194.50, change: 2.10, changePercent: 1.09, volume: 31_500_000, marketCap: "2.04T", pe: 43.2, high52w: 218.00, low52w: 156.00 },
  GOOGL: { price: 178.34, change: -0.56, changePercent: -0.31, volume: 22_100_000, marketCap: "2.19T", pe: 25.1, high52w: 193.31, low52w: 129.40 },
  AMD: { price: 168.42, change: 4.12, changePercent: 2.51, volume: 67_800_000, marketCap: "273B", pe: 288.5, high52w: 227.30, low52w: 116.37 },
  PLTR: { price: 82.50, change: 5.20, changePercent: 6.72, volume: 124_000_000, marketCap: "177B", pe: 330.0, high52w: 83.89, low52w: 17.46 },
  COIN: { price: 245.30, change: 12.80, changePercent: 5.51, volume: 18_500_000, marketCap: "62B", pe: 41.2, high52w: 349.75, low52w: 115.45 },
};

router.get("/market/quote/:ticker", async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const base = MOCK_PRICES[ticker] || {
      price: 100 + Math.random() * 500,
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 50_000_000),
      marketCap: `${Math.floor(Math.random() * 500)}B`,
      pe: 20 + Math.random() * 60,
      high52w: 200 + Math.random() * 300,
      low52w: 50 + Math.random() * 100,
    };

    res.json({ ticker, ...base });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

router.get("/market/stats", async (_req, res) => {
  try {
    const totalSignals = await db.select({ count: sql<number>`count(*)` }).from(signalsTable);
    const buySignals = await db.select({ count: sql<number>`count(*)` }).from(signalsTable).where(eq(signalsTable.action, "BUY"));
    const total = Number(totalSignals[0].count) || 1;
    const buys = Number(buySignals[0].count) || 0;

    res.json({
      overallSentiment: buys / total > 0.55 ? "BULLISH" : buys / total < 0.45 ? "BEARISH" : "NEUTRAL",
      fearGreedIndex: 58,
      insiderBuyRatio: Math.round((buys / total) * 100) / 100,
      optionsFlowBias: "BULLISH",
      totalSignalsToday: total,
      bullishSignals: buys,
      bearishSignals: total - buys,
      topSectors: [
        { name: "Technology", score: 82 },
        { name: "Energy", score: 71 },
        { name: "Healthcare", score: 65 },
        { name: "Financials", score: 58 },
        { name: "Consumer", score: 49 },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch market stats" });
  }
});

export default router;
