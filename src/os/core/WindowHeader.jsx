import React from 'react';
import { useWindowDrag } from '../hooks/useWindowDrag';

const styles = {
    header: {
        height: '36px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        userSelect: 'none',
        touchAction: 'none', // Crucial for pointer events
        borderTopLeftRadius: '5px', // Match window border
        borderTopRightRadius: '5px',
    },
    title: {
        flex: 1,
        fontSize: '13px',
        fontFamily: 'sans-serif',
        color: '#444',
        textAlign: 'center',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        pointerEvents: 'none', // Allow drag click to pass through text
    },
    controls: {
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
    },
    spacer: {
        width: '60px', // Balance the title centering
    },
    btn: {
        width: '24px',
        height: '24px',
        border: 'none',
        background: 'transparent',
        borderRadius: '4px',
        color: '#666',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '14px',
        padding: 0,
        lineHeight: 1,
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
