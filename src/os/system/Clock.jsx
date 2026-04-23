import React, { useEffect } from 'react';
import { useSystemStateStore } from './systemStateStore';
import { useSettingsStore } from '../store/settingsStore';
import { tokens } from '../styles/tokens';

export const Clock = () => {
    const currentTime = useSystemStateStore(state => state.currentTime);
    const isOnline = useSystemStateStore(state => state.isOnline);
    const initSystem = useSystemStateStore(state => state.initSystem);
    const cleanupSystem = useSystemStateStore(state => state.cleanupSystem);
    const clockFormat = useSettingsStore(state => state.clockFormat);

    useEffect(() => {
        initSystem();
        return () => cleanupSystem();
    }, [initSystem, cleanupSystem]);

    const dateTimeString = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: clockFormat === '12hr'
    }).format(currentTime).replace(',', ''); 

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            color: tokens.colors.textPrimary,
            fontFamily: tokens.typography.fontSans,
            fontSize: '13px',
            fontWeight: '500',
            userSelect: 'none',
            cursor: 'default',
            letterSpacing: '0.02em',
        },
        dateTime: {
            display: 'flex',
            alignItems: 'center',
            paddingRight: '4px',
        },
        statusIndicator: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.statusIndicator} title={isOnline ? 'Network Connected' : 'Offline'}>
                {/* SVG Wifi Icon to replace clunky "Online" text */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" 
                     stroke={isOnline ? tokens.colors.textPrimary : tokens.colors.textDisabled} 
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {isOnline ? (
                        <>
                            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                            <line x1="12" y1="20" x2="12.01" y2="20" />
                        </>
                    ) : (
                        <>
                            <line x1="1" y1="1" x2="23" y2="23" />
                            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                            <line x1="12" y1="20" x2="12.01" y2="20" />
                        </>
                    )}
                </svg>
            </div>
            <div style={styles.dateTime}>
                {dateTimeString}
            </div>
        </div>
    );
};
