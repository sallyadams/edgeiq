import React from "react";
import { motion } from "framer-motion";
import { X, Link2, Shield, ArrowRight, Clock, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrokerConnectProps {
  open: boolean;
  onClose: () => void;
  onUsePaperTrading?: () => void;
}

const BROKERS = [
  {
    id: "alpaca",
    name: "Alpaca",
    description: "Commission-free trading API for US stocks and ETFs",
    status: "coming_soon" as const,
    logo: "A",
    color: "from-amber-500 to-amber-600",
  },
  {
    id: "ibkr",
    name: "Interactive Brokers",
    description: "Professional-grade multi-asset trading platform",
    status: "coming_soon" as const,
    logo: "IB",
    color: "from-red-500 to-red-600",
  },
  {
    id: "tradier",
    name: "Tradier",
    description: "Stock and options trading with developer-friendly API",
    status: "planned" as const,
    logo: "T",
    color: "from-blue-500 to-blue-600",
  },
];

export function BrokerConnect({ open, onClose, onUsePaperTrading }: BrokerConnectProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg rounded-3xl border border-border/50 bg-card shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">Connect a Broker</h2>
              <p className="text-xs text-muted-foreground">Execute trades through your preferred broker</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {BROKERS.map((broker) => (
              <div
                key={broker.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-secondary/20 opacity-70"
              >
                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm", broker.color)}>
                  {broker.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">{broker.name}</h3>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      broker.status === "coming_soon"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-muted/30 text-muted-foreground border border-border/40"
                    )}>
                      {broker.status === "coming_soon" ? "Coming Soon" : "Planned"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{broker.description}</p>
                </div>
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold mb-1">Paper Trading Available Now</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  While broker connections are being built, you can practice with our paper trading system. Start with €10,000 virtual money — no risk, full functionality.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => {
                onUsePaperTrading?.();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all hover:scale-[1.01]"
            >
              <Zap className="w-4 h-4" />
              Use Paper Trading Instead
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
            >
              I'll wait for broker connections
            </button>
          </div>

          <div className="mt-4 flex items-start gap-2 text-[10px] text-muted-foreground/60">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <p>Broker connections will execute real trades with real money through your brokerage account. EdgeIQ does not store or manage user funds.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
