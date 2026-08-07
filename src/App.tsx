import { useEffect, useMemo, useState } from 'react'
import type { Replay } from './types'
import { fetchReplays } from './lib/api'
import { COACHES, coachName } from './data/coaches'
import {
  loadNotes, loadTheme, loadWatched, saveNotes, saveTheme, saveWatched,
  type NotesMap, type Theme,
} from './lib/storage'
import { EMPTY_FILTERS, Filters, type FilterState } from './components/Filters'
import { ReplayCard } from './components/ReplayCard'
import { PlayerView } from './components/PlayerView'
import { NotesDrawer } from './components/NotesDrawer'
import { Moon, NotesIcon, Sun } from './components/Icons'

const monthLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

export default function App() {
  const [replays, setReplays] = useState<Replay[]>([])
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [selected, setSelected] = useState<Replay | null>(null)
  const [watched, setWatched] = useState<Set<string>>(() => loadWatched())
  const [notes, setNotes] = useState<NotesMap>(() => loadNotes())
  const [theme, setTheme] = useState<Theme>(() => loadTheme())
  const [notesOpen, setNotesOpen] = useState(false)

  useEffect(() => { fetchReplays().then(setReplays) }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    saveTheme(theme)
  }, [theme])

  useEffect(() => { saveWatched(watched) }, [watched])
  useEffect(() => { saveNotes(notes) }, [notes])

  const availableDates = useMemo(() => new Set(replays.map((r) => r.date)), [replays])

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()

    return replays.filter((r) => {
      if (filters.coachId && r.coachId !== filters.coachId) return false
      if (filters.type && r.type !== filters.type) return false
      if (filters.levels.length && !filters.levels.includes(r.level)) return false
      if (filters.date && r.date !== filters.date) return false
      if (filters.unwatchedOnly && watched.has(r.id)) return false
      if (q) {
        const haystack = `${r.title} ${coachName(r.coachId)} ${r.type} ${r.level}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [replays, filters, watched])

  // Library is grouped by month so a long archive still reads as a timeline.
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

  const related = useMemo(() => {
    if (!selected) return []
    // A couple of earlier runs of the same session, then other work from the
    // same coach — otherwise the list is five copies of one recurring session.
    const earlier = replays
      .filter((r) => r.sessionId === selected.sessionId && r.id !== selected.id)
      .slice(0, 2)
    const sameCoach = replays.filter(
      (r) => r.coachId === selected.coachId && r.sessionId !== selected.sessionId,
    )
    const seen = new Set<string>()
    const bySession = sameCoach.filter((r) =>
      seen.has(r.sessionId) ? false : (seen.add(r.sessionId), true),
    )
    return [...earlier, ...bySession].slice(0, 5)
  }, [selected, replays])

  const toggleWatched = (id: string) =>
    setWatched((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const setNote = (id: string, value: string) =>
    setNotes((prev) => {
      const next = { ...prev }
      if (value.trim() === '') delete next[id]
      else next[id] = value
      return next
    })

  const open = (replay: Replay) => {
    setSelected(replay)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const watchedCount = useMemo(
    () => replays.filter((r) => watched.has(r.id)).length,
    [replays, watched],
  )

  return (
    <div className="app">
      <header className="header">
        <div className="logo">🐐</div>
        <div>
          <h1>Replay Library</h1>
          <div className="sub">
            {replays.length} replays · {COACHES.length} coaches · {watchedCount} watched
          </div>
        </div>
        <div className="header-spacer" />
        <button className="btn" onClick={() => setNotesOpen(true)}>
          <NotesIcon /> My notes
        </button>
        <button
          className="btn icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
      </header>

      {selected ? (
        <PlayerView
          replay={selected}
          related={related}
          watched={watched.has(selected.id)}
          watchedIds={watched}
          note={notes[selected.id] ?? ''}
          onBack={() => setSelected(null)}
          onToggleWatched={toggleWatched}
          onNoteChange={setNote}
          onOpen={open}
        />
      ) : (
        <>
          <Filters
            filters={filters}
            onChange={setFilters}
            availableDates={availableDates}
            resultCount={filtered.length}
            totalCount={replays.length}
          />

          <main className="main">
            {filtered.length === 0 ? (
              <div className="empty">
                <h3>No replays match those filters</h3>
                <p style={{ margin: 0 }}>Try clearing the date or widening the level selection.</p>
              </div>
            ) : (
              groups.map(([month, items]) => (
                <section key={month}>
                  <div className="group-head">
                    <span>{monthLabel(`${month}-01`)}</span>
                    <span className="rule" />
                    <span>{items.length}</span>
                  </div>
                  <div className="grid">
                    {items.map((r) => (
                      <ReplayCard key={r.id} replay={r} watched={watched.has(r.id)} onOpen={open} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </main>
        </>
      )}

      {notesOpen && (
        <NotesDrawer
          notes={notes}
          replays={replays}
          onClose={() => setNotesOpen(false)}
          onOpen={open}
        />
      )}
    </div>
  )
}
