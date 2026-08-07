import type { Replay } from '../types'
import { coachName } from '../data/coaches'
import { GeneratedThumbnail, LEVEL_LABEL } from '../lib/thumbnail'
import { NotesEditor } from './NotesEditor'
import { Check, ChevronLeft, External, Play } from './Icons'
import { formatDate, formatDuration } from './ReplayCard'

interface Props {
  replay: Replay
  related: Replay[]
  watched: boolean
  watchedIds: Set<string>
  note: string
  onBack: () => void
  onToggleWatched: (id: string) => void
  onNoteChange: (id: string, value: string) => void
  onOpen: (replay: Replay) => void
}

export function PlayerView({
  replay, related, watched, watchedIds, note,
  onBack, onToggleWatched, onNoteChange, onOpen,
}: Props) {
  const coach = coachName(replay.coachId)

  return (
    <div className="player-wrap">
      <div>
        <button className="back-link" onClick={onBack}>
          <ChevronLeft size={15} /> Back to all replays
        </button>

        <div className="panel">
          <div className="stage">
            {replay.videoUrl ? (
              // Once the backend proxy is live this is the real MP4 stream.
              <video src={replay.videoUrl} controls playsInline poster={undefined} />
            ) : (
              <>
                <div className="placeholder">
                  <GeneratedThumbnail id={replay.id} title={replay.title} level={replay.level} coach={coach} />
                </div>
                <div className="overlay">
                  <div>
                    <div className="big"><Play size={26} /></div>
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

          <div className="panel-pad player-meta">
            <div className="player-eyebrow">
              {replay.type} · {LEVEL_LABEL[replay.level]} · {formatDate(replay.date)}
            </div>
            <h2 className="player-title">{replay.title}</h2>

            <div className="card-meta">
              <span className="tag" data-level={replay.level}>{LEVEL_LABEL[replay.level]}</span>
              <span>{coach}</span>
              <span className="sep">·</span>
              <span>{formatDuration(replay.durationMin)}</span>
            </div>

            <div className="player-actions">
              {watched ? (
                <>
                  <span className="watched-chip"><Check size={16} /> Watched</span>
                  <button className="btn ghost" onClick={() => onToggleWatched(replay.id)}>
                    Mark as unwatched
                  </button>
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
        </div>
      </div>

      <div>
        <NotesEditor value={note} onChange={(v) => onNoteChange(replay.id, v)} />

        {related.length > 0 && (
          <div className="panel panel-pad" style={{ marginTop: 20 }}>
            <h3 className="up-next-title">More like this</h3>
            <div className="up-next">
              {related.map((r) => (
                <button key={r.id} className="mini" onClick={() => onOpen(r)}>
                  <div className="mini-thumb">
                    <GeneratedThumbnail id={r.id} title={r.title} level={r.level} coach={coachName(r.coachId)} />
                    {watchedIds.has(r.id) && (
                      <span className="badge-watched" style={{ width: 20, height: 20, left: 5, top: 5 }}>
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="t">{r.title}</div>
                    <div className="m">{coachName(r.coachId)} · {formatDate(r.date)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
