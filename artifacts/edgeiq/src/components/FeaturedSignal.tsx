import React from "react";
import { motion } from "framer-motion";
import { Flame, Sparkles, TrendingUp, TrendingDown, ArrowRight, Lock } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { Signal } from "@workspace/api-client-react";

interface FeaturedSignalProps {
  signal: Signal;
  unlocked: boolean;
  onUpgradeClick: () => void;
}

export function FeaturedSignal({ signal, unlocked, onUpgradeClick }: FeaturedSignalProps) {
  const { t } = useI18n();
  const isBullish = signal.action.toLowerCase() === "buy" || signal.action.toLowerCase() === "calls" || signal.action.toLowerCase() === "bullish";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl border border-success/40 bg-card/60 backdrop-blur-sm overflow-hidden shadow-xl shadow-success/10"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-success to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent pointer-events-none" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/15 border border-success/30 text-success text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            {t.dashboard.highConvictionSignal}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Link href={`/ticker/${signal.ticker}`} className="hover:opacity-80 transition-opacity">
                <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight hover:underline decoration-primary/50 underline-offset-4">
                  {signal.ticker}
                </h3>
              </Link>
              <span className={cn(
                "px-3 py-1 rounded-lg font-mono font-bold text-sm flex items-center gap-1",
                isBullish ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
              )}>
                {isBullish ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {signal.action.toUpperCase()}
              </span>
              <span className="text-2xl font-bold text-success font-mono">{signal.convictionScore}%</span>
            </div>

            <p className="text-sm text-muted-foreground mb-4 max-w-xl leading-relaxed">
              {signal.description}
            </p>

            {signal.aiInsight && (
              <div className="relative">
                <div className={cn(
                  "p-4 rounded-xl border",
                  unlocked ? "bg-success/5 border-success/20" : "bg-secondary/30 border-border/40"
                )}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className={cn("w-4 h-4", unlocked ? "text-success" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-bold uppercase tracking-wider", unlocked ? "text-success" : "text-muted-foreground")}>
                      {t.signalCard.aiInsight}
                    </span>
                  </div>
                  {unlocked ? (
                    <p className="text-sm leading-relaxed text-foreground/80 italic">
                      "{signal.aiInsight}"
                    </p>
                  ) : (
                    <div className="relative">
                      <p className="text-sm leading-relaxed text-foreground/30 italic select-none blur-[6px]">
                        "{signal.aiInsight}"
                      </p>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={onUpgradeClick}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/15 border border-primary/25 text-primary text-sm font-bold hover:bg-primary/25 transition-colors"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          {t.signalCard.upgradeToUnlock}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-secondary" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  className="stroke-success transition-all duration-1000 ease-out"
                  strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - signal.convictionScore}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-lg font-bold font-mono text-success">{signal.convictionScore}</span>
            </div>
            <Link
              href={`/ticker/${signal.ticker}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
            >
              {t.dashboard.viewFullAnalysis}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
