import { DIO } from './jojoArt'
import AsciiArt from './AsciiArt'

// DIO was colour-keyed out of a manga panel. His black outlines survive the
// key as gaps, which is what gives him readable internal structure.
const W = 52
const H = 32

const blank = () => Array.from({ length: H }, () => new Array(W).fill(' '))
const put = (g, r, c, ch) => {
  if (r >= 0 && r < H && c >= 0 && c < W && ch !== ' ') g[r][c] = ch
}
const text = (g) => g.map((row) => row.join('')).join('\n')

const layer = (rows, r0, c0) => {
  const g = blank()
  rows.forEach((row, i) => [...row].forEach((ch, j) => put(g, r0 + i, c0 + j, ch)))
  return text(g)
}

const DIO_ART = layer(DIO, 1, 0)

// the street climbs away to the right, as it does in the panel
const road = blank()
for (let c = 26; c < W; c++) put(road, Math.round(30 - ((c - 26) * 6) / 26), c, '_')
const ROAD = text(road)

const LAYERS = [
  { art: ROAD, tone: 'text-faint' },
  { art: DIO_ART, tone: 'text-accent' },
]

// scattered where the aura is in the panel, each on its own beat
const RUMBLE = [
  { left: '3%', top: '10%', size: 13, dur: 2.2, delay: 0 },
  { left: '13%', top: '42%', size: 17, dur: 2.9, delay: 0.5 },
  { left: '6%', top: '70%', size: 12, dur: 2.5, delay: 1.1 },
  { left: '46%', top: '3%', size: 19, dur: 3.1, delay: 0.3 },
  { left: '62%', top: '16%', size: 14, dur: 2.4, delay: 0.9 },
  { left: '78%', top: '6%', size: 16, dur: 2.7, delay: 1.4 },
  { left: '86%', top: '38%', size: 12, dur: 2.3, delay: 0.7 },
  { left: '72%', top: '62%', size: 15, dur: 3.0, delay: 0.2 },
]

export default function Approaching() {
  return (
    <div className="w-full max-w-[250px]">
      <div className="relative ml-[12%] w-fit max-w-[88%] border border-line bg-ink px-3 py-2">
        <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">
          Oh? You&apos;re approaching me?
        </p>
        <span
          aria-hidden="true"
          className="absolute -bottom-[5px] left-4 h-2 w-2 rotate-45 border-b border-l border-line bg-ink"
        />
      </div>

      <div className="relative mt-2">
        <AsciiArt layers={LAYERS} maxWidth={250} />
        {RUMBLE.map((r) => (
          <span
            key={r.left + r.top}
            aria-hidden="true"
            className="rumble pointer-events-none absolute select-none font-sans font-bold text-accent2"
            style={{
              left: r.left,
              top: r.top,
              fontSize: r.size,
              '--dur': `${r.dur}s`,
              '--delay': `${r.delay}s`,
            }}
          >
            ゴ
          </span>
        ))}
      </div>
    </div>
  )
}
