import React from 'react';
import { WindowManager } from './WindowManager';
import { Dock } from './Dock';
import { SystemTray } from '../system/SystemTray';
import { Clock } from '../system/Clock';
import { tokens } from '../styles/tokens';

const styles = {
    wallpaper: {
        width: '100vw',
        height: '100vh',
        backgroundColor: tokens.colors.bgCanvas,
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
    },
    scanline: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(240,237,232,0.015) 2px,
            rgba(240,237,232,0.015) 4px
        )`
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
    },
    windowLayer: {
        position: 'absolute',
        inset: 0,
        zIndex: 1,
    }
};

export const Desktop = () => {
    return (
        <div style={styles.wallpaper}>
            <div style={styles.scanline} />
            <div style={styles.topBar}>
                <Clock />
                <div style={{ width: 16 }} />
                <SystemTray />
            </div>

            <div style={styles.windowLayer}>
                <WindowManager />
            </div>
            
            <Dock />
        </div>
    );
};
