import { useCallback, useEffect, useState } from 'react'

// Only the browser-chrome colour lives here; every pigment is in
// src/index.css under [data-theme]. Changing a colour means touching one
// file, and there is no second copy to fall behind.
const CHROME = { dark: '#141310', light: '#E4DCCB' }

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

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', CHROME[theme])
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* private mode */
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  return [theme, toggle]
}
