import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, ShieldAlert, Zap, Lock, Activity } from "lucide-react";
import { useGetMarketStats, useGetTopSignals, useGetSignals } from "@workspace/api-client-react";
import { SignalCard } from "@/components/SignalCard";
import { FeaturedSignal } from "@/components/FeaturedSignal";
import { LiveActivityTicker } from "@/components/LiveActivityTicker";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useAuth } from "@workspace/replit-auth-web";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

const FREE_SIGNAL_LIMIT = 3;

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetMarketStats();
  const { data: topSignals, isLoading: topLoading } = useGetTopSignals();
  const { data: recentSignals, isLoading: recentLoading } = useGetSignals({ limit: 10 });
  const { t } = useI18n();
  const { user } = useAuth();
  const isPro = user?.tier === "pro" || user?.tier === "elite";
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);
  const featuredSignal = topSignals?.[0];

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") === "true") {
      const url = new URL(window.location.href);
      url.searchParams.delete("upgraded");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return (
    <div className="space-y-8 pb-12">

      <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-card shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-mesh.png`} 
            alt="Mesh Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>
        
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
              {t.dashboard.heroTitle} <span className="text-gradient">{t.dashboard.heroTitleHighlight}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-3">
              {t.dashboard.heroDescription}
            </p>
            <LiveActivityTicker />
          </div>
          <div className="flex flex-col items-end gap-2 bg-background/40 backdrop-blur-md p-4 rounded-2xl border border-border/50">
            <span className="text-sm font-medium text-muted-foreground">{t.dashboard.marketRegime}</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
              <span className="font-bold text-xl text-success">{t.dashboard.riskOnBullish}</span>
            </div>
          </div>
        </div>
      </div>

      {featuredSignal && (
        <FeaturedSignal
          signal={featuredSignal}
          unlocked={isPro}
          onUpgradeClick={() => setUpgradeOpen(true)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.dashboard.fearGreedIndex, value: stats?.fearGreedIndex ?? "--", sub: stats?.overallSentiment ?? "--", icon: Zap, color: "text-warning" },
          { label: t.dashboard.insiderBuyRatio, value: stats ? `${stats.insiderBuyRatio.toFixed(2)}x` : "--", sub: t.dashboard.historicalAvg, icon: ShieldAlert, color: "text-primary" },
          { label: t.dashboard.optionsFlowBias, value: stats?.optionsFlowBias ?? "--", sub: `${stats?.bullishSignals ?? 0} ${t.dashboard.bullish} / ${stats?.bearishSignals ?? 0} ${t.dashboard.bearish}`, icon: BarChart2, color: "text-success" },
          { label: t.dashboard.totalSignalsToday, value: stats?.totalSignalsToday ?? "--", sub: t.dashboard.acrossAllSectors, icon: Activity, color: "text-accent" }
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-card border border-border/50 rounded-2xl p-5 hover:border-border transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <stat.icon className={`w-4 h-4 ${stat.color} opacity-80`} />
            </div>
            <h3 className="text-3xl font-display font-bold mt-2">{statsLoading ? "..." : stat.value}</h3>
            <p className="text-xs text-muted-foreground mt-2">{statsLoading ? "..." : stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" /> {t.dashboard.liveSignalFeed}
            </h2>
            <Link href="/signals" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              {t.dashboard.viewAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-48 rounded-2xl bg-secondary/20 animate-pulse border border-border/30" />
              ))
            ) : recentSignals?.map((signal, i) => {
              const isLocked = !isPro && i >= FREE_SIGNAL_LIMIT;
              if (isLocked) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={signal.id}
                >
                  <SignalCard
                    signal={signal}
                    lockInsight={!isPro}
                    onUpgradeClick={() => setUpgradeOpen(true)}
                  />
                </motion.div>
              );
            })}

            {!isPro && !recentLoading && (recentSignals?.length ?? 0) > FREE_SIGNAL_LIMIT && (
              <div className="relative">
                <div className="space-y-4 pointer-events-none select-none">
                  {recentSignals?.slice(FREE_SIGNAL_LIMIT, FREE_SIGNAL_LIMIT + 2).map((signal, i) => (
                    <div
                      key={signal.id}
                      style={{ filter: `blur(${4 + i * 2}px)`, opacity: 0.4 - i * 0.1 }}
                    >
                      <SignalCard signal={signal} />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />
                <div className="relative text-center py-6">
                  <button
                    onClick={() => setUpgradeOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30 hover:opacity-90 transition-all hover:scale-[1.02]"
                  >
                    <Lock className="w-4 h-4" />
                    {t.dashboard.unlockAllSignals}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Zap className="w-6 h-6 text-warning" /> {t.dashboard.highConviction}
            </h2>
          </div>
          
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-lg">
            <div className="space-y-4">
              {topLoading ? (
                 [...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 rounded-xl bg-secondary/20 animate-pulse" />
                ))
              ) : topSignals?.slice(0, 5).map((signal) => (
                <div key={signal.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/ticker/${signal.ticker}`} className="font-mono font-bold text-lg hover:text-primary transition-colors">
                        {signal.ticker}
                      </Link>
                      <span className={cn("text-[10px] uppercase font-bold px-1.5 py-0.5 rounded", 
                        signal.action.toLowerCase() === 'buy' || signal.action.toLowerCase() === 'calls' ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                      )}>
                        {signal.action}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">{signal.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-lg text-primary">{signal.convictionScore}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{t.dashboard.score}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {!isPro && (
              <div className="mt-6 pt-4 border-t border-border/50 text-center">
                <Button
                  variant="outline"
                  className="w-full text-xs uppercase tracking-widest font-bold"
                  onClick={() => setUpgradeOpen(true)}
                >
                  <Lock className="w-3 h-3 mr-2" /> {t.dashboard.unlockTop50}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
