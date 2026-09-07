import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, Github, X } from 'lucide-react'
import { useKey, useScrollLock } from '../lib/hooks'
import { EASE, LinkChip } from './ui'
import ProjectVisual from './ProjectVisual'

export default function ProjectDetail({ project: p, onClose }) {
  const panelRef = useRef(null)
  const restoreRef = useRef(null)

  useScrollLock(true)
  useKey('Escape', onClose)

  useEffect(() => {
    restoreRef.current = document.activeElement
    panelRef.current?.focus()
    return () => restoreRef.current?.focus?.()
  }, [])

  // rudimentary focus containment
  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return
    const nodes = panelRef.current?.querySelectorAll('a[href], button:not([disabled])')
    if (!nodes?.length) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-6 lg:p-10">
      <motion.div
        className="absolute inset-0 bg-ink/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
      />

      <motion.div
        layoutId={`card-${p.id}`}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${p.name} details`}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        transition={{ type: 'spring', stiffness: 300, damping: 34 }}
        className="relative flex h-full w-full max-w-[1080px] flex-col overflow-hidden border border-line2 bg-panel outline-none sm:h-auto sm:max-h-[88vh]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-accent">{p.index}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{p.kicker}</span>
          </div>
          <button onClick={onClose} aria-label="Close" className="icon-btn h-9 w-9">
            <X size={15} strokeWidth={1.7} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <ProjectVisual kind={p.visual} className="h-[180px] sm:h-[260px]" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.16 }}
            className="px-5 pb-10 pt-8 sm:px-8 sm:pb-12"
          >
            <h2 className="display text-[clamp(2rem,6vw,4rem)] text-bone">{p.name}</h2>
            <p className="mt-4 max-w-[38ch] font-serif text-xl italic text-accent sm:text-2xl">
              {p.tagline}
            </p>

            <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-14">
              <div className="md:col-span-7">
                <p className="max-w-[58ch] text-[15px] leading-relaxed text-muted sm:text-base">
                  {p.description}
                </p>
                <ul className="mt-8 border-t border-line">
                  {p.highlights.map((h, i) => (
                    <motion.li
                      key={h}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.24 + i * 0.06 }}
                      className="flex items-start gap-3 border-b border-line py-3.5 text-sm leading-relaxed text-bone/85"
                    >
                      <ArrowUpRight size={14} strokeWidth={1.8} className="mt-0.5 shrink-0 text-accent/70" />
                      {h}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-5">
                <p className="eyebrow">Stack</p>
                <ul className="mt-4 grid grid-cols-2 gap-x-4">
                  {p.stack.map((t, i) => (
                    <motion.li
                      key={t}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="border-b border-line py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-bone/80"
                    >
                      {t}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-2">
                  {p.github && <LinkChip href={p.github} icon={Github} label="Source" />}
                  {p.demo && <LinkChip href={p.demo} icon={ExternalLink} label="Live demo" />}
                  {!p.github && !p.demo && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                      Links coming soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
