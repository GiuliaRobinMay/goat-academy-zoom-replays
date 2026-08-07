import { useEffect, useRef, useState } from 'react'
import type { Replay } from '../types'
import { coachNames } from '../data/coaches'
import { GeneratedThumbnail, LEVEL_LABEL } from '../lib/thumbnail'
import { NotesEditor } from './NotesEditor'
import { Check, External, Maximize, Minimize, Play } from './Icons'
import { formatDate, formatDuration } from './ReplayCard'

interface Props {
  replay: Replay
  watched: boolean
  note: string
  onWatched: (id: string) => void
  onNoteChange: (id: string, value: string) => void
}

/** Treat a replay as watched once most of it has played. */
const WATCHED_AT = 0.9

/** mm:ss, or h:mm:ss once past the hour. */
const stamp = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`
}

export function PlayerView({ replay, watched, note, onWatched, onNoteChange }: Props) {
  const coaches = coachNames(replay.coachIds)
  const [maximised, setMaximised] = useState(false)
  const [activeChapter, setActiveChapter] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Selecting a chapter jumps the recording; with no video attached yet it
  // just marks the row so the interaction is still visible.
  const seekTo = (seconds: number, index: number) => {
    setActiveChapter(index)
    const el = videoRef.current
    if (el) {
      el.currentTime = seconds
      void el.play().catch(() => {})
    }
  }

  useEffect(() => setActiveChapter(null), [replay.id])

  useEffect(() => {
    if (!maximised) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMaximised(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [maximised])

  const trackProgress = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (watched) return
    const el = e.currentTarget
    if (el.duration && el.currentTime / el.duration >= WATCHED_AT) onWatched(replay.id)
  }

  return (
    <div className="player-col">
      <div className="stage-shell" data-max={maximised}>
        <button
          className="stage-btn"
          onClick={() => setMaximised((m) => !m)}
          title={maximised ? 'Exit full view (Esc)' : 'Full view'}
        >
          {maximised ? <Minimize size={15} /> : <Maximize size={15} />}
          {maximised ? 'Exit full view' : 'Full view'}
        </button>

        <div className="stage">
          {replay.videoUrl ? (
            // Once the backend proxy is live this is the real MP4 stream.
            // Watching most of it is what marks the replay as watched.
            <video
              ref={videoRef}
              src={replay.videoUrl}
              controls
              playsInline
              onTimeUpdate={trackProgress}
              onEnded={() => onWatched(replay.id)}
            />
          ) : (
            <>
              <div className="placeholder">
                <GeneratedThumbnail id={replay.id} title={replay.title} level={replay.level} />
              </div>
              <div className="overlay">
                <div>
                  <div className="big"><Play size={24} /></div>
                  <p>
                    The recording streams here once the Zoom connection is live. The player
                    and notes around it are already wired up.
                  </p>
                  <p className="note">Placeholder preview · no video attached yet</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="panel panel-pad">
        <div className="player-eyebrow">{LEVEL_LABEL[replay.level]} · {formatDate(replay.date)}</div>
        <h2 className="player-title">{replay.title}</h2>

        <div className="card-meta" style={{ marginTop: 10, fontSize: 13 }}>
          <span className="tag" data-level={replay.level}>{LEVEL_LABEL[replay.level]}</span>
          <span>{coaches}</span>
          <span className="sep">·</span>
          <span>{formatDuration(replay.durationMin)}</span>
          {watched && <span className="watched-chip"><Check size={14} /> Watched</span>}
        </div>

        {replay.shareUrl && (
          <div className="zoom-fallback">
            <span>Prefer to watch on Zoom?</span>
            <a className="btn" href={replay.shareUrl} target="_blank" rel="noreferrer">
              <External size={14} /> Open in Zoom
            </a>
            {replay.passcode && <span>Passcode <code>{replay.passcode}</code></span>}
          </div>
        )}
      </div>

      {(replay.recap || replay.chapters?.length) && (
        <div className="panel panel-pad">
          {replay.recap && (
            <>
              <h3 className="section-label">Recap</h3>
              <p className="recap">{replay.recap}</p>
            </>
          )}

          {replay.chapters && replay.chapters.length > 0 && (
            <>
              <h3 className="section-label" style={{ marginTop: replay.recap ? 20 : 0 }}>
                In this session
              </h3>
              <ol className="chapters">
                {replay.chapters.map((chapter, i) => (
                  <li key={chapter.at}>
                    <button
                      className="chapter"
                      data-on={activeChapter === i}
                      onClick={() => seekTo(chapter.at, i)}
                      title={`Jump to ${stamp(chapter.at)}`}
                    >
                      <span className="chapter-at">{stamp(chapter.at)}</span>
                      <span className="chapter-label">{chapter.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}

      <div className="panel">
        <NotesEditor value={note} onChange={(v) => onNoteChange(replay.id, v)} />
      </div>
    </div>
  )
}
