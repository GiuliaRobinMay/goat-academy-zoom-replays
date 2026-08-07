import { useEffect, useState } from 'react'
import type { Replay } from '../types'
import { coachName } from '../data/coaches'
import { GeneratedThumbnail, LEVEL_LABEL } from '../lib/thumbnail'
import { NotesEditor } from './NotesEditor'
import { Check, External, Maximize, Minimize, Play } from './Icons'
import { formatDate, formatDuration } from './ReplayCard'

interface Props {
  replay: Replay
  watched: boolean
  note: string
  onToggleWatched: (id: string) => void
  onNoteChange: (id: string, value: string) => void
}

export function PlayerView({ replay, watched, note, onToggleWatched, onNoteChange }: Props) {
  const coach = coachName(replay.coachId)
  const [maximised, setMaximised] = useState(false)

  useEffect(() => {
    if (!maximised) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMaximised(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [maximised])

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
            <video src={replay.videoUrl} controls playsInline />
          ) : (
            <>
              <div className="placeholder">
                <GeneratedThumbnail id={replay.id} title={replay.title} level={replay.level} coach={coach} />
              </div>
              <div className="overlay">
                <div>
                  <div className="big"><Play size={24} /></div>
                  <p>
                    The recording streams here once the Zoom connection is live. The player,
                    progress tracking and notes around it are already wired up.
                  </p>
                  <p className="note">Placeholder preview · no video attached yet</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="panel panel-pad">
        <div className="player-eyebrow">
          {replay.type} · {LEVEL_LABEL[replay.level]} · {formatDate(replay.date)}
        </div>
        <h2 className="player-title">{replay.title}</h2>

        <div className="card-meta" style={{ marginTop: 10, fontSize: 13 }}>
          <span className="tag" data-level={replay.level}>{LEVEL_LABEL[replay.level]}</span>
          <span>{coach}</span>
          <span className="sep">·</span>
          <span>{formatDuration(replay.durationMin)}</span>
        </div>

        <div className="player-actions">
          {watched ? (
            <>
              <span className="watched-chip"><Check size={16} /> Watched</span>
              <button className="btn ghost" onClick={() => onToggleWatched(replay.id)}>Mark as unwatched</button>
            </>
          ) : (
            <button className="btn primary" onClick={() => onToggleWatched(replay.id)}>
              <Check size={16} /> Mark as watched
            </button>
          )}
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

      <div className="panel">
        <NotesEditor value={note} onChange={(v) => onNoteChange(replay.id, v)} />
      </div>
    </div>
  )
}
