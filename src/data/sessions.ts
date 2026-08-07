import type { Level, Session } from '../types'

/**
 * The Academy's full session list, transcribed from the session overview and
 * grouped by the level each session is classified under. 43 sessions total:
 * 11 all-levels, 17 beginner, 14 intermediate, 1 advanced.
 *
 * Coach and cadence are the only invented fields — Zoom supplies the real host
 * and dates once connected. Titles and levels are exactly as given.
 */
export const SESSIONS: Session[] = [
  // ── ALL LEVELS · 11 sessions ────────────────────────────────────────────
  { id: 'market-review', title: 'Market Review · BK / Brett / Patrick', level: 'all', coachId: 'byung-kim', cadenceDays: 7 },
  { id: 'midweek-markets', title: 'Mid-week Markets Update and Q&A', level: 'all', coachId: 'patrick', cadenceDays: 7 },
  { id: 'weekly-recap', title: 'Weekly Recap · BK / Patrick', level: 'all', coachId: 'byung-kim', cadenceDays: 7 },
  { id: 'markets-investment-discussion', title: 'Markets and Investment Discussion', level: 'all', coachId: 'brett', cadenceDays: 14 },
  { id: 'global-economic-outlook', title: 'Global Economic Outlook with Jesús', level: 'all', coachId: 'jesus', cadenceDays: 14 },
  { id: 'market-psychology', title: 'Market Psychology + Q&A', level: 'all', coachId: 'juri', cadenceDays: 21 },
  { id: 'wsp-qa-investing', title: '(WSP) Q&A (Investing)', level: 'all', coachId: 'mark-putrino', cadenceDays: 14 },
  { id: 'topic-of-the-week', title: 'Topic of the Week (Investing)', level: 'all', coachId: 'dominic', cadenceDays: 7 },
  { id: 'general-market-qa', title: '(Investing) General Market Q&A · BK', level: 'all', coachId: 'byung-kim', cadenceDays: 14 },
  { id: 'friday-investing-qa', title: 'Friday Investing Q&A', level: 'all', coachId: 'frederic', cadenceDays: 7 },
  { id: 'investing-qa-bk-patrick', title: 'Investing Q&A · BK and Patrick', level: 'all', coachId: 'patrick', cadenceDays: 14 },

  // ── BEGINNER · 17 sessions ──────────────────────────────────────────────
  { id: 'broker-tos', title: 'Broker Help · TOS (Thinkorswim)', level: 'beginner', coachId: 'matt-williamson', cadenceDays: 30 },
  { id: 'broker-ibkr', title: 'Broker Help · IBKR', level: 'beginner', coachId: 'guillermo', cadenceDays: 30 },
  { id: 'broker-fidelity', title: 'Broker Help · Fidelity / Robinhood', level: 'beginner', coachId: 'matt-williamson', cadenceDays: 30 },
  { id: 'stock-market-fundamentals', title: 'Stock Market Fundamentals', level: 'beginner', coachId: 'george', cadenceDays: 21 },
  { id: 'wsp-fundamentals-safety-net', title: '(WSP) Fundamentals as a Safety Net', level: 'beginner', coachId: 'carlos', cadenceDays: 21 },
  { id: 'success-path-1', title: 'Trading Success Path · Phase 1', level: 'beginner', coachId: 'troy', cadenceDays: 28 },
  { id: 'basics-to-investing', title: 'Basics to Investing · Concepts & Principles', level: 'beginner', coachId: 'mike-muryn', cadenceDays: 21 },
  { id: 'investing-intro', title: '(Investing) Intro · Investing Fundamentals', level: 'beginner', coachId: 'tonino', cadenceDays: 28 },
  { id: 'jesus-charting', title: "Jesús' Weekly Charting Session", level: 'beginner', coachId: 'jesus', cadenceDays: 7 },
  { id: 'wsp-stop-loss', title: '(WSP) Stop Loss Workshop', level: 'beginner', coachId: 'elliott', cadenceDays: 21 },
  { id: 'risk-management-beginners', title: 'Risk Management for Beginners', level: 'beginner', coachId: 'daniel-ayala', cadenceDays: 21 },
  { id: 'wsp-large-lists', title: '(WSP) On Keeping Track of Large Lists', level: 'beginner', coachId: 'carlos', cadenceDays: 28 },
  { id: 'trading-plans', title: 'Trading Plans · Construction & Feedback', level: 'beginner', coachId: 'george', cadenceDays: 14 },
  { id: 'securities-valuation', title: 'Investment Securities & Valuation · BK', level: 'beginner', coachId: 'byung-kim', cadenceDays: 28 },
  { id: 'profitable-exit-planning', title: 'Profitable Exit Planning', level: 'beginner', coachId: 'troy', cadenceDays: 21 },
  { id: 'trade-logging', title: 'Trade Logging and Analysis', level: 'beginner', coachId: 'mike-muryn', cadenceDays: 21 },
  { id: 'implied-volatility-beginners', title: 'Implied Volatility for Beginners', level: 'beginner', coachId: 'tonino', cadenceDays: 28 },

  // ── INTERMEDIATE · 14 sessions ──────────────────────────────────────────
  { id: 'bull-flags', title: 'Bull Flags: Anatomy of a Controlled Breakout', level: 'intermediate', coachId: 'mark-putrino', cadenceDays: 21 },
  { id: 'core-charting-strategy', title: 'Our Core Charting Strategy', level: 'intermediate', coachId: 'jea-yu', cadenceDays: 14 },
  { id: 'wsp-screening-entries-exits', title: '(WSP) On Screening, Entries and Exits', level: 'intermediate', coachId: 'carlos', cadenceDays: 21 },
  { id: 'wsp-screening', title: '(WSP) On Screening', level: 'intermediate', coachId: 'carlos', cadenceDays: 21 },
  { id: 'wsp-entries-exits', title: '(WSP) Entries and Exits', level: 'intermediate', coachId: 'frederic', cadenceDays: 21 },
  { id: 'wsp-stalking-breakouts', title: '(WSP) Stalking Breakouts and Pullbacks', level: 'intermediate', coachId: 'brett', cadenceDays: 14 },
  { id: 'wsp-potential-breakouts', title: '(WSP) Keeping an Eye on Potential Breakouts', level: 'intermediate', coachId: 'andrew-murtha', cadenceDays: 14 },
  { id: 'market-mastery', title: 'Market Mastery: Sectors, Strategies & Smart Allocation', level: 'intermediate', coachId: 'dominic', cadenceDays: 28 },
  { id: 'success-path-2', title: 'Trading Success Path · Phase 2', level: 'intermediate', coachId: 'troy', cadenceDays: 28 },
  { id: 'success-path-34', title: 'Trading Success Path · Phase 3/4', level: 'intermediate', coachId: 'george', cadenceDays: 28 },
  { id: 'backtesting-101', title: 'Backtesting 101', level: 'intermediate', coachId: 'jea-yu', cadenceDays: 28 },
  { id: 'wsp-portfolio-risk', title: '(WSP) Estimating Portfolio Risk', level: 'intermediate', coachId: 'mike-muryn', cadenceDays: 21 },
  { id: 'weekly-round-up', title: 'The Weekly Round-Up', level: 'intermediate', coachId: 'patrick', cadenceDays: 7 },
  { id: 'divergences-macd', title: 'Trading Divergences & Setups · MACD', level: 'intermediate', coachId: 'mark-putrino', cadenceDays: 21 },

  // ── ADVANCED · 1 session ────────────────────────────────────────────────
  { id: 'macro-data-analysis', title: 'Macro Data Analysis for Investors', level: 'advanced', coachId: 'brendan', cadenceDays: 21 },
]

export const sessionById = (id: string) => SESSIONS.find((s) => s.id === id)

/** Sessions grouped by level, in the order the filter dropdown lists them. */
export const SESSIONS_BY_LEVEL: { level: Level; label: string; sessions: Session[] }[] = [
  { level: 'all', label: 'All levels', sessions: SESSIONS.filter((s) => s.level === 'all') },
  { level: 'beginner', label: 'Beginner', sessions: SESSIONS.filter((s) => s.level === 'beginner') },
  { level: 'intermediate', label: 'Intermediate', sessions: SESSIONS.filter((s) => s.level === 'intermediate') },
  { level: 'advanced', label: 'Advanced', sessions: SESSIONS.filter((s) => s.level === 'advanced') },
]
