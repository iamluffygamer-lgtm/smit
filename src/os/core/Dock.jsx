// src/os/core/Dock.jsx
import React from 'react';
import { useWindowStore } from '../store/windowStore';
import { appRegistry } from '../apps/appRegistry';
import { DockIcon } from './DockIcon';
import { useSystemStateStore } from '../system/systemStateStore';

const styles = {
    container: {
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'rgba(20, 20, 20, 0.7)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        zIndex: 10000,
    }
};

export const Dock = () => {
    const windows = useWindowStore((state) => state.windows);
    const openWindow = useWindowStore((state) => state.openWindow);
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
        return windows.some((win) => win.appId === appId);
    };

    return (
        <div style={containerStyle}>
            {appRegistry.map((app) => (
                <DockIcon
                    key={app.id}
                    app={app}
                    isActive={isAppActive(app.id)}
                    onClick={openWindow}
                />
            ))}
        </div>
    );
};