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
 * One hue per level, running from a deep, fully opaque bottom-left corner —
 * where the text sits — to a lighter, part-transparent top right. The
 * transparency lets the card surface through, which is what gives the tile
 * depth instead of reading as a solid slab of colour.
 *
 * `motif` is the chart pattern: white on the dark cards, near-black on yellow.
 */
const ART: Record<Level, { light: string; deep: string; motif: string; motifOpacity: number }> = {
  beginner: { light: '#4fc47f', deep: '#14713b', motif: '#ffffff', motifOpacity: 0.18 },
  intermediate: { light: '#ffce4d', deep: '#bf8c00', motif: '#3d2c00', motifOpacity: 0.16 },
  advanced: { light: '#a274f5', deep: '#5620b4', motif: '#ffffff', motifOpacity: 0.18 },
  all: { light: '#4a9ae6', deep: '#08498e', motif: '#ffffff', motifOpacity: 0.18 },
}

/** Opacity at the pale top-right end; the bottom-left end stays fully opaque. */
const TOP_RIGHT_OPACITY = 0.5

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
  const { light, deep, motif, motifOpacity } = ART[level]
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
        {/* Light and part-transparent at the top right, deepening to fully
            opaque at the bottom left behind the title. */}
        <linearGradient id={gid} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} stopOpacity={TOP_RIGHT_OPACITY} />
          <stop offset="55%" stopColor={light} stopOpacity="0.88" />
          <stop offset="100%" stopColor={deep} stopOpacity="1" />
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
