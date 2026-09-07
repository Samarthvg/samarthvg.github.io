import { motion } from 'framer-motion'
import { FileText, Github, Linkedin, Mail } from 'lucide-react'
import { links, profile } from '../data/portfolio'
import { EASE, IconLink } from './ui'
import Staff from './Staff'

const rise = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
})

export default function Hero() {
  const socials = [
    { href: links.github, label: 'GitHub', icon: Github },
    { href: links.linkedin, label: 'LinkedIn', icon: Linkedin },
    { href: links.resume, label: 'Resume', icon: FileText },
    { href: `mailto:${links.email}`, label: 'Email', icon: Mail },
  ]

  const i = profile.tagline.indexOf(profile.taglineAccent)
  const [aStart, aEnd] =
    i === -1 ? [profile.tagline.length, profile.tagline.length] : [i, i + profile.taglineAccent.length]

  return (
    <section id="top" className="relative min-h-[100svh] pt-24 sm:pt-28">
      <div className="shell flex min-h-[calc(100svh-7rem)] flex-col justify-center pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)] lg:gap-12">
          <div className="order-2 lg:order-1">
            <motion.div {...rise(0.05)} className="mb-7 flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <span className="eyebrow">
                {profile.location} · {profile.status}
              </span>
            </motion.div>

            <motion.h1
              {...rise(0.12)}
              className="display text-[clamp(2.7rem,10vw,6.2rem)] text-bone"
            >
              {profile.first}
              <br />
              {profile.last}
            </motion.h1>

            <motion.div
              {...rise(0.2)}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone sm:text-xs">
                {profile.roles[0]}
              </span>
              <span className="h-3 w-px bg-line2" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent sm:text-xs">
                {profile.roles[1]}
              </span>
            </motion.div>

            <motion.p
              {...rise(0.28)}
              className="mt-8 max-w-[46ch] text-balance text-lg leading-relaxed text-muted sm:text-xl"
            >
              {profile.tagline.slice(0, aStart)}
              <em className="font-serif italic text-bone">
                {profile.tagline.slice(aStart, aEnd)}
              </em>
              {profile.tagline.slice(aEnd)}
            </motion.p>

            <motion.div {...rise(0.36)} className="mt-10 flex items-center gap-2.5">
              {socials.map((s) => (
                <IconLink key={s.label} {...s} external={s.label !== 'Email'} />
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.25 }}
            className="order-1 lg:order-2"
          >
            <Staff />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
