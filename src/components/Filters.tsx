import type { Level } from '../types'
import { getCoaches, sessionsByLevel } from '../lib/catalogue'
import { LEVEL_LABEL } from '../lib/thumbnail'
import { CalendarPicker } from './CalendarPicker'
import { Search } from './Icons'

export interface FilterState {
  query: string
  coachId: string
  /** A specific session from the Academy's session list, or '' for all. */
  sessionId: string
  levels: Level[]
  date: string | null
  unwatchedOnly: boolean
}

export const EMPTY_FILTERS: FilterState = {
  query: '',
  coachId: '',
  sessionId: '',
  levels: [],
  date: null,
  unwatchedOnly: false,
}

const LEVELS: Level[] = ['beginner', 'intermediate', 'advanced', 'all']

interface Props {
  filters: FilterState
  onChange: (next: FilterState) => void
  availableDates: Set<string>
}

export function Filters({ filters, onChange, availableDates }: Props) {
  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) => onChange({ ...filters, [k]: v })

  const toggleLevel = (level: Level) =>
    set('levels', filters.levels.includes(level)
      ? filters.levels.filter((l) => l !== level)
      : [...filters.levels, level])

  return (
    <div className="filters">
      <div className="search">
        <span className="icon"><Search /></span>
        <input
          value={filters.query}
          onChange={(e) => set('query', e.target.value)}
          placeholder="Search replays, coaches, topics…"
          aria-label="Search replays"
        />
      </div>

      <select
        className="control"
        value={filters.coachId}
        onChange={(e) => set('coachId', e.target.value)}
        aria-label="Filter by coach"
      >
        <option value="">All coaches</option>
        {getCoaches().map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <select
        className="control wide"
        value={filters.sessionId}
        onChange={(e) => set('sessionId', e.target.value)}
        aria-label="Filter by session"
      >
        <option value="">All sessions</option>
        {sessionsByLevel().map((group) => (
          <optgroup key={group.level} label={group.label}>
            {group.sessions.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </optgroup>
        ))}
      </select>

      <CalendarPicker value={filters.date} onChange={(d) => set('date', d)} available={availableDates} />

      <div className="pills">
        {LEVELS.map((level) => (
          <button
            key={level}
            className="pill"
            data-level={level}
            data-on={filters.levels.includes(level)}
            onClick={() => toggleLevel(level)}
            aria-pressed={filters.levels.includes(level)}
          >
            <span className="dot" />
            {LEVEL_LABEL[level]}
          </button>
        ))}
        <button
          className="pill"
          data-on={filters.unwatchedOnly}
          onClick={() => set('unwatchedOnly', !filters.unwatchedOnly)}
          aria-pressed={filters.unwatchedOnly}
        >
          Unwatched only
        </button>
      </div>
    </div>
  )
}
