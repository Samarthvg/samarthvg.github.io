import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { nav } from '../data/portfolio'
import { useActiveSection, useKey, useScrollLock, useSmoothScrollTo } from '../lib/hooks'
import { useTheme } from '../lib/theme'
import { EASE } from './ui'

const IDS = nav.map((n) => n.id)

export default function Navbar() {
  const active = useActiveSection(IDS)
  const scrollTo = useSmoothScrollTo()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [theme, toggleTheme, accent] = useTheme()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))
  useScrollLock(open)
  useKey('Escape', () => setOpen(false), open)
  useEffect(() => {
    if (!open) return
    const onResize = () => setOpen(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open])

  const go = (id) => {
    setOpen(false)
    // let the overlay unlock scroll before we move
    requestAnimationFrame(() => scrollTo(id))
  }

  return (
    <>
      <a
        href="#about"
        className="sr-only-focusable fixed left-4 top-4 z-[120] border border-accent bg-ink px-4 py-2 font-mono text-xs text-accent"
      >
        Skip to content
      </a>

      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-[100]"
      >
        <div
          className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
            scrolled ? 'border-b border-line bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent'
          }`}
        >
          <div className="shell flex h-16 items-center justify-between sm:h-[72px]">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2.5"
              aria-label="Back to top"
            >
              <span className="font-mono text-sm font-medium tracking-[0.14em] text-bone">SG</span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </button>

            <nav aria-label="Sections" className="hidden md:block">
              <ul className="flex items-center gap-1">
                {nav.map((item) => {
                  const on = active === item.id
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => go(item.id)}
                        aria-current={on ? 'true' : undefined}
                        className={`relative px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                          on ? 'text-bone' : 'text-muted hover:text-bone'
                        }`}
                      >
                        {item.label}
                        {on && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-x-2 -bottom-px h-px bg-accent"
                            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                          />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-faint lg:block">
                {accent}
              </span>
              <button
                onClick={toggleTheme}
                className="icon-btn h-10 w-10"
                title={`Theme: ${theme} · ${accent}`}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                {theme === 'dark' ? (
                  <Sun size={15} strokeWidth={1.6} />
                ) : (
                  <Moon size={15} strokeWidth={1.6} />
                )}
              </button>
              <button
                onClick={() => setOpen((v) => !v)}
                className="icon-btn h-10 w-10 md:hidden"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
              >
                {open ? <X size={16} strokeWidth={1.7} /> : <Menu size={16} strokeWidth={1.7} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[95] bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Sections" className="shell flex h-full flex-col justify-center gap-1">
              {nav.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => go(item.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.05, duration: 0.5, ease: EASE }}
                  className="flex items-baseline gap-4 border-b border-line py-5 text-left"
                >
                  <span className="font-mono text-[10px] text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`display text-3xl ${
                      active === item.id ? 'text-bone' : 'text-muted'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
