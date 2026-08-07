import type { Level } from '../types'

/**
 * Generated cover art.
 *
 * Follows the Academy's designed thumbnail language — dark level-tinted
 * ground, one bright accent, an eyebrow over a short rule, a large condensed
 * headline, a tagline, "WITH <coach>" at the foot, and a thin inset frame —
 * but composed full-bleed for a card with no photography. The right side is
 * carried by the chart motif rather than left as a gap where a portrait would
 * otherwise sit.
 *
 * Drawn at 1920x1080 and scaled by its container, so a small card and the
 * full-width player share one set of proportions.
 */

export const LEVEL_COLOR: Record<Level, string> = {
  beginner: '#22a559',
  intermediate: '#f4b400',
  advanced: '#7c3aed',
  all: '#0d6fd0',
}

export const LEVEL_LABEL: Record<Level, string> = {
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
  advanced: 'ADVANCED',
  all: 'ALL LEVELS',
}

/** A dark ground plus one bright accent — the contrast the series is built on. */
interface Palette {
  near: string
  far: string
  accent: string
  node: string
  area: string
}

const PALETTE: Record<Level, Palette> = {
  beginner: { near: '#07301e', far: '#03130c', accent: '#4fd39c', node: '#1d7a51', area: '#0e4b2e' },
  // A dark yellow reads as brown, so this one sits on a warm charcoal and lets
  // the gold accent carry the level instead.
  intermediate: { near: '#2a2313', far: '#121009', accent: '#f4b400', node: '#8f7118', area: '#3a301a' },
  advanced: { near: '#241544', far: '#100820', accent: '#a98cf7', node: '#57309b', area: '#301d55' },
  all: { near: '#0b2a4a', far: '#041424', accent: '#5cb0ee', node: '#1e5f96', area: '#10406b' },
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

/** Greedy word wrap, capped at `maxLines`. */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length <= maxChars) line = candidate
    else {
      if (line) lines.push(line)
      line = word
      if (lines.length === maxLines) break
    }
  }
  if (line && lines.length < maxLines) lines.push(line)
  return lines.slice(0, maxLines)
}

const DISPLAY_FONT = "'Arial Narrow', 'Helvetica Neue', Helvetica, Arial, sans-serif"
const BODY_FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

const PAD_X = 128
/** Type column. The motif lives to the right of this and behind the tagline. */
const TYPE_WIDTH = 1120

interface Props {
  id: string
  level: Level
  /** Short headline, e.g. "Broker TOS". */
  display: string
  /** One-line description under the headline. */
  tagline?: string
  /** Coach name(s) for the "WITH …" line. */
  coach?: string
  /** Accessible name. */
  title: string
}

export function GeneratedThumbnail({ id, level, display, tagline, coach, title }: Props) {
  const p = PALETTE[level]
  const rand = seeded(id)
  const uid = `t-${id.replace(/[^a-z0-9]/gi, '')}`

  const lines = wrap(display.toUpperCase(), 15, 2)
  const longest = Math.max(...lines.map((l) => l.length), 1)
  const headSize = Math.max(58, Math.min(120, TYPE_WIDTH / (longest * 0.52)))
  const headLead = headSize * 0.9
  const headTop = 476

  const tagLines = tagline ? wrap(tagline, 32, 2) : []
  const tagTop = headTop + (lines.length - 1) * headLead + 112

  // Contour lines drifting across the whole ground, as in the designed series.
  const contours = Array.from({ length: 7 }, (_, row) => {
    const baseY = 250 + row * 118
    const steps = 8
    const pts = Array.from({ length: steps + 1 }, (_, i) => {
      const x = (i * 1920) / steps
      const y = baseY - rand() * 70
      return `${x},${y}`
    })
    return pts.join(' ')
  })

  // Area shapes anchored bottom right, where a portrait would otherwise sit.
  const area = (offset: number, amp: number, from: number) => {
    const steps = 6
    const pts = Array.from({ length: steps + 1 }, (_, i) => {
      const x = from + (i * (1920 - from)) / steps
      const y = offset - rand() * amp
      return `${x},${y}`
    })
    return `M${from},1080 L${pts.join(' L')} L1920,1080 Z`
  }

  // The hero line: a chart sweeping through the right half.
  const points = Array.from({ length: 5 }, (_, i) => ({
    x: 1180 + i * 158,
    y: 740 - rand() * 250,
  }))

  return (
    <svg viewBox="0 0 1920 1080" className="thumb-svg" role="img" aria-label={title}>
      <defs>
        <linearGradient id={`${uid}-ground`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.near} />
          <stop offset="100%" stopColor={p.far} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.78" cy="0.12" r="0.72">
          <stop offset="0%" stopColor={p.accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </radialGradient>
        {/* Keeps the type column clear of the busiest part of the motif. */}
        <linearGradient id={`${uid}-veil`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={p.far} stopOpacity="0.82" />
          <stop offset="58%" stopColor={p.far} stopOpacity="0.28" />
          <stop offset="100%" stopColor={p.far} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1920" height="1080" fill={`url(#${uid}-ground)`} />
      <rect width="1920" height="1080" fill={`url(#${uid}-glow)`} />

      {/* texture */}
      <g fill="none" stroke={p.accent} strokeOpacity="0.07" strokeWidth="2.5">
        {contours.map((pts, i) => <polyline key={i} points={pts} />)}
      </g>

      <path d={area(900, 200, 820)} fill={p.area} opacity="0.62" />
      <path d={area(1000, 150, 640)} fill={p.area} opacity="0.4" />

      {/* hero chart line */}
      <polyline
        points={points.map((pt) => `${pt.x},${pt.y}`).join(' ')}
        fill="none"
        stroke={p.accent}
        strokeOpacity="0.5"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {points.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="17" fill={p.node} stroke={p.accent} strokeOpacity="0.7" strokeWidth="5" />
      ))}

      <rect width="1920" height="1080" fill={`url(#${uid}-veil)`} />

      {/* eyebrow */}
      <text x={PAD_X} y="322" fill={p.accent} fontSize="36" fontWeight="800" letterSpacing="7.5" fontFamily={BODY_FONT}>
        {LEVEL_LABEL[level]}
      </text>
      <rect x={PAD_X} y="344" width="112" height="6" fill={p.accent} />

      {/* Headline. `textLength` pins each line to a condensed target width, so
          it stays condensed and inside the column even where no narrow face is
          installed — the fallback font would otherwise overflow. */}
      <g fontFamily={DISPLAY_FONT} fontWeight="700" fill="#ffffff">
        {lines.map((line, i) => (
          <text
            key={i}
            x={PAD_X}
            y={headTop + i * headLead}
            fontSize={headSize}
            textLength={Math.min(TYPE_WIDTH, line.length * headSize * 0.5)}
            lengthAdjust="spacingAndGlyphs"
          >
            {line}
          </text>
        ))}
      </g>

      {/* tagline */}
      <g fontFamily={BODY_FONT} fill="#ccd8e4" fontSize="40">
        {tagLines.map((line, i) => (
          <text key={i} x={PAD_X} y={tagTop + i * 54}>{line}</text>
        ))}
      </g>

      {/* with … */}
      {coach && (
        <text x={PAD_X} y="924" fill="#ffffff" fontSize="40" fontWeight="800" letterSpacing="1.5" fontFamily={BODY_FONT}>
          {`WITH ${coach.toUpperCase()}`}
        </text>
      )}

      {/* inset frame */}
      <rect x="30" y="29" width="1860" height="1022" fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="2" />
    </svg>
  )
}
