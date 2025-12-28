import React from 'react';
import { useWindowStore } from '../store/windowStore';
import { Window } from './Window';

const styles = {
    desktop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden', // Contain windows within desktop
        pointerEvents: 'none', // Allow clicks to pass to wallpaper/icons
        zIndex: 10, // Base layer for windows
    },
    // Windows need pointer events enabled
    layer: {
        pointerEvents: 'auto',
    }
};

export const WindowManager = () => {
    // Select full state to prevent stale closures, 
    // though individual selectors are better for performance in large apps.
    // For OS UI, windows[] changes frequently anyway.
    const windows = useWindowStore((state) => state.windows);

    // Actions
    const actions = {
        focusWindow: useWindowStore((state) => state.focusWindow),
        moveWindow: useWindowStore((state) => state.moveWindow),
        resizeWindow: useWindowStore((state) => state.resizeWindow),
        closeWindow: useWindowStore((state) => state.closeWindow),
        minimizeWindow: useWindowStore((state) => state.minimizeWindow),
        maximizeWindow: useWindowStore((state) => state.maximizeWindow),
        restoreWindow: useWindowStore((state) => state.restoreWindow),
        bringToFront: useWindowStore((state) => state.bringToFront),
    };

    return (
        <div style={styles.desktop}>
            {windows.map((win) => (
                <div key={win.id} style={styles.layer}>
                    <Window
                        windowState={win}
                        actions={actions}
                    />
                </div>
            ))}
        </div>
    );
};
