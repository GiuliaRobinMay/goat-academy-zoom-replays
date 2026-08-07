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
  view: 'goat.replays.view',
  leftWidth: 'goat.replays.leftWidth',
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
export const loadTheme = (): Theme => read<Theme>(KEY.theme, 'light')
export const saveTheme = (theme: Theme) => write(KEY.theme, theme)

export type ViewMode = 'grid' | 'list'
export const loadView = () => read<ViewMode>(KEY.view, 'grid')
export const saveView = (view: ViewMode) => write(KEY.view, view)

/** Width of the replay list column, in px. */
export const loadLeftWidth = () => read<number>(KEY.leftWidth, 420)
export const saveLeftWidth = (px: number) => write(KEY.leftWidth, px)
