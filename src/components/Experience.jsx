import { motion } from 'framer-motion'
import { experience } from '../data/portfolio'
import { EASE, Reveal, SectionHeading, StackList } from './ui'

// The span the ledger covers, read off the entries rather than written twice.
const YEARS = (() => {
  const ys = experience.flatMap((x) => (x.period.match(/\d{4}/g) || []).map(Number))
  return ys.length ? `${Math.min(...ys)} — ${Math.max(...ys)}` : null
})()

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-28 lg:py-32">
      <div className="shell">
        <SectionHeading title="Work" meta={YEARS} />

        {/* A ledger, not a deck. Every role is open: three entries is not
            enough to hide behind a tab strip, and hiding two thirds of the
            section was what left the space beside it empty. */}
        <div className="mt-14 border-t border-line sm:mt-16">
          {experience.map((x, i) => (
            <motion.article
              key={x.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px -10% 0px' }}
              transition={{ duration: 0.7, ease: EASE, delay: i === 0 ? 0 : 0.04 }}
              className="group grid gap-6 border-b border-line py-10 sm:py-12 lg:grid-cols-12 lg:gap-14"
            >
              <header className="lg:col-span-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="display text-[1.7rem] text-bone transition-colors duration-500 group-hover:text-accent sm:text-[2rem]">
                    {x.company}
                  </h3>
                  {x.parent && <span className="meta text-faint">{x.parent}</span>}
                </div>
                <p className="mt-2 text-[15px] text-accent">{x.role}</p>
                <p className="meta mt-4 text-faint">
                  {x.period}
                  <span className="px-2" aria-hidden="true">
                    ·
                  </span>
                  {x.location}
                </p>
                {/* On a wide layout the manifest sits with the role: it
                    belongs to the identity, and it keeps the two columns
                    closer in height than a long right one beside a short
                    left one. Stacked, it belongs after the prose instead —
                    nobody reads the parts list before the description. */}
                <div className="hidden lg:block">
                  <StackList items={x.stack} className="mt-7 border-t border-line pt-5" />
                </div>
              </header>

              <div className="lg:col-span-8">
                <p className="max-w-[56ch] text-pretty text-base leading-[1.6] text-bone/90 sm:text-[17px]">
                  {x.summary}
                </p>

                <ul className="mt-7 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                  {x.highlights.map((h) => (
                    <li
                      key={h}
                      className="relative pl-5 text-[14px] leading-[1.6] text-muted before:absolute before:left-0 before:top-[0.62em] before:h-px before:w-2.5 before:bg-accent/55 sm:text-[15px]"
                    >
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="lg:hidden">
                  <StackList items={x.stack} className="mt-8 border-t border-line pt-5" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
