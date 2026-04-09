import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { useLocation } from "wouter";

export default function PaymentSuccess() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
          <div className="relative w-20 h-20 bg-success/10 border-2 border-success/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-display font-bold">{t.payment.successTitle}</h1>
          <p className="text-muted-foreground text-lg">{t.payment.successSubtitle}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-left">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm">{t.payment.featureUnlocked1}</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm">{t.payment.featureUnlocked2}</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm">{t.payment.featureUnlocked3}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setLocation("/signals")}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl"
          >
            {t.payment.goToSignals}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setLocation("/dashboard")}
            className="w-full py-3 rounded-xl"
          >
            {t.payment.goToDashboard}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground/60">{t.payment.receiptNote}</p>
      </div>
    </div>
  );
}
