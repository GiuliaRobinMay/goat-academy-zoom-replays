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
  onOpen: (replay: Replay) => void
}

export function ReplayCard({ replay, watched, onOpen }: Props) {
  const coach = coachName(replay.coachId)

  return (
    <button className="card" onClick={() => onOpen(replay)}>
      <div className="thumb">
        <GeneratedThumbnail id={replay.id} title={replay.title} level={replay.level} coach={coach} />
        <span className="play"><Play size={22} /></span>
        <span className="badge-time">{formatDuration(replay.durationMin)}</span>
        {watched && (
          <span className="badge-watched" title="You've watched this">
            <Check size={15} />
          </span>
        )}
      </div>

      <div className="card-body">
        <div className="card-title">{replay.title}</div>
        <div className="card-meta">
          <span className="tag" data-level={replay.level}>{LEVEL_LABEL[replay.level]}</span>
          <span>{coach}</span>
          <span className="sep">·</span>
          <span>{formatDate(replay.date)}</span>
        </div>
      </div>
    </button>
  )
}
