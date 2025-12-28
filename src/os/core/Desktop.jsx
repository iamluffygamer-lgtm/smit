import React from 'react';
import { WindowManager } from './WindowManager';
import { Dock } from './Dock';
import { SystemTray } from '../system/SystemTray';
import { Clock } from '../system/Clock';

const styles = {
    wallpaper: {
        width: '100vw',
        height: '100vh',
        // Using a nice minimal gradient or potentially an image from assets if available. 
        // Fallback to a dark gradient for now to look "hacker-ish" / clean.
        background: 'linear-gradient(135deg, #1e1e1e 0%, #0d0d0d 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
