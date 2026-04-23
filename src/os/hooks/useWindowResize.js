import { useState, useRef, useEffect, useCallback } from 'react';

export const useWindowResize = (onResize) => {
    const [isResizing, setIsResizing] = useState(false);
    const resizeRef = useRef({
        startX: 0,
        startY: 0,
        initial: { x: 0, y: 0, width: 0, height: 0 },
        direction: ''
    });

    const initResize = useCallback((direction, currentRect) => (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        resizeRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initial: { ...currentRect },
            direction
        };

        setIsResizing(true);

        if (e.target.setPointerCapture) {
            e.target.setPointerCapture(e.pointerId);
        }
    }, []);

    const onResizeRef = useRef(onResize);

    useEffect(() => {
        onResizeRef.current = onResize;
    }, [onResize]);

    useEffect(() => {
        if (!isResizing) return;

        const handlePointerMove = (e) => {
            const { startX, startY, initial, direction } = resizeRef.current;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let { x, y, width, height } = initial;

            if (direction.includes('e')) width += deltaX;
            if (direction.includes('w')) {
                width -= deltaX;
                x += deltaX;
            }
            if (direction.includes('s')) height += deltaY;
            if (direction.includes('n')) {
                height -= deltaY;
                y += deltaY;
            }

            onResizeRef.current({ x, y, width, height });
        };

        const handlePointerUp = () => {
            setIsResizing(false);
        };

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);

        return () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isResizing]);

    return {
        initResize,
        isResizing
    };
};
