export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent:           'var(--os-accent)',
        'accent-hover':   'var(--os-accent-hover)',
        canvas:           '#0C0A08',
        surface:          '#141210',
        elevated:         '#1C1916',
        sunken:           '#080604',
        subtle:           '#1A1714',
        'text-primary':   '#F0EDE8',
        'text-secondary': '#9C9590',
        'text-tertiary':  '#5C5854',
        'text-disabled':  '#3C3A38',
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", 'Courier New', 'monospace'],
        sans: ["'DM Sans'", 'system-ui', 'sans-serif'],
      },
      borderColor: {
        faint:  'rgba(240,237,232,0.04)',
        subtle: 'rgba(240,237,232,0.08)',
        base:   'rgba(240,237,232,0.12)',
        strong: 'rgba(240,237,232,0.20)',
      },
      boxShadow: {
        'window':        '0px 20px 48px -8px rgba(8,6,4,0.70), 0px 8px 16px -4px rgba(8,6,4,0.40)',
        'window-focused':'0px 36px 72px -12px rgba(8,6,4,0.80), 0px 12px 24px -6px rgba(8,6,4,0.45)',
      },
    },
  },
  plugins: [],
}
