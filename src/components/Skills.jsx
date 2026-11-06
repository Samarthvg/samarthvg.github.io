import { useState } from 'react'
import { skills } from '../data/portfolio'
import { Reveal, SectionHead } from './ui'

// Round-robin across the clusters so a highlighted group scatters
// through the field instead of lighting up one contiguous block.
const FIELD = (() => {
  const out = []
  const longest = Math.max(...skills.map((g) => g.items.length))
  for (let i = 0; i < longest; i++)
    for (const g of skills) if (g.items[i]) out.push({ item: g.items[i], group: g.id })
  return out
})()

export default function Skills() {
  const [active, setActive] = useState(null)

  return (
    <section id="skills" className="relative py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <SectionHead index="04" title="Skills" note="Hover a cluster" />

        <div onMouseLeave={() => setActive(null)}>
          <Reveal className="flex flex-wrap items-baseline gap-x-7 gap-y-3 border-b border-line pb-6">
            {skills.map((g, i) => {
              const on = active === g.id
              return (
                <button
                  key={g.id}
                  onMouseEnter={() => setActive(g.id)}
                  onFocus={() => setActive(g.id)}
                  onClick={() => setActive((a) => (a === g.id ? null : g.id))}
                  aria-pressed={on}
                  className="group flex items-baseline gap-2 transition-colors duration-500"
                >
                  <span
                    className={`font-mono text-[10px] transition-colors duration-500 ${
                      on ? 'text-accent' : 'text-faint'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 ${
                      on ? 'text-accent' : 'text-muted group-hover:text-bone'
                    }`}
                  >
                    {g.label}
                  </span>
                </button>
              )
            })}
          </Reveal>

          <Reveal delay={0.06}>
            <ul className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-3 sm:mt-12 sm:gap-x-9 sm:gap-y-4">
              {FIELD.map(({ item, group }) => {
                const dimmed = active && active !== group
                const lit = active === group
                return (
                  <li
                    key={item}
                    onMouseEnter={() => setActive(group)}
                    className={`cursor-default text-[clamp(1.05rem,2.6vw,1.8rem)] font-light tracking-tight transition-all duration-500 ease-smooth ${
                      lit ? 'text-accent' : dimmed ? 'text-faint opacity-35' : 'text-bone/85'
                    }`}
                  >
                    {item}
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
