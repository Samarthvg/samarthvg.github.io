/**
 * The ambient wave field behind the page.
 *
 * Built from cubic Béziers rather than sampled points: a half period of a sine
 * is approximated almost exactly by one cubic whose controls sit at 0.3636 and
 * 0.6364 of its width at 1.0947 times its amplitude, so a whole wave costs two
 * curves instead of a few hundred coordinates. The whole field is well under a
 * kilobyte of markup.
 *
 * It drifts by exactly one period, which is why the loop has no seam: after
 * translating by PERIOD the field is identical to where it started. Only
 * transform animates, so each band is a composited layer and the paint happens
 * once.
 */
const VIEW_W = 2400
const VIEW_H = 600
const PERIOD = 600

/** One wave line across the full viewBox, as a path. */
function line(y, amp) {
  const h = amp * 1.0947
  let d = `M0 ${y}`
  for (let x = 0; x < VIEW_W; x += PERIOD) {
    const q = PERIOD / 2
    d +=
      `c${(q * 0.3636).toFixed(0)} ${-h.toFixed(1)} ${(q * 0.6364).toFixed(0)} ${-h.toFixed(1)} ${q} 0` +
      `c${(q * 0.3636).toFixed(0)} ${h.toFixed(1)} ${(q * 0.6364).toFixed(0)} ${h.toFixed(1)} ${q} 0`
  }
  return d
}

// Three bands at different depths. The far one is dense and shallow, the near
// one sparse and tall, which is what reads as distance once they drift at
// different speeds.
const BANDS = [
  { cls: 'wave--far', lines: Array.from({ length: 9 }, (_, i) => [210 + i * 32, 9 + (i % 3) * 3]) },
  { cls: 'wave--mid', lines: Array.from({ length: 5 }, (_, i) => [300 + i * 58, 20 + (i % 2) * 7]) },
  { cls: 'wave--near', lines: Array.from({ length: 3 }, (_, i) => [360 + i * 96, 34 + i * 6]) },
]

export default function Waves() {
  return (
    <div aria-hidden="true" className="wave-field">
      <svg
        className="wave-svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        {BANDS.map((b) => (
          <g key={b.cls} className={`wave ${b.cls}`}>
            {b.lines.map(([y, amp]) => (
              <path key={`${y}-${amp}`} d={line(y, amp)} />
            ))}
          </g>
        ))}
      </svg>
    </div>
  )
}
