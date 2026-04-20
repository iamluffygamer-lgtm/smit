import React from 'react';
import { tokens } from '../styles/tokens';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        padding: '8px',
        transition: 'transform 0.1s ease',
    },
    iconBox: {
        width: '40px',
        height: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        border: '1px solid #333333',
        userSelect: 'none',
    },
    indicator: {
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        backgroundColor: tokens.colors.accent,
        opacity: 0,
        transition: 'opacity 0.2s',
    },
    indicatorActive: {
        opacity: 1,
    },
    tooltip: {
        position: 'absolute',
        bottom: '100%',
        marginBottom: '8px',
        padding: '4px 8px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '12px',
        opacity: 0,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
    }
};

export const DockIcon = ({ app, isActive, onClick }) => {
    return (
        <div
            style={styles.container}
            onClick={() => onClick(app.id)}
            title={app.name} // Simple native tooltip fallback
        >
            <div style={styles.iconBox}>
                {app.icon}
            </div>
            <div
                style={{
                    ...styles.indicator,
                    ...(isActive ? styles.indicatorActive : {})
                }}
            />
        </div>
    );
};
