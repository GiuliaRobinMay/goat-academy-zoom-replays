import type { Level } from '../types'

/**
 * Generated cover art for a replay.
 *
 * Zoom does not hand back a thumbnail for a cloud recording, so rather than
 * showing 40 identical grey rectangles we compose one per session: a bright
 * level-coloured gradient plus a chart motif seeded from the replay id, so
 * every card looks distinct but stable across reloads.
 *
 * Deliberately text-free. Anything readable — date, title, coach — is an HTML
 * overlay on top, because SVG text scales with its container and would render
 * at a different size on a 160px card than on a full-width player.
 */

export const LEVEL_COLOR: Record<Level, string> = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#a855f7',
  all: '#3b82f6',
}

/**
 * Deep-to-light pair per level, softened so the card reads as a tint rather
 * than a solid block. The deep end is painted at the bottom left, under the
 * title, and the pale end at the top right.
 */
const GRADIENT: Record<Level, [string, string]> = {
  beginner: ['#0d9488', '#a7f3d0'],
  intermediate: ['#ca8a04', '#fef08a'],
  advanced: ['#7c3aed', '#e2d5fb'],
  all: ['#2563eb', '#c3dafe'],
}

export const LEVEL_LABEL: Record<Level, string> = {
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
  advanced: 'ADVANCED',
  all: 'ALL LEVELS',
}

function seeded(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Props {
  id: string
  level: Level
  /** Only used for the accessible name. */
  title: string
}

export function GeneratedThumbnail({ id, level, title }: Props) {
  const [deep, light] = GRADIENT[level]
  const rand = seeded(id)

  const candles = Array.from({ length: 16 }, (_, i) => {
    const h = 30 + rand() * 110
    const y = 250 - h * (0.3 + rand() * 0.55)
    return { x: 22 + i * 39, y, h }
  })

  const gid = `g-${id.replace(/[^a-z0-9]/gi, '')}`

  return (
    <svg viewBox="0 0 640 360" className="thumb-svg" role="img" aria-label={title}>
      <defs>
        {/* Pale at the top right, deep at the bottom left — so the corner the
            title sits in is the darkest part of the artwork. */}
        <linearGradient id={gid} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
      </defs>

      {/* Slightly translucent so the card reads as a tint over the surface
          beneath it, leaving the level hairline to do the colour-coding. */}
      <rect width="640" height="360" fill={`url(#${gid})`} opacity="0.82" />

      <g opacity="0.26">
        {candles.map((c, i) => (
          <g key={i}>
            <rect x={c.x} y={c.y} width="15" height={c.h} rx="3" fill="#ffffff" />
            <rect x={c.x + 6} y={c.y - 14} width="3" height={c.h + 28} rx="1.5" fill="#ffffff" opacity="0.7" />
          </g>
        ))}
      </g>
    </svg>
  )
}
