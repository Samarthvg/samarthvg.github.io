import { useCallback, useEffect, useRef, useState } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = (e) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

export const useIsDesktop = () => useMediaQuery('(min-width: 768px)')
export const useHasFinePointer = () => useMediaQuery('(pointer: fine)')

/** Tracks which section id is currently dominant in the viewport. */
export function useActiveSection(ids, offset = 0.35) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    let raf = 0
    const measure = () => {
      raf = 0
      const line = window.innerHeight * offset
      let current = null
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4)
        current = els[els.length - 1].id
      setActive(current)
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
  }, [ids, offset])
  return active
}

/** Element width, kept in sync with resize. */
export function useElementWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    setWidth(el.getBoundingClientRect().width)
    return () => ro.disconnect()
  }, [])
  return [ref, width]
}

/** Locks body scroll while `locked` is true, without layout shift. */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const { body } = document
    const prevOverflow = body.style.overflow
    const prevPad = body.style.paddingRight
    const gap = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPad
    }
  }, [locked])
}

/** Fires `fn` on keydown for the given key. */
export function useKey(key, fn, active = true) {
  const saved = useRef(fn)
  saved.current = fn
  useEffect(() => {
    if (!active) return
    const on = (e) => {
      if (e.key === key) saved.current(e)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [key, active])
}

export function useSmoothScrollTo() {
  return useCallback((id) => {
    const el = document.getElementById(id)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }, [])
}
