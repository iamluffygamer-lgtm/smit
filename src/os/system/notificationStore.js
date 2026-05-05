import { create } from 'zustand';

let nextId = 1;

export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (message, type = 'info', duration = 3000) => {
    const id = nextId++;
    set(state => ({
      notifications: [...state.notifications, { id, message, type, duration }]
    }));
    setTimeout(() => {
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    }, duration + 400);
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
}));
