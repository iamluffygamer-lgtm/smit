import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  addNotification: (message, type = 'info', duration = 3000) => {
    // stub — full implementation coming in Layer 4
    console.log('[notification]', type, message);
  },
}));
