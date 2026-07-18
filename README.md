# SMIT OS

A fully-interactive, browser-based desktop operating system — built as a portfolio. Draggable windows, a dock, a launchpad, a command palette, an app store, and 20+ working mini-apps, all running client-side in React.

**Live:** add your deployed URL here
**Author:** Smit Kapildeo Patil ([@coder_smit](https://instagram.com/coder_smit))

---

## ✨ Features

- **Real window management** — drag, resize, minimize, maximize, focus/z-index stacking, and persistence across reloads
- **Dock + Taskbar + Launchpad** — macOS/Windows-style navigation, with a searchable app grid
- **Command Palette** — jump to any app or action instantly
- **App Store** — a simulated store with install/uninstall flow, progress animation, and localStorage persistence, so extra apps can be "installed" on demand
- **Boot screen** — a startup sequence on first load
- **PWA support** — installable as a standalone app (offline caching, manifest, icons) via `vite-plugin-pwa`
- **Mobile mode** — a dedicated mobile app container/layout for small screens
- **Konami code easter egg** and other hidden interactions
- **Theming** — centralized design tokens and a theme provider
- **Schema-versioned persistence** — window/app/settings state saved to `localStorage` safely across app updates

## 🖥️ Apps

Pre-installed on the desktop:

| App | Description |
|---|---|
| **About Me** | Bio, stats, and skills panel |
| **Projects** | Portfolio project showcase with tags, links, and stats |
| **Terminal** | A working shell with custom commands (`help`, `whoami`, `neofetch`, `sudo hire-me`, etc.) |
| **Contact** | Contact form / info panel |
| **Settings** | OS-level preferences |
| **Paint** | Canvas-based drawing app |
| **Files** | A simulated file explorer |
| **Music** | Audio player |
| **Browser** | An in-OS mini web browser |
| **Notes** | Simple note-taking app |
| **Games** | Mini game launcher |
| **App Store** | Browse and install the apps below |
| **Smit TV** | An algorithmic video feed that learns preferences and plays real YouTube videos |

Available via the **App Store** (install on demand):

| App | Category | Description |
|---|---|---|
| **Code Editor** | Developer Tools | HTML/CSS/JS playground with live preview and AI-style templates |
| **API Tester** | Developer Tools | Mini Postman — full HTTP client with headers, body, and syntax-highlighted responses |
| **JSON Formatter** | Developer Tools | Beautify, validate, and explore JSON with a collapsible tree view |
| **JWT Decoder** | Developer Tools | Decode JWTs client-side — header, payload, signature, expiry |
| **Regex Tester** | Developer Tools | Live regex matching with capture groups and a cheat sheet |
| **Color Picker** | Design Tools | HEX/RGB/HSL picker with palette history and Eyedropper API support |
| **CSS Gradient** | Design Tools | Visual linear/radial gradient builder with copyable CSS output |
| **Kanban** | Productivity | Drag-and-drop TODO/IN PROGRESS/DONE board, persisted locally |
| **Calculator** | Utilities | Standard + scientific calculator |
| **Pomodoro** | Utilities | 25/5 focus timer with session tracking |
| **QR Generator** | Utilities | Generate and download QR codes as PNG |
| **ASCII Art** | Creative | Convert text into block-character ASCII art |
| **Pixel Canvas** | Creative | 16×16 / 32×32 pixel art editor with PNG export |

## 🛠️ Tech Stack

- **[React 19](https://react.dev/)** with the React Compiler enabled
- **[Vite 7](https://vite.dev/)** — dev server and build tooling
- **[Zustand](https://github.com/pmndrs/zustand)** — state management (windows, apps, settings, navigation, app store)
- **[Framer Motion](https://www.framer.com/motion/)** — window and UI animations
- **[Tailwind CSS 4](https://tailwindcss.com/)** — utility styling, alongside hand-written CSS modules for the OS chrome
- **[Firebase](https://firebase.google.com/)** — backend services (Firestore, etc.)
- **[Netlify Functions](https://www.netlify.com/platform/core/functions/)** — serverless endpoints (`cors-proxy`, `smittv-fetch`)
- **[qrcode.react](https://github.com/zpao/qrcode.react)** — QR code rendering
- **[yt-search](https://www.npmjs.com/package/yt-search)** — YouTube search for Smit TV
- **[vite-plugin-pwa](https://vite-pwa-org.netlify.app/)** — PWA manifest, icons, and offline caching
- **ESLint 9** (flat config) — linting

## 📁 Project Structure

```
src/
├── app/                  # App-level entry wiring
├── os/
│   ├── apps/              # Every individual application (one folder per app)
│   ├── config/            # External links, etc.
│   ├── core/              # Desktop, Dock, Window, WindowManager, Launchpad,
│   │                         CommandPalette, Taskbar, BootScreen, OSProvider
│   ├── hooks/             # useWindowDrag, useWindowResize, useFocus,
│   │                         useKonamiCode, useShortcuts
│   ├── icons/             # SVG icon components
│   ├── store/             # Zustand stores (windows, apps, settings, nav)
│   ├── styles/            # Design tokens, theme, OS/window CSS
│   ├── system/            # Clock, tray, notifications, persistence,
│   │                         theme provider, PWA install button
│   └── utils/             # clamp, low-end device detection, z-index manager
├── main.jsx
└── App.css / index.css
netlify/functions/         # cors-proxy.js, smittv-fetch.js
scripts/                    # Icon + OG image generation scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd smit-main
npm install
```

### Development

```bash
npm run dev
```

Runs the app locally with Vite (HMR enabled). If developing with Netlify Functions, use the Netlify CLI instead so functions and the dev server run together:

```bash
netlify dev
```

### Build

```bash
npm run build
```

Outputs a production build to `dist/`.

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## ☁️ Deployment

This project is configured for **Netlify** out of the box (`netlify.toml`):

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

Push to your connected Git provider or run `netlify deploy` to ship.

## 🔒 Notes on Backend Usage

- **Firebase** is used for data that needs to persist server-side (e.g. voting, campaign tracking in sister projects). Configure your own Firebase project and environment variables before relying on any Firestore-backed features.
- **Netlify Functions** (`cors-proxy.js`, `smittv-fetch.js`) proxy third-party requests (e.g. YouTube data for Smit TV) to avoid CORS/API-key exposure in the client.

## 📄 License

Add your license of choice here (e.g. MIT).
