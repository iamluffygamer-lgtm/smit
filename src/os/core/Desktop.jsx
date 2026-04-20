import React from 'react';
import { WindowManager } from './WindowManager';
import { Dock } from './Dock';
import { SystemTray } from '../system/SystemTray';
import { Clock } from '../system/Clock';

const styles = {
    wallpaper: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050505',
        backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 16px',
        zIndex: 10000,
    }
};

export const Desktop = () => {
    return (
        <div style={styles.wallpaper}>
            {/* Top Bar for Tray and Clock */}
            <div style={styles.topBar}>
                <Clock />
                <div style={{ width: 16 }} />
                <SystemTray />
            </div>

            <WindowManager />
            <Dock />
        </div>
    );
};
