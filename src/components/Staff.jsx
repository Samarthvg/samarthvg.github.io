import { GEM, GEM_LIGHT, METAL, METAL_LIGHT } from './staffArt'
import { useThemeName } from '../lib/theme'
import AsciiArt from './AsciiArt'

// Frieren's staff, colour-keyed out of a render. The two layers are
// cell-aligned halves of one grid, gold in the page's ink and glass in the
// accent, so the mark re-tints with the theme.
const W = Math.max(...METAL.map((r) => r.length), ...GEM.map((r) => r.length))
const H = Math.max(METAL.length, GEM.length)

// The source photograph cuts the shaft off square at the bottom edge, which
// reads as a crop. The art itself is left alone; the shaft is instead carried
// on past the frame for a few more rows and allowed to run out of ink. It
// leaves toward the lower left, so the grid gains a margin on that side for it
// to travel into.
const RAMP = ' .:-=+*#%@'
const EXTRA = 9 // rows added below the source frame
const LEFT = 10 // columns for the shaft to drift into
const OW = W + LEFT
const OH = H + EXTRA

// The shaft's own line, the same one the rotation work established: from the
// top ornament down and out of frame near the left edge. Extrapolated past the
// last row here rather than interpolated within it.
const shaftCol = (y) => W * (0.823 - 0.812 * (y / (H - 1))) + LEFT

// Deterministic per-cell jitter. Thinning every cell by the same amount gives
// clean horizontal bands, which read as a gradient laid over the art; giving
// each its own threshold makes the tail speckle apart instead.
const jitter = (x, y) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

// padded to a full rectangle: AsciiArt measures the first layer to size the
// box, so a ragged right edge there would crop the other one
const extend = (rows) => {
  const out = Array.from({ length: OH }, (_, y) =>
    y < H ? ' '.repeat(LEFT) + (rows[y] || '').padEnd(W) : ' '.repeat(OW)
  )

  // start the tail at whatever weight the shaft is carrying where it leaves,
  // so the two ramps each continue in their own register
  let base = 0
  for (let y = Math.max(0, H - 4); y < H; y++) {
    for (const ch of rows[y] || '') base = Math.max(base, RAMP.indexOf(ch))
  }

  if (base > 0) {
    for (let i = 0; i < EXTRA; i++) {
      const y = H + i
      const fade = 1 - (i + 1) / (EXTRA + 1)
      const centre = shaftCol(y)
      const line = [...out[y]]
      for (let d = -1; d <= 1; d++) {
        const x = Math.round(centre + d)
        if (x < 0 || x >= OW) continue
        const k = base * Math.max(0, fade - jitter(x, y) * 0.45)
        if (k >= 0.5) line[x] = RAMP[Math.max(1, Math.round(k))]
      }
      out[y] = line.join('')
    }
  }
  return out.join('\n')
}

// One ramp per theme. A dense glyph is a lot of ink, which reads as a bright
// mass on the dark page and a dark one on the light page, so a single ramp
// cannot serve both: on paper the dark-theme art comes out as a photographic
// negative, with the gold highlights landing as the heaviest marks. The light
// pair is drawn off darkness instead, the way a pencil sketch works.
const ART = {
  dark: [
    { art: extend(METAL), tone: 'text-bone/85' },
    { art: extend(GEM), tone: 'text-accent staff-gem' },
  ],
  light: [
    { art: extend(METAL_LIGHT), tone: 'text-bone/85' },
    { art: extend(GEM_LIGHT), tone: 'text-accent staff-gem' },
  ],
}

// Motes drifting off the orb, thinning out down the shaft. Hand-placed rather
// than random so none of them sit on top of the crescents, and declared once as
// static data: these are pure CSS keyframes on twelve spans, so the whole
// effect costs no JS after mount and stays on the compositor. Positions are
// given against the staff itself, then mapped onto the larger grid the tail
// needs, so the margin does not drag them off it.
const MOTES = [
  { x: 52, y: 34, ch: '*', size: 15, rise: 52, dx: -9, dur: 5.2, delay: 0, o: 0.85, alt: false },
  { x: 69, y: 27, ch: '+', size: 12, rise: 44, dx: 7, dur: 6.1, delay: 1.4, o: 0.7, alt: true },
  { x: 43, y: 21, ch: '·', size: 17, rise: 60, dx: -5, dur: 7, delay: 2.6, o: 0.6, alt: false },
  { x: 75, y: 41, ch: '*', size: 13, rise: 48, dx: 11, dur: 5.8, delay: 0.7, o: 0.8, alt: true },
  { x: 37, y: 44, ch: '+', size: 14, rise: 40, dx: -12, dur: 6.6, delay: 3.1, o: 0.65, alt: false },
  { x: 62, y: 14, ch: '·', size: 16, rise: 56, dx: 4, dur: 6.9, delay: 4.2, o: 0.55, alt: true },
  { x: 29, y: 58, ch: '+', size: 11, rise: 38, dx: -6, dur: 7.4, delay: 1.9, o: 0.55, alt: false },
  { x: 81, y: 33, ch: '·', size: 15, rise: 46, dx: 9, dur: 6.3, delay: 5, o: 0.6, alt: false },
  { x: 47, y: 66, ch: '*', size: 11, rise: 34, dx: -4, dur: 7.8, delay: 2.2, o: 0.5, alt: true },
  { x: 23, y: 76, ch: '·', size: 13, rise: 30, dx: -8, dur: 8.2, delay: 3.8, o: 0.45, alt: false },
  { x: 57, y: 7, ch: '+', size: 12, rise: 50, dx: 6, dur: 7.1, delay: 0.4, o: 0.5, alt: true },
  { x: 15, y: 88, ch: '·', size: 12, rise: 26, dx: -5, dur: 8.6, delay: 5.6, o: 0.4, alt: false },
]

const mapX = (x) => ((LEFT + (x / 100) * W) / OW) * 100
const mapY = (y) => ((y / 100) * H * 100) / OH

export default function Staff() {
  const theme = useThemeName()
  const layers = ART[theme] || ART.dark

  return (
    <figure className="mx-auto w-full max-w-[360px]">
      {/* the art keeps its own positioning context, so the caption below can
          grow without dragging the motes off the staff */}
      <div className="relative">
        <div
          className="staff-halo pointer-events-none absolute h-44 w-44 -translate-x-1/2 rounded-full bg-accent/[0.13] blur-[80px]"
          style={{ left: `${mapX(50)}%`, top: `${mapY(30)}%` }}
        />
        <AsciiArt layers={layers} maxWidth={360} className="relative" />

        <div aria-hidden="true" className="staff-motes pointer-events-none absolute inset-0">
          {MOTES.map((m) => (
            <span
              key={`${m.x}-${m.y}`}
              className={`mote font-mono ${m.alt ? 'text-accent2' : 'text-accent'}`}
              style={{
                left: `${mapX(m.x)}%`,
                top: `${mapY(m.y)}%`,
                fontSize: m.size,
                '--rise': `${m.rise}px`,
                '--dx': `${m.dx}px`,
                '--dur': `${m.dur}s`,
                '--delay': `${m.delay}s`,
                '--o': m.o,
              }}
            >
              {m.ch}
            </span>
          ))}
        </div>
      </div>

      {/* Attributed to Himmel alone. Naming the series would explain the joke;
          anyone who knows it will place the staff from the line. */}
      <figcaption className="ml-auto mt-1 max-w-[30ch] text-right">
        <p className="font-serif text-[13px] italic leading-snug text-muted sm:text-sm">
          “It’s not a matter of what exists. What matters is doing what I can for the people
          standing right in front of me”
        </p>
        <p className="eyebrow mt-2">Himmel</p>
      </figcaption>
    </figure>
  )
}
