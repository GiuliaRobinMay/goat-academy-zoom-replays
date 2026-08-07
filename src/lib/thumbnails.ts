import { getSessions } from './catalogue'

/**
 * Real cover art, loaded from `src/assets/thumbs/`.
 *
 * Anything dropped in that folder is picked up at build time — no code change
 * needed. Files are assigned to sessions in filename order, so a given session
 * always keeps the same image across every one of its recordings.
 *
 * When the folder is empty (or holds fewer files than there are sessions) the
 * unmatched sessions fall back to the generated artwork in `thumbnail.tsx`.
 *
 * Once Zoom is connected, a real per-recording image should be set on
 * `Replay.thumbnailUrl` by the backend instead, and this becomes the default
 * for sessions that have no art of their own.
 */
const modules = import.meta.glob('../assets/thumbs/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

/** Sorted by path so numbered filenames ("01 …", "02 …") keep their order. */
const IMAGES: string[] = Object.keys(modules)
  .sort()
  .map((path) => modules[path])

/** Stable session -> image assignment, cycling if there are fewer images.
 *  Resolved per call so sessions added in the admin zone get art too. */
export function thumbnailFor(sessionId: string): string | undefined {
  if (IMAGES.length === 0) return undefined
  const i = getSessions().findIndex((s) => s.id === sessionId)
  return i < 0 ? undefined : IMAGES[i % IMAGES.length]
}

export const hasRealThumbnails = IMAGES.length > 0
