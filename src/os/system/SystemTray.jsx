import React from 'react';
import { externalLinks } from '../config/externalLinks';
import { TrayIcon } from './TrayIcon';

const styles = {
    container: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: 'rgba(20, 20, 20, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 10000,
        color: '#fff',
    }
};

export const SystemTray = () => {
    return (
        <div style={styles.container}>
            {externalLinks.map((link) => (
                <TrayIcon key={link.id} link={link} />
            ))}
        </div>
    );
};
