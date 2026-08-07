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

- **Thumbnail grid**, grouped by month, with duration badges and a green tick on
  anything already watched.
- **Filters** — free-text search, coach, session type, level, and a calendar
  where only days that actually have replays are selectable.
- **Player page** with title, coach, level, date, "mark as watched", and a
  "more like this" rail.
- **Notes** — per-replay, autosaving, plus a drawer listing every note written.
- **Dark / light mode**, remembered between visits.

Levels are colour-coded throughout: beginner green, intermediate amber,
advanced purple, all-levels blue.

## Where the data comes from

Everything currently renders from a generated placeholder archive so the UI can
be reviewed before any integration exists. Two files define it:

- `src/data/coaches.ts` — the coach roster and which levels each one teaches.
- `src/data/sessions.ts` — the recurring session formats, each tagged with its
  level, type and coach.

`src/data/replays.ts` expands those into dated occurrences. Nothing in the UI
imports it directly — the app only ever calls `fetchReplays()`.

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

Level and session type don't exist in Zoom's API — they come from the mapping in
`src/data/sessions.ts`, keyed off the meeting topic.

## Thumbnails

Zoom returns no thumbnail for a recording, so `src/lib/thumbnail.tsx` composes
one per replay: level colour, the title set large, the coach, and a chart motif
seeded from the replay id so each card is distinct but stable across reloads.

To use real artwork instead, add a `thumbnailUrl` to `Replay` and render an
`<img>` in `ReplayCard` when it's present.

## Per-member state

Watched flags and notes live in `localStorage` behind `src/lib/storage.ts`. When
accounts arrive, swap those calls for API calls — nothing in the UI changes.
