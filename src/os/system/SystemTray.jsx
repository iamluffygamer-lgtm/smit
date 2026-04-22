import React from 'react';
import { externalLinks } from '../config/externalLinks';
import { TrayIcon } from './TrayIcon';

const styles = {
    container: {
        position: 'absolute',
        top: '8px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        backgroundColor: '#111111',
        borderRadius: '4px',
        border: '1px solid #333333',
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
