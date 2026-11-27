import { useEffect, useRef } from 'react'

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
 * no amount of stacking order fixes that. So the field withdraws for it —
 * by how much of the screen About has actually taken, not by whether it has
 * been seen at all. Entering the section is not the same as being in it.
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
  const ref = useRef(null)

  useEffect(() => {
    const about = document.getElementById('about')
    const field = ref.current
    if (!about || !field) return

    // Where the fade runs. Below HOLD the circles are untouched, so arriving
    // at About does nothing; across the next FADE of the screen they go.
    const HOLD = 0.25
    const FADE = 0.45

    let raf = 0
    let last = -1
    const measure = () => {
      raf = 0
      const r = about.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // the share of the viewport About currently covers, not the share of
      // About that happens to be visible — a section taller than the screen
      // would never finish by the latter
      const covered = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / vh
      const t = Math.min(1, Math.max(0, (covered - HOLD) / FADE))
      // Most of a scroll happens nowhere near About, where this resolves to
      // the same 1 every frame. Writing it anyway dirties style for nothing.
      const next = Math.round((1 - t) * 100) / 100
      if (next === last) return
      last = next
      field.style.opacity = String(next)
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className="sg-field" aria-hidden="true">
      <Sigil className="sg--a" spin={240} counter={170} />
      <Sigil className="sg--b" spin={330} counter={225} />
    </div>
  )
}
