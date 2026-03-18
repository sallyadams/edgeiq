import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, SlidersHorizontal, Lock, Zap, Bell, TrendingUp, ArrowRight } from "lucide-react";
import { useGetSignals } from "@workspace/api-client-react";
import { SignalCard } from "@/components/SignalCard";

type GetSignalsType = "all" | "insider" | "options" | "sentiment";

const FREE_SIGNAL_LIMIT = 3;

function PremiumPaywall() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 mx-auto max-w-xl -mt-2"
    >
      <div className="relative rounded-3xl border border-primary/30 bg-card/80 backdrop-blur-xl p-8 shadow-2xl shadow-primary/10 overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10 pointer-events-none" />
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 mb-5 mx-auto">
            <Lock className="w-6 h-6 text-primary" />
          </div>

          <h2 className="text-2xl font-display font-bold mb-2">Premium Signals</h2>
          <p className="text-muted-foreground mb-6">
            Upgrade to EdgeIQ Pro to unlock:
          </p>

          <ul className="space-y-3 mb-8 text-left max-w-xs mx-auto">
            {[
              { icon: Zap, text: "Real-time high conviction trades" },
              { icon: TrendingUp, text: "Advanced AI predictions" },
              { icon: Bell, text: "Instant alerts" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
                {text}
              </li>
            ))}
          </ul>

          <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/30 hover:opacity-90 transition-all hover:scale-[1.02] duration-200">
            Upgrade to Pro
            <span className="font-normal opacity-80">€19/month</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <p className="text-xs text-muted-foreground mt-4">
            Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Signals() {
  const [filterType, setFilterType] = useState<GetSignalsType>("all");
  const [search, setSearch] = useState("");

  const { data: signals, isLoading } = useGetSignals({
    type: filterType === "all" ? undefined : filterType,
    ticker: search || undefined,
    limit: 50
  });

  const FILTERS: { label: string, value: GetSignalsType }[] = [
    { label: "All Signals", value: "all" },
    { label: "Insider Trades", value: "insider" },
    { label: "Options Flow", value: "options" },
    { label: "AI Sentiment", value: "sentiment" }
  ];

  const freeSignals = signals?.slice(0, FREE_SIGNAL_LIMIT) ?? [];
  const lockedSignals = signals?.slice(FREE_SIGNAL_LIMIT) ?? [];
  const hasLocked = !isLoading && lockedSignals.length > 0;

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Signal Feed</h1>
          <p className="text-muted-foreground">Real-time alerts for unusual market activity.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 transition-all"
            />
          </div>
          <button className="p-2 border border-border bg-card rounded-lg hover:bg-secondary transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-4 border-b border-border/50">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilterType(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filterType === f.value
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-secondary/20 animate-pulse border border-border/30" />
          ))
        ) : signals?.length === 0 ? (
          <div className="text-center py-24 bg-card/30 rounded-2xl border border-border border-dashed">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-foreground">No signals found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            {freeSignals.map((signal, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={signal.id}
              >
                <SignalCard signal={signal} />
              </motion.div>
            ))}

            {hasLocked && (
              <div className="relative">
                <div className="space-y-4 pointer-events-none select-none">
                  {lockedSignals.slice(0, 3).map((signal, i) => (
                    <div
                      key={signal.id}
                      className="blur-sm opacity-60"
                      style={{ filter: `blur(${4 + i * 2}px)`, opacity: 0.5 - i * 0.1 }}
                    >
                      <SignalCard signal={signal} />
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />

                <div className="relative mt-4">
                  <PremiumPaywall />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
