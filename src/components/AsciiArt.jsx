import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Stacked monospace layers, scaled to fit their container.
 *
 * Browsers enforce a minimum font-size, so asking for a 6px <pre> silently
 * renders far wider than requested and blows past the column. Draw at a safe
 * 10px and shrink by transform, which nothing clamps.
 */
export default function AsciiArt({ layers, maxWidth = 460, className = '' }) {
  const boxRef = useRef(null)
  const artRef = useRef(null)
  const [fit, setFit] = useState({ scale: 1, left: 0, height: 0 })

  useLayoutEffect(() => {
    const box = boxRef.current
    const art = artRef.current
    if (!box || !art) return
    const measure = () => {
      const natural = art.offsetWidth
      const avail = box.clientWidth
      if (!natural || !avail) return
      const scale = Math.min(1, avail / natural)
      setFit({
        scale,
        left: (avail - natural * scale) / 2,
        height: art.offsetHeight * scale,
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className={`relative w-full select-none ${className}`}
      style={{ maxWidth, height: fit.height || undefined }}
    >
      {layers.map((layer, i) => (
        <pre
          key={i}
          ref={i === 0 ? artRef : undefined}
          className={`absolute top-0 m-0 whitespace-pre font-mono text-[10px] leading-[1.05] ${layer.tone}`}
          style={{ left: fit.left, transform: `scale(${fit.scale})`, transformOrigin: 'top left' }}
        >
          {layer.art}
        </pre>
      ))}
    </div>
  )
}
