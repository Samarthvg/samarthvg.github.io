import { GEM, METAL } from './staffArt'
import AsciiArt from './AsciiArt'

// Frieren's staff, colour-keyed out of a render. The two layers are
// cell-aligned halves of one grid, gold in the page's ink and glass in the
// accent, so the mark re-tints with the theme.
const W = Math.max(...METAL.map((r) => r.length), ...GEM.map((r) => r.length))
const H = Math.max(METAL.length, GEM.length)

// padded to a full rectangle: AsciiArt measures the first layer to size the
// box, so a ragged right edge there would crop the other one
const pad = (rows) =>
  Array.from({ length: H }, (_, i) => (rows[i] || '').padEnd(W)).join('\n')

const LAYERS = [
  { art: pad(METAL), tone: 'text-bone/85' },
  { art: pad(GEM), tone: 'text-accent staff-gem' },
]

// Motes drifting off the orb, thinning out down the shaft. Hand-placed rather
// than random so none of them sit on top of the crescents, and declared once
// as static data: these are pure CSS keyframes on twelve spans, so the whole
// effect costs no JS after mount and stays on the compositor.
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

export default function Staff() {
  return (
    <div className="relative mx-auto w-full max-w-[330px]">
      <div className="staff-halo pointer-events-none absolute left-1/2 top-[30%] h-44 w-44 -translate-x-1/2 rounded-full bg-accent/[0.13] blur-[80px]" />
      <AsciiArt layers={LAYERS} maxWidth={330} className="relative" />

      <div aria-hidden="true" className="staff-motes pointer-events-none absolute inset-0">
        {MOTES.map((m) => (
          <span
            key={`${m.x}-${m.y}`}
            className={`mote font-mono ${m.alt ? 'text-accent2' : 'text-accent'}`}
            style={{
              left: `${m.x}%`,
              top: `${m.y}%`,
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
  )
}
