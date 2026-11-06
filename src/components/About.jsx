import { motion } from 'framer-motion'
import { about } from '../data/portfolio'
import { EASE, Reveal, SectionHead } from './ui'
import LaputaBackdrop from './LaputaBackdrop'

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <LaputaBackdrop />

      <div className="relative shell">
        <SectionHead index="01" title="About" note="Who / What / Where" />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="mt-10 lg:col-span-7">
            {about.statement.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p
                  className={`text-balance leading-[1.45] ${
                    i === 0
                      ? 'text-[clamp(1.35rem,3.2vw,2.15rem)] tracking-[-0.02em] text-bone'
                      : 'mt-7 max-w-[54ch] text-base leading-relaxed text-bone/90 sm:text-lg'
                  }`}
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <dl className="border-t border-line">
                {about.specs.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.06 * i }}
                    className="group relative flex flex-col gap-1.5 border-b border-line py-4 sm:flex-row sm:items-baseline sm:gap-6 sm:py-[18px]"
                  >
                    <span className="absolute bottom-[-1px] left-0 h-px w-0 bg-accent transition-all duration-500 ease-smooth group-hover:w-full" />
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/70 transition-colors duration-300 group-hover:text-accent sm:w-[92px] sm:shrink-0">
                      {s.label}
                    </dt>
                    <dd className="text-sm leading-relaxed text-bone/90 sm:text-[15px]">{s.value}</dd>
                  </motion.div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
