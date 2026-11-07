import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { projects } from '../data/portfolio'
import { LinkChip, Reveal, SectionHead, StackList } from './ui'
import ProjectVisual from './ProjectVisual'
import ProjectDetail from './ProjectDetail'

const N = projects.length

/**
 * Filters, built from the tags on the work itself rather than written out
 * twice. Every project carries at least one, and none of them resolves to a
 * single result, so no filter is a dead end.
 */
const FILTERS = (() => {
  const seen = new Map()
  for (const p of projects) for (const t of p.tags || []) seen.set(t, (seen.get(t) || 0) + 1)
  return [
    { id: null, label: 'All', count: N },
    ...[...seen].map(([label, count]) => ({ id: label, label, count })),
  ]
})()

export default function Projects() {
  const [tag, setTag] = useState(null)
  const [open, setOpen] = useState(null)

  const shown = useMemo(
    () => (tag ? projects.filter((p) => p.tags?.includes(tag)) : projects),
    [tag]
  )

  return (
    <section id="projects" className="relative py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <SectionHead
          index="03"
          title="Projects"
          note={tag ? `${shown.length} of ${N}` : `${N} in total`}
        />

        {/* Every project is on the page at once. The carousel showed one at a
            time, which meant a reader looking for a particular kind of work
            had to page through everything to find out whether it was there —
            and the seven inactive cards were out of the tab order and out of
            reach of the browser's own find. */}
        <Reveal className="flex flex-wrap items-baseline gap-x-7 gap-y-3 border-b border-line pb-5">
          {FILTERS.map((f) => {
            const on = tag === f.id
            return (
              <button
                key={f.label}
                onClick={() => setTag(f.id)}
                aria-pressed={on}
                className={`group flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  on ? 'text-accent' : 'text-muted hover:text-bone'
                }`}
              >
                {f.label}
                <span
                  className={`text-[10px] transition-colors duration-300 ${
                    on ? 'text-accent/70' : 'text-faint'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            )
          })}
        </Reveal>

        <motion.ul
          layout
          className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex"
              >
                <ProjectCard project={p} onSelect={() => setOpen(p)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <AnimatePresence>
        {open && <ProjectDetail project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  )
}

function ProjectCard({ project: p, onSelect }) {
  return (
    <motion.article
      layoutId={`card-${p.id}`}
      transition={{ type: 'spring', stiffness: 300, damping: 34 }}
      className="group relative flex w-full flex-col border border-line bg-panel transition-colors duration-300 hover:border-line2"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-mono text-[10px] text-accent">{p.index}</span>
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {p.kicker}
          </span>
        </div>
      </div>

      <ProjectVisual kind={p.visual} shot={p.shot} className="aspect-[2/1] w-full shrink-0" />

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        {/* The whole card is not a button: it holds its own links, and nesting
            those inside one makes both the markup and the hit target wrong.
            The title is the control, and it stretches over the card. */}
        <h3 className="display text-[clamp(1.5rem,2.3vw,1.95rem)] text-bone">
          {/* uppercase is repeated here deliberately: the UA stylesheet resets
              text-transform on form controls, so it does not inherit from the
              heading the way the rest of .display does. */}
          <button
            onClick={onSelect}
            className="text-left uppercase transition-colors duration-300 before:absolute before:inset-0 before:content-[''] group-hover:text-accent"
          >
            {p.name}
          </button>
        </h3>

        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted">{p.tagline}</p>

        <StackList items={p.stack.slice(0, 4)} className="mb-4 mt-auto pt-5" />

        {/* min-height rather than natural height: a project with no links has
            only the bare "Details" in this row, and without a floor its
            footer would sit higher than its neighbours' in the same row. */}
        <div className="relative z-10 flex min-h-[38px] flex-wrap items-center gap-2">
          {p.github && <LinkChip href={p.github} icon={Github} label="Code" />}
          {p.demo && <LinkChip href={p.demo} icon={ExternalLink} label="Demo" />}
          <span className="ml-auto h-px flex-1 bg-line" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint transition-colors duration-300 group-hover:text-accent">
            Details →
          </span>
        </div>
      </div>
    </motion.article>
  )
}
