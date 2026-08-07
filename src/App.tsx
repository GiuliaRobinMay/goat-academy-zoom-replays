import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Replay } from './types'
import { fetchReplays } from './lib/api'
import { coachNames } from './data/coaches'
import {
  loadLeftWidth, loadNotes, loadTheme, loadView, loadWatched,
  saveLeftWidth, saveNotes, saveTheme, saveView, saveWatched,
  type NotesMap, type Theme, type ViewMode,
} from './lib/storage'
import { EMPTY_FILTERS, Filters, type FilterState } from './components/Filters'
import { ReplayCard, ReplayRow } from './components/ReplayCard'
import { PlayerView } from './components/PlayerView'
import { NotesDrawer } from './components/NotesDrawer'
import { GridIcon, ListIcon, Moon, NotesIcon, Sun } from './components/Icons'

const monthLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

const MIN_LEFT = 320
const MAX_LEFT = 900
const DEFAULT_LEFT = 600

export default function App() {
  const [replays, setReplays] = useState<Replay[]>([])
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [selected, setSelected] = useState<Replay | null>(null)
  const [watched, setWatched] = useState<Set<string>>(() => loadWatched())
  const [notes, setNotes] = useState<NotesMap>(() => loadNotes())
  const [theme, setTheme] = useState<Theme>(() => loadTheme())
  const [view, setView] = useState<ViewMode>(() => loadView())
  const [leftWidth, setLeftWidth] = useState<number>(() => loadLeftWidth())
  const [dragging, setDragging] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)

  const splitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Open on the newest replay so the player is never empty on arrival.
    fetchReplays().then((all) => {
      setReplays(all)
      setSelected((current) => current ?? all[0] ?? null)
    })
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    saveTheme(theme)
  }, [theme])

  useEffect(() => { saveWatched(watched) }, [watched])
  useEffect(() => { saveNotes(notes) }, [notes])
  useEffect(() => { saveView(view) }, [view])

  // ── Splitter ───────────────────────────────────────────────────────────
  const startDrag = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    setDragging(true)
    document.body.dataset.resizing = 'true'

    const move = (ev: PointerEvent) => {
      const left = splitRef.current?.getBoundingClientRect().left ?? 0
      setLeftWidth(Math.min(MAX_LEFT, Math.max(MIN_LEFT, ev.clientX - left)))
    }
    const up = () => {
      setDragging(false)
      delete document.body.dataset.resizing
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setLeftWidth((w) => { saveLeftWidth(w); return w })
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }, [])

  const resetWidth = () => { setLeftWidth(DEFAULT_LEFT); saveLeftWidth(DEFAULT_LEFT) }

  // ── Filtering ──────────────────────────────────────────────────────────
  const availableDates = useMemo(() => new Set(replays.map((r) => r.date)), [replays])

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()

    return replays.filter((r) => {
      if (filters.coachId && !r.coachIds.includes(filters.coachId)) return false
      if (filters.sessionId && r.sessionId !== filters.sessionId) return false
      if (filters.levels.length && !filters.levels.includes(r.level)) return false
      if (filters.date && r.date !== filters.date) return false
      if (filters.unwatchedOnly && watched.has(r.id)) return false
      if (q && !`${r.title} ${coachNames(r.coachIds)} ${r.level}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [replays, filters, watched])

  const groups = useMemo(() => {
    const map = new Map<string, Replay[]>()
    for (const r of filtered) {
      const k = r.date.slice(0, 7)
      const bucket = map.get(k)
      if (bucket) bucket.push(r)
      else map.set(k, [r])
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  // ── State updates ──────────────────────────────────────────────────────
  const markWatched = useCallback((id: string) => {
    setWatched((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }, [])

  const setNote = (id: string, value: string) =>
    setNotes((prev) => {
      const next = { ...prev }
      if (value.trim() === '') delete next[id]
      else next[id] = value
      return next
    })

  return (
    <div className="app">
      <header className="banner">
        <div className="logo">🐐</div>
        <div className="banner-text">
          <h1>Replay Library</h1>
          <p>GOAT Academy · every live session, on demand</p>
        </div>
        <div className="header-spacer" />
        <button className="btn glass" onClick={() => setNotesOpen(true)}>
          <NotesIcon /> My notes
        </button>
        <button
          className="btn glass icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
      </header>

      <Filters filters={filters} onChange={setFilters} availableDates={availableDates} />

      <div className="split" ref={splitRef}>
        <div className="pane pane-left" style={{ width: leftWidth }}>
          <div className="list-bar">
            <span><strong>{filtered.length}</strong> {filtered.length === 1 ? 'replay' : 'replays'}</span>
            <div className="seg">
              <button data-on={view === 'grid'} onClick={() => setView('grid')} aria-label="Gallery view" title="Gallery view">
                <GridIcon size={17} />
              </button>
              <button data-on={view === 'list'} onClick={() => setView('list')} aria-label="List view" title="List view">
                <ListIcon size={17} />
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">
              <h3>No replays match</h3>
              <p>Try clearing the date or widening the level selection.</p>
            </div>
          ) : (
            groups.map(([month, items]) => (
              <section key={month}>
                <div className="group-head">
                  <span>{monthLabel(`${month}-01`)}</span>
                  <span className="rule" />
                  <span>{items.length}</span>
                </div>
                {view === 'grid' ? (
                  <div className="grid">
                    {items.map((r) => (
                      <ReplayCard
                        key={r.id}
                        replay={r}
                        watched={watched.has(r.id)}
                        active={selected?.id === r.id}
                        onOpen={setSelected}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rows">
                    {items.map((r) => (
                      <ReplayRow
                        key={r.id}
                        replay={r}
                        watched={watched.has(r.id)}
                        active={selected?.id === r.id}
                        onOpen={setSelected}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))
          )}
        </div>

        <div
          className="splitter"
          data-drag={dragging}
          onPointerDown={startDrag}
          onDoubleClick={resetWidth}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize the replay list"
          title="Drag to resize · double-click to reset"
        />

        <div className="pane pane-right">
          {selected ? (
            <PlayerView
              replay={selected}
              watched={watched.has(selected.id)}
              note={notes[selected.id] ?? ''}
              onWatched={markWatched}
              onNoteChange={setNote}
            />
          ) : (
            <div className="empty">
              <h3>Pick a replay</h3>
              <p>Choose any session from the list to start watching.</p>
            </div>
          )}
        </div>
      </div>

      {notesOpen && (
        <NotesDrawer
          notes={notes}
          replays={replays}
          onClose={() => setNotesOpen(false)}
          onOpen={setSelected}
        />
      )}
    </div>
  )
}
