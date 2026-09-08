import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { experience } from '../data/portfolio'
import { EASE, Reveal, SectionHead, StackList } from './ui'

const N = experience.length

export default function Experience() {
  const [active, setActive] = useState(0)
  const tabsRef = useRef(null)

  const select = (i) => setActive(((i % N) + N) % N)

  const onTabKey = (e) => {
    const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    if (map[e.key]) {
      e.preventDefault()
      const next = (active + map[e.key] + N) % N
      select(next)
      tabsRef.current?.querySelectorAll('[role="tab"]')[next]?.focus()
    }
    if (e.key === 'Home') { e.preventDefault(); select(0) }
    if (e.key === 'End') { e.preventDefault(); select(N - 1) }
  }

  return (
    <section id="experience" className="relative py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <SectionHead index="02" title="Experience" note="Hover / Click" />

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          {/* selector */}
          <Reveal className="lg:col-span-4">
            <div
              ref={tabsRef}
              role="tablist"
              aria-label="Roles"
              aria-orientation="vertical"
              onKeyDown={onTabKey}
              className="-mx-3 flex overflow-hidden border-t border-line lg:flex-col"
            >
              {experience.map((x, i) => {
                const on = i === active
                return (
                  <button
                    key={x.id}
                    role="tab"
                    id={`exp-tab-${x.id}`}
                    aria-selected={on}
                    aria-controls={`exp-panel-${x.id}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(i)}
                    onFocus={() => select(i)}
                    onMouseEnter={() => select(i)}
                    className="group relative flex-1 border-b border-line px-3 py-3.5 text-left lg:py-5"
                  >
                    <span
                      className={`absolute bottom-[-1px] left-0 h-px bg-accent transition-all duration-500 ease-smooth ${
                        on ? 'w-full' : 'w-0'
                      }`}
                    />
                    <span className="flex items-baseline gap-2.5 lg:gap-3">
                      <span
                        className={`font-mono text-[10px] transition-colors duration-300 ${
                          on ? 'text-accent' : 'text-faint'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`truncate text-[13px] font-medium tracking-tight transition-colors duration-300 sm:text-base lg:text-lg ${
                          on ? 'text-bone' : 'text-muted group-hover:text-bone/80'
                        }`}
                      >
                        {x.company}
                      </span>
                    </span>
                    <span
                      className={`mt-1 hidden font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 lg:block ${
                        on ? 'text-muted' : 'text-faint'
                      }`}
                    >
                      {x.period}
                    </span>
                  </button>
                )
              })}
            </div>
          </Reveal>

          {/* stacked deck */}
          <Reveal
            delay={0.08}
            className="lg:col-span-8"
          >
            {/* every panel shares one grid cell, so the deck is as tall as its
                tallest role rather than a fixed height the longest one overflows */}
            <div className="grid pt-10">
              {experience.map((x, i) => {
                const off = (i - active + N) % N
                const on = off === 0
                return (
                  <motion.div
                    key={x.id}
                    role="tabpanel"
                    id={`exp-panel-${x.id}`}
                    aria-labelledby={`exp-tab-${x.id}`}
                    aria-hidden={!on}
                    drag={on ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.14}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -70 || info.velocity.x < -420) select(active + 1)
                      else if (info.offset.x > 70 || info.velocity.x > 420) select(active - 1)
                    }}
                    onClick={() => !on && select(i)}
                    animate={{
                      x: off * 34,
                      y: off * -20,
                      rotate: off * 1.5,
                      scale: 1 - off * 0.028,
                      opacity: off === 0 ? 1 : off === 1 ? 0.8 : 0.45,
                    }}
                    transition={{ type: 'spring', stiffness: 280, damping: 34, mass: 0.8 }}
                    style={{ zIndex: N - off }}
                    className={`col-start-1 row-start-1 border p-6 sm:p-8 ${
                      on
                        ? 'cursor-grab border-line2 bg-panel active:cursor-grabbing'
                        : 'cursor-pointer border-line2 bg-raised'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-medium tracking-tight text-bone sm:text-2xl">
                            {x.company}
                          </h3>
                          {x.parent && (
                            <span className="border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                              {x.parent}
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent sm:text-xs">
                          {x.role}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-[11px] text-muted">{x.period}</p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                          {x.location}
                        </p>
                      </div>
                    </div>

                    <div className="my-5 h-px w-full bg-line" />

                    <AnimatePresence mode="wait" initial={false}>
                      {on && (
                        <motion.div
                          key={x.id + '-body'}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                        >
                          <p className="max-w-[52ch] text-sm leading-relaxed text-bone/80 sm:text-[15px]">
                            {x.summary}
                          </p>
                          <ul className="mt-5 space-y-2.5">
                            {x.highlights.map((h, hi) => (
                              <motion.li
                                key={h}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, ease: EASE, delay: 0.08 + hi * 0.06 }}
                                className="flex gap-3 text-[13px] leading-relaxed text-muted sm:text-sm"
                              >
                                <ArrowUpRight
                                  size={13}
                                  strokeWidth={1.8}
                                  className="mt-1 shrink-0 text-accent/70"
                                />
                                <span>{h}</span>
                              </motion.li>
                            ))}
                          </ul>
                          <StackList items={x.stack} className="mt-6 border-t border-line pt-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
