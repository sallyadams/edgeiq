import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, ChevronRight, Sparkles, BookOpen,
  TrendingUp, HelpCircle, Zap, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  flow: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: "tour", label: "Quick Tour", icon: BookOpen, flow: "tour" },
  { id: "signal", label: "Explain Signals", icon: Sparkles, flow: "signal" },
  { id: "trade", label: "How to Trade", icon: TrendingUp, flow: "trade" },
  { id: "paper", label: "Paper Trading Help", icon: HelpCircle, flow: "paper" },
  { id: "upgrade", label: "Upgrade to Pro", icon: Zap, flow: "upgrade" },
];

const FLOW_RESPONSES: Record<string, string[]> = {
  tour: [
    "Welcome to EdgeIQ! Here's a quick overview:\n\n1. **Dashboard** — Your market overview with key indicators and featured signals.\n\n2. **Signal Feed** — Browse all AI-powered trading signals with conviction scores, risk levels, and entry zones.\n\n3. **Portfolio** — Track your paper trading positions and performance.\n\n4. **Watchlist** — Monitor specific tickers you're interested in.\n\nEach signal includes an AI confidence score, risk assessment, and clear buy/sell direction. Would you like to learn more about any of these?",
  ],
  signal: [
    "**Understanding Signals:**\n\nEach signal on EdgeIQ represents a detected market opportunity based on:\n\n• **Institutional Flows** — Where large fund managers are moving money\n• **Insider Activity** — When company insiders buy or sell their stock\n• **Options Flow** — Unusual options volume that often precedes big moves\n\n**Key metrics on each signal:**\n- **Conviction Score** — AI confidence level (higher = stronger signal)\n- **Risk Level** — Low/Medium/High based on market conditions\n- **Entry Zone** — Suggested price range for entering the trade\n- **Status** — Active (still valid), Closed, or Expired\n\n⚠️ Remember: Signals are informational tools, not guaranteed outcomes. Always do your own research.",
  ],
  trade: [
    "**How to trade on EdgeIQ:**\n\n1. **Find a signal** you're interested in on the Signal Feed\n2. **Review the details** — check conviction score, risk level, and AI insight\n3. **Click 'Trade Now'** to open the trade modal\n4. **Choose your side** — Buy or Sell\n5. **Set your quantity** and review the estimated total\n6. **Execute** — Your paper trade will be placed instantly\n\n**Paper Trading** is enabled by default — you start with €10,000 virtual money, so you can practice risk-free.\n\n**Live Trading** will be available soon through broker connections (Alpaca, Interactive Brokers).\n\n⚠️ All trading involves risk. Paper trading helps you learn without financial exposure.",
  ],
  paper: [
    "**Paper Trading on EdgeIQ:**\n\nPaper trading lets you simulate real trades with virtual money — perfect for learning!\n\n• **Starting balance:** €10,000\n• **Max position size:** €5,000 per trade\n• **No real money** involved — it's all simulated\n\n**How it works:**\n1. Go to any signal and click 'Trade Now'\n2. Your trades appear in the Portfolio page\n3. Watch your positions and see P&L in real time\n4. Close positions anytime\n5. Reset your portfolio to start fresh\n\nPaper trading is clearly labeled throughout the platform. When we launch broker connections, you'll be able to switch to live trading.",
  ],
  upgrade: [
    "**EdgeIQ Plans:**\n\n**Free** — 3 signals/day, delayed data, basic features\n\n**Pro (€19/mo)** — Unlimited signals, AI conviction scoring, real-time alerts, insider & options flow, advanced filters\n\n**Elite (€49/mo)** — Everything in Pro + dark pool data, priority signal queue, custom watchlists, dedicated support, early access features\n\nMost traders upgrade within 5 minutes of seeing their first signal. The Pro plan gives you the full edge.\n\nWould you like to upgrade now? You can do so from the sidebar or the pricing section.",
  ],
};

const WELCOME_MESSAGE = "Hi! I'm your EdgeIQ trading assistant. I can help you understand signals, navigate the platform, and get started with trading. What would you like to know?";

export function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { id: "welcome", role: "assistant", content: WELCOME_MESSAGE, timestamp: new Date() }
  ]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [showActions, setShowActions] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function addAssistantMessage(content: string) {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  }

  function handleQuickAction(action: QuickAction) {
    setShowActions(false);
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      role: "user",
      content: action.label,
      timestamp: new Date(),
    }]);
    const responses = FLOW_RESPONSES[action.flow];
    if (responses) {
      addAssistantMessage(responses[0]);
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setShowActions(false);

    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    }]);

    const lower = text.toLowerCase();
    let response = "I understand your question. For now, I can help you with:\n\n• Quick Tour of the platform\n• Signal explanations\n• How to trade\n• Paper trading\n• Upgrade information\n\nTry clicking one of the quick actions, or rephrase your question. Full AI-powered responses are coming soon!";

    if (lower.includes("signal") || lower.includes("buy") || lower.includes("sell")) {
      response = FLOW_RESPONSES.signal[0];
    } else if (lower.includes("trade") || lower.includes("trading") || lower.includes("execute")) {
      response = FLOW_RESPONSES.trade[0];
    } else if (lower.includes("paper") || lower.includes("demo") || lower.includes("virtual")) {
      response = FLOW_RESPONSES.paper[0];
    } else if (lower.includes("upgrade") || lower.includes("pro") || lower.includes("elite") || lower.includes("price") || lower.includes("plan")) {
      response = FLOW_RESPONSES.upgrade[0];
    } else if (lower.includes("tour") || lower.includes("how") || lower.includes("start") || lower.includes("help")) {
      response = FLOW_RESPONSES.tour[0];
    } else if (lower.includes("risk") || lower.includes("safe")) {
      response = "All trading carries risk. EdgeIQ provides AI-powered signals and data to inform your decisions, but past performance doesn't guarantee future results. Paper trading lets you practice risk-free. Always trade only what you can afford to lose.";
    } else if (lower.includes("broker") || lower.includes("connect")) {
      response = "Broker connections are coming soon! We're building integrations with Alpaca and Interactive Brokers so you can execute trades directly. For now, you can use paper trading to practice and track signals.\n\nWe'll notify all users when live broker execution is available.";
    }

    addAssistantMessage(response);
  }

  function renderMarkdown(text: string) {
    return text.split("\n").map((line, i) => {
      let rendered = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

      if (line.startsWith("• ") || line.startsWith("- ")) {
        return <div key={i} className="flex items-start gap-1.5 ml-1"><span className="text-primary mt-0.5">•</span><span dangerouslySetInnerHTML={{ __html: rendered.slice(2) }} /></div>;
      }
      if (/^\d+\./.test(line)) {
        return <div key={i} className="ml-1" dangerouslySetInnerHTML={{ __html: rendered }} />;
      }
      if (line === "") return <br key={i} />;
      return <div key={i} dangerouslySetInnerHTML={{ __html: rendered }} />;
    });
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 w-[380px] max-h-[560px] z-[100] flex flex-col rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/30 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">EdgeIQ Assistant</h3>
                  <p className="text-[10px] text-muted-foreground">AI-Powered Trading Guide</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!showActions && (
                  <button
                    onClick={() => setShowActions(true)}
                    className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                    title="Show quick actions"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 max-h-[380px]">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary/50 border border-border/40 rounded-bl-md"
                  )}>
                    {msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary/50 border border-border/40 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {showActions && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium px-1">Quick actions:</p>
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/30 border border-border/40 hover:bg-secondary/60 hover:border-border transition-all text-left group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <action.icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium flex-1">{action.label}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border/40 p-3">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about trading..."
                  className="flex-1 bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
                Educational guidance only. Not financial advice.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 z-[100] w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105",
          isOpen
            ? "bg-secondary border border-border text-foreground shadow-lg"
            : "bg-primary text-primary-foreground shadow-xl shadow-primary/30"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </>
  );
}
