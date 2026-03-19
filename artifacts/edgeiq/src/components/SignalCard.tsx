import React from "react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { enUS, fr, de, es, nl } from "date-fns/locale";
import { TrendingUp, TrendingDown, Users, BrainCircuit, Activity, ExternalLink } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import type { Signal } from "@workspace/api-client-react";
import { useI18n } from "@/i18n";

const dateFnsLocales = { en: enUS, fr, de, es, nl } as const;

interface SignalCardProps {
  signal: Signal;
  compact?: boolean;
}

export function SignalCard({ signal, compact = false }: SignalCardProps) {
  const { locale, t } = useI18n();
  const isBullish = signal.action.toLowerCase() === 'buy' || signal.action.toLowerCase() === 'calls' || signal.action.toLowerCase() === 'bullish';
  const isBearish = signal.action.toLowerCase() === 'sell' || signal.action.toLowerCase() === 'puts' || signal.action.toLowerCase() === 'bearish';
  
  const TypeIcon = {
    insider: Users,
    options: Activity,
    sentiment: BrainCircuit
  }[signal.type] || Activity;

  return (
    <div className="group relative bg-card/40 backdrop-blur-sm border border-border/60 hover:border-border rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 overflow-hidden">
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none",
        isBullish ? "from-success/50 to-transparent" : isBearish ? "from-destructive/50 to-transparent" : "from-primary/50 to-transparent"
      )} />

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="uppercase tracking-wider text-[10px] bg-secondary/80">
            <TypeIcon className="w-3 h-3 mr-1" />
            {signal.type}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            {formatDistanceToNow(new Date(signal.reportedAt), { addSuffix: true, locale: dateFnsLocales[locale] })}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-secondary" strokeWidth="4" />
              <circle 
                cx="18" cy="18" r="16" fill="none" 
                className={cn("transition-all duration-1000 ease-out", isBullish ? "stroke-success" : isBearish ? "stroke-destructive" : "stroke-primary")} 
                strokeWidth="4" strokeDasharray="100" strokeDashoffset={100 - signal.convictionScore} 
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[10px] font-bold font-mono">{signal.convictionScore}</span>
          </div>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">{t.signalCard.conviction}</span>
        </div>
      </div>

      <div className="mb-3 flex items-end gap-3">
        <Link href={`/ticker/${signal.ticker}`} className="hover:opacity-80 transition-opacity">
          <h3 className="text-2xl font-display font-bold text-foreground tracking-tight hover:underline decoration-primary/50 underline-offset-4">
            {signal.ticker}
          </h3>
        </Link>
        <div className="pb-1">
          <Badge variant={isBullish ? "success" : isBearish ? "destructive" : "outline"} className="px-2 font-mono">
            {isBullish ? <TrendingUp className="w-3 h-3 mr-1" /> : isBearish ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
            {signal.action.toUpperCase()}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4 min-h-[2.5rem]">
        {signal.description}
      </p>

      {!compact && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-secondary/30 rounded-xl border border-border/40 mt-auto">
          {signal.valueUsd && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t.signalCard.value}</p>
              <p className="font-mono text-sm font-semibold">{formatCurrency(signal.valueUsd)}</p>
            </div>
          )}
          {signal.winRate !== undefined && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t.signalCard.histWinRate}</p>
              <p className="font-mono text-sm font-semibold text-primary">{Math.round(signal.winRate * 100)}%</p>
            </div>
          )}
          {signal.strikePrice && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t.signalCard.strike}</p>
              <p className="font-mono text-sm font-semibold">${signal.strikePrice}</p>
            </div>
          )}
          {signal.filerName && (
            <div className="col-span-2 md:col-span-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t.signalCard.entity}</p>
              <p className="font-sans text-xs font-medium truncate" title={signal.filerName}>{signal.filerName}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
