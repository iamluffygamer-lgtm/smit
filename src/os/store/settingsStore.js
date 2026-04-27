import { create } from 'zustand';
import { loadState, saveState } from '../system/persistence';

const getInitialSettings = () => {
    const persisted = loadState();
    if (persisted && persisted.settings) {
        return {
            themeColor: persisted.settings.themeColor || '#E8A020',
            clockFormat: persisted.settings.clockFormat || '12hr',
            wallpaper: persisted.settings.wallpaper || 'canvas',
            brightness: persisted.settings.brightness !== undefined ? persisted.settings.brightness : 1,
            uiScale: persisted.settings.uiScale || 1,
        };
    }
    return {
        themeColor: '#E8A020',
        clockFormat: '12hr',
        wallpaper: 'canvas',
        brightness: 1,
        uiScale: 1,
    };
};

const initialSettings = getInitialSettings();

export const useSettingsStore = create((set) => ({
    themeColor: initialSettings.themeColor,
    clockFormat: initialSettings.clockFormat,
    wallpaper: initialSettings.wallpaper,
    brightness: initialSettings.brightness,
    uiScale: initialSettings.uiScale,

    setThemeColor: (color) => set({ themeColor: color }),
    setClockFormat: (format) => set({ clockFormat: format }),
    setWallpaper: (w) => set({ wallpaper: w }),
    setBrightness: (value) => set({ brightness: value }),
    setUiScale: (value) => set({ uiScale: value }),
}));

// Persistence hook
useSettingsStore.subscribe((state) => {
    saveState({
        settings: {
            themeColor: state.themeColor,
            clockFormat: state.clockFormat,
            wallpaper: state.wallpaper,
            brightness: state.brightness,
            uiScale: state.uiScale
        }
    });
});
