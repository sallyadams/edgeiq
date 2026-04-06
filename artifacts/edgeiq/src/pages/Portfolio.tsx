import React, { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
  History,
  RefreshCw,
  ArrowUpDown,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  useGetPortfolio,
  useGetPositions,
  useGetTrades,
  useClosePosition,
  useResetPortfolio,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/i18n";
import { TradeModal } from "@/components/TradeModal";
import { toast } from "@/hooks/use-toast";

export default function Portfolio() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"positions" | "history">("positions");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [tradeModal, setTradeModal] = useState<{ ticker: string; side: "buy" | "sell" } | null>(null);

  const { data: portfolio, isLoading: portfolioLoading } = useGetPortfolio();
  const { data: positions, isLoading: positionsLoading } = useGetPositions({ status: "open" });
  const { data: trades, isLoading: tradesLoading } = useGetTrades({ limit: 50 });
  const closePosition = useClosePosition();
  const resetPortfolio = useResetPortfolio();

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    queryClient.invalidateQueries({ queryKey: ["/api/positions"] });
    queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
  };

  const handleClosePosition = (id: number, ticker?: string) => {
    closePosition.mutate(
      { id },
      {
        onSuccess: () => {
          refreshAll();
          toast({ title: `${ticker ? ticker + " " : ""}${t.trading.positionClosed}` });
        },
        onError: () => {
          toast({ title: t.trading.closeError, variant: "destructive" });
        },
      },
    );
  };

  const handleReset = () => {
    resetPortfolio.mutate(undefined, {
      onSuccess: () => {
        refreshAll();
        setShowResetConfirm(false);
        toast({ title: t.trading.portfolioResetSuccess });
      },
      onError: () => {
        toast({ title: t.trading.resetError, variant: "destructive" });
      },
    });
  };

  if (portfolioLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pnlColor = (portfolio?.totalPnl ?? 0) >= 0 ? "text-success" : "text-destructive";
  const unrealizedColor = (portfolio?.unrealizedPnl ?? 0) >= 0 ? "text-success" : "text-destructive";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-bold">{t.trading.portfolio}</h1>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
              {t.trading.demoAccount}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{t.trading.portfolioSubtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshAll}>
            <RefreshCw className="w-4 h-4 mr-1" />
            {t.trading.refresh}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(true)} className="text-destructive border-destructive/30 hover:bg-destructive/10">
            {t.trading.reset}
          </Button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
          <p className="text-sm text-destructive flex-1">{t.trading.resetConfirm}</p>
          <Button size="sm" variant="destructive" onClick={handleReset} disabled={resetPortfolio.isPending}>
            {resetPortfolio.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t.trading.confirmReset}
          </Button>
          <button onClick={() => setShowResetConfirm(false)} className="p-1 rounded hover:bg-secondary/50">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t.trading.balance}</span>
          </div>
          <p className="text-2xl font-mono font-bold">€{(portfolio?.balance ?? 0).toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">{t.trading.of} €{(portfolio?.initialBalance ?? 10000).toFixed(2)}</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t.trading.totalPnl}</span>
          </div>
          <p className={cn("text-2xl font-mono font-bold", pnlColor)}>
            {(portfolio?.totalPnl ?? 0) >= 0 ? "+" : ""}€{(portfolio?.totalPnl ?? 0).toFixed(2)}
          </p>
          <p className={cn("text-xs mt-1 font-mono", pnlColor)}>
            {(portfolio?.totalPnlPercent ?? 0) >= 0 ? "+" : ""}{(portfolio?.totalPnlPercent ?? 0).toFixed(2)}%
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpDown className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t.trading.unrealizedPnl}</span>
          </div>
          <p className={cn("text-2xl font-mono font-bold", unrealizedColor)}>
            {(portfolio?.unrealizedPnl ?? 0) >= 0 ? "+" : ""}€{(portfolio?.unrealizedPnl ?? 0).toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{portfolio?.openPositionsCount ?? 0} {t.trading.openPositions}</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t.trading.totalTrades}</span>
          </div>
          <p className="text-2xl font-mono font-bold">{portfolio?.totalTradesCount ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">{t.trading.allTime}</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border/50 pb-0">
        <button
          onClick={() => setActiveTab("positions")}
          className={cn(
            "px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-[1px]",
            activeTab === "positions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <ArrowUpDown className="w-4 h-4 inline mr-1.5" />
          {t.trading.openPositions} ({positions?.length ?? 0})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-[1px]",
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <History className="w-4 h-4 inline mr-1.5" />
          {t.trading.tradeHistory}
        </button>
      </div>

      {activeTab === "positions" && (
        <div className="space-y-3">
          {positionsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : !positions || positions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ArrowUpDown className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">{t.trading.noOpenPositions}</p>
              <p className="text-sm mt-1">{t.trading.noOpenPositionsHint}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {positions.map((pos) => {
                const isProfit = pos.pnl >= 0;
                return (
                  <div key={pos.id} className="p-4 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm hover:border-border transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          pos.side === "buy" ? "bg-success/10" : "bg-destructive/10",
                        )}>
                          {pos.side === "buy" ? (
                            <TrendingUp className="w-5 h-5 text-success" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-destructive" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-display font-bold">{pos.ticker}</span>
                            <span className={cn(
                              "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                              pos.side === "buy" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
                            )}>
                              {pos.side.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {pos.quantity} {t.trading.shares} @ €{pos.entryPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-mono font-semibold">€{pos.currentPrice.toFixed(2)}</p>
                          <p className={cn("text-xs font-mono", isProfit ? "text-success" : "text-destructive")}>
                            {isProfit ? "+" : ""}€{pos.pnl.toFixed(2)} ({isProfit ? "+" : ""}{pos.pnlPercent.toFixed(2)}%)
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleClosePosition(pos.id, pos.ticker)}
                          disabled={closePosition.isPending}
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        >
                          {t.trading.close}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-2">
          {tradesLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : !trades || trades.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">{t.trading.noTrades}</p>
              <p className="text-sm mt-1">{t.trading.noTradesHint}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border/50">
                    <th className="text-left py-3 px-4 font-semibold">{t.trading.ticker}</th>
                    <th className="text-left py-3 px-4 font-semibold">{t.trading.side}</th>
                    <th className="text-right py-3 px-4 font-semibold">{t.trading.qty}</th>
                    <th className="text-right py-3 px-4 font-semibold">{t.trading.price}</th>
                    <th className="text-right py-3 px-4 font-semibold">{t.trading.total}</th>
                    <th className="text-right py-3 px-4 font-semibold">{t.trading.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => (
                    <tr key={trade.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4 font-display font-bold">{trade.ticker}</td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          "text-xs font-bold uppercase px-2 py-0.5 rounded-full",
                          trade.side === "buy" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
                        )}>
                          {trade.side.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-sm">{trade.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono text-sm">€{trade.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono text-sm font-semibold">€{trade.total.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-xs text-muted-foreground">
                        {new Date(trade.executedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tradeModal && (
        <TradeModal
          ticker={tradeModal.ticker}
          defaultSide={tradeModal.side}
          onClose={() => setTradeModal(null)}
          onSuccess={refreshAll}
        />
      )}
    </div>
  );
}
