import React from 'react';
import { useWindowResize } from '../hooks/useWindowResize';

const styles = {
    // Hitbox styles - invisible but grabbable
    n: { position: 'absolute', top: -4, left: 4, right: 4, height: 8, cursor: 'ns-resize', zIndex: 10 },
    s: { position: 'absolute', bottom: -4, left: 4, right: 4, height: 8, cursor: 'ns-resize', zIndex: 10 },
    e: { position: 'absolute', top: 4, right: -4, bottom: 4, width: 8, cursor: 'ew-resize', zIndex: 10 },
    w: { position: 'absolute', top: 4, left: -4, bottom: 4, width: 8, cursor: 'ew-resize', zIndex: 10 },
    ne: { position: 'absolute', top: -4, right: -4, width: 12, height: 12, cursor: 'nesw-resize', zIndex: 11 },
    nw: { position: 'absolute', top: -4, left: -4, width: 12, height: 12, cursor: 'nwse-resize', zIndex: 11 },
    se: { position: 'absolute', bottom: -4, right: -4, width: 12, height: 12, cursor: 'nwse-resize', zIndex: 11 },
    sw: { position: 'absolute', bottom: -4, left: -4, width: 12, height: 12, cursor: 'nesw-resize', zIndex: 11 },
};

export const ResizeHandles = ({ windowState, onResize }) => {
    const { x, y, width, height, maximized } = windowState;

    // Adapter to pass current state to hook
    const { initResize } = useWindowResize((newRect) => {
        // Basic constraint logic before passing to parent
        const MIN_W = 300;
        const MIN_H = 200;

        let finalW = Math.max(newRect.width, MIN_W);
        let finalH = Math.max(newRect.height, MIN_H);

        // If we hit min width/height while dragging left/top, 
        // we must stop updating x/y to prevent drifting
        let finalX = newRect.x;
        let finalY = newRect.y;

        if (newRect.width < MIN_W) finalX = x + (width - MIN_W); // approximate lock
        if (newRect.height < MIN_H) finalY = y + (height - MIN_H);

        onResize(finalX, finalY, finalW, finalH);
    });

    if (maximized) return null;

    const currentRect = { x, y, width, height };

    return (
        <>
            <div style={styles.n} onPointerDown={initResize('n', currentRect)} />
            <div style={styles.s} onPointerDown={initResize('s', currentRect)} />
            <div style={styles.e} onPointerDown={initResize('e', currentRect)} />
            <div style={styles.w} onPointerDown={initResize('w', currentRect)} />
            <div style={styles.ne} onPointerDown={initResize('ne', currentRect)} />
            <div style={styles.nw} onPointerDown={initResize('nw', currentRect)} />
            <div style={styles.se} onPointerDown={initResize('se', currentRect)} />
            <div style={styles.sw} onPointerDown={initResize('sw', currentRect)} />
        </>
    );
};
