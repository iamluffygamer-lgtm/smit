import React from 'react';
import { externalLinks } from '../config/externalLinks';
import { TrayIcon } from './TrayIcon';
import { tokens } from '../styles/tokens';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
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
