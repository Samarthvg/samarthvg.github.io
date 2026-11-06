import { experience, projects, skills } from '../data/portfolio'
import { Reveal, SectionHeading } from './ui'

/**
 * Rank by evidence rather than by assertion.
 *
 * Every role and project on this page declares the stack it was built with.
 * Counting a tool across those is a claim the page can back up, which is worth
 * more than a self-rated bar chart and more than a flat wall of keywords.
 * A tool used in several pieces of work is set in the page's ink; one that
 * appears nowhere above is still listed, just not promoted.
 */
const norm = (s) => s.toLowerCase().replace(/\.js$/, '').replace(/[\s.-]/g, '')

const USE = (() => {
  const tally = new Map()
  const add = (t) => tally.set(norm(t), (tally.get(norm(t)) || 0) + 1)
  for (const x of experience) x.stack.forEach(add)
  for (const p of projects) p.stack.forEach(add)
  return tally
})()

const GROUPS = skills.map((g) => ({
  ...g,
  items: g.items
    .map((item) => ({ item, n: USE.get(norm(item)) || 0 }))
    .sort((a, b) => b.n - a.n || a.item.localeCompare(b.item)),
}))

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-28 lg:py-32">
      <div className="shell">
        <SectionHeading
          title="Tools"
          sub="Ordered by what the work above can vouch for. The figure beside a tool is the number of roles and projects on this page built with it."
        />

        <div className="mt-14 grid gap-x-12 gap-y-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-16">
          {GROUPS.map((g, gi) => (
            <Reveal key={g.id} delay={gi * 0.04}>
              <h3 className="field border-b border-line pb-3">{g.label}</h3>
              <ul className="mt-4">
                {g.items.map(({ item, n }) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-2 py-[7px] text-[17px] leading-snug"
                  >
                    <span className={n > 0 ? 'text-bone' : 'text-muted'}>{item}</span>
                    {n > 0 && (
                      <span
                        className="meta text-accent"
                        aria-label={`used in ${n} ${n === 1 ? 'piece' : 'pieces'} of work on this page`}
                      >
                        {n}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
