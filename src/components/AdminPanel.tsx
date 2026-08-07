import { useMemo, useState } from 'react'
import type { Coach, Level, Session } from '../types'
import {
  type Catalogue,
  defaultCatalogue, exportCatalogue, getCoaches, getSessions,
  importCatalogue, isCustomised, resetCatalogue, saveCatalogue, slugify,
} from '../lib/catalogue'
import { LEVEL_LABEL } from '../lib/thumbnail'
import { X } from './Icons'

const LEVELS: Level[] = ['beginner', 'intermediate', 'advanced', 'all']

interface Props {
  onClose: () => void
  /** Called after a save, so the library can rebuild from the new catalogue. */
  onSaved: () => void
}

/**
 * Admin zone: edit the coach roster and the lesson list without touching code.
 *
 * Edits are held in a local draft until saved, so closing without saving
 * changes nothing.
 */
export function AdminPanel({ onClose, onSaved }: Props) {
  const [tab, setTab] = useState<'coaches' | 'lessons'>('coaches')
  const [coaches, setCoaches] = useState<Coach[]>(() =>
    getCoaches().map((c) => ({ ...c, levels: [...c.levels] })),
  )
  const [sessions, setSessions] = useState<Session[]>(() =>
    getSessions().map((s) => ({ ...s, coachIds: [...s.coachIds] })),
  )
  const [dirty, setDirty] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState('')

  const touch = () => { setDirty(true); setNotice(null) }

  // ── Coaches ──────────────────────────────────────────────────────────────
  const updateCoach = (i: number, patch: Partial<Coach>) => {
    setCoaches((prev) => prev.map((c, n) => (n === i ? { ...c, ...patch } : c)))
    touch()
  }
  const toggleCoachLevel = (i: number, level: Level) => {
    const c = coaches[i]
    const next = c.levels.includes(level)
      ? c.levels.filter((l) => l !== level)
      : [...c.levels, level]
    updateCoach(i, { levels: next })
  }
  const addCoach = () => {
    setCoaches((prev) => [
      ...prev,
      { id: slugify('new coach', prev.map((c) => c.id)), name: '', levels: ['beginner'] },
    ])
    touch()
  }
  const removeCoach = (i: number) => {
    const id = coaches[i].id
    setCoaches((prev) => prev.filter((_, n) => n !== i))
    // Drop the coach from any lesson that referenced them.
    setSessions((prev) => prev.map((s) => ({ ...s, coachIds: s.coachIds.filter((c) => c !== id) })))
    touch()
  }

  // ── Lessons ──────────────────────────────────────────────────────────────
  const updateSession = (i: number, patch: Partial<Session>) => {
    setSessions((prev) => prev.map((s, n) => (n === i ? { ...s, ...patch } : s)))
    touch()
  }
  const toggleSessionCoach = (i: number, coachId: string) => {
    const s = sessions[i]
    const next = s.coachIds.includes(coachId)
      ? s.coachIds.filter((c) => c !== coachId)
      : [...s.coachIds, coachId]
    updateSession(i, { coachIds: next })
  }
  const addSession = () => {
    setSessions((prev) => [
      {
        id: slugify('new lesson', prev.map((s) => s.id)),
        title: '',
        level: 'all',
        coachIds: [],
        cadenceDays: 7,
        display: '',
        tagline: '',
        recap: '',
      },
      ...prev,
    ])
    touch()
  }
  const removeSession = (i: number) => {
    setSessions((prev) => prev.filter((_, n) => n !== i))
    touch()
  }

  // ── Persistence ──────────────────────────────────────────────────────────
  const problems = useMemo(() => {
    const list: string[] = []
    if (coaches.some((c) => !c.name.trim())) list.push('Every coach needs a name.')
    if (sessions.some((s) => !s.title.trim())) list.push('Every lesson needs a title.')
    return list
  }, [coaches, sessions])

  const commit = (next: Catalogue) => {
    saveCatalogue(next)
    setDirty(false)
    onSaved()
  }

  const save = () => {
    if (problems.length) { setNotice(problems[0]); return }
    commit({ coaches, sessions })
    setNotice('Saved. The library has been updated.')
  }

  const restoreDefaults = () => {
    resetCatalogue()
    const d = defaultCatalogue()
    setCoaches(d.coaches)
    setSessions(d.sessions)
    setDirty(false)
    onSaved()
    setNotice('Restored the built-in coaches and lessons.')
  }

  const copyExport = async () => {
    const json = exportCatalogue()
    try {
      await navigator.clipboard.writeText(json)
      setNotice('Copied the catalogue to your clipboard as JSON.')
    } catch {
      setImportText(json)
      setImportOpen(true)
      setNotice('Clipboard blocked — the JSON is in the box below, copy it from there.')
    }
  }

  const runImport = () => {
    const error = importCatalogue(importText)
    if (error) { setNotice(error); return }
    const c = { coaches: getCoaches(), sessions: getSessions() }
    setCoaches(c.coaches.map((x) => ({ ...x, levels: [...x.levels] })))
    setSessions(c.sessions.map((x) => ({ ...x, coachIds: [...x.coachIds] })))
    setDirty(false)
    setImportOpen(false)
    onSaved()
    setNotice('Imported.')
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <section className="admin" role="dialog" aria-label="Admin: coaches and lessons">
        <header>
          <div>
            <h2>Admin zone</h2>
            <p>Edit the coaches and lessons. Members never see this.</p>
          </div>
          <button className="btn icon ghost" onClick={onClose} aria-label="Close admin"><X /></button>
        </header>

        <div className="admin-tabs">
          <button data-on={tab === 'coaches'} onClick={() => setTab('coaches')}>
            Coaches <span>{coaches.length}</span>
          </button>
          <button data-on={tab === 'lessons'} onClick={() => setTab('lessons')}>
            Lessons <span>{sessions.length}</span>
          </button>
        </div>

        <div className="admin-body">
          {tab === 'coaches' && (
            <>
              <p className="admin-hint">
                Levels decide which filter pills a coach appears under. Removing a coach also
                removes them from every lesson.
              </p>
              {coaches.map((c, i) => (
                <div className="admin-row" key={c.id}>
                  <input
                    className="admin-input"
                    value={c.name}
                    placeholder="Coach name"
                    onChange={(e) => updateCoach(i, { name: e.target.value })}
                    aria-label="Coach name"
                  />
                  <div className="admin-chips">
                    {LEVELS.map((l) => (
                      <button
                        key={l}
                        className="pill"
                        data-level={l}
                        data-on={c.levels.includes(l)}
                        onClick={() => toggleCoachLevel(i, l)}
                      >
                        <span className="dot" />{LEVEL_LABEL[l]}
                      </button>
                    ))}
                  </div>
                  <button className="btn ghost danger" onClick={() => removeCoach(i)}>Remove</button>
                </div>
              ))}
              <button className="btn" onClick={addCoach}>+ Add coach</button>
            </>
          )}

          {tab === 'lessons' && (
            <>
              <p className="admin-hint">
                The headline and tagline are what appear on the cover art. Timestamps are not
                edited here — those come from the Zoom transcript once it is connected.
              </p>
              {sessions.map((s, i) => (
                <div className="admin-card" key={s.id}>
                  <div className="admin-grid">
                    <label>
                      <span>Title</span>
                      <input
                        className="admin-input"
                        value={s.title}
                        placeholder="Full lesson title"
                        onChange={(e) => updateSession(i, { title: e.target.value })}
                      />
                    </label>
                    <label>
                      <span>Level</span>
                      <select
                        className="control"
                        value={s.level}
                        onChange={(e) => updateSession(i, { level: e.target.value as Level })}
                      >
                        {LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Runs every (days)</span>
                      <input
                        className="admin-input"
                        type="number" min={1} max={365}
                        value={s.cadenceDays}
                        onChange={(e) => updateSession(i, { cadenceDays: Number(e.target.value) || 7 })}
                      />
                    </label>
                    <label>
                      <span>Cover headline</span>
                      <input
                        className="admin-input"
                        value={s.display ?? ''}
                        placeholder="Short, e.g. Broker TOS"
                        onChange={(e) => updateSession(i, { display: e.target.value })}
                      />
                    </label>
                    <label className="wide">
                      <span>Cover tagline</span>
                      <input
                        className="admin-input"
                        value={s.tagline ?? ''}
                        placeholder="One line under the headline"
                        onChange={(e) => updateSession(i, { tagline: e.target.value })}
                      />
                    </label>
                    <label className="wide">
                      <span>Recap</span>
                      <textarea
                        className="admin-input"
                        rows={2}
                        value={s.recap ?? ''}
                        placeholder="Shown under the player"
                        onChange={(e) => updateSession(i, { recap: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="admin-coaches">
                    <span className="admin-label">Coaches</span>
                    <div className="admin-chips">
                      {coaches.map((c) => (
                        <button
                          key={c.id}
                          className="pill"
                          data-on={s.coachIds.includes(c.id)}
                          onClick={() => toggleSessionCoach(i, c.id)}
                        >
                          {c.name || 'Unnamed'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="btn ghost danger" onClick={() => removeSession(i)}>Remove lesson</button>
                </div>
              ))}
              <button className="btn" onClick={addSession}>+ Add lesson</button>
            </>
          )}

          {importOpen && (
            <div className="admin-import">
              <span className="admin-label">Paste a catalogue JSON to replace everything</span>
              <textarea
                className="admin-input"
                rows={8}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{ "coaches": [...], "sessions": [...] }'
              />
              <div className="admin-import-actions">
                <button className="btn primary" onClick={runImport}>Replace catalogue</button>
                <button className="btn ghost" onClick={() => setImportOpen(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <footer className="admin-foot">
          <div className="admin-status">
            {notice
              ? <span className="admin-notice">{notice}</span>
              : dirty
                ? <span className="admin-dirty">Unsaved changes</span>
                : <span>{isCustomised() ? 'Using your edited catalogue' : 'Using the built-in catalogue'}</span>}
          </div>
          <button className="btn ghost" onClick={copyExport}>Copy JSON</button>
          <button className="btn ghost" onClick={() => setImportOpen((o) => !o)}>Import JSON</button>
          <button className="btn ghost danger" onClick={restoreDefaults}>Restore defaults</button>
          <button className="btn primary" onClick={save} disabled={!dirty}>Save changes</button>
        </footer>
      </section>
    </>
  )
}
