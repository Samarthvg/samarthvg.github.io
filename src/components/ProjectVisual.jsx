import { useThemeName } from '../lib/theme'

const W = 480
const H = 240
const A = 'rgb(var(--c-accent))'
const C = 'rgb(var(--c-accent2))'
const F = 'rgb(var(--c-bone))'
const L = 'rgb(var(--c-bone) / 0.16)'
const L2 = 'rgb(var(--c-bone) / 0.3)'
const M = 'rgb(var(--c-muted))'

// deterministic pseudo-random so the artwork never shifts between renders
const rand = (seed) => {
  let s = seed
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296)
}
const toPath = (pts) =>
  pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')

/* ── 01 · retrieval ───────────────────────────── */
const DOCS = (() => {
  const r = rand(7)
  const out = []
  for (let col = 0; col < 5; col++)
    for (let row = 0; row < 4; row++)
      out.push({ x: 150 + col * 40, y: 62 + row * 38, hit: false, o: 0.12 + r() * 0.25 })
  return out.map((d, i) => (i === 3 || i === 9 || i === 16 ? { ...d, hit: true } : d))
})()

function Retrieval() {
  const hits = DOCS.filter((d) => d.hit)
  return (
    <>
      <circle cx="52" cy="120" r="9" fill={A} />
      <circle cx="52" cy="120" r="20" fill="none" stroke={A} strokeOpacity="0.35" />
      <circle cx="52" cy="120" r="32" fill="none" stroke={A} strokeOpacity="0.15" />
      {hits.map((d, i) => (
        <path
          key={i}
          d={`M 66 120 C 110 120, 110 ${d.y + 8}, ${d.x} ${d.y + 8}`}
          fill="none"
          stroke={A}
          strokeOpacity="0.55"
          strokeWidth="1"
        />
      ))}
      {DOCS.map((d, i) => (
        <rect
          key={i}
          x={d.x}
          y={d.y}
          width="26"
          height="16"
          fill={d.hit ? A : F}
          fillOpacity={d.hit ? 0.8 : d.o * 0.35}
          stroke={d.hit ? A : L}
          strokeWidth="0.8"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="376" y={82 + i * 26} width={74 - i * 20} height="7" fill={A} fillOpacity={0.85 - i * 0.22} />
          <rect x="376" y={82 + i * 26} width="74" height="7" fill="none" stroke={L} strokeWidth="0.7" />
        </g>
      ))}
      <text x="376" y="70" className="font-mono" fill={M} fontSize="8" letterSpacing="1.4">
        RERANKED
      </text>
    </>
  )
}

/* ── 02 · time series ─────────────────────────── */
const SERIES = (() => {
  const r = rand(23)
  const make = (drift) => {
    let v = 0
    return Array.from({ length: 60 }, (_, i) => {
      v += (r() - 0.45) * 6 + drift
      return [30 + i * 6.8, 150 - Math.max(-40, Math.min(70, v))]
    })
  }
  return [make(0.55), make(0.28), make(-0.1)]
})()
const RUL = Array.from({ length: 60 }, (_, i) => [30 + i * 6.8, 60 + Math.pow(i / 59, 1.7) * 140])

function TimeSeries() {
  return (
    <>
      {[70, 110, 150, 190].map((y) => (
        <line key={y} x1="30" y1={y} x2="450" y2={y} stroke={L} strokeWidth="0.6" strokeDasharray="2 6" />
      ))}
      <rect x="150" y="52" width="72" height="148" fill={A} fillOpacity="0.06" stroke={A} strokeOpacity="0.3" strokeWidth="0.8" />
      {SERIES.map((s, i) => (
        <path key={i} d={toPath(s)} fill="none" stroke={F} strokeOpacity={0.3 - i * 0.07} strokeWidth="1" />
      ))}
      <path d={toPath(RUL)} fill="none" stroke={A} strokeWidth="1.8" />
      <line x1="30" y1="196" x2="450" y2="196" stroke={C} strokeOpacity="0.5" strokeDasharray="4 4" />
      <text x="34" y="210" className="font-mono" fill={M} fontSize="8" letterSpacing="1.4">
        FAILURE THRESHOLD
      </text>
    </>
  )
}

/* ── 03 · market ──────────────────────────────── */
const CANDLES = (() => {
  const r = rand(91)
  let v = 130
  return Array.from({ length: 26 }, (_, i) => {
    const open = v
    v = Math.max(60, Math.min(190, v + (r() - 0.47) * 22))
    return { x: 34 + i * 16.6, open, close: v, hi: Math.min(open, v) - r() * 14, lo: Math.max(open, v) + r() * 14 }
  })
})()
const ma = (n) =>
  CANDLES.map((c, i) => {
    const s = CANDLES.slice(Math.max(0, i - n + 1), i + 1)
    return [c.x + 3, s.reduce((a, b) => a + b.close, 0) / s.length]
  })
const MA_FAST = ma(3)
const MA_SLOW = ma(9)

function Market() {
  return (
    <>
      {CANDLES.map((c, i) => (
        <g key={i}>
          <line x1={c.x + 3} y1={c.hi} x2={c.x + 3} y2={c.lo} stroke={L2} strokeWidth="0.8" />
          <rect
            x={c.x}
            y={Math.min(c.open, c.close)}
            width="6"
            height={Math.max(2, Math.abs(c.close - c.open))}
            fill={c.close < c.open ? A : C}
            fillOpacity={c.close < c.open ? 0.85 : 0.5}
          />
        </g>
      ))}
      <path d={toPath(MA_SLOW)} fill="none" stroke={F} strokeOpacity="0.35" strokeWidth="1.2" />
      <path d={toPath(MA_FAST)} fill="none" stroke={A} strokeWidth="1.6" />
      <circle cx={MA_FAST[18][0]} cy={MA_FAST[18][1]} r="5" fill="none" stroke={C} strokeWidth="1.2" />
      <text x="34" y="216" className="font-mono" fill={M} fontSize="8" letterSpacing="1.4">
        MA(3) × MA(9) CROSSOVER
      </text>
    </>
  )
}

/* ── 04 · vision ──────────────────────────────── */
const PIXELS = (() => {
  const r = rand(55)
  const out = []
  for (let col = 0; col < 22; col++)
    for (let row = 0; row < 11; row++) out.push({ x: 30 + col * 19, y: 24 + row * 17, o: r() })
  return out
})()

function Vision() {
  return (
    <>
      {PIXELS.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width="17"
          height="15"
          fill={p.o > 0.82 ? A : F}
          fillOpacity={p.o > 0.82 ? 0.45 : p.o * 0.14}
        />
      ))}
      <path
        d="M 150 46 C 190 40, 244 44, 262 84 C 278 122, 272 160, 232 178 C 196 194, 158 178, 148 140 C 140 106, 138 62, 150 46"
        fill="none"
        stroke={A}
        strokeWidth="1.4"
        strokeOpacity="0.85"
      />
      <rect x="138" y="34" width="140" height="158" fill="none" stroke={C} strokeWidth="1" strokeOpacity="0.9" />
      {[[138, 34], [278, 34], [138, 192], [278, 192]].map(([x, y], i) => (
        <rect key={i} x={x - 3} y={y - 3} width="6" height="6" fill={C} />
      ))}
      <text x="138" y="26" className="font-mono" fill={C} fontSize="8" letterSpacing="1.4">
        FACE 0.98
      </text>
      <text x="330" y="216" className="font-mono" fill={M} fontSize="8" letterSpacing="1.4">
        SOBEL
      </text>
    </>
  )
}

/* ── 05 · audio ───────────────────────────────── */
const SPECTRUM = (() => {
  const r = rand(41)
  return Array.from({ length: 58 }, (_, i) => {
    // a few loud partials over a quieter bed, so it reads as a spectrogram
    const bed = 12 + r() * 26
    const peak = r() > 0.82 ? 60 + r() * 70 : 0
    return { x: 30 + i * 7.2, h: bed + peak, onset: r() > 0.87 }
  })
})()

function Audio() {
  return (
    <>
      <line x1="30" y1="188" x2="450" y2="188" stroke={L} strokeWidth="0.8" />
      {SPECTRUM.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={188 - b.h}
          width="4.6"
          height={b.h}
          fill={b.h > 70 ? A : F}
          fillOpacity={b.h > 70 ? 0.85 : 0.22}
        />
      ))}
      {SPECTRUM.filter((b) => b.onset).map((b, i) => (
        <g key={i}>
          <line x1={b.x + 2} y1="46" x2={b.x + 2} y2="188" stroke={C} strokeOpacity="0.45" strokeDasharray="3 4" />
          <rect x={b.x - 1} y="42" width="6" height="6" fill={C} />
        </g>
      ))}
      <text x="34" y="212" className="font-mono" fill={M} fontSize="8" letterSpacing="1.4">
        NOTE ONSETS
      </text>
    </>
  )
}

/* ── 06 · system ──────────────────────────────── */
const NODES = [
  { x: 40, y: 96, w: 74, h: 34, label: 'CLIENT' },
  { x: 176, y: 60, w: 84, h: 34, label: 'API' },
  { x: 176, y: 132, w: 84, h: 34, label: 'AUTH' },
  { x: 322, y: 60, w: 88, h: 34, label: 'MONGO' },
  { x: 322, y: 132, w: 88, h: 34, label: 'S3' },
]
const EDGES = [
  [114, 113, 176, 77],
  [114, 113, 176, 149],
  [260, 77, 322, 77],
  [260, 77, 322, 149],
  [260, 149, 322, 149],
]

function System() {
  return (
    <>
      {EDGES.map(([x1, y1, x2, y2], i) => (
        <path
          key={i}
          d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
          fill="none"
          stroke={A}
          strokeOpacity="0.5"
          strokeWidth="1"
        />
      ))}
      {NODES.map((n, i) => (
        <g key={n.label}>
          <rect
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            fill={i === 0 ? A : F}
            fillOpacity={i === 0 ? 0.16 : 0.05}
            stroke={i === 0 ? A : L2}
            strokeWidth="1"
          />
          <text
            x={n.x + n.w / 2}
            y={n.y + n.h / 2 + 3}
            textAnchor="middle"
            className="font-mono"
            fill={i === 0 ? A : M}
            fontSize="9"
            letterSpacing="1.2"
          >
            {n.label}
          </text>
        </g>
      ))}
      <text x="40" y="196" className="font-mono" fill={M} fontSize="8" letterSpacing="1.4">
        ROLE-BASED ACCESS
      </text>
    </>
  )
}

/* ── 07 · chat ────────────────────────────────── */
/* A conversation that shows its working: the answer carries two numbered
   citations, and each one runs back to the document it came out of. The
   whole claim of a RAG assistant in one picture. */
const ASK = [
  { x: 156, y: 22, w: 140, h: 30, lines: [[168, 100], [168, 62]] },
  { x: 186, y: 160, w: 110, h: 28, lines: [[198, 74], [198, 48]] },
]
const REPLY_LINES = [
  [40, 182],
  [40, 198],
  [40, 138],
]
const CITES = [
  { x: 40, cite: '1', doc: 1 },
  { x: 74, cite: '2', doc: 3 },
]
const SOURCES = Array.from({ length: 5 }, (_, i) => ({ y: 36 + i * 32 }))

function Chat() {
  return (
    <>
      {/* what the reply is grounded in */}
      {SOURCES.map((d, i) => {
        const hit = CITES.some((c) => c.doc === i)
        return (
          <rect
            key={i}
            x="352"
            y={d.y}
            width="104"
            height="22"
            fill={hit ? A : F}
            fillOpacity={hit ? 0.18 : 0.05}
            stroke={hit ? A : L}
            strokeWidth="1"
          />
        )
      })}

      {/* citation to source */}
      {CITES.map((c) => (
        <path
          key={c.cite}
          d={`M ${c.x + 26} 130 C ${c.x + 150} 130, 250 ${SOURCES[c.doc].y + 11}, 352 ${
            SOURCES[c.doc].y + 11
          }`}
          fill="none"
          stroke={A}
          strokeOpacity="0.4"
          strokeWidth="1"
        />
      ))}

      {/* the assistant's turn */}
      <rect x="24" y="62" width="228" height="86" rx="2" fill={F} fillOpacity="0.05" stroke={L2} strokeWidth="1" />
      {REPLY_LINES.map(([x, w], i) => (
        <rect key={i} x={x} y={78 + i * 14} width={w} height="4" fill={F} fillOpacity="0.22" />
      ))}
      {CITES.map((c) => (
        <g key={c.cite}>
          <rect x={c.x} y="122" width="26" height="16" fill={A} fillOpacity="0.22" stroke={A} strokeOpacity="0.6" strokeWidth="1" />
          <text x={c.x + 13} y="134" textAnchor="middle" className="font-mono" fill={A} fontSize="9">
            {c.cite}
          </text>
        </g>
      ))}

      {/* the visitor's turns */}
      {ASK.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2" fill={A} fillOpacity="0.18" stroke={A} strokeOpacity="0.55" strokeWidth="1" />
          {b.lines.map(([x, w], j) => (
            <rect key={j} x={x} y={b.y + 10 + j * 10} width={w} height="4" fill={A} fillOpacity="0.5" />
          ))}
        </g>
      ))}

      <text x="24" y="224" className="font-mono" fill={M} fontSize="8" letterSpacing="1.4">
        ANSWER TRACED TO SOURCE
      </text>
    </>
  )
}

const MAP = {
  chat: Chat,
  retrieval: Retrieval,
  timeseries: TimeSeries,
  market: Market,
  vision: Vision,
  audio: Audio,
  system: System,
}

/**
 * Drawn artwork by default; a real screenshot where a project has one.
 *
 * `shot` may be a single path or { dark, light }. The pair exists because a
 * screenshot carries its own brightness: a cream UI blazes against the dark
 * theme and a near-black one punches a hole in the light theme. Where a
 * project ships both skins, the shot follows the site's theme instead, and the
 * grade in .shot only has to pull the hue into the palette.
 *
 * A project with only one skin therefore falls back to the drawing in the
 * other theme rather than showing a screenshot fighting the page — and a
 * project whose interface has no second skin at all passes a single path,
 * which is served in both, the veil in .shot-veil carrying it across.
 */
export default function ProjectVisual({ kind, shot, fit = 'cover', veil = true, className = '' }) {
  const theme = useThemeName()
  const src = typeof shot === 'string' ? shot : shot && shot[theme]

  if (src) {
    return (
      <div
        className={`relative overflow-hidden bg-raised ${veil ? 'shot-frame' : ''} ${className}`}
        aria-hidden="true"
      >
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className={`shot h-full w-full ${veil ? '' : 'shot-bare'} ${
            fit === 'contain' ? 'object-contain' : 'object-cover object-top'
          }`}
        />
        {veil && <span className="shot-veil pointer-events-none absolute inset-0" />}
      </div>
    )
  }

  const Art = MAP[kind] || Retrieval
  return (
    <div className={`relative overflow-hidden bg-raised ${className}`} aria-hidden="true">
      <div className="dotgrid absolute inset-0 opacity-40" />
      <svg viewBox={`0 0 ${W} ${H}`} className="relative h-full w-full" preserveAspectRatio="xMidYMid slice">
        <Art />
      </svg>
    </div>
  )
}
