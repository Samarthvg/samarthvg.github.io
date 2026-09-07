const c = (v) => `rgb(var(${v}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: c('--c-ink'),
        panel: c('--c-panel'),
        raised: c('--c-raised'),
        bone: c('--c-bone'),
        muted: c('--c-muted'),
        faint: c('--c-faint'),
        accent: c('--c-accent'),
        accent2: c('--c-accent2'),
        line: 'var(--c-line)',
        line2: 'var(--c-line2)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      letterSpacing: { tightest: '-0.045em' },
      transitionTimingFunction: { smooth: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
}
