import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { links, profile } from '../data/portfolio'
import { Divider, EASE, Reveal } from './ui'
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
    <form onSubmit={send} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_250px]">
      <div>
        <label htmlFor="say" className="field">
          Or start the message here
        </label>
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
            className="shrink-0 text-sm text-accent transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Send
          </button>
        </div>
        <p className="mt-3 text-[13px] text-faint">
          Opens your own mail client. Nothing is stored here.
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
  { label: 'LinkedIn', href: links.linkedin, hint: '/in/samarthgalchar' },
  { label: 'GitHub', href: links.github, hint: '@samarthvg' },
  { label: 'Résumé', href: links.resume, hint: 'PDF' },
]

const [user, host] = links.email.split('@')

export default function Contact() {
  return (
    <section id="contact" className="relative pb-14 pt-24 sm:pt-28 lg:pt-32">
      <div className="shell">
        {/* The address is the headline. A page that ends on "Let's talk" is
            asking; a page that ends on the address has already answered. */}
        <Reveal>
          <a href={`mailto:${links.email}`} className="group block" aria-label={`Email ${links.email}`}>
            {/* One line on a wide window; on a narrow one it is allowed to
                break after the @ and nowhere else, so the address never
                shatters mid-word the way a character-level break does. */}
            <span className="display text-[clamp(1.55rem,4.9vw,4.4rem)] text-bone transition-colors duration-500 group-hover:text-accent">
              {user}@<wbr />
              {host}
            </span>
            <ArrowUpRight
              strokeWidth={1.2}
              aria-hidden="true"
              className="ml-2 inline h-[0.5em] w-[0.5em] shrink-0 -translate-y-[0.28em] text-[clamp(1.55rem,4.9vw,4.4rem)] text-accent transition-transform duration-500 ease-smooth group-hover:-translate-y-[0.5em] group-hover:translate-x-1"
            />
          </a>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-[15px] text-accent sm:text-base">{profile.status}</span>
          <Divider />
          <span className="text-[15px] text-muted sm:text-base">{profile.location}</span>
        </Reveal>

        <Reveal delay={0.12} className="mt-14 border-t border-line pt-10">
          <MailNote />
        </Reveal>

        <Reveal delay={0.08} className="mt-16 border-t border-line pt-8">
          <ul className="flex flex-wrap gap-x-10 gap-y-4">
            {channels.map((c) => (
              <li key={c.label} className="flex items-baseline gap-2.5">
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-quiet text-[17px] sm:text-lg"
                >
                  {c.label}
                </a>
                <span className="meta text-faint">{c.hint}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <footer className="mt-20 border-t border-line pt-7">
          <p className="meta text-faint">
            © {new Date().getFullYear()} {profile.first} {profile.last}
            <span className="px-2" aria-hidden="true">
              ·
            </span>
            {profile.location}
          </p>
        </footer>
      </div>
    </section>
  )
}
