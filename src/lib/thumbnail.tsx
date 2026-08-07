import type { Level } from '../types'

/**
 * Generated cover art, built to the Academy's own thumbnail template.
 *
 * The layout mirrors the designed series: a dark level-tinted panel on the
 * left carrying an eyebrow, a large condensed headline, a tagline and a
 * "WITH <coach>" line, a thin inset frame around the whole card, and a faint
 * line-chart motif behind the type. The right ~43% is reserved for the coach
 * portraits; until those exist it carries a deeper continuation of the artwork
 * so the composition still reads as finished rather than as a gap.
 *
 * Drawn at 1920x1080 and scaled by the container, so a card and the full-width
 * player share one set of proportions.
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

/**
 * Each level is a dark ground plus one bright accent, rather than a saturated
 * fill — that contrast is what makes the designed series look considered.
 */
interface Palette {
  ground: string
  panel: string
  right: string
  accent: string
  chart: string
  area: string
}

const PALETTE: Record<Level, Palette> = {
  beginner: { ground: '#04150e', panel: '#072a1b', right: '#032115', accent: '#4fd39c', chart: '#1d7a51', area: '#0d3f28' },
  intermediate: { ground: '#14110a', panel: '#262013', right: '#191509', accent: '#f4b400', chart: '#8f7118', area: '#332a14' },
  advanced: { ground: '#120a22', panel: '#22133f', right: '#170d2c', accent: '#a98cf7', chart: '#57309b', area: '#2b1a4d' },
  all: { ground: '#06182b', panel: '#0a2542', right: '#071d34', accent: '#5cb0ee', chart: '#1e5f96', area: '#123a5f' },
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

/**
 * Left panel ends here. The designed series reserves the remainder for coach
 * portraits at 1094; with no portraits supplied the panel runs wider and the
 * band becomes a slim accent instead of dead space.
 */
const SPLIT = 1330
const PAD_X = 118

interface Props {
  id: string
  level: Level
  /** Short headline, e.g. "Broker TOS". Falls back to the session title. */
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

  // Headline: wrap to two lines, then shrink so the longest line fits the panel.
  const lines = wrap(display.toUpperCase(), 16, 2)
  const avail = SPLIT - PAD_X - 56
  const longest = Math.max(...lines.map((l) => l.length), 1)
  // Condensed bold caps run about 0.52em per character.
  const headSize = Math.max(52, Math.min(112, avail / (longest * 0.52)))
  const headLead = headSize * 0.92
  const headTop = 402

  const tagLines = tagline ? wrap(tagline, 30, 2) : []
  const tagTop = headTop + (lines.length - 1) * headLead + 112

  // Line-chart motif: a polyline with round nodes, plus two soft area shapes.
  const points = Array.from({ length: 5 }, (_, i) => ({
    x: 520 + i * 168,
    y: 690 - rand() * 300,
  }))
  const path = points.map((pt) => `${pt.x},${pt.y}`).join(' ')

  const area = (offset: number, amp: number) => {
    const steps = 7
    const pts = Array.from({ length: steps + 1 }, (_, i) => {
      const x = 420 + (i * (SPLIT + 500 - 420)) / steps
      const y = offset - rand() * amp
      return `${x},${y}`
    })
    return `M420,1080 L${pts.join(' L')} L${SPLIT + 500},1080 Z`
  }

  return (
    <svg viewBox="0 0 1920 1080" className="thumb-svg" role="img" aria-label={title}>
      <defs>
        <linearGradient id={`${uid}-panel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.panel} />
          <stop offset="100%" stopColor={p.ground} />
        </linearGradient>
        <linearGradient id={`${uid}-glow`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={p.accent} stopOpacity="0.16" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${uid}-panelclip`}>
          <rect x="0" y="0" width={SPLIT} height="1080" />
        </clipPath>
      </defs>

      {/* grounds */}
      <rect width="1920" height="1080" fill={p.right} />
      <rect width={SPLIT} height="1080" fill={`url(#${uid}-panel)`} />

      <g clipPath={`url(#${uid}-panelclip)`}>
        {/* soft arc across the top left, as in the designed series */}
        <ellipse cx="430" cy="-260" rx="900" ry="700" fill={`url(#${uid}-glow)`} />

        <path d={area(880, 190)} fill={p.area} opacity="0.55" />
        <path d={area(980, 150)} fill={p.area} opacity="0.4" />

        <polyline points={path} fill="none" stroke={p.accent} strokeOpacity="0.42" strokeWidth="5" />
        {points.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="15" fill={p.chart} stroke={p.accent} strokeOpacity="0.55" strokeWidth="4" />
        ))}
      </g>

      {/* right panel keeps the motif going so the reserved portrait area still
          reads as part of the composition */}
      <g opacity="0.5">
        <path d={area(1000, 160).replace(/^M420/, `M${SPLIT}`)} fill={p.area} opacity="0.5" transform={`translate(${SPLIT - 300} 0)`} />
      </g>
      <line x1={SPLIT} y1="28" x2={SPLIT} y2="1052" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="2" />

      {/* eyebrow */}
      <text
        x={PAD_X}
        y="286"
        fill={p.accent}
        fontSize="34"
        fontWeight="800"
        letterSpacing="7"
        fontFamily={BODY_FONT}
      >
        {LEVEL_LABEL[level]}
      </text>
      <rect x={PAD_X} y="310" width="104" height="6" fill={p.accent} />

      {/* Headline. `textLength` pins each line to a condensed target width, so
          it both fits the panel and keeps the condensed look on machines with
          no narrow face installed — without it the fallback font overflows. */}
      <g fontFamily={DISPLAY_FONT} fontWeight="700" fill="#ffffff">
        {lines.map((line, i) => (
          <text
            key={i}
            x={PAD_X}
            y={headTop + i * headLead}
            fontSize={headSize}
            textLength={Math.min(avail, line.length * headSize * 0.5)}
            lengthAdjust="spacingAndGlyphs"
          >
            {line}
          </text>
        ))}
      </g>

      {/* tagline */}
      <g fontFamily={BODY_FONT} fill="#c9d6e2" fontSize="36">
        {tagLines.map((line, i) => (
          <text key={i} x={PAD_X} y={tagTop + i * 50}>
            {line}
          </text>
        ))}
      </g>

      {/* with … */}
      {coach && (
        <text
          x={PAD_X}
          y="906"
          fill="#ffffff"
          fontSize="38"
          fontWeight="800"
          letterSpacing="1.5"
          fontFamily={BODY_FONT}
        >
          {`WITH ${coach.toUpperCase()}`}
        </text>
      )}

      {/* inset frame */}
      <rect
        x="28" y="27" width="1864" height="1026"
        fill="none" stroke="#ffffff" strokeOpacity="0.13" strokeWidth="2"
      />
    </svg>
  )
}
