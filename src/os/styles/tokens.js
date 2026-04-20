export const tokens = {
    colors: {
        // Backgrounds
        bgRoot: '#050505',      // The void behind the OS
        bgSurface: '#111111',   // Windows, Panels
        bgSurfaceHover: '#1a1a1a',
        bgSurfaceActive: '#222222',

        // Text
        textPrimary: '#ffffff',
        textSecondary: '#888888',
        textTertiary: '#444444',

        // Borders
        borderSubtle: '#222222',
        borderDefault: '#333333',
        borderHigh: '#555555',
        borderFocus: '#ffffff', // High contrast focus state

        // Accents (Functional)
        accent: '#3291ff',      // System Blue (Selection, Primary Actions)
        success: '#0070f3',
        warning: '#f5a623',
        error: '#ff0000',

        // Scrims
        overlay: 'rgba(0, 0, 0, 0.5)',
    },

    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        layout: {
            dockHeight: '48px',
            headerHeight: '36px',
        }
    },

    radius: {
        none: '0px',
        sm: '2px',    // Buttons, Inputs
        md: '6px',    // Windows, Cards
        full: '999px' // Avatars only
    },

    elevation: {
        none: 'none',
        // Sharp, defined shadows. No soft glows.
        window: '0 0 0 1px #333, 0 8px 30px rgba(0,0,0,0.5)',
        windowFocused: '0 0 0 1px #555, 0 20px 50px rgba(0,0,0,0.7)',
        floating: '0 4px 12px rgba(0,0,0,0.8)',
        tool: '0 2px 4px rgba(0,0,0,0.5)'
    },

    typography: {
        fontFamily: {
            sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            mono: '"JetBrains Mono", "Fira Code", monospace',
        },
        size: {
            xs: '11px',
            sm: '13px',
            base: '14px',
            lg: '16px',
            xl: '24px',
        },
        weight: {
            regular: 400,
            medium: 500,
            bold: 600
        }
    },

    motion: {
        // Fast, mechanical transitions
        fast: '0.1s cubic-bezier(0.2, 0, 0, 1)',
        normal: '0.2s cubic-bezier(0.2, 0, 0, 1)',
    }
};