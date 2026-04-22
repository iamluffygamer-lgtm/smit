import React, { useState } from 'react';
import { tokens } from '../styles/tokens';

export const DockIcon = ({ app, isActive, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            cursor: 'pointer',
            padding: '8px',
        },
        iconBox: {
            width: '36px',
            height: '36px',
            backgroundColor: isHovered ? tokens.colors.bgElevated : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: tokens.colors.textPrimary,
            fontFamily: tokens.typography.fontMono,
            borderRadius: tokens.radius.sm,
            userSelect: 'none',
            transition: 'background-color 0.1s ease',
        },
        indicatorContainer: {
            position: 'absolute',
            left: '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '16px',
            width: '2px',
        },
        indicator: {
            width: '100%',
            height: '100%',
            backgroundColor: tokens.colors.accent,
            opacity: isActive ? 1 : 0,
            transition: 'opacity 0.2s',
        },
        tooltip: {
            position: 'absolute',
            bottom: 'calc(100% + 4px)',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 8px',
            backgroundColor: tokens.colors.bgElevated,
            color: tokens.colors.textSecondary,
            fontFamily: tokens.typography.fontMono,
            borderRadius: tokens.radius.sm,
            fontSize: '11px',
            opacity: isHovered ? 1 : 0,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s ease',
        }
    };

    return (
        <div
            style={styles.container}
            onClick={() => onClick(app.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.tooltip}>
                {app.name}
            </div>
            <div style={styles.indicatorContainer}>
                <div style={styles.indicator} />
            </div>
            <div style={styles.iconBox}>
                {app.icon}
            </div>
        </div>
    );
};
