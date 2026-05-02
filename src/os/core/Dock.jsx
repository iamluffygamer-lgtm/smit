import React from 'react';
import { useWindowStore } from '../store/windowStore';
import { appRegistry } from '../apps/appRegistry';
import { APP_CATALOG } from '../store/appStoreStore';
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

export const Dock = ({ onLauncherOpen }) => {
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

    const handleDockClick = (appId, targetPos) => {
        const win = windows.find((w) => w.appId === appId);
        if (!win) {
            openWindow(appId, targetPos);
        } else if (win.minimized) {
            restoreWindow(win.id, targetPos);
        } else if (win.focused) {
            minimizeWindow(win.id, targetPos);
        } else {
            focusWindow(win.id);
        }
    };

    const PINNED_IDS = ['terminal', 'about', 'appStore', 'contact'];

    const pinnedApps = PINNED_IDS
        .map(id => appRegistry.find(a => a.id === id))
        .filter(Boolean);

    const runningAppIds = [...new Set(windows.map(w => w.appId))]
        .filter(id => !PINNED_IDS.includes(id));

    const runningApps = runningAppIds
        .map(appId => {
            const app = appRegistry.find(a => a.id === appId);
            if (app) return app;
            
            const storeApp = APP_CATALOG.find(a => a.appId === appId);
            if (storeApp) return {
                id: appId,
                name: storeApp.name,
                icon: <span>{storeApp.icon}</span>
            };

            const runningWin = windows.find(w => w.appId === appId);
            return {
                id: appId,
                name: runningWin?.title || appId,
                icon: <span>◈</span>
            };
        });

    return (
        <div style={containerStyle}>
            {pinnedApps.map((app) => (
                <DockIcon
                    key={app.id}
                    app={app}
                    isActive={isAppActive(app.id)}
                    onClick={handleDockClick}
                />
            ))}


            {runningApps.length > 0 && (
                <div style={{
                    width: '1px',
                    height: '28px',
                    backgroundColor: tokens.colors.borderSubtle,
                    margin: '0 6px'
                }} />
            )}

            {runningApps.map((app) => (
                <DockIcon
                    key={app.id}
                    app={app}
                    isActive={isAppActive(app.id)}
                    onClick={handleDockClick}
                />
            ))}

            <div style={{ marginLeft: 'auto' }}>
                <DockIcon
                    app={{ id: 'launcher', name: 'Apps', icon: <span>⊞</span> }}
                    isActive={false}
                    onClick={() => onLauncherOpen && onLauncherOpen()}
                />
            </div>
        </div>
    );
};