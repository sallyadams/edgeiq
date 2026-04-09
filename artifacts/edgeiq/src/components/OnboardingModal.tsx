import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, Briefcase, Zap, ArrowRight, ArrowLeft, X, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  visual: string;
}

const STEPS: OnboardingStep[] = [
  {
    title: "Welcome to EdgeIQ",
    description: "Your AI-powered market intelligence platform. We track institutional flows, insider activity, and unusual options volume to give you a real-time trading edge.",
    icon: Activity,
    color: "text-primary",
    visual: "Track smart money. Trade with confidence.",
  },
  {
    title: "AI-Powered Signals",
    description: "Every signal includes a conviction score, risk level, entry zone, and AI explanation. You'll know exactly why a trade opportunity exists and how strong the edge is.",
    icon: Sparkles,
    color: "text-emerald-400",
    visual: "Each signal is rated by our AI with clear buy/sell direction.",
  },
  {
    title: "Track & Execute Trades",
    description: "Follow signals in your portfolio, monitor P&L in real time, and execute paper trades instantly. Start with €10,000 virtual money — no risk involved.",
    icon: TrendingUp,
    color: "text-violet-400",
    visual: "Paper trading lets you practice before going live.",
  },
  {
    title: "Paper Trading Mode",
    description: "Practice risk-free with our paper trading system. Place simulated trades, track your performance, and build confidence before connecting a real broker.",
    icon: Target,
    color: "text-amber-400",
    visual: "€10,000 virtual balance. Max €5,000 per position.",
  },
  {
    title: "Ready to Start?",
    description: "Explore signals, place your first paper trade, and use the AI assistant (bottom-right) anytime you need help. Upgrade to Pro for unlimited signals and advanced features.",
    icon: Zap,
    color: "text-primary",
    visual: "Your trading edge starts now.",
  },
];

const STORAGE_KEY = "edgeiq_onboarding_seen";

export function useOnboarding() {
  const [seen, setSeen] = React.useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  function markSeen() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setSeen(true);
  }

  return { seen, markSeen };
}

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const [step, setStep] = React.useState(0);
  const totalSteps = STEPS.length;
  const current = STEPS[step];

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleSkip() {
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleSkip} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg rounded-3xl border border-border/50 bg-card shadow-2xl overflow-hidden"
      >
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className={cn("w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center mb-6", current.color)}>
                <current.icon className="w-8 h-8" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Step {step + 1} of {totalSteps}
                </span>
              </div>

              <h2 className="text-2xl font-display font-bold mb-3">{current.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{current.description}</p>

              <div className="p-4 rounded-xl bg-secondary/30 border border-border/40">
                <p className="text-sm font-medium text-foreground/80 italic">
                  {current.visual}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 justify-center pb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/40" : "w-4 bg-secondary"
              )}
            />
          ))}
        </div>

        <div className="flex items-center justify-between px-8 pb-8">
          <div>
            {step > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all hover:scale-[1.02]"
          >
            {step === totalSteps - 1 ? "Get Started" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
