import { Router, type Request, type Response, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  portfoliosTable,
  positionsTable,
  tradesTable,
} from "@workspace/db/schema";
import { eq, desc, and, count, sum } from "drizzle-orm";
import { placeOrder, getQuotePrice } from "../lib/broker";

const router: IRouter = Router();

const MAX_POSITION_SIZE = 5000;
const DEFAULT_BALANCE = 10000;

async function getOrCreatePortfolio(userId: string, tx: Pick<typeof db, "select" | "insert" | "update" | "delete"> = db) {
  const existing = await tx
    .select()
    .from(portfoliosTable)
    .where(eq(portfoliosTable.userId, userId))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const inserted = await tx
    .insert(portfoliosTable)
    .values({ userId, balance: DEFAULT_BALANCE, initialBalance: DEFAULT_BALANCE })
    .returning();

  return inserted[0];
}

async function computePortfolioStats(userId: string) {
  const portfolio = await getOrCreatePortfolio(userId);

  const openPositions = await db
    .select()
    .from(positionsTable)
    .where(and(eq(positionsTable.userId, userId), eq(positionsTable.status, "open")));

  let unrealizedPnl = 0;
  for (const pos of openPositions) {
    const currentPrice = await getQuotePrice(pos.ticker);
    const positionPnl =
      pos.side === "buy"
        ? (currentPrice - pos.entryPrice) * pos.quantity
        : (pos.entryPrice - currentPrice) * pos.quantity;
    unrealizedPnl += positionPnl;

    await db
      .update(positionsTable)
      .set({ currentPrice })
      .where(eq(positionsTable.id, pos.id));
  }

  unrealizedPnl = Math.round(unrealizedPnl * 100) / 100;

  const tradeCountResult = await db
    .select({ value: count() })
    .from(tradesTable)
    .where(eq(tradesTable.userId, userId));

  const totalPnl = Math.round((portfolio.balance - portfolio.initialBalance + unrealizedPnl) * 100) / 100;
  const totalPnlPercent =
    portfolio.initialBalance > 0
      ? Math.round((totalPnl / portfolio.initialBalance) * 10000) / 100
      : 0;

  return {
    balance: portfolio.balance,
    initialBalance: portfolio.initialBalance,
    totalPnl,
    totalPnlPercent,
    openPositionsCount: openPositions.length,
    totalTradesCount: Number(tradeCountResult[0]?.value ?? 0),
    unrealizedPnl,
  };
}

router.get("/portfolio", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const stats = await computePortfolioStats(req.user.id);
    res.json(stats);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

router.post("/portfolio/reset", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const userId = req.user.id;

    await db.transaction(async (tx) => {
      await tx.delete(tradesTable).where(eq(tradesTable.userId, userId));
      await tx.delete(positionsTable).where(eq(positionsTable.userId, userId));
      await tx
        .update(portfoliosTable)
        .set({ balance: DEFAULT_BALANCE, initialBalance: DEFAULT_BALANCE })
        .where(eq(portfoliosTable.userId, userId));
    });

    const stats = await computePortfolioStats(userId);
    res.json(stats);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset portfolio" });
  }
});

router.get("/positions", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const statusFilter = (req.query.status as string) || "open";
    const userId = req.user.id;

    if (!["open", "closed", "all"].includes(statusFilter)) {
      res.status(400).json({ error: "Status must be 'open', 'closed', or 'all'" });
      return;
    }

    let whereClause;
    if (statusFilter === "all") {
      whereClause = eq(positionsTable.userId, userId);
    } else {
      whereClause = and(
        eq(positionsTable.userId, userId),
        eq(positionsTable.status, statusFilter),
      );
    }

    const positions = await db
      .select()
      .from(positionsTable)
      .where(whereClause)
      .orderBy(desc(positionsTable.openedAt));

    const enriched = await Promise.all(
      positions.map(async (pos) => {
        const currentPrice = pos.status === "open" ? await getQuotePrice(pos.ticker) : pos.currentPrice;
        const pnl =
          pos.side === "buy"
            ? (currentPrice - pos.entryPrice) * pos.quantity
            : (pos.entryPrice - currentPrice) * pos.quantity;
        const pnlPercent =
          pos.entryPrice > 0
            ? Math.round((pnl / (pos.entryPrice * pos.quantity)) * 10000) / 100
            : 0;

        const result: Record<string, unknown> = {
          id: pos.id,
          ticker: pos.ticker,
          side: pos.side,
          quantity: pos.quantity,
          entryPrice: pos.entryPrice,
          currentPrice,
          pnl: Math.round(pnl * 100) / 100,
          pnlPercent,
          status: pos.status,
          openedAt: pos.openedAt.toISOString(),
        };

        if (pos.closedAt) {
          result.closedAt = pos.closedAt.toISOString();
        }

        return result;
      }),
    );

    res.json(enriched);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

router.get("/trades", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const rawLimit = Number(req.query.limit);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(Math.floor(rawLimit), 200) : 50;
    const userId = req.user.id;

    const trades = await db
      .select()
      .from(tradesTable)
      .where(eq(tradesTable.userId, userId))
      .orderBy(desc(tradesTable.executedAt))
      .limit(limit);

    res.json(
      trades.map((t) => ({
        id: t.id,
        ticker: t.ticker,
        side: t.side,
        quantity: t.quantity,
        price: t.price,
        total: t.total,
        executedAt: t.executedAt.toISOString(),
      })),
    );
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trades" });
  }
});

router.post("/trades", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const userId = req.user.id;
    const { ticker, side, quantity: rawQuantity } = req.body as {
      ticker: string;
      side: "buy" | "sell";
      quantity: number;
    };

    if (!ticker || !side || !rawQuantity || rawQuantity <= 0) {
      res.status(400).json({ success: false, message: "Invalid trade parameters" });
      return;
    }

    if (!["buy", "sell"].includes(side)) {
      res.status(400).json({ success: false, message: "Side must be 'buy' or 'sell'" });
      return;
    }

    const quantity = Math.floor(rawQuantity);
    if (quantity <= 0) {
      res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
      return;
    }

    const orderResult = await placeOrder(ticker.toUpperCase(), side, quantity);

    if (orderResult.total > MAX_POSITION_SIZE) {
      res.status(400).json({
        success: false,
        message: `Position size €${orderResult.total.toFixed(2)} exceeds maximum allowed €${MAX_POSITION_SIZE.toFixed(2)}`,
      });
      return;
    }

    if (side === "buy") {
      const result = await db.transaction(async (tx) => {
        const portfolio = await getOrCreatePortfolio(userId, tx);

        if (orderResult.total > portfolio.balance) {
          return {
            error: true,
            message: `Insufficient balance. Available: €${portfolio.balance.toFixed(2)}, Required: €${orderResult.total.toFixed(2)}`,
          } as const;
        }

        const newBalance = Math.round((portfolio.balance - orderResult.total) * 100) / 100;
        await tx
          .update(portfoliosTable)
          .set({ balance: newBalance })
          .where(eq(portfoliosTable.userId, userId));

        const [position] = await tx
          .insert(positionsTable)
          .values({
            userId,
            ticker: ticker.toUpperCase(),
            side: "buy",
            quantity,
            entryPrice: orderResult.executedPrice,
            currentPrice: orderResult.executedPrice,
            status: "open",
          })
          .returning();

        const [trade] = await tx
          .insert(tradesTable)
          .values({
            userId,
            ticker: ticker.toUpperCase(),
            side: "buy",
            quantity,
            price: orderResult.executedPrice,
            total: orderResult.total,
            positionId: position.id,
          })
          .returning();

        return { error: false, trade, position } as const;
      });

      if (result.error) {
        res.status(400).json({ success: false, message: result.message });
        return;
      }

      const stats = await computePortfolioStats(userId);

      res.json({
        success: true,
        message: `Bought ${quantity} ${ticker.toUpperCase()} @ €${orderResult.executedPrice.toFixed(2)}`,
        trade: {
          id: result.trade.id,
          ticker: result.trade.ticker,
          side: result.trade.side,
          quantity: result.trade.quantity,
          price: result.trade.price,
          total: result.trade.total,
          executedAt: result.trade.executedAt.toISOString(),
        },
        portfolio: stats,
      });
    } else {
      const openPositions = await db
        .select()
        .from(positionsTable)
        .where(
          and(
            eq(positionsTable.userId, userId),
            eq(positionsTable.ticker, ticker.toUpperCase()),
            eq(positionsTable.side, "buy"),
            eq(positionsTable.status, "open"),
          ),
        )
        .orderBy(desc(positionsTable.openedAt));

      if (openPositions.length === 0) {
        res.status(400).json({
          success: false,
          message: `No open position for ${ticker.toUpperCase()} to sell`,
        });
        return;
      }

      const totalHeld = openPositions.reduce((sum, p) => sum + p.quantity, 0);
      if (quantity > totalHeld) {
        res.status(400).json({
          success: false,
          message: `Cannot sell ${quantity} shares. You only hold ${totalHeld}`,
        });
        return;
      }

      const sellTotal = Math.round(orderResult.executedPrice * quantity * 100) / 100;

      const result = await db.transaction(async (tx) => {
        const portfolio = await getOrCreatePortfolio(userId, tx);
        const newBalance = Math.round((portfolio.balance + sellTotal) * 100) / 100;

        await tx
          .update(portfoliosTable)
          .set({ balance: newBalance })
          .where(eq(portfoliosTable.userId, userId));

        let remaining = quantity;
        let primaryPositionId = openPositions[0].id;

        for (const pos of openPositions) {
          if (remaining <= 0) break;

          if (remaining >= pos.quantity) {
            await tx
              .update(positionsTable)
              .set({
                status: "closed",
                currentPrice: orderResult.executedPrice,
                closedAt: new Date(),
              })
              .where(eq(positionsTable.id, pos.id));
            remaining -= pos.quantity;
          } else {
            await tx
              .update(positionsTable)
              .set({
                quantity: pos.quantity - remaining,
                currentPrice: orderResult.executedPrice,
              })
              .where(eq(positionsTable.id, pos.id));
            remaining = 0;
          }
        }

        const [trade] = await tx
          .insert(tradesTable)
          .values({
            userId,
            ticker: ticker.toUpperCase(),
            side: "sell",
            quantity,
            price: orderResult.executedPrice,
            total: sellTotal,
            positionId: primaryPositionId,
          })
          .returning();

        return { trade };
      });

      const stats = await computePortfolioStats(userId);

      res.json({
        success: true,
        message: `Sold ${quantity} ${ticker.toUpperCase()} @ €${orderResult.executedPrice.toFixed(2)}`,
        trade: {
          id: result.trade.id,
          ticker: result.trade.ticker,
          side: result.trade.side,
          quantity: result.trade.quantity,
          price: result.trade.price,
          total: result.trade.total,
          executedAt: result.trade.executedAt.toISOString(),
        },
        portfolio: stats,
      });
    }
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ success: false, message: "Trade execution failed" });
  }
});

router.post("/positions/:id/close", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const userId = req.user.id;
    const positionId = Number(req.params.id);

    if (!Number.isFinite(positionId) || positionId <= 0) {
      res.status(400).json({ success: false, message: "Invalid position ID" });
      return;
    }

    const [position] = await db
      .select()
      .from(positionsTable)
      .where(
        and(
          eq(positionsTable.id, positionId),
          eq(positionsTable.userId, userId),
          eq(positionsTable.status, "open"),
        ),
      );

    if (!position) {
      res.status(404).json({ success: false, message: "Open position not found" });
      return;
    }

    const currentPrice = await getQuotePrice(position.ticker);
    const total = Math.round(currentPrice * position.quantity * 100) / 100;

    const result = await db.transaction(async (tx) => {
      const portfolio = await getOrCreatePortfolio(userId, tx);
      const newBalance = Math.round((portfolio.balance + total) * 100) / 100;

      await tx
        .update(portfoliosTable)
        .set({ balance: newBalance })
        .where(eq(portfoliosTable.userId, userId));

      await tx
        .update(positionsTable)
        .set({
          status: "closed",
          currentPrice,
          closedAt: new Date(),
        })
        .where(eq(positionsTable.id, positionId));

      const [trade] = await tx
        .insert(tradesTable)
        .values({
          userId,
          ticker: position.ticker,
          side: "sell",
          quantity: position.quantity,
          price: currentPrice,
          total,
          positionId: position.id,
        })
        .returning();

      return { trade };
    });

    const stats = await computePortfolioStats(userId);

    res.json({
      success: true,
      message: `Closed ${position.quantity} ${position.ticker} @ €${currentPrice.toFixed(2)}`,
      trade: {
        id: result.trade.id,
        ticker: result.trade.ticker,
        side: result.trade.side,
        quantity: result.trade.quantity,
        price: result.trade.price,
        total: result.trade.total,
        executedAt: result.trade.executedAt.toISOString(),
      },
      portfolio: stats,
    });
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to close position" });
  }
});

export default router;
