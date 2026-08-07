/**
 * Display copy for the generated cover art.
 *
 * The session titles are too long to set as a headline, so each session gets a
 * short punchy `display` line plus a `tagline` that carries the detail — the
 * same split the Academy's own thumbnail series uses ("BROKER TOS" over "Set up
 * and master Thinkorswim").
 *
 * `display` should stay under about 26 characters so it wraps to at most two
 * lines at headline size.
 */

export interface Artwork {
  display: string
  tagline: string
}

export const ARTWORK: Record<string, Artwork> = {
  // ── All levels ──────────────────────────────────────────────────────────
  'market-review': { display: 'Market Review', tagline: "The week's action, level by level." },
  'midweek-markets': { display: 'Mid-week Update', tagline: 'Where the market stands midweek.' },
  'weekly-recap': { display: 'Weekly Recap', tagline: "What worked, what didn't, and why." },
  'markets-investment-discussion': { display: 'Markets Discussion', tagline: 'The macro backdrop, talked through.' },
  'market-psychology': { display: 'Market Psychology', tagline: 'Why discipline breaks, and how to hold it.' },
  'wsp-qa-investing': { display: 'WSP Q&A', tagline: 'Your protocol questions, answered.' },
  'topic-of-the-week': { display: 'Topic of the Week', tagline: 'One theme, taken from your questions.' },
  'general-market-qa': { display: 'General Market Q&A', tagline: 'Index direction to single names.' },
  'friday-investing-qa': { display: 'Friday Q&A', tagline: "Closing out the week's questions." },
  'investing-qa-bk-patrick': { display: 'Investing Q&A', tagline: 'Two coaches, two perspectives.' },

  // ── Beginner ────────────────────────────────────────────────────────────
  'broker-tos': { display: 'Broker TOS', tagline: 'Set up and master Thinkorswim.' },
  'broker-ibkr': { display: 'Broker IBKR', tagline: 'Set up and master Interactive Brokers.' },
  'broker-fidelity': { display: 'Broker Fidelity', tagline: 'Get started on Fidelity and Robinhood.' },
  'stock-market-fundamentals': { display: 'Stock Market Fundamentals', tagline: 'The building blocks of the stock market.' },
  'wsp-fundamentals-safety-net': { display: 'Fundamentals Safety Net', tagline: 'A floor under every technical setup.' },
  'success-path-1': { display: 'Success Path 1', tagline: 'Set up, size small, build the habit.' },
  'basics-to-investing': { display: 'Investing Basics', tagline: 'Compounding, diversification, time.' },
  'investing-intro': { display: 'Investing Intro', tagline: 'Your orientation to the investing track.' },
  'wsp-stop-loss': { display: 'Stop Loss Workshop', tagline: 'Stops that protect without annoying.' },
  'risk-management-beginners': { display: 'Risk Management', tagline: 'Risk decided before reward.' },
  'wsp-large-lists': { display: 'Large Watchlists', tagline: 'Hundreds of names, kept under control.' },
  'trading-plans': { display: 'Trading Plans', tagline: 'Write it down, then get feedback.' },
  'securities-valuation': { display: 'Securities & Valuation', tagline: 'What a multiple really tells you.' },
  'profitable-exit-planning': { display: 'Exit Planning', tagline: 'Plan the exit before the entry.' },
  'trade-logging': { display: 'Trade Logging', tagline: 'Read your own log for the patterns.' },
  'implied-volatility-beginners': { display: 'Implied Volatility', tagline: 'What it measures, and what it costs.' },

  // ── Intermediate ────────────────────────────────────────────────────────
  'bull-flags': { display: 'Bull Flags', tagline: 'Anatomy of a controlled breakout.' },
  'core-charting-strategy': { display: 'Core Charting', tagline: 'The house method, end to end.' },
  'wsp-screening-entries-exits': { display: 'Screen, Enter, Exit', tagline: 'The full protocol loop in one session.' },
  'wsp-screening': { display: 'On Screening', tagline: 'A morning list worth reading.' },
  'wsp-entries-exits': { display: 'Entries & Exits', tagline: 'Precise triggers, and the rules with them.' },
  'wsp-stalking-breakouts': { display: 'Stalking Breakouts', tagline: 'Sit on it before it moves.' },
  'wsp-potential-breakouts': { display: 'Potential Breakouts', tagline: 'Keeping a live shortlist.' },
  'market-mastery': { display: 'Market Mastery', tagline: 'Sectors, strategies, smart allocation.' },
  'success-path-2': { display: 'Success Path 2', tagline: 'Same setup, same size, repeated.' },
  'success-path-34': { display: 'Success Path 3/4', tagline: 'Adding setups and scaling size.' },
  'backtesting-101': { display: 'Backtesting 101', tagline: 'Test it without fooling yourself.' },
  'wsp-portfolio-risk': { display: 'Portfolio Risk', tagline: 'Exposure across the whole book.' },
  'weekly-round-up': { display: 'Weekly Round-Up', tagline: "Where the week closed, what's next." },
  'divergences-macd': { display: 'MACD Divergence', tagline: "Reading it right, and when it's noise." },

  // ── Advanced ────────────────────────────────────────────────────────────
  'macro-data-analysis': { display: 'Macro Data', tagline: 'The releases that actually move markets.' },
}
