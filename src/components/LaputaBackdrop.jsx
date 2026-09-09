import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * The clip, stretched full bleed behind a section and faded top and bottom.
 *
 * The file is the full 16:9 frame, not a crop, and the frame is capped at
 * 54vw tall. Both matter. A pre-cropped file gets scaled up by more than half
 * again in a section this shape and reads as a heavy zoom; and the section
 * itself grows taller as the window narrows, so without the cap its ratio
 * eventually falls below the clip's 1.8:1, at which point cover switches to
 * scaling by height. At 900px that left barely half the frame's width on
 * screen. The cap keeps the box wider than 1.8:1 at every width, so cover
 * always scales by width and the whole frame stays in view.
 *
 * What cover trims comes off the bottom, hence object-top: the golem's head
 * sits in the first third of the frame and its chest ends around 43%.
 */
export default function LaputaBackdrop() {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  // Only run the loop while it is on screen. Browsers throttle offscreen video
  // unevenly, and there is no reason to decode frames nobody is looking at.
  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  return (
    <div
      aria-hidden="true"
      className="scene-frame pointer-events-none absolute inset-x-0 top-0 h-[min(100%,54vw)]"
    >
      {/* preload is auto rather than metadata: under reduced motion the clip
          never plays and has to render its first frame as a still. At 61kB
          that costs nothing. */}
      <video
        ref={ref}
        className="scene scene--motion h-full w-full object-cover object-top"
        src="/laputa.mp4"
        muted
        loop
        playsInline
        preload="auto"
        autoPlay={!reduce}
      />
    </div>
  )
}
