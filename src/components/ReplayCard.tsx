import type { Replay } from '../types'
import { coachNames } from '../data/coaches'
import { GeneratedThumbnail, LEVEL_LABEL } from '../lib/thumbnail'
import { Check, Play } from './Icons'

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

export const formatDuration = (min: number) =>
  min >= 60 ? `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}:00` : `${min}:00`

interface Props {
  replay: Replay
  watched: boolean
  active: boolean
  onOpen: (replay: Replay) => void
}

/**
 * Gallery view. The cover art already carries the session title, so the panel
 * beneath it names the coaches, the date, and the level instead of repeating it.
 */
export function ReplayCard({ replay, watched, active, onOpen }: Props) {
  return (
    <button className="card" data-active={active} onClick={() => onOpen(replay)}>
      <div className="thumb">
        <GeneratedThumbnail id={replay.id} title={replay.title} level={replay.level} />
        <span className="play"><Play size={18} /></span>
        <span className="badge-time">{formatDuration(replay.durationMin)}</span>
        {watched && <span className="badge-watched" title="Watched"><Check size={13} /></span>}
      </div>

      <div className="card-body">
        <div className="card-coach">{coachNames(replay.coachIds)}</div>
        <div className="card-date">{formatDate(replay.date)}</div>
        <span className="tag" data-level={replay.level}>{LEVEL_LABEL[replay.level]}</span>
      </div>
    </button>
  )
}

/** List view — the thumbnail is too small to read, so the row keeps the title. */
export function ReplayRow({ replay, watched, active, onOpen }: Props) {
  return (
    <button className="row" data-active={active} onClick={() => onOpen(replay)}>
      <div className="row-thumb">
        <GeneratedThumbnail id={replay.id} title={replay.title} level={replay.level} />
        <span className="badge-time">{formatDuration(replay.durationMin)}</span>
        {watched && (
          <span className="badge-watched" style={{ width: 19, height: 19, left: 5, top: 5 }} title="Watched">
            <Check size={11} />
          </span>
        )}
      </div>
      <div>
        <div className="t">{replay.title}</div>
        <div className="m">
          <span className="tag" data-level={replay.level}>{LEVEL_LABEL[replay.level]}</span>
          <span>{coachNames(replay.coachIds)}</span>
          <span className="sep">·</span>
          <span>{formatDate(replay.date)}</span>
        </div>
      </div>
    </button>
  )
}
