import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useHasFinePointer } from '../lib/hooks'

// Giorno's brooch stands in for the pointer, with petals falling behind it.
// Both take their colour from the accent, so they follow the theme.
const POOL = 14
const STEP = 22 // px of travel before another petal drops
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

    let visible = false
    let over = false
    let next = 0
    let lastX = 0
    let lastY = 0
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
      lastX = x
      lastY = y

      const el = petals[next++ % POOL]
      const r = Math.random()
      el.style.setProperty('--size', `${5 + r * 4}px`)
      el.style.setProperty('--px', `${x}px`)
      el.style.setProperty('--py', `${y}px`)
      el.style.setProperty('--dx', `${(r - 0.5) * 26}px`)
      el.style.setProperty('--dy', `${18 + r * 16}px`)
      el.style.setProperty('--rot', `${(r - 0.5) * 90}deg`)
      el.style.animation = 'none'
      void el.offsetWidth // restart the keyframes
      el.style.animation = `petal-fall ${LIFE}ms cubic-bezier(0.22,0.61,0.36,1) forwards`
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
      petals.forEach((p) => p.remove())
    }
  }, [fine, reduce])

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]" />
}
