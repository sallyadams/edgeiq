import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { useLocation } from "wouter";

export default function PaymentCancel() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="mx-auto w-20 h-20 bg-muted/30 border-2 border-border rounded-full flex items-center justify-center">
          <XCircle className="w-10 h-10 text-muted-foreground" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-display font-bold">{t.payment.cancelTitle}</h1>
          <p className="text-muted-foreground text-lg">{t.payment.cancelSubtitle}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-3 text-left">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">{t.payment.cancelReassurance}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setLocation("/")}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.payment.backToHome}
          </Button>
          <Button
            variant="outline"
            onClick={() => setLocation("/signals")}
            className="w-full py-3 rounded-xl"
          >
            {t.payment.browseFree}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground/60">{t.payment.cancelNote}</p>
      </div>
    </div>
  );
}
