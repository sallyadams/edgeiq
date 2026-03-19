import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { I18nProvider } from "@/i18n";

// Pages
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Signals from "@/pages/Signals";
import Watchlist from "@/pages/Watchlist";
import TickerDetail from "@/pages/TickerDetail";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard">
        <Layout>
          <Dashboard />
        </Layout>
      </Route>
      <Route path="/signals">
        <Layout>
          <Signals />
        </Layout>
      </Route>
      <Route path="/watchlist">
        <Layout>
          <Watchlist />
        </Layout>
      </Route>
      <Route path="/ticker/:symbol">
        <Layout>
          <TickerDetail />
        </Layout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }

  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </I18nProvider>
  );
}

export default App;
