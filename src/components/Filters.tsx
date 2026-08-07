import type { Level, SessionType } from '../types'
import { COACHES } from '../data/coaches'
import { SESSION_TYPES } from '../data/sessions'
import { LEVEL_LABEL } from '../lib/thumbnail'
import { CalendarPicker } from './CalendarPicker'
import { Search } from './Icons'

export interface FilterState {
  query: string
  coachId: string
  type: string
  levels: Level[]
  date: string | null
  unwatchedOnly: boolean
}

export const EMPTY_FILTERS: FilterState = {
  query: '',
  coachId: '',
  type: '',
  levels: [],
  date: null,
  unwatchedOnly: false,
}

const LEVELS: Level[] = ['beginner', 'intermediate', 'advanced', 'all']

interface Props {
  filters: FilterState
  onChange: (next: FilterState) => void
  availableDates: Set<string>
  resultCount: number
  totalCount: number
}

export function Filters({ filters, onChange, availableDates, resultCount, totalCount }: Props) {
  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) => onChange({ ...filters, [k]: v })

  const toggleLevel = (level: Level) =>
    set('levels', filters.levels.includes(level)
      ? filters.levels.filter((l) => l !== level)
      : [...filters.levels, level])

  const dirty =
    filters.query !== '' || filters.coachId !== '' || filters.type !== '' ||
    filters.levels.length > 0 || filters.date !== null || filters.unwatchedOnly

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
        {COACHES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <select
        className="control"
        value={filters.type}
        onChange={(e) => set('type', e.target.value)}
        aria-label="Filter by session type"
      >
        <option value="">All session types</option>
        {SESSION_TYPES.map((t: SessionType) => <option key={t} value={t}>{t}</option>)}
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

      {dirty && (
        <button className="link-btn" onClick={() => onChange(EMPTY_FILTERS)}>
          Clear all ({resultCount}/{totalCount})
        </button>
      )}
    </div>
  )
}
