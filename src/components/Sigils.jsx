/**
 * A spell circle, turning slowly behind a section.
 *
 * Drawn as clockwork rather than as occultism: concentric rings, a collar of
 * fine ticks, a dashed register and an inscribed polygon, which is the
 * register Frieren's magic sits in — closer to an astrolabe than a pentagram.
 * Two counter-rotating halves, so the rings shear against each other and it
 * never looks like a single turning wheel.
 *
 * Placed per section rather than fixed behind the whole page. Run page-wide
 * it crossed the copy everywhere, and on About it drew straight through the
 * clip — which cannot be fixed by sending it further back, because that clip
 * is only a quarter opaque and the rings simply read through it. So it lives
 * where there is room for it instead: behind the staff, where a circle round
 * a mage's staff is the one place it is obviously at home, and in the empty
 * half of Contact.
 */

const TICKS = (n, r, len) =>
  Array.from({ length: n }, (_, i) => {
    const a = ((i / n) * 360 * Math.PI) / 180
    const c = Math.cos(a)
    const s = Math.sin(a)
    return `M${(100 + c * r).toFixed(1)} ${(100 + s * r).toFixed(1)}L${(100 + c * (r + len)).toFixed(1)} ${(100 + s * (r + len)).toFixed(1)}`
  }).join('')

const POLY = (n, r, rot = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = (((i / n) * 360 + rot) * Math.PI) / 180
    return `${(100 + Math.cos(a) * r).toFixed(1)},${(100 + Math.sin(a) * r).toFixed(1)}`
  }).join(' ')

export function Sigil({ className, spin = 240, counter = 170 }) {
  return (
    <svg className={`sg ${className}`} viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <g className="sg-turn" style={{ '--spin-dur': `${spin}s` }}>
        <circle cx="100" cy="100" r="97" className="sg-hair" />
        <circle cx="100" cy="100" r="92" className="sg-hair" />
        <path d={TICKS(72, 83, 6)} className="sg-tick" />
        <circle cx="100" cy="100" r="80" className="sg-ring" />
        <path d={TICKS(12, 62, 14)} className="sg-tick sg-gold" />
      </g>

      <g className="sg-turn sg-turn--back" style={{ '--spin-dur': `${counter}s` }}>
        <circle cx="100" cy="100" r="62" className="sg-dash" />
        <polygon points={POLY(6, 54)} className="sg-ring" />
        <polygon points={POLY(6, 54, 30)} className="sg-hair sg-gold" />
        <circle cx="100" cy="100" r="38" className="sg-hair" />
        <circle cx="100" cy="100" r="26" className="sg-dash sg-gold" />
        {[0, 60, 120, 180, 240, 300].map((d) => {
          const a = (d * Math.PI) / 180
          return (
            <circle
              key={d}
              cx={(100 + Math.cos(a) * 54).toFixed(1)}
              cy={(100 + Math.sin(a) * 54).toFixed(1)}
              r="2.4"
              className="sg-node"
            />
          )
        })}
      </g>
    </svg>
  )
}
