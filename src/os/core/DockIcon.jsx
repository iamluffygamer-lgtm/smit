import React, { useState } from 'react';
import { tokens } from '../styles/tokens';

export const DockIcon = ({ app, isActive, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer',
            padding: '0 12px',
            height: '100%',
        },
        iconBox: {
            width: '42px',
            height: '42px',
            backgroundColor: isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            color: isHovered ? tokens.colors.accent : tokens.colors.textSecondary,
            fontFamily: tokens.typography.fontMono,
            borderRadius: tokens.radius.md,
            userSelect: 'none',
            transition: 'all 0.2s ease',
        },
        indicatorContainer: {
            position: 'absolute',
            bottom: '0px',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '3px',
            width: isActive ? '18px' : (isHovered ? '6px' : '0px'),
        },
        indicator: {
            width: '100%',
            height: '100%',
            backgroundColor: tokens.colors.accent,
            borderRadius: '3px 3px 0 0',
            opacity: isActive || isHovered ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isActive ? `0 -2px 8px ${tokens.colors.accentBorder}` : 'none',
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
