import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Github, ExternalLink } from 'lucide-react'
import { projects } from '../data/portfolio'
import { useElementWidth, useIsDesktop } from '../lib/hooks'
import { LinkChip, Reveal, SectionHead, StackList } from './ui'
import ProjectVisual from './ProjectVisual'
import ProjectDetail from './ProjectDetail'

const N = projects.length
const SPRING = { type: 'spring', stiffness: 210, damping: 30, mass: 0.9 }

export default function Projects() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(null)
  const activeRef = useRef(0)
  const viewportRef = useRef(null)
  const [wrapRef, w] = useElementWidth()
  const isDesktop = useIsDesktop()

  const go = useCallback((i) => {
    const next = Math.max(0, Math.min(N - 1, i))
    activeRef.current = next
    setActive(next)
  }, [])

  // wheel: horizontal always, vertical only while hovering and not at an end
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    let acc = 0
    let lock = false
    const onWheel = (e) => {
      if (open) return
      const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2
      const d = horiz ? e.deltaX : e.deltaY
      const i = activeRef.current
      if (!horiz && ((d > 0 && i >= N - 1) || (d < 0 && i <= 0))) return // let the page scroll
      e.preventDefault()
      if (lock) return
      acc += d
      if (Math.abs(acc) > 48) {
        go(i + Math.sign(acc))
        acc = 0
        lock = true
        setTimeout(() => (lock = false), 340)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [go, open])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1) }
    if (e.key === 'Home') { e.preventDefault(); go(0) }
    if (e.key === 'End') { e.preventDefault(); go(N - 1) }
  }

  const cardW = isDesktop ? Math.min(660, Math.max(430, w * 0.5)) : Math.max(240, Math.min(400, w * 0.84))
  const spacing = cardW + (isDesktop ? 44 : 16)

  return (
    <section id="projects" className="relative py-24 sm:py-32 lg:py-40">
      <div className="shell" ref={wrapRef}>
        <SectionHead index="03" title="Projects" note="Drag · scroll · arrows" />
      </div>

      {/* full-bleed stage */}
      <div
        ref={viewportRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Selected projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative w-full overflow-hidden outline-none"
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 || info.velocity.x < -450) go(activeRef.current + 1)
            else if (info.offset.x > 60 || info.velocity.x > 450) go(activeRef.current - 1)
          }}
          className="relative h-[520px] cursor-grab active:cursor-grabbing sm:h-[560px]"
        >
          {projects.map((p, i) => {
            const off = i - active
            const on = off === 0
            const abs = Math.abs(off)
            return (
              <motion.div
                key={p.id}
                className="absolute left-1/2 top-0"
                style={{ width: cardW, zIndex: 20 - abs }}
                animate={{
                  x: off * spacing - cardW / 2,
                  scale: on ? 1 : 0.85,
                  opacity: abs === 0 ? 1 : abs === 1 ? 0.42 : 0.16,
                }}
                transition={SPRING}
              >
                <ProjectCard
                  project={p}
                  active={on}
                  onSelect={() => (on ? setOpen(p) : go(i))}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* controls */}
      <div className="shell mt-10">
        <Reveal className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-bone">{projects[active].index}</span>
            <span className="relative h-px w-28 bg-line sm:w-44">
              <motion.span
                className="absolute inset-y-0 bg-accent"
                animate={{ left: `${(active / N) * 100}%`, width: `${100 / N}%` }}
                transition={SPRING}
              />
            </span>
            <span className="font-mono text-xs text-faint">{String(N).padStart(2, '0')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go(active - 1)}
              disabled={active === 0}
              aria-label="Previous project"
              className="icon-btn h-10 w-10 disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft size={16} strokeWidth={1.6} />
            </button>
            <button
              onClick={() => go(active + 1)}
              disabled={active === N - 1}
              aria-label="Next project"
              className="icon-btn h-10 w-10 disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowRight size={16} strokeWidth={1.6} />
            </button>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {open && <ProjectDetail project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  )
}

function ProjectCard({ project: p, active, onSelect }) {
  return (
    <motion.article
      layoutId={`card-${p.id}`}
      onClick={onSelect}
      role="button"
      tabIndex={active ? 0 : -1}
      aria-label={`${p.name}, open details`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect() }
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 34 }}
      className={`group flex h-[520px] select-none flex-col border bg-panel sm:h-[560px] ${
        active ? 'border-line2' : 'border-line'
      }`}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-accent">{p.index}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{p.kicker}</span>
        </div>
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity duration-300 ${
            active ? 'text-faint opacity-100 group-hover:text-accent' : 'opacity-0'
          }`}
        >
          Open
        </span>
      </div>

      <ProjectVisual kind={p.visual} className="h-[190px] shrink-0 sm:h-[220px]" />

      <div className="flex flex-1 flex-col justify-between px-5 pb-6 pt-6 sm:px-7 sm:pb-7">
        <div>
          <h3 className="display text-[clamp(1.7rem,3.4vw,2.6rem)] text-bone">{p.name}</h3>
          <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-muted sm:text-[15px]">{p.tagline}</p>
        </div>

        <div>
          <StackList items={p.stack} className="mb-5" />
          <div className="flex flex-wrap items-center gap-2">
            {p.github && (
              <LinkChip href={p.github} icon={Github} label="Code" />
            )}
            {p.demo && <LinkChip href={p.demo} icon={ExternalLink} label="Demo" />}
            <span className="ml-auto h-px flex-1 bg-line" aria-hidden="true" />
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.18em] text-accent transition-opacity duration-300 ${
                active ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Details →
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
