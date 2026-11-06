import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import { projects } from '../data/portfolio'
import { EASE, LinkChip, Reveal, SectionHeading, StackList } from './ui'
import ProjectVisual from './ProjectVisual'

const LEAD = projects.filter((p) => p.featured)
const REST = projects.filter((p) => !p.featured)

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-28 lg:py-32">
      <div className="shell">
        <SectionHeading
          title="Projects"
          meta={`${LEAD.length} in full · ${REST.length} more`}
        />

        {/* Each lead project gets a full row and its own screenshot rather
            than a slot in a carousel. The work is the content; a card deck
            made every project the same size and showed one at a time. */}
        <div className="mt-16 sm:mt-20">
          {LEAD.map((p, i) => (
            <LeadProject key={p.id} project={p} flip={i % 2 === 1} first={i === 0} />
          ))}
        </div>

        <Reveal className="mt-20 sm:mt-24">
          <h3 className="display text-[1.6rem] text-bone sm:text-[1.9rem]">Also built</h3>
          <ul className="mt-8 border-t border-line">
            {REST.map((p) => (
              <li key={p.id}>
                <div className="group grid items-baseline gap-x-8 gap-y-1.5 border-b border-line py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:py-6">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h4 className="text-[17px] text-bone sm:text-lg">{p.name}</h4>
                    {(p.github || p.demo) && (
                      <a
                        href={p.demo || p.github}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${p.name}, open ${p.demo ? 'demo' : 'source'}`}
                        className="text-faint transition-colors duration-300 hover:text-accent"
                      >
                        <ArrowUpRight size={15} strokeWidth={1.7} />
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <p className="text-sm text-muted">{p.kicker}</p>
                    <StackList items={p.stack.slice(0, 4)} className="sm:justify-end" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

function LeadProject({ project: p, flip, first }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`grid gap-8 lg:grid-cols-12 lg:gap-14 ${
        first ? '' : 'mt-20 border-t border-line pt-20 sm:mt-24 sm:pt-24'
      }`}
    >
      {/* The shot holds while its write-up scrolls past. Without this the
          image column simply ran out and left a third of the row empty. */}
      <div
        className={`self-start lg:col-span-7 lg:sticky lg:top-24 ${flip ? 'lg:order-2' : ''}`}
      >
        <div className="overflow-hidden border border-line bg-panel">
          {/* 2:1, which is what every screenshot in public/shots is authored
              at, so cover crops nothing. */}
          <ProjectVisual kind={p.visual} shot={p.shot} className="aspect-[2/1] w-full" />
        </div>
      </div>

      {/* The cap only bites below lg, where this column goes full width and
          the copy would otherwise run to ninety characters a line. */}
      <div className={`max-w-[58ch] lg:col-span-5 lg:max-w-none ${flip ? 'lg:order-1' : ''}`}>
        <p className="text-sm text-accent">{p.kicker}</p>
        <h3 className="display mt-3 text-[clamp(2rem,4.2vw,2.9rem)] text-bone">{p.name}</h3>
        <p className="mt-4 font-serif text-lg italic leading-snug text-bone/85 sm:text-xl">
          {p.tagline}
        </p>
        <p className="mt-6 max-w-[48ch] text-[15px] leading-[1.7] text-muted">{p.description}</p>

        <ul className="mt-7 space-y-2.5">
          {p.highlights.slice(0, 3).map((h) => (
            <li
              key={h}
              className="relative pl-5 text-[14px] leading-[1.6] text-bone/75 before:absolute before:left-0 before:top-[0.62em] before:h-px before:w-2.5 before:bg-accent/55"
            >
              {h}
            </li>
          ))}
        </ul>

        <StackList items={p.stack} className="mt-7 border-t border-line pt-5" />

        {(p.github || p.demo) && (
          <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
            {p.github && <LinkChip href={p.github} icon={Github} label="Source" />}
            {p.demo && <LinkChip href={p.demo} icon={ExternalLink} label="Live demo" />}
          </div>
        )}
      </div>
    </motion.article>
  )
}
