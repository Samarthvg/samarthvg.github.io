import { useCallback, useEffect, useState } from 'react'

const BG = { dark: '#171512', light: '#EBE5D9' }

// Soft earthy / sky tones. Each theme flip advances to the next one.
// NOTE: mirrored in the pre-paint script in index.html — keep both in sync.
export const ACCENTS = [
  { name: 'sage', dark: '152 180 124', light: '96 122 72' },
  { name: 'sky', dark: '140 172 194', light: '78 112 138' },
  { name: 'wisteria', dark: '176 164 200', light: '106 94 140' },
  { name: 'rose', dark: '208 156 158', light: '154 92 96' },
  { name: 'gold', dark: '214 186 128', light: '140 106 44' },
]

/**
 * Read-only view of the current theme, for components that need to render
 * differently in each but must not own the toggle. Watching the attribute
 * rather than calling useTheme keeps a single source of truth: a second
 * useTheme would spin up its own state and drift out of sync with the navbar's.
 */
export function useThemeName() {
  const [name, setName] = useState(() => document.documentElement.dataset.theme || 'dark')
  useEffect(() => {
    const root = document.documentElement
    const read = () => setName(root.dataset.theme || 'dark')
    read()
    const mo = new MutationObserver(read)
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])
  return name
}

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const [index, setIndex] = useState(() => Number(document.documentElement.dataset.accent) || 0)

  useEffect(() => {
    const root = document.documentElement
    const here = ACCENTS[index % ACCENTS.length]
    const next = ACCENTS[(index + 1) % ACCENTS.length]
    root.dataset.theme = theme
    root.dataset.accent = String(index)
    root.style.colorScheme = theme
    root.style.setProperty('--c-accent', here[theme])
    root.style.setProperty('--c-accent2', next[theme])
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BG[theme])
    try {
      localStorage.setItem('theme', theme)
      localStorage.setItem('accent', String(index))
    } catch {
      /* private mode */
    }
  }, [theme, index])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
    setIndex((i) => (i + 1) % ACCENTS.length)
  }, [])

  return [theme, toggle, ACCENTS[index % ACCENTS.length].name]
}
