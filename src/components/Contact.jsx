import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, FileText, Github, Linkedin } from 'lucide-react'
import { links, profile } from '../data/portfolio'
import { EASE, Reveal, SectionHead } from './ui'
import Approaching from './Approaching'

/** No backend — this composes the mail and hands it to the visitor's client. */
function MailNote() {
  const [msg, setMsg] = useState('')
  const [focused, setFocused] = useState(false)
  const approaching = focused || msg.length > 0

  const send = (e) => {
    e.preventDefault()
    const body = encodeURIComponent(msg)
    window.location.href = `mailto:${links.email}?subject=${encodeURIComponent(
      'Hello from your site'
    )}&body=${body}`
  }

  return (
    // the right column is reserved rather than inserted, so the field does not
    // resize under the cursor when he shows up
    <form onSubmit={send} className="mt-5   grid gap-8 lg:grid-cols-[minmax(0,1fr)_250px]">
      <div>

        <div className="mt-3 flex items-center gap-3 border-b border-line2 pb-2 transition-colors duration-300 focus-within:border-accent">
          <input
            id="say"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="I'm building something and I need…"
            className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-bone outline-none placeholder:text-faint sm:text-base"
          />
          <button
            type="submit"
            disabled={!msg.trim()}
            className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-accent transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Send →
          </button>
        </div>

        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          Opens your mail client, nothing is stored here
        </p>
      </div>

      <AnimatePresence>
        {approaching && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Approaching />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}

const channels = [
  { label: 'LinkedIn', href: links.linkedin, icon: Linkedin, hint: '/in/samarthgalchar' },
  { label: 'GitHub', href: links.github, icon: Github, hint: '@samarthgalchar' },
  { label: 'Resume', href: links.resume, icon: FileText, hint: 'PDF' },
]

export default function Contact() {
  return (
    <section id="contact" className="relative pb-14 pt-24 sm:pt-32 lg:pt-40">
      <div className="shell">
        <SectionHead index="05" title="Contact" note={profile.status} />

        <Reveal>
          <h2 className="display text-[clamp(2.6rem,11vw,8rem)] text-bone">
            Let&apos;s Talk<span className="text-accent">.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 border-t border-line pt-8">
          <a
            href={`mailto:${links.email}`}
            className="group inline-flex max-w-full items-center gap-3 sm:gap-5"
          >
            <span className="truncate text-[clamp(1.05rem,3.6vw,2.1rem)] font-light tracking-tight text-bone transition-colors duration-300 group-hover:text-accent">
              {links.email}
            </span>
            <ArrowUpRight
              size={26}
              strokeWidth={1.4}
              className="shrink-0 text-accent transition-transform duration-500 ease-smooth group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </Reveal>

        <Reveal delay={0.14}>
          <MailNote />
        </Reveal>

        <div className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-3">
          {channels.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer noopener"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.07 }}
              className="group relative flex items-center justify-between gap-4 bg-ink p-6 transition-colors duration-300 hover:bg-panel sm:p-7"
            >
              <span>
                <span className="flex items-center gap-2.5">
                  <c.icon size={15} strokeWidth={1.6} className="text-muted transition-colors group-hover:text-accent" />
                  <span className="text-base tracking-tight text-bone">{c.label}</span>
                </span>
                <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  {c.hint}
                </span>
              </span>
              <ArrowUpRight
                size={17}
                strokeWidth={1.5}
                className="shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </motion.a>
          ))}
        </div>

        <footer className="mt-16 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            © {new Date().getFullYear()} {profile.first} {profile.last} · {profile.location}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            React · Vite · Tailwind · Framer Motion
          </p>
        </footer>
      </div>
    </section>
  )
}
