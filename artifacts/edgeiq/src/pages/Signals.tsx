import React, { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search, SlidersHorizontal, Lock, Zap, Bell, TrendingUp, ArrowRight, Loader2, Star } from "lucide-react";
import { useGetSignals } from "@workspace/api-client-react";
import { SignalCard } from "@/components/SignalCard";

type GetSignalsType = "all" | "insider" | "options" | "sentiment";

const FREE_SIGNAL_LIMIT = 2;

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

const TIER_FEATURES = {
  pro: [
    { icon: Zap, text: "Unlimited real-time signals" },
    { icon: TrendingUp, text: "AI conviction scoring" },
    { icon: Bell, text: "Instant push alerts" },
  ],
  elite: [
    { icon: Zap, text: "Everything in Pro" },
    { icon: TrendingUp, text: "Dark pool data" },
    { icon: Star, text: "Priority signal queue" },
    { icon: Bell, text: "Dedicated support" },
  ],
};

function TierCard({ plan, label, price, features, highlighted }: {
  plan: "pro" | "elite";
  label: string;
  price: string;
  features: { icon: React.ElementType; text: string }[];
  highlighted?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);
    try {
      await startCheckout(plan);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className={`relative flex flex-col rounded-2xl border p-6 ${
      highlighted
        ? "border-primary/50 bg-primary/5"
        : "border-border/50 bg-card/50"
    }`}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
          Most Popular
        </div>
      )}

      <div className="mb-5">
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-display font-bold">{price}</span>
          <span className="text-muted-foreground text-sm mb-0.5">/ month</span>
        </div>
      </div>

      <ul className="space-y-2.5 mb-6 flex-1">
        {features.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2.5 text-sm text-foreground">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
              highlighted ? "bg-primary/15 border border-primary/20" : "bg-secondary border border-border/50"
            }`}>
              <Icon className={`w-3 h-3 ${highlighted ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            {text}
          </li>
        ))}
      </ul>

      {error && <p className="text-xs text-destructive mb-3">{error}</p>}

      <button
        onClick={handleUpgrade}
        disabled={loading}
        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none ${
          highlighted
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 hover:scale-[1.02]"
            : "border border-border/60 bg-secondary/40 text-foreground hover:bg-secondary"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Redirecting...
          </>
        ) : (
          <>
            Upgrade to {label}
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </div>
  );
}

function PremiumPaywall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUnlock() {
    setLoading(true);
    setError(null);
    try {
      await startCheckout("early");
    } catch {
      setError("Something went wrong. Please try again.");
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
            You're seeing only 10% of the signals
          </div>

          <h2 className="text-2xl font-display font-bold mb-3">
            Unlock Full Market Intelligence
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            Get access to all real-time insider trades, options flow alerts, and AI-scored signals — the ones retail investors never see in time.
          </p>

          <ul className="grid grid-cols-1 gap-2.5 mb-7 text-left">
            {[
              { icon: Zap, text: "Unlimited real-time signals across all tickers" },
              { icon: TrendingUp, text: "AI conviction scores + win-rate data" },
              { icon: Bell, text: "Instant push alerts on high-conviction setups" },
              { icon: Star, text: "Dark pool prints & institutional options flow" },
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
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-0.5">Early Access Pricing</div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-display font-bold">€9</span>
              <span className="text-muted-foreground text-sm">/ month</span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Lock in this rate — price increases at launch</div>
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
                Redirecting...
              </>
            ) : (
              <>
                Unlock Full Access (€9)
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-xs text-muted-foreground mt-4">
            Cancel anytime · No hidden fees · Billed monthly
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
    limit: 50,
  });

  const FILTERS: { label: string; value: GetSignalsType }[] = [
    { label: "All Signals", value: "all" },
    { label: "Insider Trades", value: "insider" },
    { label: "Options Flow", value: "options" },
    { label: "AI Sentiment", value: "sentiment" },
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
