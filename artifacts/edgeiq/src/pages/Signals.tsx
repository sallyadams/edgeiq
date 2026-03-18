import React, { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useGetSignals } from "@workspace/api-client-react";
import { SignalCard } from "@/components/SignalCard";
import { Badge } from "@/components/ui/badge";

type GetSignalsType = "all" | "insider" | "options" | "sentiment";

export default function Signals() {
  const [filterType, setFilterType] = useState<GetSignalsType>("all");
  const [search, setSearch] = useState("");
  
  // In a real app, we'd debounce the search
  const { data: signals, isLoading } = useGetSignals({ 
    type: filterType === "all" ? undefined : filterType, 
    ticker: search || undefined,
    limit: 50 
  });

  const FILTERS: { label: string, value: GetSignalsType }[] = [
    { label: "All Signals", value: "all" },
    { label: "Insider Trades", value: "insider" },
    { label: "Options Flow", value: "options" },
    { label: "AI Sentiment", value: "sentiment" }
  ];

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Signal Feed</h1>
          <p className="text-muted-foreground">Real-time alerts for unusual market activity.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filter by ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 transition-all"
            />
          </div>
          <button className="p-2 border border-border bg-card rounded-lg hover:bg-secondary transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-4 border-b border-border/50">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilterType(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filterType === f.value 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-secondary/20 animate-pulse border border-border/30" />
          ))
        ) : signals?.length === 0 ? (
          <div className="text-center py-24 bg-card/30 rounded-2xl border border-border border-dashed">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-foreground">No signals found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          signals?.map((signal, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={signal.id}
            >
              <SignalCard signal={signal} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
