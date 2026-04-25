// src/os/core/Window.jsx
import React, { useEffect } from 'react';
import { useSystemStateStore } from '../system/systemStateStore';
import { WindowHeader } from './WindowHeader';
import { ResizeHandles } from './ResizeHandles';
import { WindowContent } from './WindowContent';
// Inside src/os/core/Window.jsx
import { tokens } from '../styles/tokens';
import { motion, AnimatePresence } from 'framer-motion';

const styles = {
    window: {
        position: 'absolute',
        backgroundColor: tokens.colors.bgSurface,
        borderRadius: '0px',
        // Default state: Subtle border, low shadow
        boxShadow: tokens.shadowLg,
        color: tokens.colors.textPrimary,
        fontFamily: tokens.typography.fontSans,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: `box-shadow 0.2s ease`,
    },
    focused: {
        // Focused state: Brighter border, deeper shadow
        boxShadow: tokens.shadowXl,
        borderColor: tokens.colors.accentBorder,
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
            borderStyle: 'none',
            borderWidth: 0,
        }
        : {
            top: Math.max(40, y),
            left: x,
            width,
            height,
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
        const clampedY = Math.max(40, newY);
        actions.moveWindow(id, newX, clampedY);
    };

    const handleResize = (nx, ny, nw, nh) => {
        if (nx !== x || ny !== y) {
            actions.moveWindow(id, nx, ny);
        }
        actions.resizeWindow(id, nw, nh);
    };

    const animationProps = maximized
        ? {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.08 }
        }
        : {
            initial: { opacity: 0, scaleX: 1.015, y: -3 },
            animate: { opacity: 1, scaleX: 1, y: 0 },
            exit: { opacity: 0, scale: 0.97 },
            transition: {
                opacity:  { duration: 0.10 },
                scaleX:   { duration: 0.12, ease: [0.16, 1, 0.3, 1] },
                scale:    { duration: 0.08, ease: 'easeIn' },
                y:        { duration: 0.12, ease: [0.16, 1, 0.3, 1] },
            }
        };

    return (
        <motion.div
            style={containerStyle}
            onPointerDownCapture={handleFocus}
            {...animationProps}
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
        </motion.div>
    );
};

