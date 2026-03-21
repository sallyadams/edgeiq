import React from "react";
import { Activity, Users } from "lucide-react";
import { useI18n } from "@/i18n";

function useAnimatedCount(base: number, range: number, intervalMs = 8000) {
  const [count, setCount] = React.useState(() => base + Math.floor(Math.random() * range));
  React.useEffect(() => {
    const id = setInterval(() => {
      setCount(base + Math.floor(Math.random() * range));
    }, intervalMs);
    return () => clearInterval(id);
  }, [base, range, intervalMs]);
  return count;
}

export function LiveActivityTicker() {
  const { t } = useI18n();
  const signalCount = useAnimatedCount(8, 20, 7000);
  const traderCount = useAnimatedCount(2, 6, 12000);

  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
        <Activity className="w-3 h-3" />
        <span>+{signalCount} {t.dashboard.signalsDetected}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Users className="w-3 h-3" />
        <span>{traderCount} {t.dashboard.tradersUpgraded}</span>
      </div>
    </div>
  );
}
