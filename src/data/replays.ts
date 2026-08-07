import type { Replay } from '../types'
import { SESSIONS } from './sessions'
import { RECAPS } from './recaps'
import { ARTWORK } from './artwork'
import { thumbnailFor } from '../lib/thumbnails'

/**
 * Placeholder replay history.
 *
 * Every occurrence here is generated from the recurring session definitions so
 * the UI has a realistic archive to filter and page through. When Vlad wires up
 * the Zoom Cloud Recording API this module is replaced wholesale — nothing else
 * in the app reads from it directly (see `lib/api.ts`).
 */

/** Newest recording in the generated archive. */
const LATEST = new Date('2026-08-07T00:00:00Z')
/** How far back the placeholder archive reaches. */
const ARCHIVE_DAYS = 120

/** Small deterministic PRNG so the demo data is identical on every load. */
function seeded(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const isoDate = (d: Date) => d.toISOString().slice(0, 10)

function buildReplays(): Replay[] {
  const out: Replay[] = []

  for (const session of SESSIONS) {
    const rand = seeded(session.id)
    // Stagger each session's start so they don't all land on the same day.
    let offset = Math.floor(rand() * session.cadenceDays)

    while (offset < ARCHIVE_DAYS) {
      const date = new Date(LATEST)
      date.setUTCDate(date.getUTCDate() - offset)

      // Sessions run on weekdays.
      const day = date.getUTCDay()
      if (day !== 0 && day !== 6) {
        const durationMin = 40 + Math.floor(rand() * 55)
        const entry = RECAPS[session.id]
        const art = ARTWORK[session.id]

        out.push({
          id: `${session.id}-${isoDate(date)}`,
          sessionId: session.id,
          title: session.title,
          level: session.level,
          coachIds: session.coachIds,
          date: isoDate(date),
          durationMin,
          thumbnailUrl: thumbnailFor(session.id),
          display: art?.display ?? session.title,
          tagline: art?.tagline,
          recap: entry?.recap,
          // Chapter positions are stored as fractions, so they land inside
          // whatever length this particular recording turned out to be.
          chapters: entry?.chapters.map((c) => ({
            at: Math.round(c.at * durationMin * 60),
            label: c.label,
          })),
        })
      }
      offset += session.cadenceDays
    }
  }

  return out.sort((a, b) => b.date.localeCompare(a.date))
}

export const REPLAYS: Replay[] = buildReplays()
