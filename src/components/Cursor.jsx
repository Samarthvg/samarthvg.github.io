import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useHasFinePointer } from '../lib/hooks'

// Giorno's brooch stands in for the pointer, with petals falling behind it.
// Both take their colour from the accent, so they follow the theme.
//
// The pool has to outlast the spawn rate or the trail eats itself. A petal
// lives LIFE ms, and a fast sweep covers STEP px many times inside that,
// so a pool of 14 was being recycled several times over per petal-lifetime:
// every reuse yanks a mid-flight petal back to the cursor, which is why the
// trail kept thinning out or vanishing at speed. GAP caps the rate at about
// 22 live petals, and the pool is sized above that with room to spare.
const POOL = 30
const STEP = 22 // px of travel before another petal drops
const GAP = 45 // ms floor between petals, so speed cannot exhaust the pool
const LIFE = 1000
const HOVERABLE = 'a,button,input,textarea,select,summary,[role="button"],[role="tab"]'

export default function Cursor() {
  const hostRef = useRef(null)
  const fine = useHasFinePointer()
  const reduce = useReducedMotion()

  useEffect(() => {
    const host = hostRef.current
    if (!fine || !host) return

    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    const brooch = document.createElement('span')
    brooch.className = 'brooch-cursor'
    brooch.innerHTML = '<span class="body"></span><span class="face"></span>'
    host.appendChild(brooch)

    const petals = reduce
      ? []
      : Array.from({ length: POOL }, () => {
          const el = document.createElement('span')
          el.className = 'petal'
          host.appendChild(el)
          return el
        })

    const anims = new Array(POOL).fill(null)
    let visible = false
    let over = false
    let next = 0
    let lastX = 0
    let lastY = 0
    let lastAt = 0
    let primed = false

    const onMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      // written straight through: pointermove is already coalesced to one event
      // per frame, and deferring to rAF strands the brooch at 0,0 whenever the
      // tab is backgrounded and frames stop
      brooch.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`

      if (!visible) {
        visible = true
        brooch.style.opacity = '1'
      }

      const target = e.target instanceof Element ? e.target : null
      const nowOver = Boolean(target?.closest(HOVERABLE))
      if (nowOver !== over) {
        over = nowOver
        brooch.dataset.over = String(nowOver)
      }

      if (!petals.length) return
      if (!primed) {
        primed = true
        lastX = x
        lastY = y
        return
      }
      if (Math.hypot(x - lastX, y - lastY) < STEP) return
      const now = e.timeStamp
      if (now - lastAt < GAP) return
      lastAt = now
      lastX = x
      lastY = y

      const i = next++ % POOL
      const el = petals[i]
      const r = Math.random()
      const size = 5 + r * 4
      const dx = (r - 0.5) * 26
      const dy = 18 + r * 16
      const rot = (r - 0.5) * 90

      el.style.width = `${size}px`
      el.style.height = `${size}px`
      // Driven by the Web Animations API rather than restarted CSS keyframes:
      // the old restart needed a forced reflow (void offsetWidth) on every
      // petal to make the animation play again, which is a synchronous layout
      // in the middle of a pointermove handler.
      anims[i]?.cancel()
      anims[i] = el.animate(
        [
          { opacity: 0.85, transform: `translate3d(${x}px, ${y}px, 0) rotate(0deg) scale(1)` },
          {
            opacity: 0,
            transform: `translate3d(${x + dx}px, ${y + dy}px, 0) rotate(${rot}deg) scale(0.75)`,
          },
        ],
        { duration: LIFE, easing: 'cubic-bezier(0.22,0.61,0.36,1)', fill: 'forwards' }
      )
    }

    const hide = () => {
      visible = false
      brooch.style.opacity = '0'
    }

    // Only hide when the pointer is genuinely off the page. A null
    // relatedTarget is not enough on its own: it also fires when the element
    // under the pointer is removed or replaced mid-animation, which was
    // blinking the cursor out over anything that re-rendered under it.
    const onOut = (e) => {
      if (e.relatedTarget) return
      const { clientX: x, clientY: y } = e
      if (x > 0 && y > 0 && x < window.innerWidth - 1 && y < window.innerHeight - 1) return
      hide()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut)
    window.addEventListener('blur', hide)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
      window.removeEventListener('blur', hide)
      root.classList.remove('has-custom-cursor')
      brooch.remove()
      anims.forEach((a) => a?.cancel())
      petals.forEach((p) => p.remove())
    }
  }, [fine, reduce])

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]" />
}
