import type { Replay } from '../types'
import type { NotesMap } from '../lib/storage'
import { coachNames } from '../data/coaches'
import { formatDate } from './ReplayCard'
import { X } from './Icons'

interface Props {
  notes: NotesMap
  replays: Replay[]
  onClose: () => void
  onOpen: (replay: Replay) => void
}

/** Every note the member has written, newest replay first. */
export function NotesDrawer({ notes, replays, onClose, onOpen }: Props) {
  const withNotes = replays.filter((r) => (notes[r.id] ?? '').trim().length > 0)

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="My notes">
        <header>
          <h2>My notes {withNotes.length > 0 && <span style={{ color: 'var(--muted)', fontWeight: 500 }}>· {withNotes.length}</span>}</h2>
          <button className="btn icon ghost" onClick={onClose} aria-label="Close notes"><X /></button>
        </header>

        <div className="body">
          {withNotes.length === 0 ? (
            <div className="empty" style={{ padding: '46px 18px' }}>
              <h3>No notes yet</h3>
              <p style={{ margin: 0, fontSize: 13.5 }}>
                Open any replay and start typing — your notes save automatically and show up here.
              </p>
            </div>
          ) : (
            withNotes.map((r) => (
              <button key={r.id} className="note-card" onClick={() => { onOpen(r); onClose() }}>
                <div className="t">{r.title}</div>
                <div className="m">{coachNames(r.coachIds)} · {formatDate(r.date)}</div>
                <div className="x">{notes[r.id]}</div>
              </button>
            ))
          )}
        </div>
      </aside>
    </>
  )
}
