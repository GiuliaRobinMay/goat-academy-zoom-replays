/**
 * Local persistence for per-member state: which replays have been watched, the
 * notes they've written, and their theme choice.
 *
 * Deliberately isolated behind this module — when accounts arrive, swap the
 * localStorage calls for API calls and nothing in the UI changes.
 */

const KEY = {
  watched: 'goat.replays.watched',
  notes: 'goat.replays.notes',
  theme: 'goat.replays.theme',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) — state stays in memory for the session */
  }
}

export const loadWatched = () => new Set(read<string[]>(KEY.watched, []))
export const saveWatched = (watched: Set<string>) => write(KEY.watched, [...watched])

export type NotesMap = Record<string, string>
export const loadNotes = () => read<NotesMap>(KEY.notes, {})
export const saveNotes = (notes: NotesMap) => write(KEY.notes, notes)

export type Theme = 'dark' | 'light'
export const loadTheme = (): Theme => read<Theme>(KEY.theme, 'dark')
export const saveTheme = (theme: Theme) => write(KEY.theme, theme)
