import React, { useState } from 'react';
import { useWindowDrag } from '../hooks/useWindowDrag';
import { tokens } from '../styles/tokens';

export const WindowHeader = ({
    windowState,
    onDrag,
    onClose,
    onMinimize,
    onMaximize,
    onRestore
}) => {
    const { onPointerDown } = useWindowDrag(onDrag);
    const [isHovered, setIsHovered] = useState(false);

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        if (windowState.maximized) onRestore(windowState.id);
        else onMaximize(windowState.id);
    };

    const handleDragStart = (e) => {
        if (windowState.maximized) return;
        onPointerDown(e, windowState.x, windowState.y);
    };

    const styles = {
        header: {
            height: '32px',
            borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${tokens.spacing['3']}`,
            userSelect: 'none',
            backgroundColor: tokens.colors.windowTitlebar,
        },
        title: {
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            fontWeight: tokens.typography.weight.medium,
            color: tokens.colors.textSecondary,
            letterSpacing: '0.04em',
            textTransform: 'lowercase',
            pointerEvents: 'none',
        },
        controls: {
            display: 'flex',
            gap: tokens.spacing['2'],
        },
        btn: {
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        closeBtn: {
            backgroundColor: isHovered ? '#F87171' : tokens.colors.borderDefault,
        },
        minBtn: {
            backgroundColor: isHovered ? '#FBBF24' : tokens.colors.borderDefault,
        },
        maxBtn: {
            backgroundColor: isHovered ? '#4ADE80' : tokens.colors.borderDefault,
        },
        spacer: {
            width: '40px', // Matches controls width to balance title
        }
    };

    return (
        <div
            style={styles.header}
            onPointerDown={handleDragStart}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.spacer} />

            <div style={styles.title}>
                {windowState.appId.toLowerCase()}
            </div>

            <div style={styles.controls} onPointerDown={(e) => e.stopPropagation()}>
                <button
                    style={{ ...styles.btn, ...styles.minBtn }}
                    onClick={() => onMinimize(windowState.id)}
                    title="Minimize"
                />
                <button
                    style={{ ...styles.btn, ...styles.maxBtn }}
                    onClick={() => windowState.maximized ? onRestore(windowState.id) : onMaximize(windowState.id)}
                    title={windowState.maximized ? "Restore" : "Maximize"}
                />
                <button
                    style={{ ...styles.btn, ...styles.closeBtn }}
                    onClick={() => onClose(windowState.id)}
                    title="Close"
                />
            </div>
        </div>
    );
};
