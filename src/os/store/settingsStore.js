import { create } from 'zustand';
import { loadState, saveState } from '../system/persistence';

const getInitialSettings = () => {
    const persisted = loadState();
    if (persisted && persisted.settings) {
        return {
            themeColor: persisted.settings.themeColor || '#E8A020',
            clockFormat: persisted.settings.clockFormat || '12hr',
        };
    }
    return {
        themeColor: '#E8A020',
        clockFormat: '12hr',
    };
};

const initialSettings = getInitialSettings();

export const useSettingsStore = create((set) => ({
    themeColor: initialSettings.themeColor,
    clockFormat: initialSettings.clockFormat,

    setThemeColor: (color) => set({ themeColor: color }),
    setClockFormat: (format) => set({ clockFormat: format }),
}));

// Persistence hook
useSettingsStore.subscribe((state) => {
    saveState({
        settings: {
            themeColor: state.themeColor,
            clockFormat: state.clockFormat
        }
    });
});
