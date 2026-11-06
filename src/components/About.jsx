import { motion } from 'framer-motion'
import { about } from '../data/portfolio'
import { EASE, Reveal } from './ui'
import LaputaBackdrop from './LaputaBackdrop'

const [statement, ...rest] = about.statement

export default function About() {
  return (
    <section
      id="about"
      aria-label="About"
      className="relative overflow-hidden pb-28 pt-24 sm:pb-36 sm:pt-28 lg:pb-44 lg:pt-32"
    >
      <LaputaBackdrop />

      <div className="relative shell">
        {/* No label above this. The statement is the heading — the section
            says what it is by saying something. */}
        <Reveal>
          <p className="display max-w-[20ch] text-[clamp(1.9rem,4.6vw,3.4rem)] text-bone">
            {statement}
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-9">
          {rest.map((p, i) => (
            <p key={i} className="max-w-[58ch] text-[15px] leading-[1.7] text-muted sm:text-base">
              {p}
            </p>
          ))}
        </Reveal>

        {/* Two columns of records rather than one tall one: the single column
            left the other half of the section empty, which is the kind of hole
            that makes a page look assembled rather than laid out. */}
        <Reveal delay={0.1} className="mt-16 lg:mt-20">
          <dl className="grid border-t border-line sm:grid-cols-2 sm:gap-x-16 lg:gap-x-24">
            {about.specs.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.05 * i }}
                className="group relative grid gap-1 border-b border-line py-4 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-6 sm:py-5"
              >
                <span className="absolute bottom-[-1px] left-0 h-px w-0 bg-accent transition-all duration-700 ease-smooth group-hover:w-full" />
                <dt className="field pt-1 transition-colors duration-300 group-hover:text-accent">
                  {s.label}
                </dt>
                <dd className="text-[15px] leading-relaxed text-bone/90">{s.value}</dd>
              </motion.div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
