const MOCK_PRICES: Record<string, number> = {
  NVDA: 875.32,
  TSLA: 248.50,
  AAPL: 213.18,
  MSFT: 415.20,
  META: 556.84,
  AMZN: 194.50,
  GOOGL: 178.34,
  AMD: 168.42,
  PLTR: 82.50,
  COIN: 245.30,
};

export type BrokerMode = "paper" | "live";

export function getBrokerMode(): BrokerMode {
  return (process.env.BROKER_MODE as BrokerMode) || "paper";
}

export interface OrderResult {
  executedPrice: number;
  executedQuantity: number;
  total: number;
}

export interface AccountInfo {
  balance: number;
  mode: BrokerMode;
}

export async function getQuotePrice(ticker: string): Promise<number> {
  const base = MOCK_PRICES[ticker.toUpperCase()];
  if (base) {
    const jitter = base * (Math.random() * 0.002 - 0.001);
    return Math.round((base + jitter) * 100) / 100;
  }
  return Math.round((100 + Math.random() * 500) * 100) / 100;
}

export async function placeOrder(
  ticker: string,
  side: "buy" | "sell",
  quantity: number,
): Promise<OrderResult> {
  const mode = getBrokerMode();

  if (mode === "live") {
    throw new Error("Live trading is not yet enabled. Set BROKER_MODE=paper.");
  }

  const executedPrice = await getQuotePrice(ticker);
  const total = Math.round(executedPrice * quantity * 100) / 100;

  return {
    executedPrice,
    executedQuantity: quantity,
    total,
  };
}

export async function getAccount(): Promise<AccountInfo> {
  return {
    balance: 0,
    mode: getBrokerMode(),
  };
}

export async function getPositions(): Promise<unknown[]> {
  return [];
}
