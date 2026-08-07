import type { Level } from '../types'

/**
 * Generated cover art for a replay.
 *
 * Zoom does not hand back a thumbnail for a cloud recording, so rather than
 * showing 40 identical grey rectangles we compose one per session: level colour,
 * the title set large, the coach, and a chart motif seeded from the replay id so
 * every card looks distinct but stable. Drop-in replaceable with real artwork —
 * `ReplayCard` will use an <img> whenever a replay has a `thumbnailUrl`.
 */

export const LEVEL_COLOR: Record<Level, string> = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#a855f7',
  all: '#3b82f6',
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

/** Greedy word wrap, capped at `maxLines` with an ellipsis on overflow. */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length <= maxChars) {
      line = candidate
    } else {
      if (line) lines.push(line)
      line = word
      if (lines.length === maxLines) break
    }
  }
  if (line && lines.length < maxLines) lines.push(line)

  if (lines.length === maxLines) {
    const consumed = lines.join(' ').split(/\s+/).length
    if (consumed < words.length) {
      lines[maxLines - 1] = lines[maxLines - 1].replace(/[\s·:,-]+$/, '') + '…'
    }
  }
  return lines
}

interface Props {
  id: string
  title: string
  level: Level
  coach: string
}

export function GeneratedThumbnail({ id, title, level, coach }: Props) {
  const color = LEVEL_COLOR[level]
  const rand = seeded(id)

  const lines = wrap(title.toUpperCase(), 20, 3)

  // Shrink to fit: bold system caps run ~0.64em wide, and we have 548px of safe
  // width from the left inset. Without this, long titles bleed off the card.
  const longest = Math.max(...lines.map((l) => l.length), 1)
  const byWidth = 548 / (longest * 0.64)
  const byCount = lines.length >= 3 ? 46 : lines.length === 2 ? 54 : 62
  const fontSize = Math.max(22, Math.min(byCount, byWidth))

  const blockHeight = lines.length * fontSize * 1.06
  const startY = 186 - blockHeight / 2 + fontSize * 0.8

  // Candlestick motif — seeded so each card is distinct but never changes.
  const candles = Array.from({ length: 14 }, (_, i) => {
    const h = 26 + rand() * 92
    const y = 210 - h * (0.35 + rand() * 0.5)
    return { x: 408 + i * 17, y, h, up: rand() > 0.42 }
  })

  const gid = `g-${id.replace(/[^a-z0-9]/gi, '')}`

  return (
    <svg viewBox="0 0 640 360" className="thumb-svg" role="img" aria-label={title}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d1117" />
          <stop offset="55%" stopColor="#131a24" />
          <stop offset="100%" stopColor={color} stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id={`${gid}-fade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0d1117" stopOpacity="0.96" />
          <stop offset="70%" stopColor="#0d1117" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0d1117" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="640" height="360" fill={`url(#${gid})`} />

      {/* chart motif */}
      <g opacity="0.5">
        {candles.map((c, i) => (
          <g key={i}>
            <rect
              x={c.x}
              y={c.y}
              width="9"
              height={c.h}
              rx="2"
              fill={c.up ? color : '#ef4444'}
              opacity={c.up ? 0.85 : 0.6}
            />
            <rect x={c.x + 3.5} y={c.y - 9} width="2" height={c.h + 18} rx="1" fill={c.up ? color : '#ef4444'} opacity="0.45" />
          </g>
        ))}
      </g>

      {/* keep text legible over the motif */}
      <rect width="640" height="360" fill={`url(#${gid}-fade)`} />

      {/* level accent bar */}
      <rect x="0" y="0" width="7" height="360" fill={color} />

      {/* level badge */}
      <rect x="34" y="30" rx="11" width={LEVEL_LABEL[level].length * 8.6 + 26} height="26" fill={color} opacity="0.18" />
      <text x={34 + 13} y="48" fill={color} fontSize="14" fontWeight="800" letterSpacing="1.4" fontFamily="system-ui, sans-serif">
        {LEVEL_LABEL[level]}
      </text>

      {/* title */}
      <g fontFamily="system-ui, -apple-system, Segoe UI, sans-serif" fontWeight="800">
        {lines.map((line, i) => (
          <text
            key={i}
            x="34"
            y={startY + i * fontSize * 1.06}
            fill="#ffffff"
            fontSize={fontSize}
            letterSpacing="-0.5"
          >
            {line}
          </text>
        ))}
      </g>

      {/* coach */}
      <circle cx="41" cy="322" r="5" fill={color} />
      <text x="56" y="327" fill="#cbd5e1" fontSize="19" fontWeight="600" fontFamily="system-ui, sans-serif">
        {coach}
      </text>
    </svg>
  )
}
