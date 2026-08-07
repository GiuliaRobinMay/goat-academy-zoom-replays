import { useEffect, useRef, useState } from 'react'
import { Pencil } from './Icons'

interface Props {
  value: string
  onChange: (value: string) => void
}

/** Per-replay notes with debounced autosave, mirroring the course app. */
export function NotesEditor({ value, onChange }: Props) {
  const [draft, setDraft] = useState(value)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const timer = useRef<number>()
  // Skip the autosave effect when the draft changes because we switched replay.
  const external = useRef(true)

  useEffect(() => {
    external.current = true
    setDraft(value)
    setStatus('idle')
  }, [value])

  useEffect(() => {
    if (external.current) {
      external.current = false
      return
    }
    setStatus('saving')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      onChange(draft)
      setStatus('saved')
    }, 450)
    return () => window.clearTimeout(timer.current)
    // `onChange` is stable enough here; re-running on it would reset the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  return (
    <>
      <div className="notes-head">
        <span className="label"><Pencil size={15} /> My notes</span>
        <span className="status">
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'Autosaves as you type'}
        </span>
      </div>
      <textarea
        className="notes-area"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Write your notes for this replay — key levels, rules, aha-moments…"
      />
    </>
  )
}
