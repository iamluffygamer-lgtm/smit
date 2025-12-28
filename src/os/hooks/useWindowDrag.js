import { useState, useRef, useEffect, useCallback } from 'react';

export const useWindowDrag = (onDrag) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef({
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0
    });

    const handlePointerDown = useCallback((e, x, y) => {
        // Only left click
        if (e.button !== 0) return;

        e.preventDefault();
        e.stopPropagation();

        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: x,
            initialY: y
        };

        setIsDragging(true);

        // Explicit pointer capture often helps with touch/pen, 
        // but document listeners are more robust for mouse tracking escaping the element.
        if (e.target.setPointerCapture) {
            e.target.setPointerCapture(e.pointerId);
        }
    }, []);

    useEffect(() => {
        if (!isDragging) return;

        const handlePointerMove = (e) => {
            const deltaX = e.clientX - dragRef.current.startX;
            const deltaY = e.clientY - dragRef.current.startY;

            // Emit absolute position based on initial + delta
            onDrag(
                dragRef.current.initialX + deltaX,
                dragRef.current.initialY + deltaY
            );
        };

        const handlePointerUp = (e) => {
            setIsDragging(false);
            // Release capture if strictly needed, though browser handles usually
        };

        // Attach to document to ensure we track even if cursor leaves the element
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);

        return () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isDragging, onDrag]);

    return {
        onPointerDown: handlePointerDown,
        isDragging
    };
};
