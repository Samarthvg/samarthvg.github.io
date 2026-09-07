// Slow ambient drift. Pure CSS keyframes on transform — no JS per frame.
const PETALS = [
  { x: '7%', size: 7, dur: 44, sway: 7, delay: -6, spin: '200deg', o: 0.14 },
  { x: '21%', size: 5, dur: 58, sway: 11, delay: -22, spin: '-160deg', o: 0.1 },
  { x: '34%', size: 8, dur: 50, sway: 9, delay: -34, spin: '260deg', o: 0.12 },
  { x: '48%', size: 5, dur: 66, sway: 13, delay: -12, spin: '-220deg', o: 0.09 },
  { x: '62%', size: 7, dur: 47, sway: 8, delay: -47, spin: '180deg', o: 0.13 },
  { x: '76%', size: 5, dur: 61, sway: 12, delay: -28, spin: '-280deg', o: 0.1 },
  { x: '88%', size: 6, dur: 53, sway: 10, delay: -3, spin: '240deg', o: 0.12 },
]

export default function Petals() {
  return (
    <div className="petal-field pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.map((p) => (
        <div
          key={p.x}
          className="fall"
          style={{
            '--x': p.x,
            '--dur': `${p.dur}s`,
            '--delay': `${p.delay}s`,
            '--spin': p.spin,
          }}
        >
          <div className="sway" style={{ '--sway-dur': `${p.sway}s`, '--delay': `${p.delay}s` }}>
            <span className="leaf" style={{ '--size': `${p.size}px`, '--o': p.o }} />
          </div>
        </div>
      ))}
    </div>
  )
}
