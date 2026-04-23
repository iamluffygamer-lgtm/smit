import React from 'react';
import { useWindowStore } from '../store/windowStore';
import { appRegistry } from '../apps/appRegistry';
import { DockIcon } from './DockIcon';
import { useSystemStateStore } from '../system/systemStateStore';
import { tokens } from '../styles/tokens';

const styles = {
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '64px',
        backgroundColor: tokens.colors.dockBg,
        borderTop: `1px solid ${tokens.colors.dockBorder}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        gap: '4px',
        zIndex: 9999,
        boxSizing: 'border-box'
    }
};

export const Dock = () => {
    const windows = useWindowStore((state) => state.windows);
    const openWindow = useWindowStore((state) => state.openWindow);
    const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
    const focusWindow = useWindowStore((state) => state.focusWindow);
    const restoreWindow = useWindowStore((state) => state.restoreWindow);
    const isMobileMode = useSystemStateStore((state) => state.isMobileMode);

    const containerStyle = {
        ...styles.container,
        ...(isMobileMode ? {
            justifyContent: 'space-evenly',
            padding: '16px 8px',
            gap: '0',
            backgroundColor: '#111',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
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