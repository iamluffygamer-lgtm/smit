// src/os/store/windowStore.js
import { create } from 'zustand';
import { appRegistry } from '../apps/appRegistry';
import { loadState, saveState } from '../system/persistence';
import { useSystemStateStore } from '../system/systemStateStore';

// Helper to detect mobile state synchronously during init
const isMobileInit = () => {
    return typeof window !== 'undefined' && (
        window.innerWidth <= 768 ||
        ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );
};

const getInitialState = () => {
    const persisted = loadState();
    const isMobile = isMobileInit();

    // Hydrate
    if (persisted && Array.isArray(persisted.windows) && persisted.windows.length > 0) {
        let windows = persisted.windows;
        let activeId = persisted.activeWindowId;

        // Mobile Logic: Enforce single window rule on restore
        if (isMobile) {
            // Find the active window or the last one
            const activeWindow = windows.find(w => w.id === activeId) || windows[windows.length - 1];
            if (activeWindow) {
                // Restore only the active app, fully maximized
                windows = [{
                    ...activeWindow,
                    maximized: true,
                    minimized: false,
                    x: 0,
                    y: 0,
                    width: '100%',
                    height: '100%'
                }];
                activeId = activeWindow.id;
            } else {
                windows = [];
                activeId = null;
            }
        }

        const maxZ = windows.length > 0 ? Math.max(...windows.map(w => w.zIndex), 100) : 100;

        return {
            windows,
            activeWindowId: activeId,
            zIndexCounter: maxZ + 1
        };
    }

    // Default Boot
    const projectApp = appRegistry.find(a => a.id === 'projects');
    if (projectApp) {
        const id = `projects-${Date.now()}`;
        return {
            windows: [{
                id,
                appId: 'projects',
                title: projectApp.name,
                x: isMobile ? 0 : 100,
                y: isMobile ? 0 : 100,
                width: isMobile ? '100%' : (projectApp.defaultSize?.width || 800),
                height: isMobile ? '100%' : (projectApp.defaultSize?.height || 600),
                zIndex: 101,
                minimized: false,
                maximized: isMobile, // Auto-maximize on mobile
                focused: true
            }],
            activeWindowId: id,
            zIndexCounter: 101
        };
    }

    return {
        windows: [],
        activeWindowId: null,
        zIndexCounter: 100
    };
};

const initialState = getInitialState();

export const useWindowStore = create((set, get) => ({
    windows: initialState.windows,
    activeWindowId: initialState.activeWindowId,
    zIndexCounter: initialState.zIndexCounter,

    openWindow: (appId, targetPos = null, intentData = null) => {
        const { windows, zIndexCounter } = get();
        const app = appRegistry.find(a => a.id === appId);
        if (!app) return;

        const isMobile = useSystemStateStore.getState().isMobileMode;
        const id = `${appId}-${Date.now()}`;

        // Mobile: Close all other windows before opening new one
        const currentWindows = isMobile ? [] : windows;

        const newWindow = {
            id,
            appId,
            title: app.name,
            x: isMobile ? 0 : 80 + (windows.length * 24),
            y: isMobile ? 0 : 60 + (windows.length * 24),
            width: isMobile ? '100%' : app.defaultSize.width,
            height: isMobile ? '100%' : app.defaultSize.height,
            zIndex: zIndexCounter + 1,
            minimized: false,
            maximized: isMobile, // Auto-maximize
            focused: true,
            target: targetPos,
            intentData
        };

        set({
            windows: [...currentWindows, newWindow],
            zIndexCounter: zIndexCounter + 1,
            activeWindowId: id
        });
    },

    focusWindow: (id) => {
        const { zIndexCounter } = get();
        set((state) => ({
            windows: state.windows.map(w =>
                w.id === id ? { ...w, zIndex: zIndexCounter + 1, focused: true } : { ...w, focused: false }
            ),
            zIndexCounter: zIndexCounter + 1,
            activeWindowId: id
        }));
    },

    moveWindow: (id, x, y) => {
        if (useSystemStateStore.getState().isMobileMode) return; // Disable move on mobile
        set((state) => ({
            windows: state.windows.map(w => w.id === id ? { ...w, x, y } : w)
        }));
    },

    resizeWindow: (id, width, height) => {
        if (useSystemStateStore.getState().isMobileMode) return; // Disable resize on mobile
        set((state) => ({
            windows: state.windows.map(w => w.id === id ? { ...w, width, height } : w)
        }));
    },

    closeWindow: (id) => {
        set((state) => {
            const remaining = state.windows.filter(w => w.id !== id);
            let nextActive = state.activeWindowId;

            if (state.activeWindowId === id) {
                if (remaining.length > 0) {
                    const top = remaining.reduce((prev, current) => (prev.zIndex > current.zIndex) ? prev : current);
                    nextActive = top.id;
                } else {
                    nextActive = null;
                }
            }

            const updatedWindows = remaining.map(w => ({
                ...w,
                focused: w.id === nextActive
            }));

            return {
                windows: updatedWindows,
                activeWindowId: nextActive
            };
        });
    },

    minimizeWindow: (id, targetPos = null) => {
        // Optional: Disable minimize on mobile if single-window UX prefers closing
        set((state) => ({
            windows: state.windows.map(w => w.id === id ? { ...w, minimized: true, focused: false, target: targetPos } : w)
        }));
    },

    maximizeWindow: (id) => {
        set((state) => ({
            windows: state.windows.map(w => w.id === id ? { ...w, maximized: true } : w)
        }));
    },

    restoreWindow: (id, targetPos = null) => {
        // Disable restore on mobile
        if (useSystemStateStore.getState().isMobileMode) return;

        set((state) => ({
            windows: state.windows.map(w => w.id === id ? { ...w, maximized: false, minimized: false, target: targetPos } : w)
        }));
    },

    bringToFront: (id) => {
        get().focusWindow(id);
    },

    clearWindowTarget: (id) => {
        set((state) => ({
            windows: state.windows.map(w => w.id === id ? { ...w, target: null } : w)
        }));
    }
}));

// Persistence Subscription
let saveTimeout;
useWindowStore.subscribe((state) => {
    if (saveTimeout) clearTimeout(saveTimeout);

    saveTimeout = setTimeout(() => {
        const windowsToSave = state.windows.map(w => ({
            id: w.id,
            appId: w.appId,
            x: w.x,
            y: w.y,
            width: w.width,
            height: w.height,
            zIndex: w.zIndex,
            maximized: w.maximized
        }));

        saveState({
            windows: windowsToSave,
            activeWindowId: state.activeWindowId
        });
    }, 1000);
});