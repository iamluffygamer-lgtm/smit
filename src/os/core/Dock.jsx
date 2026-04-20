// src/os/core/Dock.jsx
import React from 'react';
import { useWindowStore } from '../store/windowStore';
import { appRegistry } from '../apps/appRegistry';
import { DockIcon } from './DockIcon';
import { useSystemStateStore } from '../system/systemStateStore';
import { tokens } from '../styles/tokens';

// Inside src/os/core/Dock.jsx
const styles = {
    container: {
        position: 'absolute',
        bottom: tokens.spacing.lg,
        left: '50%',
        transform: 'translateX(-50%)',
        height: '64px',
        backgroundColor: tokens.colors.bgSurface,
        border: `1px solid ${tokens.colors.borderDefault}`,
        borderRadius: tokens.radius.md,
        boxShadow: tokens.elevation.floating,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: tokens.spacing.md,
        zIndex: 9999,
    },
    // Active indicator is a sharp line, not a dot
    activeIndicator: {
        position: 'absolute',
        bottom: '-1px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '12px',
        height: '2px',
        backgroundColor: tokens.colors.accent,
    }
};

export const Dock = () => {
    const windows = useWindowStore((state) => state.windows);
    const openWindow = useWindowStore((state) => state.openWindow);
    const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
    const focusWindow = useWindowStore((state) => state.focusWindow);
    const restoreWindow = useWindowStore((state) => state.restoreWindow);
    const isMobileMode = useSystemStateStore((state) => state.isMobileMode);

    // Mobile Dock Styles
    const containerStyle = {
        ...styles.container,
        ...(isMobileMode ? {
            bottom: '0',
            left: '0',
            width: '100%',
            transform: 'none',
            borderRadius: '0',
            border: 'none',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            justifyContent: 'space-evenly', // Better touch targets
            padding: '16px 8px', // Taller hit area
            gap: '0',
            backgroundColor: '#111', // Solid background for mobile
            backdropFilter: 'none',
        } : {})
    };

    const isAppActive = (appId) => {
        return windows.some((win) => win.appId === appId && !win.minimized);
    };

    const handleDockClick = (appId) => {
        const win = windows.find((w) => w.appId === appId);
        if (!win) {
            openWindow(appId);
        } else if (win.minimized) {
            restoreWindow(win.id);
        } else if (win.focused) {
            minimizeWindow(win.id);
        } else {
            focusWindow(win.id);
        }
    };

    return (
        <div style={containerStyle}>
            {appRegistry.map((app) => (
                <DockIcon
                    key={app.id}
                    app={app}
                    isActive={isAppActive(app.id)}
                    onClick={handleDockClick}
                />
            ))}
        </div>
    );
};