import React from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Activity, Target } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { useGetMarketQuote, useGetTickerSignalHistory } from "@workspace/api-client-react";
import { SignalCard } from "@/components/SignalCard";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function TickerDetail() {
  const { symbol } = useParams();
  const ticker = symbol?.toUpperCase() || "";
  
  const { data: quote, isLoading: quoteLoading } = useGetMarketQuote(ticker);
  const { data: history, isLoading: historyLoading } = useGetTickerSignalHistory(ticker);

  // Transform history data for charts
  const chartData = history?.map(h => ({
    date: new Date(h.reportedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: h.convictionScore,
    type: h.type,
    fullDate: h.reportedAt
  })).reverse() || [];

  const isPositiveChange = quote && quote.change >= 0;

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      <Link href="/signals" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Signals
      </Link>

      {/* Header / Quote Section */}
      <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tighter">{ticker}</h1>
            <Badge variant="outline" className="text-xs uppercase tracking-wider bg-background">Equity</Badge>
          </div>
          {quoteLoading ? (
            <div className="h-10 w-48 bg-secondary/50 animate-pulse rounded-lg mt-4" />
          ) : quote ? (
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatCurrency(quote.price)}</span>
              <span className={cn("text-lg font-medium flex items-center", isPositiveChange ? "text-success" : "text-destructive")}>
                {isPositiveChange ? "+" : ""}{formatCurrency(quote.change)} ({quote.changePercent.toFixed(2)}%)
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground">Quote data unavailable</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Volume</p>
            <p className="font-mono font-medium">{quote?.volume ? (quote.volume / 1000000).toFixed(2) + "M" : "--"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Market Cap</p>
            <p className="font-mono font-medium">{quote?.marketCap || "--"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">P/E Ratio</p>
            <p className="font-mono font-medium">{quote?.pe || "--"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">52W Range</p>
            <p className="font-mono font-medium text-xs mt-0.5">{quote ? `$${quote.low52w} - $${quote.high52w}` : "--"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <h3 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Signal Conviction Trend
            </h3>
            
            <div className="h-[300px] w-full">
              {historyLoading ? (
                <div className="w-full h-full bg-secondary/20 animate-pulse rounded-xl" />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                  Not enough historical data
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Signal History List */}
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" /> Recent Signals
          </h3>
          
          <div className="space-y-4">
            {historyLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-secondary/20 animate-pulse border border-border/30" />
              ))
            ) : history && history.length > 0 ? (
              history.map((signal, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={signal.id}
                >
                  <SignalCard signal={signal} compact />
                </motion.div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm p-4 border border-dashed border-border rounded-xl text-center">
                No signals recorded for this ticker yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
