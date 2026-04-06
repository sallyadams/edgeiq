import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, Trash2, Plus, Search, TrendingUp } from "lucide-react";
import { useGetWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { toast } from "@/hooks/use-toast";

const SUGGESTED_TICKERS = ["NVDA", "SPY", "TSLA", "QQQ", "AAPL", "MSFT", "META", "AMZN"];

export default function Watchlist() {
  const queryClient = useQueryClient();
  const { data: watchlist, isLoading } = useGetWatchlist();
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();
  const [newTicker, setNewTicker] = useState("");
  const { t } = useI18n();

  const addTicker = (ticker: string) => {
    addMutation.mutate(
      { data: { ticker: ticker.toUpperCase().trim() } },
      {
        onSuccess: () => {
          setNewTicker("");
          queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
          toast({ title: `${ticker.toUpperCase()} ${t.watchlist.addedToast}` });
        },
        onError: () => {
          toast({ title: t.watchlist.addErrorToast, variant: "destructive" });
        },
      }
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker.trim()) return;
    addTicker(newTicker);
  };

  const handleRemove = (ticker: string) => {
    removeMutation.mutate(
      { ticker },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
          toast({ title: `${ticker} ${t.watchlist.removedToast}` });
        },
        onError: () => {
          toast({ title: t.watchlist.removeErrorToast, variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card border border-border/50 p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold tracking-tight mb-2 flex items-center gap-3">
            <Star className="w-8 h-8 text-warning fill-warning/20" /> {t.watchlist.title}
          </h1>
          <p className="text-muted-foreground">{t.watchlist.subtitle}</p>
        </div>
        
        <form onSubmit={handleAdd} className="relative z-10 flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder={t.watchlist.addTickerPlaceholder}
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              className="bg-background border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full transition-all font-mono"
            />
          </div>
          <Button type="submit" disabled={addMutation.isPending || !newTicker.trim()}>
            {addMutation.isPending ? t.watchlist.adding : <><Plus className="w-4 h-4 mr-1" /> {t.watchlist.add}</>}
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-secondary/20 animate-pulse border border-border/30" />
          ))}
        </div>
      ) : watchlist?.length === 0 ? (
        <div className="text-center py-16 bg-card/30 rounded-3xl border border-border border-dashed">
          <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-bold text-foreground">{t.watchlist.empty}</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">{t.watchlist.emptyHint}</p>
          
          <div className="mt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">
              <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
              {t.watchlist.suggestedTickers}
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              {SUGGESTED_TICKERS.map((ticker) => (
                <button
                  key={ticker}
                  onClick={() => addTicker(ticker)}
                  disabled={addMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/50 hover:bg-primary/10 text-sm font-mono font-bold transition-all hover:scale-105"
                >
                  <Plus className="w-3 h-3 inline mr-1 text-primary" />
                  {ticker}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist?.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={item.id}
              className="bg-card border border-border/60 hover:border-primary/50 rounded-2xl p-5 group transition-all hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <Link href={`/ticker/${item.ticker}`} className="hover:opacity-80">
                  <h3 className="text-2xl font-mono font-bold">{item.ticker}</h3>
                </Link>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleRemove(item.ticker)}
                    className="p-1.5 rounded-md bg-secondary text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    title={t.watchlist.remove}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/50 flex justify-between items-end">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.watchlist.latestSignal}</p>
                  {item.latestSignalScore ? (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl font-bold text-primary">{item.latestSignalScore}</span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">{t.watchlist.noRecentSignals}</span>
                  )}
                </div>
                <Link href={`/ticker/${item.ticker}`} className="text-xs font-medium text-primary hover:underline">
                  {t.watchlist.analyze} &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
