import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, SlidersHorizontal, Lock, Zap, Bell, TrendingUp, ArrowRight, Loader2, Star, CheckCircle2, X } from "lucide-react";
import { useGetSignals } from "@workspace/api-client-react";
import { SignalCard } from "@/components/SignalCard";
import { useI18n } from "@/i18n";
import { useUnlocked, UpgradeModal } from "@/components/UpgradeModal";

type GetSignalsType = "all" | "insider" | "options" | "sentiment";

const FREE_SIGNAL_LIMIT = 3;

async function startCheckout(plan: "early" | "pro" | "elite") {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const res = await fetch(`${base}/api/checkout/create-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) throw new Error("Failed to create checkout session");
  const { url } = await res.json();
  if (url) window.location.href = url;
}

function PremiumPaywall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  async function handleUnlock() {
    setLoading(true);
    setError(null);
    try {
      await startCheckout("early");
    } catch {
      setError(t.signals.somethingWentWrong);
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 mx-auto max-w-lg -mt-2"
    >
      <div className="relative rounded-3xl border border-primary/30 bg-card/90 backdrop-blur-xl p-8 shadow-2xl shadow-black/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10 pointer-events-none" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-bold mb-5">
            <Lock className="w-3 h-3" />
            {t.signals.seeingOnly10}
          </div>

          <h2 className="text-2xl font-display font-bold mb-3">
            {t.signals.unlockTitle}
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            {t.signals.unlockDescription}
          </p>

          <ul className="grid grid-cols-1 gap-2.5 mb-7 text-left">
            {[
              { icon: Zap, text: t.signals.featureUnlimited },
              { icon: TrendingUp, text: t.signals.featureAiScoring },
              { icon: Bell, text: t.signals.featurePushAlerts },
              { icon: Star, text: t.signals.featureDarkPool },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="mb-4 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-0.5">{t.signals.earlyAccessPricing}</div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-display font-bold">€9</span>
              <span className="text-muted-foreground text-sm">{t.signals.pricePerMonth}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{t.signals.lockInRate}</div>
          </div>

          {error && <p className="text-xs text-destructive mb-3">{error}</p>}

          <button
            onClick={handleUnlock}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30 hover:opacity-90 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.signals.redirecting}
              </>
            ) : (
              <>
                {t.signals.unlockFullAccess}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-xs text-muted-foreground mt-4">
            {t.signals.cancelAnytime}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Signals() {
  const [filterType, setFilterType] = useState<GetSignalsType>("all");
  const [search, setSearch] = useState("");
  const [bannerVisible, setBannerVisible] = useState(true);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const { unlocked, justUpgraded } = useUnlocked();
  const { t } = useI18n();

  const { data: signals, isLoading } = useGetSignals({
    type: filterType === "all" ? undefined : filterType,
    ticker: search || undefined,
    limit: 50,
  });

  const FILTERS: { label: string; value: GetSignalsType }[] = [
    { label: t.signals.allSignals, value: "all" },
    { label: t.signals.insiderTrades, value: "insider" },
    { label: t.signals.optionsFlow, value: "options" },
    { label: t.signals.aiSentiment, value: "sentiment" },
  ];

  const visibleSignals = unlocked ? (signals ?? []) : (signals?.slice(0, FREE_SIGNAL_LIMIT) ?? []);
  const lockedSignals  = unlocked ? [] : (signals?.slice(FREE_SIGNAL_LIMIT) ?? []);
  const hasLocked = !isLoading && !unlocked && lockedSignals.length > 0;

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />

      <AnimatePresence>
        {justUpgraded && bannerVisible && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">{t.signals.fullAccessUnlocked}</p>
                <p className="text-xs text-green-400/80 mt-0.5">{t.signals.welcomeEarlyAccess}</p>
              </div>
            </div>
            <button onClick={() => setBannerVisible(false)} className="text-green-400/60 hover:text-green-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-2">{t.signals.title}</h1>
          <p className="text-muted-foreground">{t.signals.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.signals.filterByTicker}
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
        {FILTERS.map((f) => (
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
            <h3 className="text-lg font-bold text-foreground">{t.signals.noSignalsFound}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.signals.noSignalsHint}</p>
          </div>
        ) : (
          <>
            {visibleSignals.map((signal, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                key={signal.id}
              >
                <SignalCard
                  signal={signal}
                  lockInsight={!unlocked}
                  onUpgradeClick={() => setUpgradeOpen(true)}
                />
              </motion.div>
            ))}

            {hasLocked && (
              <div className="relative">
                <div className="space-y-4 pointer-events-none select-none">
                  {lockedSignals.slice(0, 3).map((signal, i) => (
                    <div
                      key={signal.id}
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
