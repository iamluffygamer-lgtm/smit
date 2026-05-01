// src/os/core/Window.jsx
import React, { useEffect, useState } from 'react';
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
        minimized, maximized, focused, target
    } = windowState;

    const [isMinimizing, setIsMinimizing] = useState(false);
    const [prevMinimized, setPrevMinimized] = useState(minimized);
    const [isShaking, setIsShaking] = useState(false);

    if (minimized && !prevMinimized) {
        setPrevMinimized(true);
        setIsMinimizing(true);
        setTimeout(() => setIsMinimizing(false), 220);
    } else if (!minimized && prevMinimized) {
        setPrevMinimized(false);
        setIsMinimizing(false);
    }

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

    useEffect(() => {
        const { x, y, width, height } = windowState;
        const EDGE_THRESHOLD = 10;
        const hitEdge = 
            x <= EDGE_THRESHOLD ||
            y <= 40 ||
            x + width >= window.innerWidth - EDGE_THRESHOLD;
        
        if (hitEdge && !isShaking) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 400);
        }
    }, [windowState.x, windowState.y]);

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
        },
        minimizeWindow: (wid) => {
            // Derived state handles the unmount delay automatically
            actions.minimizeWindow(wid);
        }
        // Close remains close, acts as "Back" naturally by removing window
    };

    if (minimized && !isMinimizing) return null;

    const parsedWidth = typeof width === 'number' ? width : 800;
    const parsedHeight = typeof height === 'number' ? height : 600;
    const centerX = x + parsedWidth / 2;
    const centerY = Math.max(0, y) + parsedHeight / 2;

    const deltaX = target ? target.x - centerX : 0;
    const deltaY = target ? target.y - centerY : 180;

    const initialX = target ? target.x - centerX : 0;
    const initialY = target ? target.y - centerY : 40;

    const geometry = maximized
        ? {
            top: 0,
            left: 0,
            width: '100%',
            height: 'calc(100% - 64px)',
            transform: 'none',
            borderRadius: 0,
            borderStyle: 'none',
            borderWidth: 0,
        }
        : {
            top: Math.max(0, y),
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
        
        const w = typeof width === 'number' ? width : 800;
        const minX = -w + 60; // Keep at least 60px visible on the left
        const maxX = window.innerWidth - 60; // Keep at least 60px visible on the right
        const clampedX = Math.max(minX, Math.min(newX, maxX));

        const maxY = window.innerHeight - 100; // Leave 32px (top bar) + 64px (dock) + some buffer
        const clampedY = Math.max(0, Math.min(newY, maxY));
        
        actions.moveWindow(id, clampedX, clampedY);
    };

    const handleResize = (nx, ny, nw, nh) => {
        let clampedY = ny;
        let clampedH = nh;
        
        // Prevent resizing upward past the top bar
        if (ny < 0) {
            clampedH = nh + ny; // ny is negative, so this shrinks the height
            clampedY = 0;
        }
        
        let clampedX = nx;
        let clampedW = nw;
        
        // Prevent resizing leftward past the screen edge
        if (nx < 0) {
            clampedW = nw + nx; // nx is negative, so this shrinks the width
            clampedX = 0;
        }

        if (clampedX !== x || clampedY !== y) {
            actions.moveWindow(id, clampedX, clampedY);
        }
        actions.resizeWindow(id, clampedW, clampedH);
    };

    const animationProps = maximized
        ? {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.08 }
        }
        : {
            initial: target
                ? { opacity: 0, scale: 0.7, x: initialX, y: initialY }
                : { opacity: 0, scaleX: 1.015, y: -3 },
            animate: isMinimizing 
                ? { opacity: 0.4, scale: 0.75, x: deltaX, y: deltaY }
                : { opacity: 1, scale: 1, scaleX: 1, x: 0, y: 0 },
            exit: isMinimizing
                ? {
                    opacity: 0.4,
                    scale: 0.75,
                    x: deltaX,
                    y: deltaY
                }
                : { opacity: 0, scale: 0.96 },
            transition: isMinimizing
                ? { duration: 0.22, ease: [0.4, 0, 0.2, 1] }
                : (target ? { duration: 0.22, ease: [0.22, 1, 0.36, 1] } : {
                    opacity:  { duration: 0.10 },
                    scaleX:   { duration: 0.12, ease: [0.16, 1, 0.3, 1] },
                    scale:    { duration: 0.08, ease: 'easeIn' },
                    y:        { duration: 0.12, ease: [0.16, 1, 0.3, 1] },
                })
        };

    return (
        <>
            <style>
                {`
                @keyframes windowShake {
                    0%, 100% { translate: 0px; }
                    20%       { translate: -6px; }
                    40%       { translate: 6px; }
                    60%       { translate: -4px; }
                    80%       { translate: 4px; }
                }
                `}
            </style>
            <motion.div
                style={{
                    ...containerStyle,
                    animation: (!maximized && isShaking) ? 'windowShake 0.4s ease-in-out' : undefined,
                }}
                onPointerDownCapture={handleFocus}
            onAnimationComplete={() => {
                if (target && !minimized && actions.clearWindowTarget) {
                    actions.clearWindowTarget(id);
                }
            }}
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
                    <WindowContent appId={windowState.appId} intentData={windowState.intentData} />
                </div>
            </div>

            {!isMobileMode && (
                <ResizeHandles
                    windowState={windowState}
                    onResize={handleResize}
                />
                )}
            </motion.div>
        </>
    );
};

