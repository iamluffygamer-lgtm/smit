import { create } from 'zustand';

export const useOSStore = create((set) => ({
    isBooted: false,
    setBooted: (isBooted) => set({ isBooted }),
}));
