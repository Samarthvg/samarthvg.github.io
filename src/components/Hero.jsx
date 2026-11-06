import { motion } from 'framer-motion'
import { FileText, Github, Linkedin, Mail } from 'lucide-react'
import { links, profile } from '../data/portfolio'
import { Divider, EASE, IconLink } from './ui'
import Staff from './Staff'

const rise = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE, delay },
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
    <section id="top" className="relative min-h-[100svh]">
      {/* The staff runs the full height of the fold on its own layer rather
          than sitting in a grid cell, so the name can cross in front of it.
          Two objects sharing space read as composed; two columns side by side
          read as a template. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] items-center justify-center pb-10 pt-24 lg:flex xl:w-[48%]"
      >
        <Staff />
      </motion.div>

      <div className="shell relative flex min-h-[100svh] flex-col justify-start pb-14 pt-28 sm:pb-16 lg:justify-end lg:pb-20 lg:pt-32">
        <div className="relative max-w-[18ch]">
          <motion.h1 {...rise(0.08)} className="display text-[clamp(3.1rem,11.5vw,8.2rem)] text-bone">
            Samarth
            <br />
            Galchar
          </motion.h1>
        </div>

        <motion.div
          {...rise(0.18)}
          className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] sm:text-base"
        >
          <span className="text-bone">{profile.roles[0]}</span>
          <Divider />
          <span className="text-accent">{profile.roles[1]}</span>
        </motion.div>

        <motion.p
          {...rise(0.26)}
          className="mt-6 max-w-[48ch] text-pretty text-base leading-[1.65] text-muted sm:text-lg"
        >
          {profile.tagline.slice(0, aStart)}
          <em className="font-serif not-italic text-bone">{profile.tagline.slice(aStart, aEnd)}</em>
          {profile.tagline.slice(aEnd)}
        </motion.p>

        <motion.div {...rise(0.34)} className="mt-10 flex items-center gap-2.5">
          {socials.map((s) => (
            <IconLink key={s.label} {...s} external={s.label !== 'Email'} />
          ))}
        </motion.div>

        {/* On layouts too narrow to cross the name, the staff follows it
            instead of leading. Above the name it pushed the only thing a
            visitor came for below the first screen. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          className="mt-14 flex justify-center lg:hidden"
        >
          <Staff />
        </motion.div>

        <motion.div
          {...rise(0.44)}
          className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-5 text-sm lg:mt-16"
        >
          <span className="text-muted">{profile.location}</span>
          <Divider />
          <span className="text-accent">{profile.status}</span>
        </motion.div>
      </div>
    </section>
  )
}
