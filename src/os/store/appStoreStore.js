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
  // Add these to the APP_CATALOG array in appStoreStore.js
  {
    id: 'json-formatter',
    appId: 'jsonFormatter',
    name: 'JSON Formatter',
    tagline: 'Beautify, validate and explore JSON instantly',
    description: 'Paste any JSON — minified, broken, or ugly. Get instant pretty-print with syntax highlighting, error detection, collapsible tree view, and one-click copy. Handles nested objects, arrays, and edge cases.',
    category: 'DEVELOPER TOOLS',
    version: '1.0.0',
    size: '1.4 MB',
    author: 'Smit Patil',
    featured: false,
    icon: '{}',
  },
  {
    id: 'api-tester',
    appId: 'apiTester',
    name: 'API Tester',
    tagline: 'Mini Postman. Send HTTP requests, inspect responses.',
    description: 'A full HTTP client inside the OS. Set method, URL, headers, body. Send requests, see response status, headers, and JSON. Supports GET, POST, PUT, PATCH, DELETE. Response syntax highlighted.',
    category: 'DEVELOPER TOOLS',
    version: '1.0.0',
    size: '2.1 MB',
    author: 'Smit Patil',
    featured: true,
    icon: '⇄',
  },
  {
    id: 'jwt-decoder',
    appId: 'jwtDecoder',
    name: 'JWT Decoder',
    tagline: 'Decode any JWT token instantly. No backend.',
    description: 'Paste any JWT token. Instantly decode header, payload, signature. Shows expiry countdown, issued-at time, all claims. Highlights expired tokens in red. Zero data sent anywhere.',
    category: 'DEVELOPER TOOLS',
    version: '1.0.0',
    size: '0.9 MB',
    author: 'Smit Patil',
    featured: false,
    icon: '🔑',
  },
  {
    id: 'regex-tester',
    appId: 'regexTester',
    name: 'Regex Tester',
    tagline: 'Live regex matching with highlight and capture groups',
    description: 'Write a regex pattern, paste test strings, see matches highlighted in real time. Shows capture groups, match count, flags support (g, i, m, s). Includes a cheat sheet.',
    category: 'DEVELOPER TOOLS',
    version: '1.0.0',
    size: '1.0 MB',
    author: 'Smit Patil',
    featured: false,
    icon: '.*',
  },
  {
    id: 'color-picker',
    appId: 'colorPicker',
    name: 'Color Picker',
    tagline: 'Pick colors. Copy HEX, RGB, HSL instantly.',
    description: 'A full-featured color picker with hue slider, saturation/brightness canvas, opacity control. Outputs HEX, RGB, HSL, RGBA. Palette history. Eyedropper API support.',
    category: 'DESIGN TOOLS',
    version: '1.0.0',
    size: '1.2 MB',
    author: 'Smit Patil',
    featured: false,
    icon: '◉',
  },
  {
    id: 'css-gradient',
    appId: 'cssGradient',
    name: 'CSS Gradient',
    tagline: 'Visual gradient builder. Copy ready CSS.',
    description: 'Build linear or radial gradients visually. Add color stops, drag positions, pick angles. Live preview. Outputs production-ready CSS code. One click copy.',
    category: 'DESIGN TOOLS',
    version: '1.0.0',
    size: '1.3 MB',
    author: 'Smit Patil',
    featured: false,
    icon: '▣',
  },
  {
    id: 'kanban',
    appId: 'kanban',
    name: 'Kanban',
    tagline: 'Drag and drop task board. Persists locally.',
    description: 'A full Kanban board with TODO / IN PROGRESS / DONE columns. Add cards, drag between columns, delete. Everything persists to localStorage. Clean, fast, no account needed.',
    category: 'PRODUCTIVITY',
    version: '1.0.0',
    size: '1.8 MB',
    author: 'Smit Patil',
    featured: false,
    icon: '▦',
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
