import type { Coach, Level, Session } from '../types'
import { DEFAULT_COACHES } from '../data/coaches'
import { DEFAULT_SESSIONS } from '../data/sessions'
import { ARTWORK } from '../data/artwork'
import { RECAPS } from '../data/recaps'

/**
 * The live catalogue of coaches and lessons.
 *
 * Everything in the app reads coaches and sessions from here rather than from
 * the bundled data files, so the admin zone can change them without a code
 * change or a redeploy.
 *
 * Resolution order is: saved overrides, else the bundled defaults. Overrides
 * currently live in localStorage; when there is a backend, replace `read` and
 * `persist` below with API calls and nothing else has to change.
 */

const KEY = 'goat.replays.catalogue.v1'

export interface Catalogue {
  coaches: Coach[]
  sessions: Session[]
}

/** Bundled defaults, with the artwork copy and recap folded onto each session
 *  so the admin zone can edit them as ordinary fields. */
export function defaultCatalogue(): Catalogue {
  return {
    coaches: DEFAULT_COACHES.map((c) => ({ ...c, levels: [...c.levels] })),
    sessions: DEFAULT_SESSIONS.map((s) => ({
      ...s,
      coachIds: [...s.coachIds],
      display: ARTWORK[s.id]?.display,
      tagline: ARTWORK[s.id]?.tagline,
      recap: RECAPS[s.id]?.recap,
    })),
  }
}

function read(): Catalogue {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultCatalogue()
    const parsed = JSON.parse(raw) as Partial<Catalogue>
    if (!Array.isArray(parsed.coaches) || !Array.isArray(parsed.sessions)) {
      return defaultCatalogue()
    }
    return { coaches: parsed.coaches, sessions: parsed.sessions }
  } catch {
    return defaultCatalogue()
  }
}

function persist(catalogue: Catalogue) {
  try {
    localStorage.setItem(KEY, JSON.stringify(catalogue))
  } catch {
    /* storage unavailable — the change still applies for this session */
  }
}

let current: Catalogue = read()

// ── Change notification ────────────────────────────────────────────────────
type Listener = () => void
const listeners = new Set<Listener>()

export function onCatalogueChange(fn: Listener) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const getCoaches = () => current.coaches
export const getSessions = () => current.sessions
export const isCustomised = () => localStorage.getItem(KEY) !== null

export function saveCatalogue(next: Catalogue) {
  current = next
  persist(next)
  listeners.forEach((fn) => fn())
}

export function resetCatalogue() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  current = defaultCatalogue()
  listeners.forEach((fn) => fn())
}

export const exportCatalogue = () => JSON.stringify(current, null, 2)

/** Returns an error message, or null when the import succeeded. */
export function importCatalogue(json: string): string | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return 'That is not valid JSON.'
  }
  const c = parsed as Partial<Catalogue>
  if (!Array.isArray(c.coaches) || !Array.isArray(c.sessions)) {
    return 'The file needs a "coaches" list and a "sessions" list.'
  }
  if (c.sessions.some((s) => !s.id || !s.title)) {
    return 'Every lesson needs an id and a title.'
  }
  if (c.coaches.some((p) => !p.id || !p.name)) {
    return 'Every coach needs an id and a name.'
  }
  saveCatalogue({ coaches: c.coaches, sessions: c.sessions })
  return null
}

// ── Lookups used across the UI ─────────────────────────────────────────────

export const coachById = (id: string) => current.coaches.find((c) => c.id === id)
export const coachName = (id: string) => coachById(id)?.name ?? 'GOAT Academy'

/** "Byung Kim, Brett & Patrick" — for co-hosted sessions. */
export const coachNames = (ids: string[]) => {
  const names = ids.map(coachName)
  if (names.length <= 1) return names[0] ?? 'GOAT Academy'
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
}

export const sessionById = (id: string) => current.sessions.find((s) => s.id === id)

const LEVEL_ORDER: { level: Level; label: string }[] = [
  { level: 'all', label: 'All levels' },
  { level: 'beginner', label: 'Beginner' },
  { level: 'intermediate', label: 'Intermediate' },
  { level: 'advanced', label: 'Advanced' },
]

/** Sessions grouped by level, in the order the filter dropdown lists them. */
export const sessionsByLevel = () =>
  LEVEL_ORDER.map((g) => ({
    ...g,
    sessions: current.sessions.filter((s) => s.level === g.level),
  })).filter((g) => g.sessions.length > 0)

/** Turns a name into a stable id for a newly added coach or lesson. */
export function slugify(input: string, taken: string[]): string {
  const base =
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'item'
  if (!taken.includes(base)) return base
  let n = 2
  while (taken.includes(`${base}-${n}`)) n++
  return `${base}-${n}`
}
