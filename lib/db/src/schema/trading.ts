import { pgTable, varchar, serial, real, timestamp, text, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const portfoliosTable = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => usersTable.id).unique(),
  balance: real("balance").notNull().default(10000),
  initialBalance: real("initial_balance").notNull().default(10000),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export type Portfolio = typeof portfoliosTable.$inferSelect;
export type InsertPortfolio = typeof portfoliosTable.$inferInsert;

export const positionsTable = pgTable("positions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => usersTable.id),
  ticker: text("ticker").notNull(),
  side: text("side").notNull(),
  quantity: integer("quantity").notNull(),
  entryPrice: real("entry_price").notNull(),
  currentPrice: real("current_price").notNull(),
  status: text("status").notNull().default("open"),
  openedAt: timestamp("opened_at").notNull().defaultNow(),
  closedAt: timestamp("closed_at"),
});

export type Position = typeof positionsTable.$inferSelect;
export type InsertPosition = typeof positionsTable.$inferInsert;

export const tradesTable = pgTable("trades", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => usersTable.id),
  ticker: text("ticker").notNull(),
  side: text("side").notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  total: real("total").notNull(),
  positionId: integer("position_id").references(() => positionsTable.id),
  executedAt: timestamp("executed_at").notNull().defaultNow(),
});

export type Trade = typeof tradesTable.$inferSelect;
export type InsertTrade = typeof tradesTable.$inferInsert;
