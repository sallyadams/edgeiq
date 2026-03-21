import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Zap, TrendingUp, Bell, Star, ArrowRight, Loader2 } from "lucide-react";
import { useI18n } from "@/i18n";

const UNLOCK_KEY = "edgeiq_unlocked";

export function goToStripeCheckout() {
  const origin = window.location.origin;
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const successUrl = encodeURIComponent(`${origin}${basePath}/signals?upgraded=true`);
  window.location.href = `https://buy.stripe.com/fZu6oGePYaES03wbzL8IU00?success_url=${successUrl}`;
}

export function useUnlocked() {
  const [unlocked, setUnlocked] = React.useState(() =>
    typeof window !== "undefined" && localStorage.getItem(UNLOCK_KEY) === "true"
  );
  const [justUpgraded, setJustUpgraded] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") === "true") {
      localStorage.setItem(UNLOCK_KEY, "true");
      setUnlocked(true);
      setJustUpgraded(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("upgraded");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return { unlocked, justUpgraded };
}

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { t } = useI18n();

  function handleUpgrade() {
    setLoading(true);
    goToStripeCheckout();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-primary/30 bg-card shadow-2xl shadow-black/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10 pointer-events-none" />
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto mb-5">
                <Lock className="w-7 h-7 text-primary" />
              </div>

              <h2 className="text-2xl font-display font-bold mb-2">
                {t.upgradeModal.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t.upgradeModal.subtitle}
              </p>

              <ul className="space-y-3 mb-7 text-left">
                {[
                  { icon: Zap, text: t.upgradeModal.featureSignals },
                  { icon: TrendingUp, text: t.upgradeModal.featureAi },
                  { icon: Bell, text: t.upgradeModal.featureAlerts },
                  { icon: Star, text: t.upgradeModal.featureDarkPool },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-2 mb-4">{error}</p>
              )}

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/30 hover:opacity-90 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t.upgradeModal.upgradeNow}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-muted-foreground mt-3">
                {t.upgradeModal.cancelAnytime}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
