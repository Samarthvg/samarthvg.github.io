/**
 * The drifting petal field.
 *
 * Modelled on the flower-field spell: loose curved petals suspended at many
 * scales and angles rather than whole blooms on stems, in three tones —
 * the violet, the gold, and the page's own pale ink.
 *
 * Every petal is a span with a masked silhouette; the fall and the sway are
 * two nested CSS keyframes on transform only, so nothing here touches the
 * main thread after mount. Negative delays start each one mid-flight, so the
 * field is already full on the first frame instead of raining in.
 */

// x, size, fall seconds, sway seconds, start offset, spin, tilt, opacity, tone
const PETALS = [
  ['4%', 22, 52, 9, -14, '220deg', -24, 0.26, 'violet'],
  ['9%', 9, 71, 13, -41, '-180deg', 38, 0.16, 'gold'],
  ['14%', 15, 44, 8, -27, '260deg', 12, 0.2, 'pale'],
  ['19%', 26, 63, 11, -55, '-140deg', -40, 0.22, 'violet'],
  ['25%', 8, 49, 14, -8, '300deg', 64, 0.14, 'gold'],
  ['31%', 18, 57, 10, -36, '-240deg', -16, 0.24, 'violet'],
  ['37%', 11, 68, 12, -61, '160deg', 48, 0.15, 'pale'],
  ['43%', 24, 46, 9, -19, '-200deg', -52, 0.21, 'gold'],
  ['49%', 13, 74, 15, -48, '280deg', 28, 0.17, 'violet'],
  ['55%', 7, 53, 11, -31, '-320deg', 72, 0.13, 'pale'],
  ['60%', 20, 60, 8, -5, '180deg', -34, 0.25, 'violet'],
  ['66%', 10, 67, 13, -52, '-170deg', 20, 0.15, 'gold'],
  ['72%', 17, 48, 10, -24, '240deg', -8, 0.23, 'pale'],
  ['78%', 25, 71, 12, -44, '-260deg', 56, 0.2, 'violet'],
  ['83%', 9, 55, 14, -12, '320deg', -44, 0.14, 'gold'],
  ['88%', 19, 62, 9, -58, '-150deg', 32, 0.22, 'violet'],
  ['93%', 12, 50, 11, -33, '210deg', -60, 0.16, 'pale'],
  ['97%', 15, 69, 13, -17, '-290deg', 8, 0.19, 'gold'],
]

export default function Petals() {
  return (
    <div className="petal-field pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.map(([x, size, dur, sway, delay, spin, tilt, o, tone]) => (
        <div
          key={x}
          className="fall"
          style={{ '--x': x, '--dur': `${dur}s`, '--delay': `${delay}s`, '--spin': spin }}
        >
          <div className="sway" style={{ '--sway-dur': `${sway}s`, '--delay': `${delay}s` }}>
            <span
              className={`leaf leaf--${tone}`}
              style={{ '--size': `${size}px`, '--o': o, '--tilt': `${tilt}deg` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
