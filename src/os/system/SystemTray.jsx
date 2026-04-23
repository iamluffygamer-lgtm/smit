import React from 'react';
import { externalLinks } from '../config/externalLinks';
import { TrayIcon } from './TrayIcon';
import { tokens } from '../styles/tokens';

const styles = {
    container: {
        position: 'absolute',
        top: '8px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        backgroundColor: tokens.colors.bgElevated,
        borderRadius: '4px',
        border: `1px solid ${tokens.colors.borderSubtle}`,
        zIndex: 10000,
        color: tokens.colors.textPrimary,
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
