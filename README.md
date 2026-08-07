# GOAT Academy · Replay Library

A standalone viewer for the Academy's live-session replays. Members browse a
YouTube-style grid of recordings, filter down to what they need, watch in-page,
take notes, and track what they've already seen.

```bash
npm install
npm run dev      # local dev server
npm run build    # emits a single self-contained dist/index.html
```

## What's built

- **Two panes** — the replay list on the left, player and notes on the right,
  each scrolling independently, with a draggable splitter between them.
- **Gallery and list views** for the left pane, toggled and remembered.
- **Filters** — free-text search, coach, session (the Academy's 41 sessions,
  grouped by level), level pills, and a calendar where only days that actually
  have replays are selectable.
- **Player** with a full-view control; a replay is marked watched automatically
  once 90% of it has played, which puts a green tick on its card.
- **Notes** — per-replay, autosaving, plus a drawer listing every note written.
- **Dark / light mode**, remembered between visits.

Levels are colour-coded throughout: beginner green, intermediate gold,
advanced purple, all-levels blue.

## Admin zone

Coaches and lessons are editable in the app, so adding a coach or a new session
never needs a code change.

- **Getting in:** visit the app once with `?admin=1`. That sets a local flag and
  strips the parameter from the URL; `?admin=0` revokes it. Members see no trace
  of it — the button is not rendered at all.
- **What it edits:** the coach roster (name, levels) and the lesson list (title,
  level, coaches, cadence, cover headline, cover tagline, recap). Chapter
  timestamps are deliberately not editable — those should come from the Zoom
  transcript.
- **Export / Import** round-trips the whole catalogue as JSON, so a set of edits
  can be reviewed, version-controlled, or moved between environments.
- **Restore defaults** drops back to the bundled `src/data/*` files.

> ⚠️ **`?admin=1` is a placeholder, not security.** Anyone who knows the
> parameter can grant it to themselves, and edits currently live in that
> browser's localStorage rather than on a server.
>
> Two things to replace before this is real:
> 1. `isAdmin()` in `src/lib/admin.ts` — swap for the host's member role, a
>    claim on the session token, or an endpoint on our backend. Every admin
>    control is already behind that single function.
> 2. `read()` / `persist()` in `src/lib/catalogue.ts` — swap localStorage for
>    API calls so the catalogue is shared rather than per-browser.

## Where the data comes from

Everything currently renders from a generated placeholder archive so the UI can
be reviewed before any integration exists.

- `src/lib/catalogue.ts` — **the live catalogue.** Everything reads coaches and
  sessions from here, which layers admin edits over the bundled defaults.
- `src/data/coaches.ts` / `src/data/sessions.ts` — the bundled defaults.
- `src/data/artwork.ts` / `src/data/recaps.ts` — default cover copy and recaps,
  folded onto each session by the catalogue.

`src/data/replays.ts` expands the catalogue into dated occurrences, rebuilt on
every fetch so admin edits appear immediately. Nothing in the UI imports it
directly — the app only ever calls `fetchReplays()`.

## Wiring up the real data

**`src/lib/api.ts` is the only file that needs to change.** Replace the body of
`fetchReplays()` with a call to our backend and return the same `Replay` shape.

The backend side, for reference:

1. List recordings per host with `GET /v2/users/{userId}/recordings`. The
   account-wide endpoint needs master-level scopes we won't have, so iterate
   over the coaches who host, using `recording:read:admin`.
2. Map each recording: `topic` → title, `start_time` → date, `host_id` → coach,
   `duration` → runtime.
3. **Stream the MP4 through our own proxy.** Zoom requires the OAuth token in an
   `Authorization` header, and a `<video>` tag cannot send headers — so the
   backend attaches the header, forwards the browser's `Range` header so seeking
   works, and pipes the bytes back. Put that proxy URL in `Replay.videoUrl` and
   the player picks it up automatically.

If a recording has no playable file, set `shareUrl` and `passcode` instead and
the player falls back to an "Open in Zoom" button with the passcode shown.

Levels don't exist in Zoom's API — match the meeting `topic` against
`src/data/sessions.ts` to resolve a recording to its session and level.

## Thumbnails

Drop cover art into **`src/assets/thumbs/`** and it is picked up at build time —
no code change. Files are assigned to sessions in filename order, so a session
keeps the same image across all of its recordings. See the README in that folder
for sizing guidance.

Resize before committing: the build inlines every asset into one HTML file, so
full-size 2MB PNGs bloat it badly. 640px wide at ~78% quality is plenty.

Any session with no image falls back to generated artwork
(`src/lib/thumbnail.tsx`) — a level-coloured gradient with the title and coaches
drawn over it. Cards using real artwork drop that text overlay, on the
assumption the artwork already carries it.

## Recap and chapters

`src/data/recaps.ts` holds a recap and a set of chapter markers per session.
Chapter positions are stored as a **fraction** of the recording rather than
absolute seconds, because a session runs a different length each week; the
fraction is converted to a real timestamp per recording. Clicking a chapter
seeks the player.

These are written placeholders. Once Zoom is connected the recap should come
from the meeting summary and the chapters from the transcript (VTT), with this
file left as the fallback for recordings that have neither.

## Per-member state

Watched flags and notes live in `localStorage` behind `src/lib/storage.ts`. When
accounts arrive, swap those calls for API calls — nothing in the UI changes.
