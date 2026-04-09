import React, { useState, useMemo } from "react";
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Loader2, Link2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useExecuteTrade, useGetMarketQuote } from "@workspace/api-client-react";
import { useI18n } from "@/i18n";
import { toast } from "@/hooks/use-toast";
import { BrokerConnect } from "./BrokerConnect";

const MAX_POSITION_SIZE = 5000;

interface TradeModalProps {
  ticker: string;
  defaultSide?: "buy" | "sell";
  onClose: () => void;
  onSuccess?: () => void;
}

export function TradeModal({ ticker, defaultSide = "buy", onClose, onSuccess }: TradeModalProps) {
  const [side, setSide] = useState<"buy" | "sell">(defaultSide);
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [brokerOpen, setBrokerOpen] = useState(false);
  const { t } = useI18n();

  const { data: quote } = useGetMarketQuote(ticker);
  const executeTrade = useExecuteTrade();

  const qty = Number(quantity) || 0;
  const price = quote?.price ?? 0;
  const estimatedTotal = Math.round(qty * price * 100) / 100;

  const maxQuantity = useMemo(() => {
    if (price <= 0) return 0;
    return Math.floor(MAX_POSITION_SIZE / price);
  }, [price]);

  const exceedsMax = qty > 0 && price > 0 && estimatedTotal > MAX_POSITION_SIZE;
  const isValid = qty > 0 && price > 0 && !exceedsMax && Number.isInteger(qty);
  const canSubmit = isValid && !executeTrade.isPending && !successMsg;

  const usagePercent = qty > 0 && price > 0
    ? Math.min((estimatedTotal / MAX_POSITION_SIZE) * 100, 100)
    : 0;

  const handleUseMax = () => {
    if (maxQuantity > 0) {
      setQuantity(String(maxQuantity));
      setError(null);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
    setError(null);
  };

  const handleSubmit = () => {
    setError(null);
    if (qty <= 0) {
      setError(t.trading.invalidQuantity);
      return;
    }
    if (exceedsMax) {
      return;
    }

    executeTrade.mutate(
      { data: { ticker, side, quantity: qty } },
      {
        onSuccess: (result) => {
          if (result.success) {
            setSuccessMsg(result.message);
            toast({ title: `${side === "buy" ? t.trading.buy : t.trading.sell} ${qty} ${ticker} — ${t.trading.tradeSuccess}` });
            setTimeout(() => {
              onSuccess?.();
              onClose();
            }, 1500);
          } else {
            setError(result.message);
          }
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : t.trading.tradeFailed;
          setError(message);
          toast({ title: t.trading.tradeFailed, variant: "destructive" });
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-emerald-400" />

        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              {side === "buy" ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold">{t.trading.executeTrade}</h2>
              <p className="text-xs text-muted-foreground">{t.trading.paperTrading}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {successMsg}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/50">
            <div>
              <p className="text-2xl font-display font-bold">{ticker}</p>
              <p className="text-xs text-muted-foreground">{t.trading.currentPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold">€{price.toFixed(2)}</p>
              {quote && (
                <p className={cn("text-xs font-mono", quote.change >= 0 ? "text-success" : "text-destructive")}>
                  {quote.change >= 0 ? "+" : ""}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSide("buy")}
              className={cn(
                "py-3 rounded-xl font-semibold text-sm transition-all border",
                side === "buy"
                  ? "bg-success/15 border-success/40 text-success"
                  : "bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50",
              )}
            >
              <TrendingUp className="w-4 h-4 inline mr-1.5" />
              {t.trading.buy}
            </button>
            <button
              onClick={() => setSide("sell")}
              className={cn(
                "py-3 rounded-xl font-semibold text-sm transition-all border",
                side === "sell"
                  ? "bg-destructive/15 border-destructive/40 text-destructive"
                  : "bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50",
              )}
            >
              <TrendingDown className="w-4 h-4 inline mr-1.5" />
              {t.trading.sell}
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t.trading.quantity}
              </label>
              {price > 0 && (
                <button
                  onClick={handleUseMax}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all"
                >
                  <Zap className="w-3 h-3" />
                  {t.trading.useMax} ({maxQuantity})
                </button>
              )}
            </div>
            <input
              type="number"
              min="1"
              max={maxQuantity}
              step="1"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="0"
              className={cn(
                "w-full px-4 py-3 bg-secondary/30 border rounded-xl text-lg font-mono focus:outline-none focus:ring-2 transition-all",
                exceedsMax
                  ? "border-destructive/50 focus:ring-destructive/30 focus:border-destructive/50"
                  : isValid
                    ? "border-success/50 focus:ring-success/30 focus:border-success/50"
                    : "border-border/50 focus:ring-primary/30 focus:border-primary/50",
              )}
            />

            {exceedsMax && (
              <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-destructive/5 border border-destructive/15">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs text-destructive font-medium">{t.trading.exceedsMax}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-destructive/80">
                      {t.trading.maxQuantityHint} <span className="font-bold font-mono">{maxQuantity} {t.trading.shares}</span>
                    </p>
                    <button
                      onClick={handleUseMax}
                      className="text-xs font-semibold text-destructive underline underline-offset-2 hover:text-destructive/80 transition-colors"
                    >
                      {t.trading.useMax}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isValid && (
              <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-success/5 border border-success/15">
                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                <p className="text-xs text-success font-medium">{t.trading.validPosition}</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-secondary/20 rounded-xl border border-border/40 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.trading.estimatedTotal}</span>
              <span className={cn(
                "font-mono font-bold",
                exceedsMax ? "text-destructive" : isValid ? "text-success" : "",
              )}>
                €{estimatedTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t.trading.maxPosition}</span>
              <span className="font-mono text-muted-foreground">€5,000.00</span>
            </div>
            <div className="space-y-1">
              <div className="w-full h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    exceedsMax
                      ? "bg-destructive"
                      : usagePercent > 80
                        ? "bg-amber-500"
                        : "bg-success",
                  )}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground/70 text-right">
                {usagePercent.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-border/50">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "w-full py-3 font-semibold text-sm rounded-xl transition-all",
              !canSubmit
                ? "opacity-50 cursor-not-allowed"
                : side === "buy"
                  ? "bg-success hover:bg-success/90 text-white"
                  : "bg-destructive hover:bg-destructive/90 text-white",
            )}
          >
            {executeTrade.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {executeTrade.isPending
              ? t.trading.executing
              : `${side === "buy" ? t.trading.buy : t.trading.sell} ${qty > 0 ? qty : ""} ${ticker}`}
          </Button>
        </div>

        <div className="px-5 pb-2">
          <button
            onClick={() => setBrokerOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all border border-transparent hover:border-border/40"
          >
            <Link2 className="w-3.5 h-3.5" />
            Connect broker for live trading
          </button>
        </div>

        <div className="px-5 pb-4 text-center">
          <p className="text-[10px] text-muted-foreground/60">{t.trading.disclaimer}</p>
        </div>
      </div>

      <BrokerConnect open={brokerOpen} onClose={() => setBrokerOpen(false)} />
    </div>
  );
}
