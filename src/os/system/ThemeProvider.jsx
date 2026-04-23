import React from 'react';
import { useSettingsStore } from '../store/settingsStore';

// Helper to convert hex to comma separated RGB
const hexToRgb = (hex) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return `${r}, ${g}, ${b}`;
};

// Helper to lighten a hex color dynamically for interactive states
const lightenHex = (hex, amount = 15) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    // Simple blend towards white
    r = Math.min(255, Math.floor(r + (255 - r) * (amount / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (amount / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (amount / 100)));
    
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`;
};

export const ThemeProvider = ({ children }) => {
    const themeColor = useSettingsStore(state => state.themeColor);
    
    const rgb = hexToRgb(themeColor);
    const hoverColor = lightenHex(themeColor, 15);
    
    const cssVars = `
        :root {
            --os-accent: ${themeColor};
            --os-accent-hover: ${hoverColor};
            --os-accent-muted: rgba(${rgb}, 0.12);
            --os-accent-border: rgba(${rgb}, 0.28);
        }
    `;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: cssVars }} />
            {children}
        </>
    );
};
