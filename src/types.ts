export type Level = 'beginner' | 'intermediate' | 'advanced' | 'all'

export type SessionType =
  | 'Market Update'
  | 'Q&A'
  | 'Workshop'
  | 'Broker Setup'
  | 'Fundamentals'
  | 'Strategy & Charting'
  | 'Risk & Planning'
  | 'Success Path'
  | 'Macro & Psychology'

export interface Coach {
  id: string
  name: string
  /** Levels this coach teaches. `all` means every level. */
  levels: Level[]
}

/** A recurring session format, e.g. "The Weekly Round-Up". */
export interface Session {
  id: string
  title: string
  level: Level
  type: SessionType
  coachId: string
  /** Roughly how often it runs — drives the generated replay history. */
  cadenceDays: number
}

/** One actual recorded occurrence of a session — this is what a card represents. */
export interface Replay {
  id: string
  sessionId: string
  title: string
  level: Level
  type: SessionType
  coachId: string
  /** ISO date (yyyy-mm-dd) the session was recorded. */
  date: string
  durationMin: number
  /**
   * Populated by the backend once Zoom is connected.
   * `videoUrl` streams through our own proxy; `shareUrl`/`passcode` are the
   * fallback when a recording has no downloadable file.
   */
  videoUrl?: string
  shareUrl?: string
  passcode?: string
}
