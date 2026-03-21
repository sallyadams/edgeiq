import React from "react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { enUS, fr, de, es, nl } from "date-fns/locale";
import { TrendingUp, TrendingDown, Users, BrainCircuit, Activity, Flame, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import type { Signal } from "@workspace/api-client-react";
import { useI18n } from "@/i18n";

const dateFnsLocales = { en: enUS, fr, de, es, nl } as const;

interface SignalCardProps {
  signal: Signal;
  compact?: boolean;
}

type ConvictionTier = "high" | "medium" | "low";

function getConvictionTier(score: number): ConvictionTier {
  if (score >= 85) return "high";
  if (score >= 70) return "medium";
  return "low";
}

const tierRingStroke: Record<ConvictionTier, string> = {
  high: "stroke-success",
  medium: "stroke-blue-400",
  low: "stroke-muted-foreground/60",
};

const tierScoreText: Record<ConvictionTier, string> = {
  high: "text-success",
  medium: "text-blue-400",
  low: "text-muted-foreground",
};

const tierBorder: Record<ConvictionTier, string> = {
  high: "border-success/40 hover:border-success/60",
  medium: "border-blue-400/30 hover:border-blue-400/50",
  low: "border-border/60 hover:border-border",
};

const tierGlowLine: Record<ConvictionTier, string> = {
  high: "bg-gradient-to-r from-transparent via-success to-transparent",
  medium: "bg-gradient-to-r from-transparent via-blue-400 to-transparent",
  low: "",
};

const tierBadgeClasses: Record<ConvictionTier, string> = {
  high: "bg-success/20 text-success border border-success/30",
  medium: "bg-blue-400/15 text-blue-400 border border-blue-400/25",
  low: "bg-muted/30 text-muted-foreground border border-border/50",
};

const tierInsightBox: Record<ConvictionTier, string> = {
  high: "bg-success/5 border-success/20",
  medium: "bg-blue-400/5 border-blue-400/15",
  low: "bg-secondary/30 border-border/40",
};

const tierInsightIcon: Record<ConvictionTier, string> = {
  high: "text-success",
  medium: "text-blue-400",
  low: "text-muted-foreground",
};

const tierBadgeLabel: Record<ConvictionTier, string> = {
  high: "High Conviction",
  medium: "Moderate",
  low: "Low",
};

export function SignalCard({ signal, compact = false }: SignalCardProps) {
  const { locale, t } = useI18n();
  const isBullish = signal.action.toLowerCase() === 'buy' || signal.action.toLowerCase() === 'calls' || signal.action.toLowerCase() === 'bullish';
  const isBearish = signal.action.toLowerCase() === 'sell' || signal.action.toLowerCase() === 'puts' || signal.action.toLowerCase() === 'bearish';
  const tier = getConvictionTier(signal.convictionScore);

  const TypeIcon = {
    insider: Users,
    options: Activity,
    sentiment: BrainCircuit
  }[signal.type] || Activity;

  return (
    <div className={cn(
      "group relative bg-card/40 backdrop-blur-sm border rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 overflow-hidden",
      tierBorder[tier]
    )}>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none",
        isBullish ? "from-success/50 to-transparent" : isBearish ? "from-destructive/50 to-transparent" : "from-primary/50 to-transparent"
      )} />

      {tier !== "low" && (
        <div className={cn("absolute top-0 left-0 right-0 h-[2px]", tierGlowLine[tier])} />
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="uppercase tracking-wider text-[10px] bg-secondary/80">
            <TypeIcon className="w-3 h-3 mr-1" />
            {signal.type}
          </Badge>
          <Badge variant="default" className={cn("text-[10px] font-bold uppercase tracking-wider animate-in fade-in", tierBadgeClasses[tier])}>
            {tier === "high" && <Flame className="w-3 h-3 mr-1" />}
            {tierBadgeLabel[tier]}
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
                className={cn("transition-all duration-1000 ease-out", tierRingStroke[tier])} 
                strokeWidth="4" strokeDasharray="100" strokeDashoffset={100 - signal.convictionScore} 
                strokeLinecap="round"
              />
            </svg>
            <span className={cn("absolute text-[10px] font-bold font-mono", tierScoreText[tier])}>{signal.convictionScore}</span>
          </div>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">{t.signalCard.conviction}</span>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <Link href={`/ticker/${signal.ticker}`} className="hover:opacity-80 transition-opacity">
          <h3 className="text-2xl font-display font-bold text-foreground tracking-tight hover:underline decoration-primary/50 underline-offset-4">
            {signal.ticker}
          </h3>
        </Link>
        <Badge variant={isBullish ? "success" : isBearish ? "destructive" : "outline"} className="px-2 font-mono">
          {isBullish ? <TrendingUp className="w-3 h-3 mr-1" /> : isBearish ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
          {signal.action.toUpperCase()}
        </Badge>
        <span className={cn("text-sm font-bold", tierScoreText[tier])}>
          {signal.convictionScore}%
        </span>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3 min-h-[2.5rem]">
        {signal.description}
      </p>

      {signal.aiInsight && (
        <div className={cn("mb-4 p-3.5 rounded-xl border", tierInsightBox[tier])}>
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className={cn("w-3.5 h-3.5", tierInsightIcon[tier])} />
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", tierInsightIcon[tier])}>
              AI Insight
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80 italic">
            "{signal.aiInsight}"
          </p>
        </div>
      )}

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
