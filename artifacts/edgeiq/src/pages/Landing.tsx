import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap, BarChart2, Activity, Eye, Check, Globe } from "lucide-react";
import { useI18n, LOCALE_LABELS, LOCALE_FLAGS, type Locale } from "@/i18n";
import { useAuth } from "@workspace/replit-auth-web";

async function startCheckout(plan: "pro" | "elite") {
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

function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Globe className="w-4 h-4" />
        {LOCALE_FLAGS[locale]}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 min-w-[140px]">
          {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50 transition-colors ${
                l === locale ? "bg-primary/10 text-primary font-medium" : "text-foreground"
              }`}
            >
              <span>{LOCALE_FLAGS[l]}</span>
              <span>{LOCALE_LABELS[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  const { t } = useI18n();
  const { isAuthenticated, login } = useAuth();

  const FEATURES = [
    { icon: TrendingUp, title: t.landing.featureInstitutional, description: t.landing.featureInstitutionalDesc, color: "text-primary", glow: "from-primary/20" },
    { icon: Eye, title: t.landing.featureInsider, description: t.landing.featureInsiderDesc, color: "text-emerald-400", glow: "from-emerald-400/20" },
    { icon: BarChart2, title: t.landing.featureOptions, description: t.landing.featureOptionsDesc, color: "text-violet-400", glow: "from-violet-400/20" },
    { icon: Zap, title: t.landing.featureAi, description: t.landing.featureAiDesc, color: "text-amber-400", glow: "from-amber-400/20" },
  ];

  const STATS = [
    { value: "12,400+", label: t.landing.statsSignals },
    { value: "94%", label: t.landing.statsAccuracy },
    { value: "$2.1B+", label: t.landing.statsFlows },
    { value: "<500ms", label: t.landing.statsLatency },
  ];

  type FreeTier = { kind: "free"; name: string; price: string; period: string; description: string; highlighted: false; cta: string; ctaHref: string; features: string[] };
  type PaidTier = { kind: "paid"; name: string; price: string; period: string; description: string; highlighted: boolean; badge?: string; cta: string; plan: "pro" | "elite"; features: string[] };
  type PricingTier = FreeTier | PaidTier;

  const PRICING_TIERS: PricingTier[] = [
    {
      kind: "free", name: t.landing.free, price: "€0", period: t.landing.forever, description: t.landing.freeDescription,
      highlighted: false, cta: t.landing.startFree, ctaHref: "/dashboard",
      features: [t.landing.freeFeature1, t.landing.freeFeature2, t.landing.freeFeature3, t.landing.freeFeature4],
    },
    {
      kind: "paid", name: t.landing.pro, price: "€19", period: t.landing.perMonth, description: t.landing.proDescription,
      highlighted: true, badge: t.landing.mostPopular, cta: t.landing.getPro, plan: "pro",
      features: [t.landing.proFeature1, t.landing.proFeature2, t.landing.proFeature3, t.landing.proFeature4, t.landing.proFeature5],
    },
    {
      kind: "paid", name: t.landing.elite, price: "€49", period: t.landing.perMonth, description: t.landing.eliteDescription,
      highlighted: false, cta: t.landing.getElite, plan: "elite",
      features: [t.landing.eliteFeature1, t.landing.eliteFeature2, t.landing.eliteFeature3, t.landing.eliteFeature4, t.landing.eliteFeature5, t.landing.eliteFeature6],
    },
  ];

  function PricingCard({ tier, index }: { tier: PricingTier; index: number }) {
    const [loading, setLoading] = React.useState(false);

    async function handleCta() {
      if (tier.kind !== "paid") return;
      setLoading(true);
      try { await startCheckout(tier.plan); } catch { setLoading(false); }
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index + 0.2 }}
        className={`relative flex flex-col rounded-3xl border p-8 ${
          tier.highlighted ? "border-primary/60 bg-card shadow-2xl shadow-primary/15 scale-[1.03]" : "border-border/50 bg-card/50"
        }`}
      >
        {tier.highlighted && tier.kind === "paid" && tier.badge && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-wide">
            {tier.badge}
          </div>
        )}
        <div className="mb-6">
          <h3 className="text-lg font-display font-bold mb-1">{tier.name}</h3>
          <p className="text-muted-foreground text-sm mb-4">{tier.description}</p>
          <div className="flex items-end gap-1">
            <span className="text-4xl font-display font-bold">{tier.price}</span>
            <span className="text-muted-foreground text-sm mb-1">{tier.period}</span>
          </div>
        </div>
        <ul className="space-y-2.5 mb-8 flex-1">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        {tier.kind === "paid" ? (
          <button
            onClick={handleCta}
            disabled={loading}
            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none ${
              tier.highlighted ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 hover:scale-[1.02]" : "border border-border/60 bg-secondary/30 text-foreground hover:bg-secondary"
            }`}
          >
            {loading ? t.signals.redirecting : tier.cta}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        ) : (
          <Link
            href={tier.ctaHref}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm border border-border/60 bg-secondary/30 text-foreground hover:bg-secondary transition-colors"
          >
            {tier.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl tracking-wide">
              Edge<span className="text-primary">IQ</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
              >
                {t.nav.dashboard}
              </Link>
            ) : (
              <>
                <button onClick={login} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t.landing.signIn}
                </button>
                <button
                  onClick={login}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
                >
                  {t.landing.startFree}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
            <Zap className="w-3.5 h-3.5" />
            {t.landing.heroTagline}
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.05]">
            {t.landing.heroLine1}{" "}
            <br />
            <span className="text-gradient">{t.landing.heroLine2}</span>
            <br />
            {t.landing.heroLine3}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.landing.heroDescription}
          </p>

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:opacity-90 transition-all hover:scale-105 duration-200"
                >
                  {t.nav.dashboard}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={login}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:opacity-90 transition-all hover:scale-105 duration-200"
                >
                  {t.landing.startFree}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border/60 bg-card/50 text-foreground font-semibold text-base hover:bg-card transition-colors backdrop-blur"
              >
                {t.landing.seeLiveSignals}
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.landing.freeAccessLine}
            </p>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-border/40 bg-card/30 backdrop-blur py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
            >
              <div className="text-3xl font-display font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t.landing.featuresTitle}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {t.landing.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.2 }}
                className="relative group rounded-2xl border border-border/50 bg-card/50 p-7 hover:border-border transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`w-11 h-11 rounded-xl bg-card border border-border/50 flex items-center justify-center mb-5 ${feature.color}`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t.landing.pricingTitle}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {t.landing.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {PRICING_TIERS.map((tier, i) => (
              <PricingCard key={tier.name} tier={tier} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl" />
          <div className="relative z-10 rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl p-12">
            <Shield className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t.landing.ctaTitle}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t.landing.ctaSubtitle}
            </p>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:opacity-90 transition-all hover:scale-105 duration-200"
              >
                {t.nav.dashboard}
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={login}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:opacity-90 transition-all hover:scale-105 duration-200"
              >
                {t.landing.startFree}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8 px-6 text-center text-sm text-muted-foreground">
        <span className="font-display font-bold text-foreground">Edge<span className="text-primary">IQ</span></span>
        {" "}&mdash; {t.landing.footerDisclaimer}
      </footer>
    </div>
  );
}
