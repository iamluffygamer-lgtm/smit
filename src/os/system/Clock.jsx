import React, { useEffect } from 'react';
import { useSystemStateStore } from './systemStateStore';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontSize: '12px',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: '1.2',
        userSelect: 'none',
        cursor: 'default',
    },
    time: {
        fontWeight: '600',
        fontSize: '13px',
    },
    date: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px',
    },
    status: {
        fontSize: '11px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    online: {
        color: '#4cd964', // Success green
    },
    offline: {
        color: '#ff3b30', // Error red
    }
};

export const Clock = () => {
    const currentTime = useSystemStateStore(state => state.currentTime);
    const isOnline = useSystemStateStore(state => state.isOnline);
    const initSystem = useSystemStateStore(state => state.initSystem);
    const cleanupSystem = useSystemStateStore(state => state.cleanupSystem);

    useEffect(() => {
        initSystem();
        return () => cleanupSystem();
    }, [initSystem, cleanupSystem]);

    // Formatters
    const timeString = new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: '2-digit',
    }).format(currentTime);

    const dateString = new Intl.DateTimeFormat('default', {
        month: 'short',
        day: 'numeric',
    }).format(currentTime);

    return (
        <div style={styles.container}>
            <div style={styles.time}>{timeString}</div>
            <div style={styles.date}>{dateString}</div>
            <div style={{ ...styles.status, ...(isOnline ? styles.online : styles.offline) }}>
                {isOnline ? 'Online' : 'Offline'}
            </div>
        </div>
    );
};
