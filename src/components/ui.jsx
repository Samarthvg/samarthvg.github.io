import { motion } from 'framer-motion'

export const EASE = [0.16, 1, 0.3, 1]

/** Scroll-triggered reveal wrapper. */
export function Reveal({ children, delay = 0, y = 20, className = '', as = 'div' }) {
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

/** Section label: index, title, rule, optional note. */
export function SectionHead({ index, title, note }) {
  return (
    <Reveal className="mb-12 flex items-baseline gap-4 sm:mb-16 md:gap-6">
      <span className="font-mono text-[11px] text-accent sm:text-xs">{index}</span>
      <h2 className="eyebrow !text-bone">{title}</h2>
      <span className="h-px flex-1 translate-y-[-3px] bg-line" aria-hidden="true" />
      {note && <span className="eyebrow hidden sm:block">{note}</span>}
    </Reveal>
  )
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

/** Bordered link chip used by project cards and the detail panel. */
export function LinkChip({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
    >
      <Icon size={12} strokeWidth={1.7} />
      {label}
    </a>
  )
}

/** Monospace tech list, dot separated. */
export function StackList({ items, className = '' }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 ${className}`}>
      {items.map((t, i) => (
        <li key={t} className="flex items-center gap-3">
          {i > 0 && <span className="h-1 w-1 rounded-full bg-faint" aria-hidden="true" />}
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[11px]">
            {t}
          </span>
        </li>
      ))}
    </ul>
  )
}
