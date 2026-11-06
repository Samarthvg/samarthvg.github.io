import { motion } from 'framer-motion'

export const EASE = [0.16, 1, 0.3, 1]

/** Scroll-triggered reveal wrapper. */
export function Reveal({ children, delay = 0, y = 18, className = '', as = 'div' }) {
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

/**
 * A section heading and, optionally, the one fact worth putting beside it.
 *
 * No index numeral and no label above the title: the sequence carries no
 * information the reader needs, and a heading this size does not need
 * announcing. `meta` is for real data — a count, a span of years — never for
 * instructions on how to work the controls.
 */
export function SectionHeading({ title, meta, sub, className = '' }) {
  return (
    <Reveal className={className}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h2 className="heading">{title}</h2>
        {meta && <span className="meta pb-2 text-faint">{meta}</span>}
      </div>
      {sub && <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-muted">{sub}</p>}
    </Reveal>
  )
}

/**
 * A drawn separator rather than a slash or a middot. Several of the strings
 * it sits between contain their own punctuation ("ML / Gen AI", "Boston, MA"),
 * and a glyph separator disappears into them.
 */
export function Divider({ className = '' }) {
  return <span aria-hidden="true" className={`h-3.5 w-px shrink-0 bg-line2 ${className}`} />
}

/** Understated bordered icon link. */
export function IconLink({ href, label, icon: Icon, external = true, size = 'md' }) {
  const dims = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'
  return (
    <motion.a
      href={href}
      aria-label={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      className={`icon-btn ${dims}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
    >
      <Icon size={size === 'sm' ? 15 : 17} strokeWidth={1.6} />
    </motion.a>
  )
}

/** Text link with an icon, for source and demo. */
export function LinkChip({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(e) => e.stopPropagation()}
      className="group inline-flex items-center gap-2 text-sm text-muted transition-colors duration-300 hover:text-accent"
    >
      <Icon size={13} strokeWidth={1.7} className="shrink-0" />
      <span className="border-b border-transparent pb-px transition-colors duration-300 group-hover:border-accent/60">
        {label}
      </span>
    </a>
  )
}

/**
 * The build manifest. Monospace because these are literal package names
 * rendered as written, not because the section wants to look technical —
 * hence natural case and no tracking.
 */
export function StackList({ items, className = '' }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 ${className}`}>
      {items.map((t, i) => (
        // The separator trails its own item rather than leading the next one,
        // so a wrap leaves "MongoDB /" at the end of a line instead of
        // starting the next one with a slash.
        <li key={t} className="flex items-center gap-2.5 font-mono text-[11px] text-muted sm:text-xs">
          <span>{t}</span>
          {i < items.length - 1 && (
            <span className="text-faint/70" aria-hidden="true">
              /
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
