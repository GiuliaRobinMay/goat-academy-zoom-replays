import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarIcon, ChevronLeft, ChevronRight } from './Icons'

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

interface Props {
  /** Selected day as yyyy-mm-dd, or null for "any date". */
  value: string | null
  onChange: (value: string | null) => void
  /** Days that actually have replays — dotted in the grid. */
  available: Set<string>
}

const pad = (n: number) => String(n).padStart(2, '0')
const key = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

export function CalendarPicker({ value, onChange, available }: Props) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Open on the selected month, else the most recent month that has replays.
  const initial = useMemo(() => {
    const ref = value ?? [...available].sort().pop()
    if (!ref) return new Date()
    const [y, m] = ref.split('-').map(Number)
    return new Date(y, m - 1, 1)
  }, [value, available])

  const [cursor, setCursor] = useState(initial)
  useEffect(() => setCursor(initial), [initial])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Monday-first offset.
  const lead = (new Date(year, month, 1).getDay() + 6) % 7

  const label = value
    ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Any date'

  const shift = (delta: number) => setCursor(new Date(year, month + delta, 1))

  return (
    <div className="cal-wrap" ref={wrapRef}>
      <button className="btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <CalendarIcon />
        {label}
      </button>

      {open && (
        <div className="cal-pop" role="dialog" aria-label="Filter by date">
          <div className="cal-head">
            <button className="cal-nav" onClick={() => shift(-1)} aria-label="Previous month"><ChevronLeft size={14} /></button>
            <span className="month">{MONTHS[month]} {year}</span>
            <button className="cal-nav" onClick={() => shift(1)} aria-label="Next month"><ChevronRight size={14} /></button>
          </div>

          <div className="cal-grid">
            {DOW.map((d, i) => <div className="cal-dow" key={i}>{d}</div>)}
            {Array.from({ length: lead }, (_, i) => <div key={`lead-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const k = key(year, month, day)
              const has = available.has(k)
              return (
                <button
                  key={k}
                  className="cal-day"
                  data-has={has}
                  data-sel={value === k}
                  disabled={!has}
                  title={has ? 'Replays on this day' : 'No replays'}
                  onClick={() => { onChange(value === k ? null : k); setOpen(false) }}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <div className="cal-foot">
            <button className="link-btn" onClick={() => { onChange(null); setOpen(false) }}>Clear date</button>
            <span style={{ fontSize: 12, color: 'var(--faint)' }}>Dotted days have replays</span>
          </div>
        </div>
      )}
    </div>
  )
}
