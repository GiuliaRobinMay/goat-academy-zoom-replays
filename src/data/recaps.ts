/**
 * Recap and chapter markers per session.
 *
 * Chapter `at` values are a fraction of the recording's length, not absolute
 * seconds — a session runs a different length each week, and this keeps the
 * markers inside the recording whatever that length turns out to be.
 * `replays.ts` converts them to real timestamps.
 *
 * These are written placeholders. Once Zoom is connected the recap comes from
 * the meeting summary and the chapters from the transcript, so this file is
 * only the fallback for recordings with neither.
 */

export interface RecapEntry {
  recap: string
  chapters: { at: number; label: string }[]
}

export const RECAPS: Record<string, RecapEntry> = {
  // ── All levels ──────────────────────────────────────────────────────────
  'market-review': {
    recap: 'A walk through the week\'s index action, where sector leadership sat, and the levels that matter going into next week. Closes with live questions on member positions.',
    chapters: [
      { at: 0, label: 'Welcome and agenda' },
      { at: 0.08, label: 'Index levels: S&P, Nasdaq, Russell' },
      { at: 0.3, label: 'Sector rotation and leadership' },
      { at: 0.55, label: 'Names on the watchlist' },
      { at: 0.78, label: 'Member positions and Q&A' },
      { at: 0.94, label: 'What to watch next week' },
    ],
  },
  'midweek-markets': {
    recap: 'A mid-week check on whether the market is still behaving the way Monday\'s plan assumed, then an open floor.',
    chapters: [
      { at: 0, label: 'Where we are since Monday' },
      { at: 0.14, label: 'Breadth and volume check' },
      { at: 0.36, label: 'Names that triggered' },
      { at: 0.6, label: 'Risk management reminders' },
      { at: 0.8, label: 'Open Q&A' },
    ],
  },
  'weekly-recap': {
    recap: 'What worked and what did not across the week\'s setups, with the reasoning behind each entry and exit laid out.',
    chapters: [
      { at: 0, label: 'The week in one slide' },
      { at: 0.12, label: 'Trades that worked' },
      { at: 0.38, label: 'Trades that did not' },
      { at: 0.62, label: 'Lessons and adjustments' },
      { at: 0.85, label: 'Setups carrying into next week' },
    ],
  },
  'markets-investment-discussion': {
    recap: 'An open discussion on the macro backdrop and what it means for longer-term positioning.',
    chapters: [
      { at: 0, label: 'Opening thoughts' },
      { at: 0.18, label: 'Rates, inflation and the dollar' },
      { at: 0.44, label: 'Where the opportunity is' },
      { at: 0.7, label: 'Portfolio positioning' },
      { at: 0.9, label: 'Questions' },
    ],
  },
  'market-psychology': {
    recap: 'Why discipline breaks down under pressure, and the habits that keep decisions consistent when it does.',
    chapters: [
      { at: 0, label: 'Why we self-sabotage' },
      { at: 0.16, label: 'Fear, greed and the middle ground' },
      { at: 0.42, label: 'Building a repeatable routine' },
      { at: 0.66, label: 'Journaling that actually helps' },
      { at: 0.86, label: 'Q&A' },
    ],
  },
  'wsp-qa-investing': {
    recap: 'Open questions on applying the Wall Street Protocol over a longer investing horizon.',
    chapters: [
      { at: 0, label: 'Housekeeping' },
      { at: 0.1, label: 'Protocol refresher' },
      { at: 0.34, label: 'Questions: screening' },
      { at: 0.58, label: 'Questions: sizing' },
      { at: 0.82, label: 'Questions: exits' },
    ],
  },
  'topic-of-the-week': {
    recap: 'One focused theme, chosen from whatever members have been asking about most that week.',
    chapters: [
      { at: 0, label: "This week's topic" },
      { at: 0.2, label: 'Why it matters now' },
      { at: 0.46, label: 'Worked example' },
      { at: 0.72, label: 'Common mistakes' },
      { at: 0.9, label: 'Takeaways' },
    ],
  },
  'general-market-qa': {
    recap: 'Byung Kim takes general market questions, from index direction through to individual names.',
    chapters: [
      { at: 0, label: 'Market snapshot' },
      { at: 0.18, label: 'Index direction' },
      { at: 0.42, label: 'Single-name questions' },
      { at: 0.68, label: 'Valuation questions' },
      { at: 0.88, label: 'Wrap-up' },
    ],
  },
  'friday-investing-qa': {
    recap: 'End-of-week questions on the investing side, closing out the themes raised earlier in the week.',
    chapters: [
      { at: 0, label: 'Week in review' },
      { at: 0.16, label: 'Questions on holdings' },
      { at: 0.44, label: 'Adding versus trimming' },
      { at: 0.7, label: 'Weekend homework' },
      { at: 0.9, label: 'Close' },
    ],
  },
  'investing-qa-bk-patrick': {
    recap: 'Two coaches taking the same questions, including the places where they read a situation differently.',
    chapters: [
      { at: 0, label: 'Intro' },
      { at: 0.14, label: 'Where they agree' },
      { at: 0.4, label: 'Where they differ' },
      { at: 0.66, label: 'Member questions' },
      { at: 0.88, label: 'Closing thoughts' },
    ],
  },

  // ── Beginner ────────────────────────────────────────────────────────────
  'broker-tos': {
    recap: 'Thinkorswim from a standing start: laying out the platform, building charts and watchlists, and placing a first order safely.',
    chapters: [
      { at: 0, label: 'Account overview' },
      { at: 0.14, label: 'Setting up the layout' },
      { at: 0.36, label: 'Charts and watchlists' },
      { at: 0.58, label: 'Placing your first order' },
      { at: 0.8, label: 'Order types that matter' },
      { at: 0.94, label: 'Where to get help' },
    ],
  },
  'broker-ibkr': {
    recap: 'Getting an Interactive Brokers account registered, funded and configured for the Academy workflow.',
    chapters: [
      { at: 0, label: 'Registration walkthrough' },
      { at: 0.2, label: 'Funding the account' },
      { at: 0.42, label: 'Finding the trading screen' },
      { at: 0.64, label: 'Placing an order' },
      { at: 0.86, label: 'Fees and settings to check' },
    ],
  },
  'broker-fidelity': {
    recap: 'Setup for the two most common US retail brokers, and an honest look at what each one cannot do.',
    chapters: [
      { at: 0, label: 'Which broker suits you' },
      { at: 0.18, label: 'Fidelity setup' },
      { at: 0.46, label: 'Robinhood setup' },
      { at: 0.72, label: 'Limitations to be aware of' },
      { at: 0.9, label: 'Questions' },
    ],
  },
  'stock-market-fundamentals': {
    recap: 'The foundations: what actually moves a share price, who is on the other side of your order, and how that order reaches the market.',
    chapters: [
      { at: 0, label: 'What a share actually is' },
      { at: 0.18, label: 'Who is on the other side' },
      { at: 0.42, label: 'How orders get filled' },
      { at: 0.66, label: 'Reading a quote' },
      { at: 0.86, label: 'First principles recap' },
    ],
  },
  'wsp-fundamentals-safety-net': {
    recap: 'Using company fundamentals as a floor under a technical setup, so a clean chart never talks you into a broken business.',
    chapters: [
      { at: 0, label: 'Why fundamentals still matter' },
      { at: 0.2, label: 'The four numbers to check' },
      { at: 0.48, label: 'Screening for quality' },
      { at: 0.72, label: 'When to override the chart' },
      { at: 0.9, label: 'Summary' },
    ],
  },
  'success-path-1': {
    recap: 'Phase 1 of the path: getting set up, sizing small on purpose, and building the habit loop before chasing returns.',
    chapters: [
      { at: 0, label: 'What Phase 1 covers' },
      { at: 0.16, label: 'Account and tools' },
      { at: 0.4, label: 'Your first position size' },
      { at: 0.64, label: 'The habit loop' },
      { at: 0.86, label: 'Moving to Phase 2' },
    ],
  },
  'basics-to-investing': {
    recap: 'Compounding, diversification and time horizon explained in plain language, with no jargon assumed.',
    chapters: [
      { at: 0, label: 'Investing versus trading' },
      { at: 0.2, label: 'Compounding explained' },
      { at: 0.44, label: 'Diversification done properly' },
      { at: 0.7, label: 'Choosing a time horizon' },
      { at: 0.9, label: 'Getting started' },
    ],
  },
  'investing-intro': {
    recap: 'An orientation to the investing track and how its decisions differ from the trading side.',
    chapters: [
      { at: 0, label: 'Welcome to the track' },
      { at: 0.18, label: 'How this differs from trading' },
      { at: 0.44, label: 'What we look for' },
      { at: 0.7, label: 'Your first watchlist' },
      { at: 0.9, label: 'Next steps' },
    ],
  },
  'wsp-stop-loss': {
    recap: 'Where to place a stop so it protects capital without being taken out by ordinary noise.',
    chapters: [
      { at: 0, label: 'Why stops get hit' },
      { at: 0.18, label: 'Structure-based placement' },
      { at: 0.44, label: 'ATR and volatility' },
      { at: 0.68, label: 'Moving a stop up' },
      { at: 0.88, label: 'Live examples' },
    ],
  },
  'risk-management-beginners': {
    recap: 'Position sizing, the one percent rule, and why risk gets decided before any thought about returns.',
    chapters: [
      { at: 0, label: 'Risk before reward' },
      { at: 0.16, label: 'The one percent rule' },
      { at: 0.4, label: 'Sizing from your stop' },
      { at: 0.66, label: 'Correlation risk' },
      { at: 0.88, label: 'Putting it together' },
    ],
  },
  'wsp-large-lists': {
    recap: 'Managing a watchlist of hundreds of names without drowning in it — tiering, alerts and a weekly prune.',
    chapters: [
      { at: 0, label: 'The problem with big lists' },
      { at: 0.18, label: 'Tiering your list' },
      { at: 0.44, label: 'Alerts that do the work' },
      { at: 0.7, label: 'Weekly pruning routine' },
      { at: 0.9, label: 'Tools' },
    ],
  },
  'trading-plans': {
    recap: 'Building a written trading plan section by section, then live feedback on plans members brought along.',
    chapters: [
      { at: 0, label: 'Why write it down' },
      { at: 0.16, label: 'The five sections' },
      { at: 0.42, label: 'Worked example' },
      { at: 0.62, label: 'Plan review one' },
      { at: 0.8, label: 'Plan review two' },
      { at: 0.94, label: 'Homework' },
    ],
  },
  'securities-valuation': {
    recap: 'How to value a business, and what a multiple does and does not tell you about one.',
    chapters: [
      { at: 0, label: 'What valuation is for' },
      { at: 0.18, label: 'Earnings and cash flow' },
      { at: 0.44, label: 'Multiples and their limits' },
      { at: 0.7, label: 'A worked valuation' },
      { at: 0.9, label: 'Q&A' },
    ],
  },
  'profitable-exit-planning': {
    recap: 'Planning the exit before the entry, and scaling out without leaving the whole move on the table.',
    chapters: [
      { at: 0, label: 'Exits decide returns' },
      { at: 0.18, label: 'Setting targets' },
      { at: 0.42, label: 'Scaling out in thirds' },
      { at: 0.68, label: 'Trailing the rest' },
      { at: 0.88, label: 'Examples' },
    ],
  },
  'trade-logging': {
    recap: 'What to record after every trade, and how to read your own log back for the patterns you keep repeating.',
    chapters: [
      { at: 0, label: 'What to log' },
      { at: 0.2, label: 'Setting up the sheet' },
      { at: 0.44, label: 'Reviewing weekly' },
      { at: 0.68, label: 'Finding your edge' },
      { at: 0.88, label: 'Common blind spots' },
    ],
  },
  'implied-volatility-beginners': {
    recap: 'What implied volatility measures, and why it changes what a trade costs before the price moves at all.',
    chapters: [
      { at: 0, label: 'Volatility in plain terms' },
      { at: 0.2, label: 'Implied versus realised' },
      { at: 0.46, label: 'IV and option pricing' },
      { at: 0.72, label: 'High IV versus low IV setups' },
      { at: 0.92, label: 'Recap' },
    ],
  },

  // ── Intermediate ────────────────────────────────────────────────────────
  'bull-flags': {
    recap: 'The anatomy of a bull flag: the pole, the pause, and what separates a clean break from a trap.',
    chapters: [
      { at: 0, label: 'The pattern in one chart' },
      { at: 0.16, label: 'The pole' },
      { at: 0.36, label: 'The flag' },
      { at: 0.58, label: 'Volume signature' },
      { at: 0.78, label: 'Entry, stop and target' },
      { at: 0.94, label: 'Failed examples' },
    ],
  },
  'core-charting-strategy': {
    recap: 'The house charting method end to end, including the indicators deliberately left off the chart.',
    chapters: [
      { at: 0, label: 'Chart setup' },
      { at: 0.18, label: 'The moving averages we use' },
      { at: 0.42, label: 'Volume and relative strength' },
      { at: 0.66, label: 'Putting a thesis together' },
      { at: 0.88, label: 'Q&A' },
    ],
  },
  'wsp-screening-entries-exits': {
    recap: 'The full protocol loop in one session: find it, enter it, exit it.',
    chapters: [
      { at: 0, label: 'Overview of the loop' },
      { at: 0.16, label: 'Screening filters' },
      { at: 0.4, label: 'Entry triggers' },
      { at: 0.64, label: 'Exit rules' },
      { at: 0.86, label: 'Live walkthrough' },
    ],
  },
  'wsp-screening': {
    recap: 'Building and tuning screens so the list waiting for you each morning is short and worth reading.',
    chapters: [
      { at: 0, label: 'What a screen is for' },
      { at: 0.18, label: 'The base filters' },
      { at: 0.44, label: 'Tuning for market conditions' },
      { at: 0.7, label: 'Saving and reusing' },
      { at: 0.9, label: 'Q&A' },
    ],
  },
  'wsp-entries-exits': {
    recap: 'Precise entry triggers and the exit rules that have to travel with them.',
    chapters: [
      { at: 0, label: 'Entry checklist' },
      { at: 0.2, label: 'Trigger versus anticipation' },
      { at: 0.46, label: 'The initial stop' },
      { at: 0.7, label: 'Exit rules' },
      { at: 0.9, label: 'Examples' },
    ],
  },
  'wsp-stalking-breakouts': {
    recap: 'How to sit on a name before it moves, and when to take the break versus wait for the pullback.',
    chapters: [
      { at: 0, label: 'Stalking versus chasing' },
      { at: 0.18, label: 'Setting alerts' },
      { at: 0.42, label: 'The breakout entry' },
      { at: 0.64, label: 'The pullback entry' },
      { at: 0.86, label: 'Which to prefer' },
    ],
  },
  'wsp-potential-breakouts': {
    recap: 'Keeping a live shortlist of names close to breaking out, and the daily routine that maintains it.',
    chapters: [
      { at: 0, label: 'Building the shortlist' },
      { at: 0.2, label: 'Daily review routine' },
      { at: 0.46, label: 'What disqualifies a name' },
      { at: 0.72, label: "This week's candidates" },
      { at: 0.92, label: 'Q&A' },
    ],
  },
  'market-mastery': {
    recap: 'Reading sector leadership, and allocating across several strategies instead of betting the account on one.',
    chapters: [
      { at: 0, label: 'Why sectors lead' },
      { at: 0.18, label: 'Reading rotation' },
      { at: 0.44, label: 'Allocating across strategies' },
      { at: 0.7, label: 'Rebalancing rules' },
      { at: 0.9, label: 'Summary' },
    ],
  },
  'success-path-2': {
    recap: 'Phase 2 is consistency: the same setup at the same size, repeated until the results get boring.',
    chapters: [
      { at: 0, label: 'What changes in Phase 2' },
      { at: 0.18, label: 'Choosing one setup' },
      { at: 0.44, label: 'Sizing up carefully' },
      { at: 0.68, label: 'Measuring consistency' },
      { at: 0.9, label: 'Moving to Phase 3' },
    ],
  },
  'success-path-34': {
    recap: 'The later phases: adding a second setup, scaling size, and running several positions at once.',
    chapters: [
      { at: 0, label: 'Where Phase 3 begins' },
      { at: 0.18, label: 'Adding a second setup' },
      { at: 0.42, label: 'Scaling position size' },
      { at: 0.66, label: 'Managing several open trades' },
      { at: 0.88, label: 'Phase 4 outlook' },
    ],
  },
  'backtesting-101': {
    recap: 'Testing a setup against history without quietly fooling yourself into a result you wanted.',
    chapters: [
      { at: 0, label: 'Why backtest' },
      { at: 0.18, label: 'Defining the rules' },
      { at: 0.42, label: 'Running the test' },
      { at: 0.66, label: 'Reading the results' },
      { at: 0.86, label: 'Overfitting traps' },
    ],
  },
  'wsp-portfolio-risk': {
    recap: 'Measuring exposure across the whole book rather than trade by trade, and setting a ceiling you hold to.',
    chapters: [
      { at: 0, label: 'Single-trade versus portfolio risk' },
      { at: 0.2, label: 'Adding up open risk' },
      { at: 0.46, label: 'Correlation between positions' },
      { at: 0.7, label: 'Setting a ceiling' },
      { at: 0.9, label: 'Worked example' },
    ],
  },
  'weekly-round-up': {
    recap: 'Where the market closed the week, what set up along the way, and what is on the list for Monday.',
    chapters: [
      { at: 0, label: 'The weekly close' },
      { at: 0.16, label: 'Sector scoreboard' },
      { at: 0.38, label: 'Setups that triggered' },
      { at: 0.62, label: 'Names for Monday' },
      { at: 0.86, label: 'Q&A' },
    ],
  },
  'divergences-macd': {
    recap: 'Reading MACD divergence properly, including the far more common case where it is simply noise.',
    chapters: [
      { at: 0, label: 'How MACD is built' },
      { at: 0.18, label: 'Regular divergence' },
      { at: 0.42, label: 'Hidden divergence' },
      { at: 0.66, label: 'Confirmation required' },
      { at: 0.88, label: 'Live examples' },
    ],
  },

  // ── Advanced ────────────────────────────────────────────────────────────
  'macro-data-analysis': {
    recap: 'The macro releases that genuinely move markets, and how to read them without overreacting to each print.',
    chapters: [
      { at: 0, label: 'The macro calendar' },
      { at: 0.18, label: 'CPI and PPI' },
      { at: 0.42, label: 'Employment data' },
      { at: 0.64, label: 'Central bank language' },
      { at: 0.86, label: 'Positioning around releases' },
    ],
  },
}
