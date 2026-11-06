import { useCallback, useEffect, useState } from 'react'

// Five seasons. Each theme flip advances to the next one.
//
// Only the names and the browser-chrome colour live here; every pigment is
// in src/index.css under [data-theme][data-accent]. Changing a colour means
// touching one file, and there is no second copy to fall behind.
export const ACCENTS = [
  { name: 'sage', dark: '#121511', light: '#E8E5D8' },
  { name: 'slate', dark: '#101318', light: '#E2E7EB' },
  { name: 'wisteria', dark: '#141219', light: '#E8E4EC' },
  { name: 'ember', dark: '#181212', light: '#EEE4E0' },
  { name: 'amber', dark: '#17130F', light: '#EFE8D9' },
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
    const season = ACCENTS[index % ACCENTS.length]
    root.dataset.theme = theme
    root.dataset.accent = String(index)
    root.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', season[theme])
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
