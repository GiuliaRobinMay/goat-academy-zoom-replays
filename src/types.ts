export type Level = 'beginner' | 'intermediate' | 'advanced' | 'all'

export interface Coach {
  id: string
  name: string
  /** Levels this coach teaches. `all` means every level. */
  levels: Level[]
}

/** A recurring session, e.g. "The Weekly Round-Up". These are the Academy's
 *  actual session list — the filter dropdown is built straight from them. */
export interface Session {
  id: string
  title: string
  level: Level
  /** Some sessions are co-hosted, so this is always a list. */
  coachIds: string[]
  /** Roughly how often it runs — drives the generated replay history. */
  cadenceDays: number
  /** Short headline for the cover art, e.g. "Broker TOS". */
  display?: string
  /** One-line description under the headline. */
  tagline?: string
  /** Short summary of what the session covers. */
  recap?: string
}

/** A jump point inside a recording. */
export interface Chapter {
  /** Seconds from the start of the recording. */
  at: number
  label: string
}

/** One actual recorded occurrence of a session — this is what a card represents. */
export interface Replay {
  id: string
  sessionId: string
  title: string
  level: Level
  coachIds: string[]
  /** ISO date (yyyy-mm-dd) the session was recorded. */
  date: string
  durationMin: number
  /** Cover art. Falls back to generated artwork when absent. */
  thumbnailUrl?: string
  /** Short headline used on the cover art. */
  display?: string
  /** One-line description under the headline on the cover art. */
  tagline?: string
  /** Short summary of what the session covered. */
  recap?: string
  /** Jump points, in order. */
  chapters?: Chapter[]
  /**
   * Populated by the backend once Zoom is connected.
   * `videoUrl` streams through our own proxy; `shareUrl`/`passcode` are the
   * fallback when a recording has no downloadable file.
   */
  videoUrl?: string
  shareUrl?: string
  passcode?: string
}
