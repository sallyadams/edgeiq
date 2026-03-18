import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap, BarChart2, Activity, Eye } from "lucide-react";

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Institutional Flow Tracking",
    description: "See where the big money is moving before the crowd catches on.",
    color: "text-primary",
    glow: "from-primary/20",
  },
  {
    icon: Eye,
    title: "Insider Activity Monitor",
    description: "Real-time alerts when corporate insiders buy or sell their own stock.",
    color: "text-emerald-400",
    glow: "from-emerald-400/20",
  },
  {
    icon: BarChart2,
    title: "Options Flow Analysis",
    description: "Unusual options activity that signals where smart money is betting.",
    color: "text-violet-400",
    glow: "from-violet-400/20",
  },
  {
    icon: Zap,
    title: "AI Conviction Scoring",
    description: "Every signal rated by our AI so you know exactly how strong each edge is.",
    color: "text-amber-400",
    glow: "from-amber-400/20",
  },
];

const STATS = [
  { value: "12,400+", label: "Signals tracked daily" },
  { value: "94%", label: "Accuracy on high-conviction calls" },
  { value: "$2.1B+", label: "Institutional flows monitored" },
  { value: "<500ms", label: "Average signal latency" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl tracking-wide">
              Edge<span className="text-primary">IQ</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Market Intelligence
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.05]">
            Track smart money.{" "}
            <br />
            <span className="text-gradient">Predict market moves.</span>
            <br />
            Trade with confidence.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Our AI analyzes institutional flows, insider activity, and options data to give you a real-time edge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:opacity-90 transition-all hover:scale-105 duration-200"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border/60 bg-card/50 text-foreground font-semibold text-base hover:bg-card transition-colors backdrop-blur"
            >
              See Live Signals
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
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

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Every edge, in one place.
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Stop guessing. Start trading with the same signals institutional desks pay millions for.
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

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl" />
          <div className="relative z-10 rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl p-12">
            <Shield className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Your edge starts today.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of traders who use EdgeIQ to stay ahead of the market.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:opacity-90 transition-all hover:scale-105 duration-200"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6 text-center text-sm text-muted-foreground">
        <span className="font-display font-bold text-foreground">Edge<span className="text-primary">IQ</span></span>
        {" "}— Market intelligence for the modern trader. Not financial advice.
      </footer>
    </div>
  );
}
