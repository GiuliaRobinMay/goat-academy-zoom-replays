import type { Replay } from '../types'
import { coachNames } from '../data/coaches'
import { GeneratedThumbnail, LEVEL_LABEL } from '../lib/thumbnail'
import { Check } from './Icons'

/**
 * US order, weekday first, no year — the library only holds a rolling window
 * of recent recordings, so the year never disambiguates anything.
 * e.g. Wednesday 26 November -> "WED 11/26".
 */
export const formatDateBadge = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`)
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  return `${weekday} ${d.getMonth() + 1}/${d.getDate()}`
}

/** Same date, sentence-cased for running text. */
export const formatDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`)
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' })
  return `${weekday} ${d.getMonth() + 1}/${d.getDate()}`
}

export const formatDuration = (min: number) =>
  min >= 60 ? `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}:00` : `${min}:00`

interface Props {
  replay: Replay
  watched: boolean
  active: boolean
  onOpen: (replay: Replay) => void
}

/**
 * Gallery view — the card is the artwork, nothing else. Date sits top left,
 * title and coach are set into the art, and the gradient colour carries the
 * level.
 */
export function ReplayCard({ replay, watched, active, onOpen }: Props) {
  return (
    <button className="card" data-level={replay.level} data-active={active} onClick={() => onOpen(replay)}>
      <div className="thumb">
        {replay.thumbnailUrl ? (
          <img src={replay.thumbnailUrl} alt={replay.title} loading="lazy" />
        ) : (
          <GeneratedThumbnail
            id={replay.id}
            title={replay.title}
            level={replay.level}
            display={replay.display ?? replay.title}
            tagline={replay.tagline}
            coach={coachNames(replay.coachIds)}
          />
        )}
        {watched && <span className="badge-watched" title="Watched"><Check size={13} /></span>}

        {/* The artwork carries the title, tagline and coaches, so only the
            date rides on top of it. */}
        <div className="card-stack">
          <span className="badge-date">{formatDateBadge(replay.date)}</span>
        </div>
      </div>
    </button>
  )
}

/** List view — the thumbnail is too small to read, so the row keeps the text. */
export function ReplayRow({ replay, watched, active, onOpen }: Props) {
  return (
    <button className="row" data-active={active} onClick={() => onOpen(replay)}>
      <div className="row-thumb">
        {replay.thumbnailUrl ? (
          <img src={replay.thumbnailUrl} alt={replay.title} loading="lazy" />
        ) : (
          <GeneratedThumbnail
            id={replay.id}
            title={replay.title}
            level={replay.level}
            display={replay.display ?? replay.title}
            tagline={replay.tagline}
            coach={coachNames(replay.coachIds)}
          />
        )}
        {watched && (
          <span className="badge-watched" style={{ width: 19, height: 19, right: 5, top: 5 }} title="Watched">
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
