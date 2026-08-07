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
  beginner: '#22a559',
  intermediate: '#f4b400',
  advanced: '#7c3aed',
  all: '#0d6fd0',
}

/**
 * The brand colour at full strength, shading to a deeper tone of the same hue
 * at the bottom left where the text sits. No overlay or scrim — the card is
 * saturated enough for its ink colour to read directly on it.
 *
 * `motif` is the chart pattern: white on the dark cards, near-black on yellow.
 */
const ART: Record<Level, { from: string; to: string; motif: string; motifOpacity: number }> = {
  beginner: { from: '#22a559', to: '#177c41', motif: '#ffffff', motifOpacity: 0.18 },
  intermediate: { from: '#f4b400', to: '#c98f00', motif: '#3d2c00', motifOpacity: 0.16 },
  advanced: { from: '#7c3aed', to: '#5a24bd', motif: '#ffffff', motifOpacity: 0.18 },
  all: { from: '#0d6fd0', to: '#08549f', motif: '#ffffff', motifOpacity: 0.18 },
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
  const { from, to, motif, motifOpacity } = ART[level]
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
        {/* Brand colour at the top right, deepening toward the bottom left
            where the title sits. */}
        <linearGradient id={gid} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>

      <rect width="640" height="360" fill={`url(#${gid})`} />

      <g opacity={motifOpacity}>
        {candles.map((c, i) => (
          <g key={i}>
            <rect x={c.x} y={c.y} width="15" height={c.h} rx="3" fill={motif} />
            <rect x={c.x + 6} y={c.y - 14} width="3" height={c.h + 28} rx="1.5" fill={motif} opacity="0.7" />
          </g>
        ))}
      </g>
    </svg>
  )
}
