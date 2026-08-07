import type { Session } from '../types'

/**
 * The recurring session formats, grouped by level exactly as the Academy
 * classifies them. Each one expands into dated replays in `replays.ts`.
 */
export const SESSIONS: Session[] = [
  // ── ALL LEVELS ──────────────────────────────────────────────────────────
  { id: 'market-review', title: 'Market Review · BK / Brett / Patrick', level: 'all', type: 'Market Update', coachId: 'byung-kim', cadenceDays: 7 },
  { id: 'midweek-markets', title: 'Mid-week Markets Update and Q&A', level: 'all', type: 'Market Update', coachId: 'patrick', cadenceDays: 7 },
  { id: 'weekly-recap', title: 'Weekly Recap · BK / Patrick', level: 'all', type: 'Market Update', coachId: 'byung-kim', cadenceDays: 7 },
  { id: 'markets-investment-discussion', title: 'Markets and Investment Discussion', level: 'all', type: 'Market Update', coachId: 'brett', cadenceDays: 14 },
  { id: 'global-economic-outlook', title: 'Global Economic Outlook with Jesús', level: 'all', type: 'Macro & Psychology', coachId: 'jesus', cadenceDays: 14 },
  { id: 'market-psychology', title: 'Market Psychology + Q&A', level: 'all', type: 'Macro & Psychology', coachId: 'juri', cadenceDays: 21 },
  { id: 'wsp-qa-investing', title: '(WSP) Q&A (Investing)', level: 'all', type: 'Q&A', coachId: 'mark-putrino', cadenceDays: 14 },
  { id: 'topic-of-the-week', title: 'Topic of the Week (Investing)', level: 'all', type: 'Market Update', coachId: 'dominic', cadenceDays: 7 },
  { id: 'general-market-qa', title: '(Investing) General Market Q&A · BK', level: 'all', type: 'Q&A', coachId: 'byung-kim', cadenceDays: 14 },
  { id: 'friday-investing-qa', title: 'Friday Investing Q&A', level: 'all', type: 'Q&A', coachId: 'frederic', cadenceDays: 7 },
  { id: 'investing-qa-bk-patrick', title: 'Investing Q&A · BK and Patrick', level: 'all', type: 'Q&A', coachId: 'patrick', cadenceDays: 14 },

  // ── BEGINNER ────────────────────────────────────────────────────────────
  { id: 'broker-tos', title: 'Broker Help · TOS (Thinkorswim)', level: 'beginner', type: 'Broker Setup', coachId: 'matt-williamson', cadenceDays: 30 },
  { id: 'broker-ibkr', title: 'Broker Help · IBKR', level: 'beginner', type: 'Broker Setup', coachId: 'guillermo', cadenceDays: 30 },
  { id: 'broker-fidelity', title: 'Broker Help · Fidelity / Robinhood', level: 'beginner', type: 'Broker Setup', coachId: 'matt-williamson', cadenceDays: 30 },
  { id: 'stock-market-fundamentals', title: 'Stock Market Fundamentals', level: 'beginner', type: 'Fundamentals', coachId: 'george', cadenceDays: 21 },
  { id: 'wsp-fundamentals-safety-net', title: '(WSP) Fundamentals as a Safety Net', level: 'beginner', type: 'Fundamentals', coachId: 'carlos', cadenceDays: 21 },
  { id: 'success-path-1', title: 'Trading Success Path · Phase 1', level: 'beginner', type: 'Success Path', coachId: 'troy', cadenceDays: 28 },
  { id: 'basics-to-investing', title: 'Basics to Investing · Concepts & Principles', level: 'beginner', type: 'Fundamentals', coachId: 'mike-muryn', cadenceDays: 21 },
  { id: 'investing-intro', title: '(Investing) Intro · Investing Fundamentals', level: 'beginner', type: 'Fundamentals', coachId: 'tonino', cadenceDays: 28 },
  { id: 'jesus-charting', title: "Jesús' Weekly Charting Session", level: 'beginner', type: 'Strategy & Charting', coachId: 'jesus', cadenceDays: 7 },
  { id: 'wsp-stop-loss', title: '(WSP) Stop Loss Workshop', level: 'beginner', type: 'Risk & Planning', coachId: 'elliott', cadenceDays: 21 },
  { id: 'risk-management-beginners', title: 'Risk Management for Beginners', level: 'beginner', type: 'Risk & Planning', coachId: 'daniel-ayala', cadenceDays: 21 },
  { id: 'wsp-large-lists', title: '(WSP) On Keeping Track of Large Lists', level: 'beginner', type: 'Workshop', coachId: 'carlos', cadenceDays: 28 },
  { id: 'trading-plans', title: 'Trading Plans · Construction & Feedback', level: 'beginner', type: 'Risk & Planning', coachId: 'george', cadenceDays: 14 },
  { id: 'securities-valuation', title: 'Investment Securities & Valuation · BK', level: 'beginner', type: 'Fundamentals', coachId: 'byung-kim', cadenceDays: 28 },
  { id: 'profitable-exit-planning', title: 'Profitable Exit Planning', level: 'beginner', type: 'Risk & Planning', coachId: 'troy', cadenceDays: 21 },
  { id: 'trade-logging', title: 'Trade Logging and Analysis', level: 'beginner', type: 'Risk & Planning', coachId: 'mike-muryn', cadenceDays: 21 },
  { id: 'implied-volatility-beginners', title: 'Implied Volatility for Beginners', level: 'beginner', type: 'Strategy & Charting', coachId: 'tonino', cadenceDays: 28 },

  // ── INTERMEDIATE ────────────────────────────────────────────────────────
  { id: 'bull-flags', title: 'Bull Flags: Anatomy of a Controlled Breakout', level: 'intermediate', type: 'Strategy & Charting', coachId: 'mark-putrino', cadenceDays: 21 },
  { id: 'core-charting-strategy', title: 'Our Core Charting Strategy', level: 'intermediate', type: 'Strategy & Charting', coachId: 'jea-yu', cadenceDays: 14 },
  { id: 'wsp-screening-entries-exits', title: '(WSP) On Screening, Entries and Exits', level: 'intermediate', type: 'Strategy & Charting', coachId: 'carlos', cadenceDays: 21 },
  { id: 'wsp-screening', title: '(WSP) On Screening', level: 'intermediate', type: 'Strategy & Charting', coachId: 'carlos', cadenceDays: 21 },
  { id: 'wsp-entries-exits', title: '(WSP) Entries and Exits', level: 'intermediate', type: 'Strategy & Charting', coachId: 'frederic', cadenceDays: 21 },
  { id: 'wsp-stalking-breakouts', title: '(WSP) Stalking Breakouts and Pullbacks', level: 'intermediate', type: 'Strategy & Charting', coachId: 'brett', cadenceDays: 14 },
  { id: 'wsp-potential-breakouts', title: '(WSP) Keeping an Eye on Potential Breakouts', level: 'intermediate', type: 'Strategy & Charting', coachId: 'andrew-murtha', cadenceDays: 14 },
  { id: 'market-mastery', title: 'Market Mastery: Sectors, Strategies & Smart Allocation', level: 'intermediate', type: 'Strategy & Charting', coachId: 'dominic', cadenceDays: 28 },
  { id: 'success-path-2', title: 'Trading Success Path · Phase 2', level: 'intermediate', type: 'Success Path', coachId: 'troy', cadenceDays: 28 },
  { id: 'success-path-34', title: 'Trading Success Path · Phase 3/4', level: 'intermediate', type: 'Success Path', coachId: 'george', cadenceDays: 28 },
  { id: 'backtesting-101', title: 'Backtesting 101', level: 'intermediate', type: 'Workshop', coachId: 'jea-yu', cadenceDays: 28 },
  { id: 'wsp-portfolio-risk', title: '(WSP) Estimating Portfolio Risk', level: 'intermediate', type: 'Risk & Planning', coachId: 'mike-muryn', cadenceDays: 21 },
  { id: 'weekly-round-up', title: 'The Weekly Round-Up', level: 'intermediate', type: 'Market Update', coachId: 'patrick', cadenceDays: 7 },
  { id: 'divergences-macd', title: 'Trading Divergences & Setups · MACD', level: 'intermediate', type: 'Strategy & Charting', coachId: 'mark-putrino', cadenceDays: 21 },

  // ── ADVANCED ────────────────────────────────────────────────────────────
  { id: 'macro-data-analysis', title: 'Macro Data Analysis for Investors', level: 'advanced', type: 'Macro & Psychology', coachId: 'brendan', cadenceDays: 21 },
]

export const sessionById = (id: string) => SESSIONS.find((s) => s.id === id)

export const SESSION_TYPES = [...new Set(SESSIONS.map((s) => s.type))].sort()
