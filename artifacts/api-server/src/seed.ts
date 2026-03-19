import { db } from "@workspace/db";
import { signalsTable } from "@workspace/db/schema";
import { count } from "drizzle-orm";

const now = new Date();
const h = (hrs: number) => new Date(now.getTime() - hrs * 3600000);

const DEMO_SIGNALS = [
  { ticker: "SPY",   type: "options",  action: "BULLISH", description: "Unusual call sweep: 12,000 SPY 580C expiring 14 days, premium $18.4M", convictionScore: 91, winRate: 0.74, valueUsd: 18400000, filerName: null, expiryDate: "2026-04-01", strikePrice: 580, optionType: "CALL", sentiment: null, source: "options-flow", reportedAt: h(0.2) },
  { ticker: "NVDA",  type: "insider",  action: "BUY",     description: "CEO Jensen Huang purchased 50,000 shares on open market — largest insider buy in 2 years", convictionScore: 94, winRate: 0.82, valueUsd: 43750000, filerName: "Jensen Huang", expiryDate: null, strikePrice: null, optionType: null, sentiment: null, source: "sec-form4", reportedAt: h(0.5) },
  { ticker: "QQQ",   type: "options",  action: "BULLISH", description: "Massive call block: 20,000 QQQ $510C premium $22.1M — largest options print this week", convictionScore: 96, winRate: 0.77, valueUsd: 22100000, filerName: null, expiryDate: "2026-04-17", strikePrice: 510, optionType: "CALL", sentiment: null, source: "options-flow", reportedAt: h(0.7) },
  { ticker: "NVDA",  type: "sentiment",action: "BUY",     description: "Extreme bullish sentiment shift: 94% positive mentions across financial forums, earnings beat speculation rising", convictionScore: 83, winRate: 0.69, valueUsd: null, filerName: null, expiryDate: null, strikePrice: null, optionType: null, sentiment: "bullish", source: "social", reportedAt: h(0.9) },
  { ticker: "AAPL",  type: "insider",  action: "BUY",     description: "Director Arthur Levinson acquired 12,000 shares — largest purchase in 3 years", convictionScore: 88, winRate: 0.76, valueUsd: 2280000, filerName: "Arthur Levinson", expiryDate: null, strikePrice: null, optionType: null, sentiment: null, source: "sec-form4", reportedAt: h(1.2) },
  { ticker: "NVDA",  type: "options",  action: "BULLISH", description: "Unusual call sweep: 5,000 $900C expiring 30 days, premium $8.2M", convictionScore: 92, winRate: 0.74, valueUsd: 8200000, filerName: null, expiryDate: "2026-04-18", strikePrice: 900, optionType: "CALL", sentiment: null, source: "options-flow", reportedAt: h(1.0) },
  { ticker: "AMD",   type: "options",  action: "BEARISH", description: "Large put block: 8,000 $130P expiring 21 days, premium $4.1M — smart money hedging", convictionScore: 83, winRate: 0.69, valueUsd: 4100000, filerName: null, expiryDate: "2026-04-08", strikePrice: 130, optionType: "PUT", sentiment: null, source: "options-flow", reportedAt: h(2.1) },
  { ticker: "META",  type: "insider",  action: "SELL",    description: "COO Javier Olivan sold 8,500 shares via pre-planned 10b5-1 plan", convictionScore: 61, winRate: 0.58, valueUsd: 4335000, filerName: "Javier Olivan", expiryDate: null, strikePrice: null, optionType: null, sentiment: null, source: "sec-form4", reportedAt: h(2.8) },
  { ticker: "AAPL",  type: "sentiment",action: "BUY",     description: "Institutional sentiment score hit 10-month high following Vision Pro supply chain reports", convictionScore: 78, winRate: 0.65, valueUsd: null, filerName: null, expiryDate: null, strikePrice: null, optionType: null, sentiment: "bullish", source: "social", reportedAt: h(2.3) },
  { ticker: "TSLA",  type: "options",  action: "BULLISH", description: "Call sweep 7,500 $280C expiring 45 days — institutional positioning ahead of earnings", convictionScore: 86, winRate: 0.72, valueUsd: 6750000, filerName: null, expiryDate: "2026-05-02", strikePrice: 280, optionType: "CALL", sentiment: null, source: "options-flow", reportedAt: h(3.5) },
  { ticker: "TSLA",  type: "sentiment",action: "SELL",    description: "Bearish divergence: social volume up 340% but predominantly negative — delivery miss fears", convictionScore: 80, winRate: 0.67, valueUsd: null, filerName: null, expiryDate: null, strikePrice: null, optionType: null, sentiment: "bearish", source: "social", reportedAt: h(3.7) },
  { ticker: "GOOGL", type: "options",  action: "BEARISH", description: "Put sweep 3,000 $155P expiring 10 days — defensive positioning before FOMC", convictionScore: 77, winRate: 0.66, valueUsd: 2900000, filerName: null, expiryDate: "2026-03-27", strikePrice: 155, optionType: "PUT", sentiment: null, source: "options-flow", reportedAt: h(4.2) },
  { ticker: "TSLA",  type: "insider",  action: "BUY",     description: "Board member Kathleen Wilson-Thompson purchased 5,000 shares after recent dip", convictionScore: 79, winRate: 0.71, valueUsd: 990000, filerName: "K. Wilson-Thompson", expiryDate: null, strikePrice: null, optionType: null, sentiment: null, source: "sec-form4", reportedAt: h(5.1) },
  { ticker: "MSFT",  type: "sentiment",action: "BUY",     description: "AI revenue acceleration narrative gaining momentum — analyst sentiment at 18-month peak", convictionScore: 87, winRate: 0.73, valueUsd: null, filerName: null, expiryDate: null, strikePrice: null, optionType: null, sentiment: "bullish", source: "social", reportedAt: h(5.6) },
  { ticker: "MSFT",  type: "insider",  action: "BUY",     description: "CFO Amy Hood acquired 3,200 shares — first open market buy in 18 months", convictionScore: 85, winRate: 0.79, valueUsd: 1376000, filerName: "Amy Hood", expiryDate: null, strikePrice: null, optionType: null, sentiment: null, source: "sec-form4", reportedAt: h(8.3) },
  { ticker: "JPM",   type: "options",  action: "BULLISH", description: "Call block 4,500 $240C expiring 60 days — financial sector rotation signal", convictionScore: 81, winRate: 0.70, valueUsd: 5400000, filerName: null, expiryDate: "2026-05-15", strikePrice: 240, optionType: "CALL", sentiment: null, source: "options-flow", reportedAt: h(6.9) },
  { ticker: "META",  type: "sentiment",action: "BUY",     description: "Threads MAU milestone driving bullish momentum — institutional coverage upgrades accelerating", convictionScore: 75, winRate: 0.64, valueUsd: null, filerName: null, expiryDate: null, strikePrice: null, optionType: null, sentiment: "bullish", source: "social", reportedAt: h(7.2) },
  { ticker: "AMD",   type: "sentiment",action: "SELL",    description: "Server GPU demand concern: supply chain checks show inventory build — sentiment turning negative", convictionScore: 72, winRate: 0.63, valueUsd: null, filerName: null, expiryDate: null, strikePrice: null, optionType: null, sentiment: "bearish", source: "social", reportedAt: h(9.1) },
  { ticker: "AMZN",  type: "insider",  action: "SELL",    description: "Director Jamie Gorelick sold 15,000 shares — routine liquidity event", convictionScore: 52, winRate: 0.54, valueUsd: 2895000, filerName: "Jamie Gorelick", expiryDate: null, strikePrice: null, optionType: null, sentiment: null, source: "sec-form4", reportedAt: h(11.4) },
  { ticker: "AMZN",  type: "sentiment",action: "BUY",     description: "AWS growth reacceleration thesis gaining institutional traction — 87% of coverage bullish", convictionScore: 89, winRate: 0.75, valueUsd: null, filerName: null, expiryDate: null, strikePrice: null, optionType: null, sentiment: "bullish", source: "social", reportedAt: h(10.4) },
];

export async function seedDemoSignals() {
  try {
    const [{ value: existing }] = await db.select({ value: count() }).from(signalsTable);
    if (existing > 0) {
      console.log(`[seed] ${existing} signals already present — skipping demo seed`);
      return;
    }
    await db.insert(signalsTable).values(DEMO_SIGNALS);
    console.log(`[seed] Inserted ${DEMO_SIGNALS.length} demo signals`);
  } catch (err) {
    console.error("[seed] Failed to seed demo signals:", err);
  }
}
