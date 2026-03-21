import React from "react";
import { Link, useLocation } from "wouter";
import { Activity, LayoutDashboard, Star, Search, Bell, LogIn, LogOut, Menu, X, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "@workspace/replit-auth-web";
import { useI18n, LOCALE_LABELS, LOCALE_FLAGS, type Locale } from "@/i18n";
import { useUnlocked, UpgradeModal } from "./UpgradeModal";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const { user, isLoading: authLoading, isAuthenticated, login, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const { unlocked } = useUnlocked();
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);

  const NAV_ITEMS = [
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/signals", label: t.nav.signalFeed, icon: Activity },
    { href: "/watchlist", label: t.nav.watchlist, icon: Star },
  ];

  const initials = isAuthenticated && user
    ? `${(user.firstName?.[0] || "").toUpperCase()}${(user.lastName?.[0] || "").toUpperCase()}` || user.id.slice(0, 2).toUpperCase()
    : "";

  const displayName = isAuthenticated && user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || "User"
    : "";

  const langRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground overflow-hidden">
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/30 backdrop-blur-xl relative z-20">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <img 
            src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
            alt="EdgeIQ Logo" 
            className="w-8 h-8 mr-3"
          />
          <span className="font-display font-bold text-xl tracking-wide text-foreground">
            Edge<span className="text-primary">IQ</span>
          </span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <div className="mb-6 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t.nav.menu}
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-3 border-t border-border/50">
          {!unlocked && (
            <button
              onClick={() => setUpgradeOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
            >
              <Lock className="w-4 h-4" />
              {t.dashboard.unlockAllSignals}
            </button>
          )}
          {!unlocked && (
            <div className="flex items-center justify-center gap-1.5 px-2 py-1 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
              {t.dashboard.freePlan}
            </div>
          )}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/50 text-sm text-muted-foreground hover:text-foreground"
            >
              <Globe className="w-4 h-4" />
              <span>{LOCALE_FLAGS[locale]} {LOCALE_LABELS[locale]}</span>
            </button>
            {langOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLocale(l); setLangOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary/50 transition-colors",
                      l === locale ? "bg-primary/10 text-primary font-medium" : "text-foreground"
                    )}
                  >
                    <span>{LOCALE_FLAGS[l]}</span>
                    <span>{LOCALE_LABELS[l]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {authLoading ? (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/30 border border-border/50">
              <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-20 bg-secondary animate-pulse rounded" />
                <div className="h-2 w-14 bg-secondary animate-pulse rounded" />
              </div>
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/30 border border-border/50">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover shadow-lg" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              </div>
              <button onClick={logout} title={t.nav.signOut} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
            >
              <LogIn className="w-4 h-4" />
              {t.nav.signIn}
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="ml-2 font-display font-bold text-lg">EdgeIQ</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-secondary/40 border border-border/50 rounded-full w-96 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder={t.nav.searchTickers}
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full font-mono"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background"></span>
            </button>
            {!authLoading && !isAuthenticated && (
              <Button onClick={login} className="hidden sm:flex font-semibold shadow-lg shadow-primary/20">
                <LogIn className="w-4 h-4 mr-2" />
                {t.nav.signIn}
              </Button>
            )}
            {isAuthenticated && (
              <Button onClick={logout} variant="outline" className="hidden sm:flex font-semibold">
                <LogOut className="w-4 h-4 mr-2" />
                {t.nav.signOut}
              </Button>
            )}
          </div>
        </header>

        {isMobileMenuOpen && (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl z-50 md:hidden flex flex-col p-6 animate-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-8">
              <span className="font-display font-bold text-2xl text-foreground">{t.nav.menu}</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-muted-foreground">
                <X className="w-8 h-8" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-xl font-medium p-4 rounded-2xl hover:bg-secondary/50"
                >
                  <item.icon className="w-6 h-6 text-primary" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-wrap gap-2">
              {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-sm transition-colors",
                    l === locale ? "bg-primary/10 text-primary font-medium border border-primary/30" : "bg-secondary/50 text-muted-foreground"
                  )}
                >
                  {LOCALE_FLAGS[l]} {LOCALE_LABELS[l]}
                </button>
              ))}
            </div>
            <div className="mt-auto pt-6 border-t border-border/50">
              {isAuthenticated ? (
                <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary text-foreground font-semibold">
                  <LogOut className="w-5 h-5" />
                  {t.nav.signOut}
                </button>
              ) : (
                <button onClick={login} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">
                  <LogIn className="w-5 h-5" />
                  {t.nav.signIn}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-hide relative">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/5 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-screen" />
          
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
