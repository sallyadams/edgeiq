import { db } from "@workspace/db";
import { signalsTable, watchlistTable } from "@workspace/db/schema";

const insiderSignals = [
  { ticker: "NVDA", type: "insider", action: "BUY", description: "CEO Jensen Huang purchased 50,000 shares", convictionScore: 94, winRate: 0.82, valueUsd: 43750000, filerName: "Jensen Huang", source: "SEC Form 4" },
  { ticker: "META", type: "insider", action: "BUY", description: "CFO Susan Li acquired 12,000 shares open market", convictionScore: 88, winRate: 0.79, valueUsd: 6681000, filerName: "Susan Li", source: "SEC Form 4" },
  { ticker: "PLTR", type: "insider", action: "BUY", description: "Director Peter Thiel purchased 2M shares", convictionScore: 96, winRate: 0.85, valueUsd: 165000000, filerName: "Peter Thiel", source: "SEC Form 4" },
  { ticker: "AMD", type: "insider", action: "BUY", description: "CEO Lisa Su purchased 25,000 shares", convictionScore: 91, winRate: 0.80, valueUsd: 4210500, filerName: "Lisa Su", source: "SEC Form 4" },
  { ticker: "AAPL", type: "insider", action: "SELL", description: "Tim Cook sold 511,000 shares via 10b5-1 plan", convictionScore: 31, winRate: 0.55, valueUsd: 108941000, filerName: "Tim Cook", source: "SEC Form 4" },
  { ticker: "TSLA", type: "insider", action: "SELL", description: "Elon Musk sold 3.97M shares", convictionScore: 22, winRate: 0.48, valueUsd: 987000000, filerName: "Elon Musk", source: "SEC Form 4" },
  { ticker: "COIN", type: "insider", action: "BUY", description: "Director Marc Andreessen purchased 500K shares", convictionScore: 89, winRate: 0.77, valueUsd: 122650000, filerName: "Marc Andreessen", source: "SEC Form 4" },
  { ticker: "MSFT", type: "insider", action: "BUY", description: "President Brad Smith acquired 10,000 shares", convictionScore: 76, winRate: 0.72, valueUsd: 4152000, filerName: "Brad Smith", source: "SEC Form 4" },
];

const optionsSignals = [
  { ticker: "NVDA", type: "options", action: "BUY", description: "Unusual call sweep: 5,000 $900C expiring 30 days, premium $8.2M", convictionScore: 92, winRate: 0.74, valueUsd: 8200000, optionType: "CALL", strikePrice: 900, expiryDate: "2026-04-18", source: "Options Flow" },
  { ticker: "META", type: "options", action: "BUY", description: "Block trade: 2,000 $570C expiring next week, $3.1M premium", convictionScore: 87, winRate: 0.71, valueUsd: 3100000, optionType: "CALL", strikePrice: 570, expiryDate: "2026-03-25", source: "Options Flow" },
  { ticker: "TSLA", type: "options", action: "SELL", description: "Large put sweep: 10,000 $220P expiring 2 weeks, $5.5M", convictionScore: 78, winRate: 0.68, valueUsd: 5500000, optionType: "PUT", strikePrice: 220, expiryDate: "2026-04-04", source: "Options Flow" },
  { ticker: "AMD", type: "options", action: "BUY", description: "Massive call sweep: 15,000 $180C 60 DTE, $12.3M premium", convictionScore: 93, winRate: 0.76, valueUsd: 12300000, optionType: "CALL", strikePrice: 180, expiryDate: "2026-05-16", source: "Options Flow" },
  { ticker: "PLTR", type: "options", action: "BUY", description: "Aggressive call buying: 8,000 $90C expiring monthly, $6.4M", convictionScore: 85, winRate: 0.70, valueUsd: 6400000, optionType: "CALL", strikePrice: 90, expiryDate: "2026-04-17", source: "Options Flow" },
  { ticker: "COIN", type: "options", action: "BUY", description: "Block call: 3,000 $280C expiring 45 DTE, $4.2M premium", convictionScore: 88, winRate: 0.72, valueUsd: 4200000, optionType: "CALL", strikePrice: 280, expiryDate: "2026-05-02", source: "Options Flow" },
  { ticker: "AAPL", type: "options", action: "SELL", description: "Put sweep: 6,000 $200P expiring 3 weeks, $2.8M", convictionScore: 65, winRate: 0.61, valueUsd: 2800000, optionType: "PUT", strikePrice: 200, expiryDate: "2026-04-11", source: "Options Flow" },
  { ticker: "GOOGL", type: "options", action: "BUY", description: "Call sweep: 4,000 $185C expiring monthly, $3.6M premium", convictionScore: 79, winRate: 0.67, valueUsd: 3600000, optionType: "CALL", strikePrice: 185, expiryDate: "2026-04-17", source: "Options Flow" },
];

const sentimentSignals = [
  { ticker: "NVDA", type: "sentiment", action: "BUY", description: "Extreme bullish sentiment shift: 94% positive mentions across financial forums, earnings beat speculation rising", convictionScore: 83, winRate: 0.69, sentiment: "BULLISH", source: "AI Sentiment Engine" },
  { ticker: "PLTR", type: "sentiment", action: "BUY", description: "Government contract rumors driving 340% spike in positive sentiment, AI division highlights dominate", convictionScore: 81, winRate: 0.66, sentiment: "BULLISH", source: "AI Sentiment Engine" },
  { ticker: "TSLA", type: "sentiment", action: "SELL", description: "Bearish sentiment surge: 78% negative mentions, deliveries miss concerns mounting across social platforms", convictionScore: 74, winRate: 0.64, sentiment: "BEARISH", source: "AI Sentiment Engine" },
  { ticker: "AMD", type: "sentiment", action: "BUY", description: "Positive sentiment breakout on MI300X GPU sell-out reports, data center demand commentary bullish", convictionScore: 80, winRate: 0.67, sentiment: "BULLISH", source: "AI Sentiment Engine" },
  { ticker: "META", type: "sentiment", action: "BUY", description: "Ad revenue optimism driving bullish sentiment wave, AI monetization thesis gaining traction", convictionScore: 76, winRate: 0.65, sentiment: "BULLISH", source: "AI Sentiment Engine" },
  { ticker: "COIN", type: "sentiment", action: "BUY", description: "Crypto regulatory clarity euphoria drives 89% bullish mentions, ETF flow commentary very positive", convictionScore: 86, winRate: 0.71, sentiment: "BULLISH", source: "AI Sentiment Engine" },
  { ticker: "MSFT", type: "sentiment", action: "BUY", description: "Azure AI growth story dominating narrative, Copilot enterprise adoption accelerating per channel checks", convictionScore: 72, winRate: 0.63, sentiment: "BULLISH", source: "AI Sentiment Engine" },
  { ticker: "AAPL", type: "sentiment", action: "SELL", description: "China sales weakness sentiment building, iPhone upgrade cycle concerns emerging from supply chain", convictionScore: 68, winRate: 0.60, sentiment: "BEARISH", source: "AI Sentiment Engine" },
];

const now = new Date();
const dayMs = 24 * 60 * 60 * 1000;

async function seed() {
  console.log("Seeding signals...");

  await db.delete(signalsTable);
  await db.delete(watchlistTable);

  const allSignals = [
    ...insiderSignals.map((s, i) => ({ ...s, reportedAt: new Date(now.getTime() - i * 2 * 60 * 60 * 1000) })),
    ...optionsSignals.map((s, i) => ({ ...s, reportedAt: new Date(now.getTime() - i * 1.5 * 60 * 60 * 1000) })),
    ...sentimentSignals.map((s, i) => ({ ...s, reportedAt: new Date(now.getTime() - i * 3 * 60 * 60 * 1000) })),
  ];

  await db.insert(signalsTable).values(allSignals.map(s => ({
    ticker: s.ticker,
    type: s.type,
    action: s.action,
    description: s.description,
    convictionScore: s.convictionScore,
    winRate: s.winRate,
    valueUsd: (s as any).valueUsd ?? null,
    filerName: (s as any).filerName ?? null,
    expiryDate: (s as any).expiryDate ?? null,
    strikePrice: (s as any).strikePrice ?? null,
    optionType: (s as any).optionType ?? null,
    sentiment: (s as any).sentiment ?? null,
    source: s.source ?? null,
    reportedAt: s.reportedAt,
  })));

  await db.insert(watchlistTable).values([
    { ticker: "NVDA", alertsEnabled: true },
    { ticker: "META", alertsEnabled: true },
    { ticker: "PLTR", alertsEnabled: false },
    { ticker: "AMD", alertsEnabled: true },
  ]);

  console.log("Seeding complete!");
}

seed().catch(console.error);
