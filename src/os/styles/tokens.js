export const tokens = {
  colors: {
    bgCanvas: '#0C0A08',
    bgSurface: '#141210',
    bgElevated: '#1C1916',
    bgSunken: '#080604',
    bgSubtle: '#1A1714',

    accent: 'var(--os-accent)',
    accentHover: 'var(--os-accent-hover)',
    accentMuted: 'var(--os-accent-muted)',
    accentBorder: 'var(--os-accent-border)',

    textPrimary: '#F5F2EE',
    textSecondary: '#C4BFB8',
    textTertiary: '#818480',
    textDisabled: '#5C5854',
    textOnAccent: '#0C0A08',

    borderFaint: 'rgba(240,237,232,0.04)',
    borderSubtle: 'rgba(240,237,232,0.08)',
    borderDefault: 'rgba(240,237,232,0.12)',
    borderStrong: 'rgba(240,237,232,0.20)',
    borderAccent: 'rgba(232,160,32,0.35)',

    shadowSm: '0px 2px 8px -1px rgba(8,6,4,0.50)',
    shadowMd: '0px 8px 24px -4px rgba(8,6,4,0.60), 0px 3px 8px -2px rgba(8,6,4,0.35)',
    shadowLg: '0px 20px 48px -8px rgba(8,6,4,0.70), 0px 8px 16px -4px rgba(8,6,4,0.40)',
    shadowXl: '0px 36px 72px -12px rgba(8,6,4,0.80), 0px 12px 24px -6px rgba(8,6,4,0.45)',
    shadowFocus: '0px 0px 0px 3px rgba(232,160,32,0.30)',

    windowBg: '#141210',
    windowTitlebar: '#0C0A08',
    windowBorder: 'rgba(240,237,232,0.08)',
    desktopBg: '#0C0A08',
    dockBg: 'rgba(20,18,16,0.88)',
    dockBorder: 'rgba(240,237,232,0.08)',
    tooltipBg: '#1C1916',
    tooltipText: '#F0EDE8',

    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
  },

  typography: {
    fontMono: "'JetBrains Mono', 'Courier New', monospace",
    fontSans: "'DM Sans', system-ui, sans-serif",
    size: {
      xxs: '10px', xs: '11px', sm: '12px',
      md: '13px', base: '14px', lg: '16px',
      xl: '20px', xxl: '28px', display: '48px',
    },
    weight: {
      regular: '400', medium: '500',
      semibold: '600', bold: '700',
    },
    lineHeight: {
      tight: '1.2', normal: '1.5', loose: '1.8',
    },
  },

  spacing: {
    px: '1px', '0': '0px', '1': '4px', '2': '8px',
    '3': '12px', '4': '16px', '5': '20px', '6': '24px',
    '8': '32px', '10': '40px', '12': '48px', '16': '64px',
  },

  radius: {
    none: '0px', sm: '2px', md: '4px',
    lg: '6px', xl: '8px', full: '9999px',
  },
};