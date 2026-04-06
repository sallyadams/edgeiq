export type Locale = "en" | "fr" | "de" | "es" | "nl";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  nl: "Nederlands",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
  nl: "🇳🇱",
};

type TranslationKeys = {
  nav: {
    menu: string;
    dashboard: string;
    signalFeed: string;
    portfolio: string;
    watchlist: string;
    signIn: string;
    signOut: string;
    searchTickers: string;
  };
  dashboard: {
    heroTitle: string;
    heroTitleHighlight: string;
    heroDescription: string;
    marketRegime: string;
    riskOnBullish: string;
    fearGreedIndex: string;
    insiderBuyRatio: string;
    historicalAvg: string;
    optionsFlowBias: string;
    bullish: string;
    bearish: string;
    totalSignalsToday: string;
    acrossAllSectors: string;
    liveSignalFeed: string;
    viewAll: string;
    highConviction: string;
    score: string;
    unlockTop50: string;
    featuredSignal: string;
    highConvictionSignal: string;
    viewFullAnalysis: string;
    signalsDetected: string;
    tradersUpgraded: string;
    freePlan: string;
    unlockAllSignals: string;
  };
  upgradeModal: {
    title: string;
    subtitle: string;
    featureSignals: string;
    featureAi: string;
    featureAlerts: string;
    featureDarkPool: string;
    upgradeNow: string;
    cancelAnytime: string;
  };
  signals: {
    title: string;
    subtitle: string;
    filterByTicker: string;
    allSignals: string;
    insiderTrades: string;
    optionsFlow: string;
    aiSentiment: string;
    noSignalsFound: string;
    noSignalsHint: string;
    seeingOnly10: string;
    unlockTitle: string;
    unlockDescription: string;
    featureUnlimited: string;
    featureAiScoring: string;
    featurePushAlerts: string;
    featureDarkPool: string;
    earlyAccessPricing: string;
    pricePerMonth: string;
    lockInRate: string;
    unlockFullAccess: string;
    redirecting: string;
    somethingWentWrong: string;
    cancelAnytime: string;
    fullAccessUnlocked: string;
    welcomeEarlyAccess: string;
  };
  watchlist: {
    title: string;
    subtitle: string;
    addTickerPlaceholder: string;
    adding: string;
    add: string;
    empty: string;
    emptyHint: string;
    toggleAlerts: string;
    remove: string;
    latestSignal: string;
    noRecentSignals: string;
    analyze: string;
    suggestedTickers: string;
    addedToast: string;
    addErrorToast: string;
    removedToast: string;
    removeErrorToast: string;
  };
  signalCard: {
    conviction: string;
    value: string;
    histWinRate: string;
    strike: string;
    entity: string;
    aiInsight: string;
    upgradeToUnlock: string;
  };
  ticker: {
    backToSignals: string;
    equity: string;
    quoteUnavailable: string;
    volume: string;
    marketCap: string;
    peRatio: string;
    week52Range: string;
    convictionTrend: string;
    notEnoughData: string;
    recentSignals: string;
    noSignalsForTicker: string;
  };
  landing: {
    signIn: string;
    startFree: string;
    heroTagline: string;
    heroLine1: string;
    heroLine2: string;
    heroLine3: string;
    heroDescription: string;
    seeLiveSignals: string;
    freeAccessLine: string;
    statsSignals: string;
    statsAccuracy: string;
    statsFlows: string;
    statsLatency: string;
    featuresTitle: string;
    featuresSubtitle: string;
    featureInstitutional: string;
    featureInstitutionalDesc: string;
    featureInsider: string;
    featureInsiderDesc: string;
    featureOptions: string;
    featureOptionsDesc: string;
    featureAi: string;
    featureAiDesc: string;
    pricingTitle: string;
    pricingSubtitle: string;
    free: string;
    forever: string;
    freeDescription: string;
    freeFeature1: string;
    freeFeature2: string;
    freeFeature3: string;
    freeFeature4: string;
    pro: string;
    perMonth: string;
    proDescription: string;
    mostPopular: string;
    proFeature1: string;
    proFeature2: string;
    proFeature3: string;
    proFeature4: string;
    proFeature5: string;
    getPro: string;
    proUrgency: string;
    elite: string;
    eliteDescription: string;
    getElite: string;
    eliteUrgency: string;
    eliteFeature1: string;
    eliteFeature2: string;
    eliteFeature3: string;
    eliteFeature4: string;
    eliteFeature5: string;
    eliteFeature6: string;
    freeLimitation1: string;
    freeLimitation2: string;
    tradersBadge: string;
    ctaTitle: string;
    ctaSubtitle: string;
    footerDisclaimer: string;
  };
  trading: {
    portfolio: string;
    portfolioSubtitle: string;
    demoAccount: string;
    balance: string;
    of: string;
    totalPnl: string;
    unrealizedPnl: string;
    openPositions: string;
    totalTrades: string;
    allTime: string;
    tradeHistory: string;
    noOpenPositions: string;
    noOpenPositionsHint: string;
    noTrades: string;
    noTradesHint: string;
    shares: string;
    close: string;
    ticker: string;
    side: string;
    qty: string;
    price: string;
    total: string;
    date: string;
    refresh: string;
    reset: string;
    resetConfirm: string;
    confirmReset: string;
    executeTrade: string;
    paperTrading: string;
    currentPrice: string;
    buy: string;
    sell: string;
    quantity: string;
    estimatedTotal: string;
    maxPosition: string;
    executing: string;
    invalidQuantity: string;
    tradeFailed: string;
    disclaimer: string;
    trade: string;
    positionClosed: string;
    closeError: string;
    portfolioResetSuccess: string;
    resetError: string;
    tradeSuccess: string;
  };
  notFound: {
    title: string;
    message: string;
  };
};

const en: TranslationKeys = {
  nav: {
    menu: "Menu",
    dashboard: "Dashboard",
    signalFeed: "Signal Feed",
    portfolio: "Portfolio",
    watchlist: "Watchlist",
    signIn: "Sign In",
    signOut: "Sign Out",
    searchTickers: "Search tickers (e.g. AAPL)...",
  },
  dashboard: {
    heroTitle: "Market Intelligence,",
    heroTitleHighlight: "Weaponized.",
    heroDescription: "Track institutional money, uncover unusual options flow, and trade alongside insiders with AI-driven conviction scoring.",
    marketRegime: "Market Regime",
    riskOnBullish: "Risk-On / Bullish",
    fearGreedIndex: "Fear & Greed Index",
    insiderBuyRatio: "Insider Buy Ratio",
    historicalAvg: "Historical avg 1.2x",
    optionsFlowBias: "Options Flow Bias",
    bullish: "Bullish",
    bearish: "Bearish",
    totalSignalsToday: "Total Signals Today",
    acrossAllSectors: "Across all sectors",
    liveSignalFeed: "Live Signal Feed",
    viewAll: "View All",
    highConviction: "High Conviction",
    score: "Score",
    unlockTop50: "Unlock Top 50 Signals",
    featuredSignal: "Featured Signal",
    highConvictionSignal: "HIGH CONVICTION SIGNAL",
    viewFullAnalysis: "View Full Analysis",
    signalsDetected: "signals detected in the last hour",
    tradersUpgraded: "traders upgraded recently",
    freePlan: "Free Plan",
    unlockAllSignals: "Unlock All Signals",
  },
  upgradeModal: {
    title: "You've reached your limit",
    subtitle: "Unlock 50+ signals, AI insights, and real-time alerts.",
    featureSignals: "50+ high-conviction signals daily",
    featureAi: "AI insights on every signal",
    featureAlerts: "Real-time push alerts",
    featureDarkPool: "Dark pool & institutional flow",
    upgradeNow: "Upgrade Now",
    cancelAnytime: "Cancel anytime \u00b7 No hidden fees",
  },
  signals: {
    title: "Signal Feed",
    subtitle: "Real-time alerts for unusual market activity.",
    filterByTicker: "Filter by ticker...",
    allSignals: "All Signals",
    insiderTrades: "Insider Trades",
    optionsFlow: "Options Flow",
    aiSentiment: "AI Sentiment",
    noSignalsFound: "No signals found",
    noSignalsHint: "Try adjusting your filters or search query.",
    seeingOnly10: "You're seeing only 10% of the signals",
    unlockTitle: "Unlock Full Market Intelligence",
    unlockDescription: "Get access to all real-time insider trades, options flow alerts, and AI-scored signals — the ones retail investors never see in time.",
    featureUnlimited: "Unlimited real-time signals across all tickers",
    featureAiScoring: "AI conviction scores + win-rate data",
    featurePushAlerts: "Instant push alerts on high-conviction setups",
    featureDarkPool: "Dark pool prints & institutional options flow",
    earlyAccessPricing: "Early Access Pricing",
    pricePerMonth: "/ month",
    lockInRate: "Lock in this rate — price increases at launch",
    unlockFullAccess: "Unlock Full Access (€9)",
    redirecting: "Redirecting...",
    somethingWentWrong: "Something went wrong. Please try again.",
    cancelAnytime: "Cancel anytime · No hidden fees · Billed monthly",
    fullAccessUnlocked: "You're in — full access unlocked!",
    welcomeEarlyAccess: "Welcome to EdgeIQ Early Access. All signals are now visible.",
  },
  watchlist: {
    title: "My Watchlist",
    subtitle: "Monitor high-conviction signals for your favorite assets.",
    addTickerPlaceholder: "Add ticker (e.g. NVDA)",
    adding: "Adding...",
    add: "Add",
    empty: "Your watchlist is empty",
    emptyHint: "Add tickers to track unusual options flow and insider trading specifically for the assets you care about.",
    toggleAlerts: "Toggle Alerts",
    remove: "Remove",
    latestSignal: "Latest Signal",
    noRecentSignals: "No recent signals",
    analyze: "Analyze",
    suggestedTickers: "Popular tickers to get started",
    addedToast: "added to watchlist",
    addErrorToast: "Failed to add ticker",
    removedToast: "removed from watchlist",
    removeErrorToast: "Failed to remove ticker",
  },
  signalCard: {
    conviction: "Conviction",
    value: "Value",
    histWinRate: "Hist. Win Rate",
    strike: "Strike",
    entity: "Entity",
    aiInsight: "AI Insight",
    upgradeToUnlock: "Upgrade to unlock",
  },
  ticker: {
    backToSignals: "Back to Signals",
    equity: "Equity",
    quoteUnavailable: "Quote data unavailable",
    volume: "Volume",
    marketCap: "Market Cap",
    peRatio: "P/E Ratio",
    week52Range: "52W Range",
    convictionTrend: "Signal Conviction Trend",
    notEnoughData: "Not enough historical data",
    recentSignals: "Recent Signals",
    noSignalsForTicker: "No signals recorded for this ticker yet.",
  },
  landing: {
    signIn: "Sign In",
    startFree: "Start Free \u2014 Get 3 Live Signals",
    heroTagline: "AI-Powered Market Intelligence",
    heroLine1: "Track smart money.",
    heroLine2: "Predict market moves.",
    heroLine3: "Trade with confidence.",
    heroDescription: "Our AI analyzes institutional flows, insider activity, and options data to give you a real-time edge.",
    seeLiveSignals: "See Live Signals",
    freeAccessLine: "Free access \u00b7 No credit card \u00b7 3 live signals instantly",
    statsSignals: "Signals tracked daily",
    statsAccuracy: "Accuracy on high-conviction calls",
    statsFlows: "Institutional flows monitored",
    statsLatency: "Average signal latency",
    featuresTitle: "Every edge, in one place.",
    featuresSubtitle: "Stop guessing. Start trading with the same signals institutional desks pay millions for.",
    featureInstitutional: "Institutional Flow Tracking",
    featureInstitutionalDesc: "See where the big money is moving before the crowd catches on.",
    featureInsider: "Insider Activity Monitor",
    featureInsiderDesc: "Real-time alerts when corporate insiders buy or sell their own stock.",
    featureOptions: "Options Flow Analysis",
    featureOptionsDesc: "Unusual options activity that signals where smart money is betting.",
    featureAi: "AI Conviction Scoring",
    featureAiDesc: "Every signal rated by our AI so you know exactly how strong each edge is.",
    pricingTitle: "Simple, transparent pricing.",
    pricingSubtitle: "Start free, upgrade when you're ready. No lock-ins, cancel anytime.",
    free: "Free",
    forever: "forever",
    freeDescription: "Get a taste of the edge.",
    freeFeature1: "3 signals per day",
    freeFeature2: "Delayed data (15 min)",
    freeFeature3: "Basic signal feed",
    freeFeature4: "Community access",
    pro: "Pro",
    perMonth: "/ month",
    proDescription: "For active traders who want a real edge.",
    mostPopular: "Most traders choose this",
    proFeature1: "Unlimited real-time signals",
    proFeature2: "AI conviction scoring",
    proFeature3: "Instant push alerts",
    proFeature4: "Insider & options flow",
    proFeature5: "Advanced filters",
    getPro: "Unlock All Signals \u2014 \u20ac19/mo",
    proUrgency: "Most traders upgrade within 5 minutes",
    elite: "Elite",
    eliteDescription: "Maximum edge for serious traders.",
    getElite: "Go Elite \u2014 Full Market Access",
    eliteUrgency: "Limited early access tier",
    eliteFeature1: "Everything in Pro",
    eliteFeature2: "Dark pool data",
    eliteFeature3: "Priority signal queue",
    eliteFeature4: "Custom watchlists",
    eliteFeature5: "Dedicated support",
    eliteFeature6: "Early access to new features",
    freeLimitation1: "Limited to 3 signals/day",
    freeLimitation2: "No AI insights",
    tradersBadge: "Most traders choose this",
    ctaTitle: "Get Your First Winning Signal in Seconds",
    ctaSubtitle: "Join traders already using EdgeIQ to track smart money in real-time.",
    footerDisclaimer: "Market intelligence for the modern trader. Not financial advice.",
  },
  trading: {
    portfolio: "Portfolio",
    portfolioSubtitle: "Track your paper trading performance and open positions.",
    demoAccount: "Demo Account",
    balance: "Balance",
    of: "of",
    totalPnl: "Total P&L",
    unrealizedPnl: "Unrealized P&L",
    openPositions: "Open Positions",
    totalTrades: "Total Trades",
    allTime: "All time",
    tradeHistory: "Trade History",
    noOpenPositions: "No open positions",
    noOpenPositionsHint: "Execute a trade from the Signal Feed to open your first position.",
    noTrades: "No trades yet",
    noTradesHint: "Your trade history will appear here once you execute your first trade.",
    shares: "shares",
    close: "Close",
    ticker: "Ticker",
    side: "Side",
    qty: "Qty",
    price: "Price",
    total: "Total",
    date: "Date",
    refresh: "Refresh",
    reset: "Reset",
    resetConfirm: "This will reset your portfolio to €10,000 and delete all positions and trades. This cannot be undone.",
    confirmReset: "Confirm Reset",
    executeTrade: "Execute Trade",
    paperTrading: "Paper Trading — No real money",
    currentPrice: "Current price",
    buy: "Buy",
    sell: "Sell",
    quantity: "Quantity",
    estimatedTotal: "Estimated Total",
    maxPosition: "Max position size",
    executing: "Executing...",
    invalidQuantity: "Please enter a valid quantity",
    tradeFailed: "Trade execution failed",
    disclaimer: "Paper trading only. No real money is involved. Prices are simulated.",
    trade: "Trade",
    positionClosed: "position closed",
    closeError: "Failed to close position",
    portfolioResetSuccess: "Portfolio reset to €10,000",
    resetError: "Failed to reset portfolio",
    tradeSuccess: "Trade executed successfully",
  },
  notFound: {
    title: "404 Page Not Found",
    message: "The page you're looking for doesn't exist.",
  },
};

const fr: TranslationKeys = {
  nav: {
    menu: "Menu",
    dashboard: "Tableau de bord",
    signalFeed: "Flux de signaux",
    portfolio: "Portefeuille",
    watchlist: "Liste de suivi",
    signIn: "Connexion",
    signOut: "Déconnexion",
    searchTickers: "Rechercher des tickers (ex. AAPL)...",
  },
  dashboard: {
    heroTitle: "Intelligence de marché,",
    heroTitleHighlight: "Armée.",
    heroDescription: "Suivez l'argent institutionnel, détectez les flux d'options inhabituels et tradez aux côtés des initiés grâce au scoring IA.",
    marketRegime: "Régime de marché",
    riskOnBullish: "Risk-On / Haussier",
    fearGreedIndex: "Indice Peur & Avidité",
    insiderBuyRatio: "Ratio d'achat initié",
    historicalAvg: "Moyenne historique 1,2x",
    optionsFlowBias: "Biais du flux d'options",
    bullish: "Haussier",
    bearish: "Baissier",
    totalSignalsToday: "Signaux du jour",
    acrossAllSectors: "Tous secteurs confondus",
    liveSignalFeed: "Flux de signaux en direct",
    viewAll: "Tout voir",
    highConviction: "Haute conviction",
    score: "Score",
    unlockTop50: "D\u00e9bloquer le Top 50",
    featuredSignal: "Signal vedette",
    highConvictionSignal: "SIGNAL HAUTE CONVICTION",
    viewFullAnalysis: "Voir l'analyse compl\u00e8te",
    signalsDetected: "signaux d\u00e9tect\u00e9s dans la derni\u00e8re heure",
    tradersUpgraded: "traders ont pass\u00e9 au Pro r\u00e9cemment",
    freePlan: "Plan gratuit",
    unlockAllSignals: "D\u00e9bloquer tous les signaux",
  },
  upgradeModal: {
    title: "Vous avez atteint votre limite",
    subtitle: "D\u00e9bloquez 50+ signaux, analyses IA et alertes en temps r\u00e9el.",
    featureSignals: "50+ signaux haute conviction par jour",
    featureAi: "Analyses IA sur chaque signal",
    featureAlerts: "Alertes push en temps r\u00e9el",
    featureDarkPool: "Flux dark pool & institutionnel",
    upgradeNow: "Passer au Pro",
    cancelAnytime: "Annulable \u00e0 tout moment \u00b7 Sans frais cach\u00e9s",
  },
  signals: {
    title: "Flux de signaux",
    subtitle: "Alertes en temps réel pour les activités de marché inhabituelles.",
    filterByTicker: "Filtrer par ticker...",
    allSignals: "Tous les signaux",
    insiderTrades: "Transactions initiés",
    optionsFlow: "Flux d'options",
    aiSentiment: "Sentiment IA",
    noSignalsFound: "Aucun signal trouvé",
    noSignalsHint: "Essayez d'ajuster vos filtres ou votre recherche.",
    seeingOnly10: "Vous ne voyez que 10% des signaux",
    unlockTitle: "Débloquez l'intelligence de marché complète",
    unlockDescription: "Accédez à toutes les transactions d'initiés, alertes de flux d'options et signaux notés par l'IA — ceux que les investisseurs particuliers ne voient jamais à temps.",
    featureUnlimited: "Signaux illimités en temps réel sur tous les tickers",
    featureAiScoring: "Scores de conviction IA + données de taux de réussite",
    featurePushAlerts: "Alertes instantanées sur les configurations à haute conviction",
    featureDarkPool: "Impressions dark pool & flux d'options institutionnels",
    earlyAccessPricing: "Tarif accès anticipé",
    pricePerMonth: "/ mois",
    lockInRate: "Verrouillez ce tarif — le prix augmente au lancement",
    unlockFullAccess: "Débloquer l'accès complet (9€)",
    redirecting: "Redirection...",
    somethingWentWrong: "Une erreur est survenue. Veuillez réessayer.",
    cancelAnytime: "Annulation à tout moment · Pas de frais cachés · Facturation mensuelle",
    fullAccessUnlocked: "C'est fait — accès complet débloqué !",
    welcomeEarlyAccess: "Bienvenue dans l'accès anticipé EdgeIQ. Tous les signaux sont maintenant visibles.",
  },
  watchlist: {
    title: "Ma liste de suivi",
    subtitle: "Surveillez les signaux à haute conviction pour vos actifs préférés.",
    addTickerPlaceholder: "Ajouter un ticker (ex. NVDA)",
    adding: "Ajout...",
    add: "Ajouter",
    empty: "Votre liste est vide",
    emptyHint: "Ajoutez des tickers pour suivre les flux d'options inhabituels et les transactions d'initiés sur les actifs qui vous intéressent.",
    toggleAlerts: "Activer/désactiver les alertes",
    remove: "Supprimer",
    latestSignal: "Dernier signal",
    noRecentSignals: "Aucun signal récent",
    analyze: "Analyser",
    suggestedTickers: "Tickers populaires pour commencer",
    addedToast: "ajouté à la liste",
    addErrorToast: "Échec de l'ajout du ticker",
    removedToast: "retiré de la liste",
    removeErrorToast: "Échec de la suppression du ticker",
  },
  signalCard: {
    conviction: "Conviction",
    value: "Valeur",
    histWinRate: "Taux de r\u00e9ussite hist.",
    strike: "Strike",
    entity: "Entit\u00e9",
    aiInsight: "Analyse IA",
    upgradeToUnlock: "Passez au Pro pour d\u00e9bloquer",
  },
  ticker: {
    backToSignals: "Retour aux signaux",
    equity: "Action",
    quoteUnavailable: "Données de cotation indisponibles",
    volume: "Volume",
    marketCap: "Capitalisation",
    peRatio: "Ratio C/B",
    week52Range: "Fourchette 52 sem.",
    convictionTrend: "Tendance de conviction",
    notEnoughData: "Pas assez de données historiques",
    recentSignals: "Signaux récents",
    noSignalsForTicker: "Aucun signal enregistré pour ce ticker.",
  },
  landing: {
    signIn: "Connexion",
    startFree: "Commencer \u2014 3 signaux en direct",
    heroTagline: "Intelligence de marché propulsée par l'IA",
    heroLine1: "Suivez l'argent intelligent.",
    heroLine2: "Prédisez les mouvements du marché.",
    heroLine3: "Tradez en confiance.",
    heroDescription: "Notre IA analyse les flux institutionnels, l'activité des initiés et les données d'options pour vous donner un avantage en temps réel.",
    seeLiveSignals: "Voir les signaux en direct",
    freeAccessLine: "Acc\u00e8s gratuit \u00b7 Sans carte bancaire \u00b7 3 signaux en direct",
    statsSignals: "Signaux suivis quotidiennement",
    statsAccuracy: "Précision sur les appels à haute conviction",
    statsFlows: "Flux institutionnels surveillés",
    statsLatency: "Latence moyenne des signaux",
    featuresTitle: "Tous les avantages, en un seul endroit.",
    featuresSubtitle: "Arrêtez de deviner. Tradez avec les mêmes signaux que les desks institutionnels paient des millions.",
    featureInstitutional: "Suivi des flux institutionnels",
    featureInstitutionalDesc: "Voyez où le gros argent se déplace avant que la foule ne réagisse.",
    featureInsider: "Moniteur d'activité des initiés",
    featureInsiderDesc: "Alertes en temps réel quand les initiés achètent ou vendent leurs propres actions.",
    featureOptions: "Analyse du flux d'options",
    featureOptionsDesc: "Activité d'options inhabituelle qui signale où l'argent intelligent parie.",
    featureAi: "Scoring de conviction IA",
    featureAiDesc: "Chaque signal noté par notre IA pour que vous sachiez exactement la force de chaque avantage.",
    pricingTitle: "Tarification simple et transparente.",
    pricingSubtitle: "Commencez gratuitement, passez au supérieur quand vous êtes prêt. Sans engagement.",
    free: "Gratuit",
    forever: "pour toujours",
    freeDescription: "Goûtez à l'avantage.",
    freeFeature1: "3 signaux par jour",
    freeFeature2: "Données différées (15 min)",
    freeFeature3: "Flux de signaux basique",
    freeFeature4: "Accès communautaire",
    pro: "Pro",
    perMonth: "/ mois",
    proDescription: "Pour les traders actifs qui veulent un vrai avantage.",
    mostPopular: "Le choix des traders",
    proFeature1: "Signaux illimités en temps réel",
    proFeature2: "Scoring de conviction IA",
    proFeature3: "Alertes push instantanées",
    proFeature4: "Flux d'initiés & d'options",
    proFeature5: "Filtres avancés",
    getPro: "D\u00e9bloquer tous les signaux \u2014 \u20ac19/mois",
    proUrgency: "La plupart des traders passent au Pro en 5 minutes",
    elite: "Elite",
    eliteDescription: "L'avantage maximum pour les traders s\u00e9rieux.",
    getElite: "Passer Elite \u2014 Acc\u00e8s march\u00e9 complet",
    eliteUrgency: "Places limit\u00e9es en acc\u00e8s anticip\u00e9",
    eliteFeature1: "Tout dans Pro",
    eliteFeature2: "Donn\u00e9es dark pool",
    eliteFeature3: "File d'attente prioritaire",
    eliteFeature4: "Listes personnalis\u00e9es",
    eliteFeature5: "Support d\u00e9di\u00e9",
    eliteFeature6: "Acc\u00e8s anticip\u00e9 aux nouveaut\u00e9s",
    freeLimitation1: "Limit\u00e9 \u00e0 3 signaux/jour",
    freeLimitation2: "Pas d'analyses IA",
    tradersBadge: "Le choix des traders",
    ctaTitle: "Recevez votre premier signal gagnant en secondes",
    ctaSubtitle: "Rejoignez les traders qui utilisent d\u00e9j\u00e0 EdgeIQ pour suivre le smart money en temps r\u00e9el.",
    footerDisclaimer: "Intelligence de marché pour le trader moderne. Ceci n'est pas un conseil financier.",
  },
  trading: {
    portfolio: "Portefeuille",
    portfolioSubtitle: "Suivez vos performances de trading papier et vos positions ouvertes.",
    demoAccount: "Compte démo",
    balance: "Solde",
    of: "sur",
    totalPnl: "P&L total",
    unrealizedPnl: "P&L non réalisé",
    openPositions: "Positions ouvertes",
    totalTrades: "Total des trades",
    allTime: "Depuis le début",
    tradeHistory: "Historique des trades",
    noOpenPositions: "Aucune position ouverte",
    noOpenPositionsHint: "Exécutez un trade depuis le flux de signaux pour ouvrir votre première position.",
    noTrades: "Aucun trade",
    noTradesHint: "Votre historique de trades apparaîtra ici après votre premier trade.",
    shares: "actions",
    close: "Fermer",
    ticker: "Ticker",
    side: "Côté",
    qty: "Qté",
    price: "Prix",
    total: "Total",
    date: "Date",
    refresh: "Actualiser",
    reset: "Réinitialiser",
    resetConfirm: "Cela réinitialisera votre portefeuille à 10 000 € et supprimera toutes les positions et trades. Cette action est irréversible.",
    confirmReset: "Confirmer",
    executeTrade: "Exécuter le trade",
    paperTrading: "Trading papier — Pas d'argent réel",
    currentPrice: "Prix actuel",
    buy: "Acheter",
    sell: "Vendre",
    quantity: "Quantité",
    estimatedTotal: "Total estimé",
    maxPosition: "Taille max. de position",
    executing: "Exécution...",
    invalidQuantity: "Veuillez entrer une quantité valide",
    tradeFailed: "L'exécution du trade a échoué",
    disclaimer: "Trading papier uniquement. Aucun argent réel n'est impliqué. Les prix sont simulés.",
    trade: "Trader",
    positionClosed: "position clôturée",
    closeError: "Échec de la clôture de la position",
    portfolioResetSuccess: "Portefeuille réinitialisé à 10 000 €",
    resetError: "Échec de la réinitialisation du portefeuille",
    tradeSuccess: "Trade exécuté avec succès",
  },
  notFound: {
    title: "404 Page non trouvée",
    message: "La page que vous cherchez n'existe pas.",
  },
};

const de: TranslationKeys = {
  nav: {
    menu: "Menü",
    dashboard: "Dashboard",
    signalFeed: "Signal-Feed",
    portfolio: "Portfolio",
    watchlist: "Watchlist",
    signIn: "Anmelden",
    signOut: "Abmelden",
    searchTickers: "Ticker suchen (z.B. AAPL)...",
  },
  dashboard: {
    heroTitle: "Marktintelligenz,",
    heroTitleHighlight: "Bewaffnet.",
    heroDescription: "Verfolgen Sie institutionelles Kapital, decken Sie ungewöhnliche Optionsströme auf und handeln Sie an der Seite von Insidern mit KI-gestütztem Conviction-Scoring.",
    marketRegime: "Marktregime",
    riskOnBullish: "Risk-On / Bullish",
    fearGreedIndex: "Angst & Gier Index",
    insiderBuyRatio: "Insider-Kaufverhältnis",
    historicalAvg: "Historischer Durchschnitt 1,2x",
    optionsFlowBias: "Options-Flow-Tendenz",
    bullish: "Bullish",
    bearish: "Bearish",
    totalSignalsToday: "Signale heute",
    acrossAllSectors: "Über alle Sektoren",
    liveSignalFeed: "Live Signal-Feed",
    viewAll: "Alle anzeigen",
    highConviction: "Hohe Überzeugung",
    score: "Score",
    unlockTop50: "Top 50 Signale freischalten",
    featuredSignal: "Top-Signal",
    highConvictionSignal: "SIGNAL MIT HOHER \u00dcBERZEUGUNG",
    viewFullAnalysis: "Vollst\u00e4ndige Analyse ansehen",
    signalsDetected: "Signale in der letzten Stunde erkannt",
    tradersUpgraded: "Trader haben k\u00fcrzlich ein Upgrade durchgef\u00fchrt",
    freePlan: "Kostenloser Plan",
    unlockAllSignals: "Alle Signale freischalten",
  },
  upgradeModal: {
    title: "Sie haben Ihr Limit erreicht",
    subtitle: "Schalten Sie 50+ Signale, KI-Analysen und Echtzeit-Warnungen frei.",
    featureSignals: "50+ Signale mit hoher \u00dcberzeugung t\u00e4glich",
    featureAi: "KI-Analysen f\u00fcr jedes Signal",
    featureAlerts: "Echtzeit-Push-Warnungen",
    featureDarkPool: "Dark-Pool & institutioneller Fluss",
    upgradeNow: "Jetzt upgraden",
    cancelAnytime: "Jederzeit k\u00fcndbar \u00b7 Keine versteckten Geb\u00fchren",
  },
  signals: {
    title: "Signal-Feed",
    subtitle: "Echtzeit-Warnungen bei ungewöhnlicher Marktaktivität.",
    filterByTicker: "Nach Ticker filtern...",
    allSignals: "Alle Signale",
    insiderTrades: "Insider-Handel",
    optionsFlow: "Options-Flow",
    aiSentiment: "KI-Sentiment",
    noSignalsFound: "Keine Signale gefunden",
    noSignalsHint: "Versuchen Sie, Ihre Filter oder Suchanfrage anzupassen.",
    seeingOnly10: "Sie sehen nur 10% der Signale",
    unlockTitle: "Vollständige Marktintelligenz freischalten",
    unlockDescription: "Erhalten Sie Zugang zu allen Echtzeit-Insider-Trades, Optionsflow-Warnungen und KI-bewerteten Signalen — die, die Privatanleger nie rechtzeitig sehen.",
    featureUnlimited: "Unbegrenzte Echtzeit-Signale für alle Ticker",
    featureAiScoring: "KI-Conviction-Scores + Gewinnraten-Daten",
    featurePushAlerts: "Sofortige Push-Benachrichtigungen bei starken Setups",
    featureDarkPool: "Dark-Pool-Drucke & institutionelle Optionsströme",
    earlyAccessPricing: "Early-Access-Preis",
    pricePerMonth: "/ Monat",
    lockInRate: "Sichern Sie sich diesen Preis — Erhöhung zum Launch",
    unlockFullAccess: "Vollzugang freischalten (9€)",
    redirecting: "Weiterleitung...",
    somethingWentWrong: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    cancelAnytime: "Jederzeit kündbar · Keine versteckten Gebühren · Monatliche Abrechnung",
    fullAccessUnlocked: "Sie sind dabei — Vollzugang freigeschaltet!",
    welcomeEarlyAccess: "Willkommen beim EdgeIQ Early Access. Alle Signale sind jetzt sichtbar.",
  },
  watchlist: {
    title: "Meine Watchlist",
    subtitle: "Überwachen Sie Signale mit hoher Überzeugung für Ihre Lieblings-Assets.",
    addTickerPlaceholder: "Ticker hinzufügen (z.B. NVDA)",
    adding: "Wird hinzugefügt...",
    add: "Hinzufügen",
    empty: "Ihre Watchlist ist leer",
    emptyHint: "Fügen Sie Ticker hinzu, um ungewöhnliche Optionsströme und Insider-Handel speziell für die Assets zu verfolgen, die Sie interessieren.",
    toggleAlerts: "Warnungen umschalten",
    remove: "Entfernen",
    latestSignal: "Letztes Signal",
    noRecentSignals: "Keine aktuellen Signale",
    analyze: "Analysieren",
    suggestedTickers: "Beliebte Ticker zum Starten",
    addedToast: "zur Watchlist hinzugefügt",
    addErrorToast: "Ticker konnte nicht hinzugefügt werden",
    removedToast: "von der Watchlist entfernt",
    removeErrorToast: "Ticker konnte nicht entfernt werden",
  },
  signalCard: {
    conviction: "\u00dcberzeugung",
    value: "Wert",
    histWinRate: "Hist. Gewinnrate",
    strike: "Strike",
    entity: "Unternehmen",
    aiInsight: "KI-Analyse",
    upgradeToUnlock: "Upgrade zum Freischalten",
  },
  ticker: {
    backToSignals: "Zurück zu Signalen",
    equity: "Aktie",
    quoteUnavailable: "Kursdaten nicht verfügbar",
    volume: "Volumen",
    marketCap: "Marktkapitalisierung",
    peRatio: "KGV",
    week52Range: "52-Wochen-Spanne",
    convictionTrend: "Signal-Conviction-Trend",
    notEnoughData: "Nicht genügend historische Daten",
    recentSignals: "Aktuelle Signale",
    noSignalsForTicker: "Noch keine Signale für diesen Ticker.",
  },
  landing: {
    signIn: "Anmelden",
    startFree: "Kostenlos starten \u2014 3 Live-Signale",
    heroTagline: "KI-gestützte Marktintelligenz",
    heroLine1: "Verfolgen Sie Smart Money.",
    heroLine2: "Prognostizieren Sie Marktbewegungen.",
    heroLine3: "Handeln Sie mit Vertrauen.",
    heroDescription: "Unsere KI analysiert institutionelle Ströme, Insider-Aktivitäten und Optionsdaten, um Ihnen einen Echtzeit-Vorteil zu geben.",
    seeLiveSignals: "Live-Signale ansehen",
    freeAccessLine: "Kostenlos \u00b7 Keine Kreditkarte \u00b7 3 Live-Signale sofort",
    statsSignals: "Täglich verfolgte Signale",
    statsAccuracy: "Genauigkeit bei High-Conviction-Calls",
    statsFlows: "Überwachte institutionelle Ströme",
    statsLatency: "Durchschnittliche Signal-Latenz",
    featuresTitle: "Jeder Vorteil, an einem Ort.",
    featuresSubtitle: "Hören Sie auf zu raten. Handeln Sie mit denselben Signalen, für die institutionelle Desks Millionen zahlen.",
    featureInstitutional: "Institutionelle Flow-Verfolgung",
    featureInstitutionalDesc: "Sehen Sie, wohin das große Geld fließt, bevor die Masse reagiert.",
    featureInsider: "Insider-Aktivitätsmonitor",
    featureInsiderDesc: "Echtzeit-Benachrichtigungen wenn Unternehmensinsider eigene Aktien kaufen oder verkaufen.",
    featureOptions: "Optionsflow-Analyse",
    featureOptionsDesc: "Ungewöhnliche Optionsaktivität, die signalisiert, wo Smart Money wettet.",
    featureAi: "KI-Conviction-Scoring",
    featureAiDesc: "Jedes Signal wird von unserer KI bewertet, damit Sie genau wissen, wie stark jeder Vorteil ist.",
    pricingTitle: "Einfache, transparente Preise.",
    pricingSubtitle: "Starten Sie kostenlos, upgraden Sie wenn Sie bereit sind. Keine Bindung.",
    free: "Kostenlos",
    forever: "für immer",
    freeDescription: "Probieren Sie den Vorteil.",
    freeFeature1: "3 Signale pro Tag",
    freeFeature2: "Verzögerte Daten (15 Min)",
    freeFeature3: "Basis Signal-Feed",
    freeFeature4: "Community-Zugang",
    pro: "Pro",
    perMonth: "/ Monat",
    proDescription: "Für aktive Trader, die einen echten Vorteil wollen.",
    mostPopular: "Die Wahl der Trader",
    proFeature1: "Unbegrenzte Echtzeit-Signale",
    proFeature2: "KI-Conviction-Scoring",
    proFeature3: "Sofortige Push-Warnungen",
    proFeature4: "Insider- & Optionsflow",
    proFeature5: "Erweiterte Filter",
    getPro: "Alle Signale freischalten \u2014 \u20ac19/Monat",
    proUrgency: "Die meisten Trader upgraden innerhalb von 5 Minuten",
    elite: "Elite",
    eliteDescription: "Maximaler Vorteil f\u00fcr ernsthafte Trader.",
    getElite: "Elite w\u00e4hlen \u2014 Voller Marktzugang",
    eliteUrgency: "Begrenzte Fr\u00fchzugangs-Pl\u00e4tze",
    eliteFeature1: "Alles in Pro",
    eliteFeature2: "Dark-Pool-Daten",
    eliteFeature3: "Priorit\u00e4tswarteschlange",
    eliteFeature4: "Eigene Watchlists",
    eliteFeature5: "Dedizierter Support",
    eliteFeature6: "Fr\u00fchzugang zu neuen Features",
    freeLimitation1: "Begrenzt auf 3 Signale/Tag",
    freeLimitation2: "Keine KI-Analysen",
    tradersBadge: "Die Wahl der Trader",
    ctaTitle: "Erhalten Sie Ihr erstes Gewinnsignal in Sekunden",
    ctaSubtitle: "Schlie\u00dfen Sie sich Tradern an, die EdgeIQ bereits nutzen, um Smart Money in Echtzeit zu verfolgen.",
    footerDisclaimer: "Marktintelligenz für den modernen Trader. Keine Finanzberatung.",
  },
  trading: {
    portfolio: "Portfolio",
    portfolioSubtitle: "Verfolgen Sie Ihre Paper-Trading-Performance und offene Positionen.",
    demoAccount: "Demokonto",
    balance: "Guthaben",
    of: "von",
    totalPnl: "Gesamt-P&L",
    unrealizedPnl: "Unrealisierte P&L",
    openPositions: "Offene Positionen",
    totalTrades: "Trades gesamt",
    allTime: "Gesamt",
    tradeHistory: "Trade-Verlauf",
    noOpenPositions: "Keine offenen Positionen",
    noOpenPositionsHint: "Führen Sie einen Trade aus dem Signal-Feed aus, um Ihre erste Position zu eröffnen.",
    noTrades: "Noch keine Trades",
    noTradesHint: "Ihr Trade-Verlauf erscheint hier nach Ihrem ersten Trade.",
    shares: "Aktien",
    close: "Schließen",
    ticker: "Ticker",
    side: "Seite",
    qty: "Menge",
    price: "Preis",
    total: "Gesamt",
    date: "Datum",
    refresh: "Aktualisieren",
    reset: "Zurücksetzen",
    resetConfirm: "Dies setzt Ihr Portfolio auf 10.000 € zurück und löscht alle Positionen und Trades. Dies kann nicht rückgängig gemacht werden.",
    confirmReset: "Bestätigen",
    executeTrade: "Trade ausführen",
    paperTrading: "Paper Trading — Kein echtes Geld",
    currentPrice: "Aktueller Preis",
    buy: "Kaufen",
    sell: "Verkaufen",
    quantity: "Menge",
    estimatedTotal: "Geschätzter Gesamtbetrag",
    maxPosition: "Max. Positionsgröße",
    executing: "Wird ausgeführt...",
    invalidQuantity: "Bitte geben Sie eine gültige Menge ein",
    tradeFailed: "Trade-Ausführung fehlgeschlagen",
    disclaimer: "Nur Paper Trading. Kein echtes Geld. Preise sind simuliert.",
    trade: "Handeln",
    positionClosed: "Position geschlossen",
    closeError: "Position konnte nicht geschlossen werden",
    portfolioResetSuccess: "Portfolio auf 10.000 € zurückgesetzt",
    resetError: "Portfolio konnte nicht zurückgesetzt werden",
    tradeSuccess: "Trade erfolgreich ausgeführt",
  },
  notFound: {
    title: "404 Seite nicht gefunden",
    message: "Die gesuchte Seite existiert nicht.",
  },
};

const es: TranslationKeys = {
  nav: {
    menu: "Menú",
    dashboard: "Panel",
    signalFeed: "Feed de señales",
    portfolio: "Cartera",
    watchlist: "Seguimiento",
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    searchTickers: "Buscar tickers (ej. AAPL)...",
  },
  dashboard: {
    heroTitle: "Inteligencia de mercado,",
    heroTitleHighlight: "Armada.",
    heroDescription: "Rastrea el dinero institucional, descubre flujos de opciones inusuales y opera junto a los insiders con puntuación de convicción por IA.",
    marketRegime: "Régimen de mercado",
    riskOnBullish: "Risk-On / Alcista",
    fearGreedIndex: "Índice Miedo & Codicia",
    insiderBuyRatio: "Ratio de compra insider",
    historicalAvg: "Promedio histórico 1,2x",
    optionsFlowBias: "Sesgo del flujo de opciones",
    bullish: "Alcista",
    bearish: "Bajista",
    totalSignalsToday: "Señales de hoy",
    acrossAllSectors: "En todos los sectores",
    liveSignalFeed: "Feed de señales en vivo",
    viewAll: "Ver todo",
    highConviction: "Alta convicción",
    score: "Puntuación",
    unlockTop50: "Desbloquear Top 50",
    featuredSignal: "Se\u00f1al destacada",
    highConvictionSignal: "SE\u00d1AL DE ALTA CONVICCI\u00d3N",
    viewFullAnalysis: "Ver an\u00e1lisis completo",
    signalsDetected: "se\u00f1ales detectadas en la \u00faltima hora",
    tradersUpgraded: "traders mejoraron recientemente",
    freePlan: "Plan gratuito",
    unlockAllSignals: "Desbloquear todas las se\u00f1ales",
  },
  upgradeModal: {
    title: "Has alcanzado tu l\u00edmite",
    subtitle: "Desbloquea 50+ se\u00f1ales, an\u00e1lisis IA y alertas en tiempo real.",
    featureSignals: "50+ se\u00f1ales de alta convicci\u00f3n al d\u00eda",
    featureAi: "An\u00e1lisis IA en cada se\u00f1al",
    featureAlerts: "Alertas push en tiempo real",
    featureDarkPool: "Dark pool & flujo institucional",
    upgradeNow: "Mejorar ahora",
    cancelAnytime: "Cancela cuando quieras \u00b7 Sin cargos ocultos",
  },
  signals: {
    title: "Feed de se\u00f1ales",
    subtitle: "Alertas en tiempo real para actividad inusual del mercado.",
    filterByTicker: "Filtrar por ticker...",
    allSignals: "Todas las señales",
    insiderTrades: "Operaciones insider",
    optionsFlow: "Flujo de opciones",
    aiSentiment: "Sentimiento IA",
    noSignalsFound: "No se encontraron señales",
    noSignalsHint: "Intenta ajustar tus filtros o búsqueda.",
    seeingOnly10: "Solo ves el 10% de las señales",
    unlockTitle: "Desbloquea la inteligencia de mercado completa",
    unlockDescription: "Accede a todas las operaciones insider en tiempo real, alertas de flujo de opciones y señales calificadas por IA — las que los inversores minoristas nunca ven a tiempo.",
    featureUnlimited: "Señales ilimitadas en tiempo real en todos los tickers",
    featureAiScoring: "Puntuaciones de convicción IA + datos de tasa de acierto",
    featurePushAlerts: "Alertas push instantáneas en configuraciones de alta convicción",
    featureDarkPool: "Impresiones dark pool & flujo de opciones institucional",
    earlyAccessPricing: "Precio de acceso anticipado",
    pricePerMonth: "/ mes",
    lockInRate: "Asegura este precio — sube en el lanzamiento",
    unlockFullAccess: "Desbloquear acceso completo (9€)",
    redirecting: "Redirigiendo...",
    somethingWentWrong: "Algo salió mal. Por favor, inténtalo de nuevo.",
    cancelAnytime: "Cancela cuando quieras · Sin cargos ocultos · Facturación mensual",
    fullAccessUnlocked: "¡Estás dentro — acceso completo desbloqueado!",
    welcomeEarlyAccess: "Bienvenido al acceso anticipado de EdgeIQ. Todas las señales son ahora visibles.",
  },
  watchlist: {
    title: "Mi seguimiento",
    subtitle: "Monitorea señales de alta convicción para tus activos favoritos.",
    addTickerPlaceholder: "Añadir ticker (ej. NVDA)",
    adding: "Añadiendo...",
    add: "Añadir",
    empty: "Tu lista de seguimiento está vacía",
    emptyHint: "Añade tickers para rastrear flujos de opciones inusuales y operaciones insider específicamente para los activos que te interesan.",
    toggleAlerts: "Alternar alertas",
    remove: "Eliminar",
    latestSignal: "Última señal",
    noRecentSignals: "Sin señales recientes",
    analyze: "Analizar",
    suggestedTickers: "Tickers populares para empezar",
    addedToast: "añadido a la lista",
    addErrorToast: "Error al añadir el ticker",
    removedToast: "eliminado de la lista",
    removeErrorToast: "Error al eliminar el ticker",
  },
  signalCard: {
    conviction: "Convicci\u00f3n",
    value: "Valor",
    histWinRate: "Tasa hist. de acierto",
    strike: "Strike",
    entity: "Entidad",
    aiInsight: "An\u00e1lisis IA",
    upgradeToUnlock: "Mejora para desbloquear",
  },
  ticker: {
    backToSignals: "Volver a señales",
    equity: "Acción",
    quoteUnavailable: "Datos de cotización no disponibles",
    volume: "Volumen",
    marketCap: "Cap. de mercado",
    peRatio: "Ratio P/B",
    week52Range: "Rango 52 sem.",
    convictionTrend: "Tendencia de convicción",
    notEnoughData: "Datos históricos insuficientes",
    recentSignals: "Señales recientes",
    noSignalsForTicker: "Aún no hay señales para este ticker.",
  },
  landing: {
    signIn: "Iniciar sesión",
    startFree: "Empieza gratis \u2014 3 se\u00f1ales en vivo",
    heroTagline: "Inteligencia de mercado con IA",
    heroLine1: "Rastrea el dinero inteligente.",
    heroLine2: "Predice movimientos del mercado.",
    heroLine3: "Opera con confianza.",
    heroDescription: "Nuestra IA analiza flujos institucionales, actividad insider y datos de opciones para darte una ventaja en tiempo real.",
    seeLiveSignals: "Ver señales en vivo",
    freeAccessLine: "Gratis \u00b7 Sin tarjeta de cr\u00e9dito \u00b7 3 se\u00f1ales en vivo al instante",
    statsSignals: "Señales rastreadas diariamente",
    statsAccuracy: "Precisión en calls de alta convicción",
    statsFlows: "Flujos institucionales monitoreados",
    statsLatency: "Latencia media de señal",
    featuresTitle: "Toda la ventaja, en un solo lugar.",
    featuresSubtitle: "Deja de adivinar. Opera con las mismas señales por las que los desks institucionales pagan millones.",
    featureInstitutional: "Seguimiento de flujos institucionales",
    featureInstitutionalDesc: "Ve hacia dónde se mueve el dinero grande antes de que la multitud reaccione.",
    featureInsider: "Monitor de actividad insider",
    featureInsiderDesc: "Alertas en tiempo real cuando los insiders compran o venden sus propias acciones.",
    featureOptions: "Análisis de flujo de opciones",
    featureOptionsDesc: "Actividad de opciones inusual que señala dónde apuesta el dinero inteligente.",
    featureAi: "Scoring de convicción IA",
    featureAiDesc: "Cada señal calificada por nuestra IA para que sepas exactamente lo fuerte que es cada ventaja.",
    pricingTitle: "Precios simples y transparentes.",
    pricingSubtitle: "Empieza gratis, mejora cuando estés listo. Sin permanencia.",
    free: "Gratis",
    forever: "para siempre",
    freeDescription: "Prueba la ventaja.",
    freeFeature1: "3 señales por día",
    freeFeature2: "Datos diferidos (15 min)",
    freeFeature3: "Feed de señales básico",
    freeFeature4: "Acceso comunitario",
    pro: "Pro",
    perMonth: "/ mes",
    proDescription: "Para traders activos que quieren una ventaja real.",
    mostPopular: "La elecci\u00f3n de los traders",
    proFeature1: "Señales ilimitadas en tiempo real",
    proFeature2: "Scoring de convicción IA",
    proFeature3: "Alertas push instantáneas",
    proFeature4: "Flujo insider & opciones",
    proFeature5: "Filtros avanzados",
    getPro: "Desbloquear todas las se\u00f1ales \u2014 \u20ac19/mes",
    proUrgency: "La mayor\u00eda de traders mejoran en 5 minutos",
    elite: "Elite",
    eliteDescription: "M\u00e1xima ventaja para traders serios.",
    getElite: "Ir Elite \u2014 Acceso completo al mercado",
    eliteUrgency: "Plazas limitadas de acceso anticipado",
    eliteFeature1: "Todo en Pro",
    eliteFeature2: "Datos dark pool",
    eliteFeature3: "Cola de se\u00f1ales prioritaria",
    eliteFeature4: "Watchlists personalizadas",
    eliteFeature5: "Soporte dedicado",
    eliteFeature6: "Acceso anticipado a nuevas funciones",
    freeLimitation1: "Limitado a 3 se\u00f1ales/d\u00eda",
    freeLimitation2: "Sin an\u00e1lisis IA",
    tradersBadge: "La elecci\u00f3n de los traders",
    ctaTitle: "Obt\u00e9n tu primera se\u00f1al ganadora en segundos",
    ctaSubtitle: "\u00danete a traders que ya usan EdgeIQ para rastrear smart money en tiempo real.",
    footerDisclaimer: "Inteligencia de mercado para el trader moderno. No es consejo financiero.",
  },
  trading: {
    portfolio: "Cartera",
    portfolioSubtitle: "Sigue el rendimiento de tu trading de papel y posiciones abiertas.",
    demoAccount: "Cuenta demo",
    balance: "Saldo",
    of: "de",
    totalPnl: "P&L total",
    unrealizedPnl: "P&L no realizado",
    openPositions: "Posiciones abiertas",
    totalTrades: "Total de operaciones",
    allTime: "Todo el tiempo",
    tradeHistory: "Historial de operaciones",
    noOpenPositions: "Sin posiciones abiertas",
    noOpenPositionsHint: "Ejecuta una operación desde el feed de señales para abrir tu primera posición.",
    noTrades: "Sin operaciones",
    noTradesHint: "Tu historial de operaciones aparecerá aquí después de tu primera operación.",
    shares: "acciones",
    close: "Cerrar",
    ticker: "Ticker",
    side: "Lado",
    qty: "Cant.",
    price: "Precio",
    total: "Total",
    date: "Fecha",
    refresh: "Actualizar",
    reset: "Reiniciar",
    resetConfirm: "Esto reiniciará tu cartera a 10.000 € y eliminará todas las posiciones y operaciones. No se puede deshacer.",
    confirmReset: "Confirmar",
    executeTrade: "Ejecutar operación",
    paperTrading: "Trading de papel — Sin dinero real",
    currentPrice: "Precio actual",
    buy: "Comprar",
    sell: "Vender",
    quantity: "Cantidad",
    estimatedTotal: "Total estimado",
    maxPosition: "Tamaño máx. de posición",
    executing: "Ejecutando...",
    invalidQuantity: "Introduce una cantidad válida",
    tradeFailed: "Fallo en la ejecución",
    disclaimer: "Solo trading de papel. No se usa dinero real. Los precios son simulados.",
    trade: "Operar",
    positionClosed: "posición cerrada",
    closeError: "Error al cerrar la posición",
    portfolioResetSuccess: "Cartera reiniciada a 10.000 €",
    resetError: "Error al reiniciar la cartera",
    tradeSuccess: "Operación ejecutada con éxito",
  },
  notFound: {
    title: "404 Página no encontrada",
    message: "La página que buscas no existe.",
  },
};

const nl: TranslationKeys = {
  nav: {
    menu: "Menu",
    dashboard: "Dashboard",
    signalFeed: "Signaalfeed",
    portfolio: "Portefeuille",
    watchlist: "Volglijst",
    signIn: "Inloggen",
    signOut: "Uitloggen",
    searchTickers: "Zoek tickers (bijv. AAPL)...",
  },
  dashboard: {
    heroTitle: "Marktintelligentie,",
    heroTitleHighlight: "Bewapend.",
    heroDescription: "Volg institutioneel geld, ontdek ongewone optiestromen en handel naast insiders met AI-gedreven conviction scoring.",
    marketRegime: "Marktregime",
    riskOnBullish: "Risk-On / Bullish",
    fearGreedIndex: "Angst & Hebzucht Index",
    insiderBuyRatio: "Insider-koopverhouding",
    historicalAvg: "Historisch gemiddelde 1,2x",
    optionsFlowBias: "Optie-flow bias",
    bullish: "Bullish",
    bearish: "Bearish",
    totalSignalsToday: "Signalen vandaag",
    acrossAllSectors: "Over alle sectoren",
    liveSignalFeed: "Live signaalfeed",
    viewAll: "Alles bekijken",
    highConviction: "Hoge overtuiging",
    score: "Score",
    unlockTop50: "Top 50 signalen vrijgeven",
    featuredSignal: "Uitgelicht signaal",
    highConvictionSignal: "SIGNAAL MET HOGE OVERTUIGING",
    viewFullAnalysis: "Volledige analyse bekijken",
    signalsDetected: "signalen gedetecteerd in het laatste uur",
    tradersUpgraded: "traders hebben recent een upgrade gedaan",
    freePlan: "Gratis plan",
    unlockAllSignals: "Alle signalen ontgrendelen",
  },
  upgradeModal: {
    title: "Je hebt je limiet bereikt",
    subtitle: "Ontgrendel 50+ signalen, AI-analyses en realtime-meldingen.",
    featureSignals: "50+ signalen met hoge overtuiging per dag",
    featureAi: "AI-analyses bij elk signaal",
    featureAlerts: "Realtime push-meldingen",
    featureDarkPool: "Dark pool & institutionele stromen",
    upgradeNow: "Nu upgraden",
    cancelAnytime: "Altijd opzegbaar \u00b7 Geen verborgen kosten",
  },
  signals: {
    title: "Signaalfeed",
    subtitle: "Realtime-meldingen voor ongewone marktactiviteit.",
    filterByTicker: "Filter op ticker...",
    allSignals: "Alle signalen",
    insiderTrades: "Insider-transacties",
    optionsFlow: "Optie-flow",
    aiSentiment: "AI-sentiment",
    noSignalsFound: "Geen signalen gevonden",
    noSignalsHint: "Probeer je filters of zoekopdracht aan te passen.",
    seeingOnly10: "Je ziet slechts 10% van de signalen",
    unlockTitle: "Ontgrendel volledige marktintelligentie",
    unlockDescription: "Krijg toegang tot alle realtime insider-transacties, optieflow-meldingen en AI-beoordeelde signalen — degene die particuliere beleggers nooit op tijd zien.",
    featureUnlimited: "Onbeperkte realtime signalen voor alle tickers",
    featureAiScoring: "AI-overtuigingsscores + winstpercentage-data",
    featurePushAlerts: "Directe push-meldingen bij sterke setups",
    featureDarkPool: "Dark pool prints & institutionele optiestromen",
    earlyAccessPricing: "Early access prijs",
    pricePerMonth: "/ maand",
    lockInRate: "Verzeker deze prijs — stijgt bij de lancering",
    unlockFullAccess: "Volledige toegang ontgrendelen (€9)",
    redirecting: "Doorsturen...",
    somethingWentWrong: "Er is iets misgegaan. Probeer het opnieuw.",
    cancelAnytime: "Altijd opzegbaar · Geen verborgen kosten · Maandelijkse facturering",
    fullAccessUnlocked: "Je bent erin — volledige toegang ontgrendeld!",
    welcomeEarlyAccess: "Welkom bij EdgeIQ Early Access. Alle signalen zijn nu zichtbaar.",
  },
  watchlist: {
    title: "Mijn volglijst",
    subtitle: "Volg signalen met hoge overtuiging voor je favoriete activa.",
    addTickerPlaceholder: "Ticker toevoegen (bijv. NVDA)",
    adding: "Toevoegen...",
    add: "Toevoegen",
    empty: "Je volglijst is leeg",
    emptyHint: "Voeg tickers toe om ongewone optiestromen en insider-handel te volgen voor de activa die je belangrijk vindt.",
    toggleAlerts: "Meldingen aan/uit",
    remove: "Verwijderen",
    latestSignal: "Laatste signaal",
    noRecentSignals: "Geen recente signalen",
    analyze: "Analyseren",
    suggestedTickers: "Populaire tickers om te beginnen",
    addedToast: "toegevoegd aan volglijst",
    addErrorToast: "Ticker kon niet worden toegevoegd",
    removedToast: "verwijderd uit volglijst",
    removeErrorToast: "Ticker kon niet worden verwijderd",
  },
  signalCard: {
    conviction: "Overtuiging",
    value: "Waarde",
    histWinRate: "Hist. winstpercentage",
    strike: "Strike",
    entity: "Entiteit",
    aiInsight: "AI-analyse",
    upgradeToUnlock: "Upgrade om te ontgrendelen",
  },
  ticker: {
    backToSignals: "Terug naar signalen",
    equity: "Aandeel",
    quoteUnavailable: "Koersdata niet beschikbaar",
    volume: "Volume",
    marketCap: "Marktkapitalisatie",
    peRatio: "K/W-verhouding",
    week52Range: "52-weken bereik",
    convictionTrend: "Signaal overtuigingstrend",
    notEnoughData: "Niet genoeg historische data",
    recentSignals: "Recente signalen",
    noSignalsForTicker: "Nog geen signalen voor deze ticker.",
  },
  landing: {
    signIn: "Inloggen",
    startFree: "Gratis starten \u2014 3 live signalen",
    heroTagline: "AI-aangedreven marktintelligentie",
    heroLine1: "Volg slim geld.",
    heroLine2: "Voorspel marktbewegingen.",
    heroLine3: "Handel met vertrouwen.",
    heroDescription: "Onze AI analyseert institutionele stromen, insider-activiteit en optiedata om je een realtime voordeel te geven.",
    seeLiveSignals: "Live signalen bekijken",
    freeAccessLine: "Gratis \u00b7 Geen creditcard \u00b7 3 live signalen direct",
    statsSignals: "Dagelijks gevolgde signalen",
    statsAccuracy: "Nauwkeurigheid bij hoge-overtuiging calls",
    statsFlows: "Gemonitorde institutionele stromen",
    statsLatency: "Gemiddelde signaallatentie",
    featuresTitle: "Elk voordeel, op één plek.",
    featuresSubtitle: "Stop met gokken. Handel met dezelfde signalen waarvoor institutionele desks miljoenen betalen.",
    featureInstitutional: "Institutionele flowtracking",
    featureInstitutionalDesc: "Zie waar het grote geld naartoe gaat voordat de massa het doorheeft.",
    featureInsider: "Insider-activiteitsmonitor",
    featureInsiderDesc: "Realtime-meldingen wanneer insiders hun eigen aandelen kopen of verkopen.",
    featureOptions: "Optieflow-analyse",
    featureOptionsDesc: "Ongewone optie-activiteit die aangeeft waar slim geld inzet.",
    featureAi: "AI overtuigingsscoring",
    featureAiDesc: "Elk signaal beoordeeld door onze AI zodat je precies weet hoe sterk elk voordeel is.",
    pricingTitle: "Eenvoudige, transparante prijzen.",
    pricingSubtitle: "Start gratis, upgrade wanneer je klaar bent. Geen binding.",
    free: "Gratis",
    forever: "voor altijd",
    freeDescription: "Proef het voordeel.",
    freeFeature1: "3 signalen per dag",
    freeFeature2: "Vertraagde data (15 min)",
    freeFeature3: "Basis signaalfeed",
    freeFeature4: "Community-toegang",
    pro: "Pro",
    perMonth: "/ maand",
    proDescription: "Voor actieve traders die een echt voordeel willen.",
    mostPopular: "De keuze van traders",
    proFeature1: "Onbeperkte realtime signalen",
    proFeature2: "AI overtuigingsscoring",
    proFeature3: "Directe push-meldingen",
    proFeature4: "Insider & optieflow",
    proFeature5: "Geavanceerde filters",
    getPro: "Alle signalen ontgrendelen \u2014 \u20ac19/maand",
    proUrgency: "De meeste traders upgraden binnen 5 minuten",
    elite: "Elite",
    eliteDescription: "Maximaal voordeel voor serieuze traders.",
    getElite: "Ga Elite \u2014 Volledige markttoegang",
    eliteUrgency: "Beperkte vroege toegangsplaatsen",
    eliteFeature1: "Alles in Pro",
    eliteFeature2: "Dark pool data",
    eliteFeature3: "Prioriteitswachtrij",
    eliteFeature4: "Aangepaste watchlists",
    eliteFeature5: "Toegewijde ondersteuning",
    eliteFeature6: "Vroege toegang tot nieuwe functies",
    freeLimitation1: "Beperkt tot 3 signalen/dag",
    freeLimitation2: "Geen AI-analyses",
    tradersBadge: "De keuze van traders",
    ctaTitle: "Ontvang je eerste winnend signaal in seconden",
    ctaSubtitle: "Sluit je aan bij traders die EdgeIQ al gebruiken om smart money in realtime te volgen.",
    footerDisclaimer: "Marktintelligentie voor de moderne trader. Geen financieel advies.",
  },
  trading: {
    portfolio: "Portefeuille",
    portfolioSubtitle: "Volg je paper trading prestaties en open posities.",
    demoAccount: "Demo-account",
    balance: "Saldo",
    of: "van",
    totalPnl: "Totaal P&L",
    unrealizedPnl: "Ongerealiseerde P&L",
    openPositions: "Open posities",
    totalTrades: "Totaal trades",
    allTime: "Alle tijd",
    tradeHistory: "Trade-geschiedenis",
    noOpenPositions: "Geen open posities",
    noOpenPositionsHint: "Voer een trade uit vanuit de signaalfeed om je eerste positie te openen.",
    noTrades: "Nog geen trades",
    noTradesHint: "Je trade-geschiedenis verschijnt hier na je eerste trade.",
    shares: "aandelen",
    close: "Sluiten",
    ticker: "Ticker",
    side: "Zijde",
    qty: "Aantal",
    price: "Prijs",
    total: "Totaal",
    date: "Datum",
    refresh: "Vernieuwen",
    reset: "Resetten",
    resetConfirm: "Dit reset je portefeuille naar €10.000 en verwijdert alle posities en trades. Dit kan niet ongedaan worden.",
    confirmReset: "Bevestigen",
    executeTrade: "Trade uitvoeren",
    paperTrading: "Paper Trading — Geen echt geld",
    currentPrice: "Huidige prijs",
    buy: "Kopen",
    sell: "Verkopen",
    quantity: "Aantal",
    estimatedTotal: "Geschat totaal",
    maxPosition: "Max. positiegrootte",
    executing: "Uitvoeren...",
    invalidQuantity: "Voer een geldig aantal in",
    tradeFailed: "Trade-uitvoering mislukt",
    disclaimer: "Alleen paper trading. Geen echt geld. Prijzen zijn gesimuleerd.",
    trade: "Handelen",
    positionClosed: "positie gesloten",
    closeError: "Positie kon niet worden gesloten",
    portfolioResetSuccess: "Portefeuille gereset naar €10.000",
    resetError: "Portefeuille kon niet worden gereset",
    tradeSuccess: "Trade succesvol uitgevoerd",
  },
  notFound: {
    title: "404 Pagina niet gevonden",
    message: "De pagina die je zoekt bestaat niet.",
  },
};

export const translations: Record<Locale, TranslationKeys> = { en, fr, de, es, nl };
