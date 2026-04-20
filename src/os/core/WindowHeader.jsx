import React from 'react';
import { useWindowDrag } from '../hooks/useWindowDrag';
import { tokens } from '../styles/tokens';

const styles = {
    header: {
        height: tokens.spacing.layout.headerHeight,
        borderBottom: `1px solid ${tokens.colors.borderDefault}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${tokens.spacing.sm}`,
        userSelect: 'none',
        backgroundColor: tokens.colors.bgSurface, // Same as window, seamless
    },
    title: {
        fontSize: tokens.typography.size.xs,
        fontWeight: tokens.typography.weight.medium,
        color: tokens.colors.textSecondary,
        textTransform: 'uppercase', // Technical feel
        letterSpacing: '0.5px',
    },
    controls: {
        display: 'flex',
        gap: tokens.spacing.sm,
    },
    // Square, monochrome buttons
    btn: {
        width: '24px',
        height: '24px',
        border: `1px solid ${tokens.colors.borderSubtle}`,
        backgroundColor: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: tokens.colors.textSecondary,
        borderRadius: tokens.radius.sm,
    },
    spacer: {
        width: '56px', // Approximate width of controls to balance title
    }
};
export const WindowHeader = ({
    windowState,
    onDrag,
    onClose,
    onMinimize,
    onMaximize,
    onRestore
}) => {
    const { onPointerDown } = useWindowDrag(onDrag);

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        if (windowState.maximized) onRestore(windowState.id);
        else onMaximize(windowState.id);
    };

    const handleDragStart = (e) => {
        if (windowState.maximized) return;
        onPointerDown(e, windowState.x, windowState.y);
    };

    return (
        <div
            style={styles.header}
            onPointerDown={handleDragStart}
            onDoubleClick={handleDoubleClick}
        >
            {/* Left spacer or icon could go here */}
            <div style={styles.spacer} />

            <div style={styles.title}>
                {windowState.appId} — {windowState.id.slice(0, 4)}
            </div>

            <div style={styles.controls} onPointerDown={(e) => e.stopPropagation()}>
                <button
                    style={styles.btn}
                    onClick={() => onMinimize(windowState.id)}
                    title="Minimize"
                >
                    ─
                </button>
                <button
                    style={styles.btn}
                    onClick={() => windowState.maximized ? onRestore(windowState.id) : onMaximize(windowState.id)}
                    title={windowState.maximized ? "Restore" : "Maximize"}
                >
                    {windowState.maximized ? '❐' : '□'}
                </button>
                <button
                    style={{ ...styles.btn, fontSize: '18px' }}
                    onClick={() => onClose(windowState.id)}
                    title="Close"
                >
                    ×
                </button>
            </div>
        </div>
    );
};
