// src/os/system/systemStateStore.js
import { create } from 'zustand';

export const useSystemStateStore = create((set, get) => ({
    currentTime: new Date(),
    isOnline: navigator.onLine,
    isMobileMode: false,
    sessionStart: Date.now(),
    sessionDuration: 0,
    _intervalId: null,
    _resizeTimeout: null,

    initSystem: () => {
        if (get()._intervalId) return;

        const checkMobile = () => {
            const isMobile = window.innerWidth <= 768 ||
                ('ontouchstart' in window || navigator.maxTouchPoints > 0);

            // Debounce state update to prevent thrashing
            if (get().isMobileMode !== isMobile) {
                set({ isMobileMode: isMobile });
            }
        };

        const debouncedCheckMobile = () => {
            const { _resizeTimeout } = get();
            if (_resizeTimeout) clearTimeout(_resizeTimeout);

            const timeout = setTimeout(checkMobile, 100); // 100ms debounce
            set({ _resizeTimeout: timeout });
        };

        const updateTick = () => {
            const now = new Date();
            const start = get().sessionStart;
            const duration = Math.floor((now.getTime() - start) / 60000);

            set({
                currentTime: now,
                sessionDuration: duration
            });
        };

        const handleOnline = () => set({ isOnline: true });
        const handleOffline = () => set({ isOnline: false });

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('resize', debouncedCheckMobile);

        // Initial checks
        updateTick();
        checkMobile();

        const id = setInterval(updateTick, 60000);
        set({ _intervalId: id });
    },

    cleanupSystem: () => {
        const { _intervalId, _resizeTimeout } = get();
        if (_intervalId) clearInterval(_intervalId);
        if (_resizeTimeout) clearTimeout(_resizeTimeout);
        set({ _intervalId: null, _resizeTimeout: null });
    }
}));