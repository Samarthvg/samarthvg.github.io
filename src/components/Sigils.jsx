import { useEffect, useState } from 'react'

/**
 * The spell circles: one set, fixed behind the whole page.
 *
 * Drawn as clockwork rather than as occultism: concentric rings, a collar of
 * fine ticks, a dashed register and an inscribed polygon, which is the
 * register Frieren's magic sits in — closer to an astrolabe than a pentagram.
 * Two counter-rotating halves, so the rings shear against each other and it
 * never looks like a single turning wheel.
 *
 * One set for the whole site rather than a figure per section: fixed to the
 * viewport, so the same circles stay put as the page moves behind them and
 * they read as the room the site is in rather than as decoration repeated
 * section by section. In the hero that puts the large one round the staff,
 * which is where a circle round a mage's staff belongs anyway.
 *
 * About is the one place it cannot stay. That section's clip is only about a
 * quarter opaque, so rings behind it read straight through the picture, and
 * no amount of stacking order fixes that. So the field watches for About and
 * takes itself out of the way while it is on screen.
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

function Sigil({ className, spin = 240, counter = 170 }) {
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

export default function Sigils() {
  const [dim, setDim] = useState(false)

  useEffect(() => {
    const about = document.getElementById('about')
    if (!about) return
    // The margins mean the fade starts as About takes the middle of the
    // screen rather than the instant its top edge appears, so the circles
    // are gone by the time there is anything to read over.
    const io = new IntersectionObserver(([e]) => setDim(e.isIntersecting), {
      rootMargin: '-28% 0px -28% 0px',
    })
    io.observe(about)
    return () => io.disconnect()
  }, [])

  return (
    <div className={`sg-field ${dim ? 'sg-field--dim' : ''}`} aria-hidden="true">
      <Sigil className="sg--a" spin={240} counter={170} />
      <Sigil className="sg--b" spin={330} counter={225} />
    </div>
  )
}
