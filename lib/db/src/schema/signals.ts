import { pgTable, text, serial, real, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const signalsTable = pgTable("signals", {
  id: serial("id").primaryKey(),
  ticker: text("ticker").notNull(),
  type: text("type").notNull(), // insider | options | sentiment
  action: text("action").notNull(), // BUY | SELL | BULLISH | BEARISH
  description: text("description").notNull(),
  convictionScore: real("conviction_score").notNull(),
  winRate: real("win_rate").notNull(),
  valueUsd: real("value_usd"),
  filerName: text("filer_name"),
  expiryDate: text("expiry_date"),
  strikePrice: real("strike_price"),
  optionType: text("option_type"),
  sentiment: text("sentiment"),
  aiInsight: text("ai_insight"),
  source: text("source"),
  reportedAt: timestamp("reported_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSignalSchema = createInsertSchema(signalsTable).omit({ id: true, createdAt: true });
export type InsertSignal = z.infer<typeof insertSignalSchema>;
export type Signal = typeof signalsTable.$inferSelect;

export const watchlistTable = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  ticker: text("ticker").notNull().unique(),
  alertsEnabled: boolean("alerts_enabled").notNull().default(true),
  addedAt: timestamp("added_at").notNull().defaultNow(),
});

export const insertWatchlistSchema = createInsertSchema(watchlistTable).omit({ id: true, addedAt: true });
export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type Watchlist = typeof watchlistTable.$inferSelect;
