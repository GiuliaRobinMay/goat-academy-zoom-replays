import type { Replay } from '../types'
import { coachName } from '../data/coaches'
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

/** Grid view — cover art with the title beneath, like a video library. */
export function ReplayCard({ replay, watched, active, onOpen }: Props) {
  const coach = coachName(replay.coachId)

  return (
    <button className="card" data-active={active} onClick={() => onOpen(replay)}>
      <div className="thumb">
        <GeneratedThumbnail id={replay.id} title={replay.title} level={replay.level} coach={coach} />
        <span className="play"><Play size={18} /></span>
        <span className="badge-time">{formatDuration(replay.durationMin)}</span>
        {watched && <span className="badge-watched" title="Watched"><Check size={13} /></span>}
      </div>

      <div className="card-body">
        <div className="card-title">{replay.title}</div>
        <div className="card-meta">
          <span className="tag" data-level={replay.level}>{LEVEL_LABEL[replay.level]}</span>
          <span className="who">
            {coach} <span className="sep">·</span> {formatDate(replay.date)}
          </span>
        </div>
      </div>
    </button>
  )
}

/** List view — the same replay as a compact row. */
export function ReplayRow({ replay, watched, active, onOpen }: Props) {
  const coach = coachName(replay.coachId)

  return (
    <button className="row" data-active={active} onClick={() => onOpen(replay)}>
      <div className="row-thumb">
        <GeneratedThumbnail id={replay.id} title={replay.title} level={replay.level} coach={coach} />
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
          <span>{coach}</span>
          <span className="sep">·</span>
          <span>{formatDate(replay.date)}</span>
        </div>
      </div>
    </button>
  )
}
