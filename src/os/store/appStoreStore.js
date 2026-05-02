import { create } from 'zustand';

const STORAGE_KEY = 'smit-os-store-installed';

const DEFAULT_INSTALLED = []; // nothing pre-installed from store

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_INSTALLED;
  } catch {
    return DEFAULT_INSTALLED;
  }
};

const save = (installed) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(installed));
};

// App catalog — all apps available in the store
export const APP_CATALOG = [
  {
    id: 'code-editor',
    appId: 'codeEditor',        // matches windowStore/registry id
    name: 'Code Editor',
    tagline: 'HTML/CSS/JS playground with AI templates',
    description: 'A lightweight code playground with live preview. Paste your idea, get a template from the AI panel, edit it, and see it run instantly. Includes a fake npm run dev flow in Terminal.',
    category: 'DEVELOPER TOOLS',
    version: '1.0.0',
    size: '4.2 MB',
    author: 'Smit Patil',
    featured: true,
    icon: '⌨',
  },
  {
    id: 'calculator',
    appId: 'calculator',
    name: 'Calculator',
    tagline: 'Clean scientific calculator',
    description: 'A precise calculator with standard and scientific modes. Built with vanilla JS logic inside React.',
    category: 'UTILITIES',
    version: '1.0.0',
    size: '0.8 MB',
    author: 'Smit Patil',
    featured: false,
    icon: '◎',
  },
  {
    id: 'pomodoro',
    appId: 'pomodoro',
    name: 'Pomodoro',
    tagline: '25/5 focus timer',
    description: 'Classic Pomodoro timer. 25 minutes focus, 5 minutes break. Tracks your sessions. Plays a sound on completion.',
    category: 'UTILITIES',
    version: '1.0.0',
    size: '0.6 MB',
    author: 'Smit Patil',
    featured: false,
    icon: '◷',
  },
];

export const useAppStoreStore = create((set, get) => ({
  installed: load(),
  installing: null,   // appId currently being installed
  progress: 0,        // install progress 0-100

  isInstalled: (appId) => {
    return get().installed.includes(appId);
  },

  installApp: (appId) => {
    if (get().installed.includes(appId)) return;
    if (get().installing) return;

    set({ installing: appId, progress: 0 });

    // Simulate install progress
    const steps = [15, 35, 55, 72, 88, 100];
    const delays = [300, 600, 900, 1200, 1500, 2000];

    delays.forEach((delay, i) => {
      setTimeout(() => {
        set({ progress: steps[i] });
        if (steps[i] === 100) {
          setTimeout(() => {
            const newInstalled = [...get().installed, appId];
            save(newInstalled);
            set({
              installed: newInstalled,
              installing: null,
              progress: 0,
            });
          }, 400);
        }
      }, delay);
    });
  },

  uninstallApp: (appId) => {
    const newInstalled = get().installed.filter(id => id !== appId);
    save(newInstalled);
    set({ installed: newInstalled });
  },
}));
