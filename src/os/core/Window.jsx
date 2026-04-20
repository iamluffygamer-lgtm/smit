// src/os/core/Window.jsx
import React, { useEffect } from 'react';
import { useSystemStateStore } from '../system/systemStateStore';
import { WindowHeader } from './WindowHeader';
import { ResizeHandles } from './ResizeHandles';
import { WindowContent } from './WindowContent';
// Inside src/os/core/Window.jsx
import { tokens } from '../styles/tokens';

const styles = {
    window: {
        position: 'absolute',
        backgroundColor: tokens.colors.bgSurface,
        borderRadius: tokens.radius.md,
        // Default state: Subtle border, low shadow
        boxShadow: tokens.elevation.window,
        color: tokens.colors.textPrimary,
        fontFamily: tokens.typography.fontFamily.sans,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: `box-shadow ${tokens.motion.fast}, transform ${tokens.motion.fast}`,
    },
    focused: {
        // Focused state: Brighter border, deeper shadow
        boxShadow: tokens.elevation.windowFocused,
        borderColor: tokens.colors.borderFocus,
        zIndex: 1000,
    },
    content: {
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
    },
    appContainer: {
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    }
};

export const Window = ({ windowState, actions }) => {
    const {
        id, x, y, width, height, zIndex,
        minimized, maximized, focused
    } = windowState;

    const isMobileMode = useSystemStateStore((state) => state.isMobileMode);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && focused && maximized && !isMobileMode) {
                actions.restoreWindow(id);
            }
        };

        if (focused && maximized) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focused, maximized, id, actions, isMobileMode]);

    // Proxy actions to enforce mobile rules (Back instead of Close, No Restore)
    const windowActions = {
        ...actions,
        restoreWindow: (wid) => {
            if (isMobileMode) return; // Disable restore
            actions.restoreWindow(wid);
        },
        maximizeWindow: (wid) => {
            if (isMobileMode) return; // Already maxed
            actions.maximizeWindow(wid);
        }
        // Close remains close, acts as "Back" naturally by removing window
    };

    if (minimized) return null;

    const geometry = maximized
        ? {
            top: 40,
            left: 0,
            width: '100%',
            height: 'calc(100% - 40px)',
            transform: 'none',
            borderRadius: 0,
            border: 'none',
        }
        : {
            top: 0,
            left: 0,
            width,
            height,
            transform: `translate3d(${x}px, ${y}px, 0)`
        };

    const containerStyle = {
        ...styles.window,
        ...geometry,
        zIndex,
        ...(focused ? styles.focused : {}),
    };

    const handleFocus = () => {
        if (!focused) actions.focusWindow(id);
    };

    const handleMove = (newX, newY) => {
        if (isMobileMode) return;
        actions.moveWindow(id, newX, newY);
    };

    const handleResize = (nx, ny, nw, nh) => {
        if (nx !== x || ny !== y) {
            actions.moveWindow(id, nx, ny);
        }
        actions.resizeWindow(id, nw, nh);
    };

    return (
        <div
            style={containerStyle}
            onPointerDownCapture={handleFocus}
        >
            <WindowHeader
                windowState={windowState}
                onDrag={handleMove}
                onClose={windowActions.closeWindow}
                onMinimize={windowActions.minimizeWindow}
                onMaximize={windowActions.maximizeWindow}
                onRestore={windowActions.restoreWindow}
            />

            <div style={styles.content}>
                <div style={styles.appContainer}>
                    <WindowContent appId={windowState.appId} />
                </div>
            </div>

            {!isMobileMode && (
                <ResizeHandles
                    windowState={windowState}
                    onResize={handleResize}
                />
            )}
        </div>
    );
};

