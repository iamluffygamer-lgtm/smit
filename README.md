# SMIT OS

<div align="center">

```
░██████╗███╗░░░███╗██╗████████╗
██╔════╝████╗░████║██║╚══██╔══╝
╚█████╗░██╔████╔██║██║░░░██║░░░
░╚═══██╗██║╚██╔╝██║██║░░░██║░░░
██████╔╝██║░╚═╝░██║██║░░░██║░░░
╚═════╝░╚═╝░░░░░╚═╝╚═╝░░░╚═╝░░░
      OS — v1.0.0
```

**A browser-based operating system. Built as a portfolio.**

[![Live](https://img.shields.io/badge/LIVE-smitdev.netlify.app-E8A020?style=flat-square&labelColor=0C0A08)](https://smitdev.netlify.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&labelColor=0C0A08)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&labelColor=0C0A08)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-4ADE80?style=flat-square&labelColor=0C0A08)](LICENSE)

[**Live Demo**](https://smitdev.netlify.app) · [**About Me**](https://smitdev.netlify.app?open=about) · [**My Projects**](https://smitdev.netlify.app?open=projects) · [**Contact**](https://smitdev.netlify.app?open=contact)

</div>

---

## What is this?

Most developers build a portfolio website.

I built an operating system.

SMIT OS is a fully functional browser-based OS with draggable windows, a custom dock, an app store with 13 installable apps, a YouTube client with a custom recommendation algorithm, easter eggs, character wallpapers, and a terminal that actually does things.

Not a gimmick. Not a template. Every line written from scratch.

---

## Demo

<div align="center">

| Desktop | App Store | SmitTV |
|---------|-----------|--------|
| Walter White wallpaper, ambient OS | Browse and install apps live | Custom algorithm, real YouTube feed |

</div>

> **Try these immediately:**
> - Press `Ctrl+K` — CommandPalette
> - Right-click the desktop — context menu
> - Type `sudo hire-me` in the Terminal
> - Try the Konami code: `↑↑↓↓←→←→BA`
> - Open App Store → install Code Editor → type "calculator" in AI panel → hit RUN

---

## Features

### The OS
- **Full windowed environment** — drag, resize, minimize, maximize, 8-direction resize
- **Genie minimize animation** — windows fly to their dock icon on minimize
- **Blind-pull open animation** — windows assemble from a line with spring physics
- **Window persistence** — positions, sizes, and state survive page refresh
- **Command Palette** (`Ctrl+K`) — search apps, projects, actions. Keyboard navigable.
- **Desktop icons** — double-click to open apps
- **Right-click context menu** — quick launch from anywhere
- **Custom dock** — pinned apps + running apps separated by a divider
- **Launchpad** (`⊞`) — full-screen app grid with search
- **Boot screen** — ASCII art, typing animation, loading bar
- **Welcome toast** — guided onboarding for new visitors
- **Konami code** easter egg

### Apps (Core)
| App | Description |
|-----|-------------|
| **Terminal** | Full command system. `neofetch`, `sudo hire-me`, `ssh smit@portfolio`, `matrix`, hidden commands |
| **About** | Bio, stats, skills. Headline scrambles on 5 rapid clicks. |
| **Projects** | PlaylistBridge, RMS Ads, AnswerHunt — all live products |
| **Contact** | Email compose, click-to-copy, availability status |
| **Files** | 3-panel file explorer. Click projects to open in Browser. |
| **Browser** | New tab launcher. Search → Google. Quick links. |
| **Notes** | 3 persistent slots. Slash commands. Autosave. |
| **Music** | PlaylistBridge showcase |
| **Paint** | HTML5 canvas. Undo/redo. Fill tool. Save PNG. |
| **Games** | Neon Surge arcade game |
| **Settings** | Theme color, 9 wallpapers, brightness, UI scale, clock format, reset |

### App Store
Install apps from the store. They appear in Launchpad. Open them → they appear in the Dock.

| App | Category | What it shows |
|-----|----------|---------------|
| **Code Editor** | Developer Tools | HTML/CSS/JS playground. AI templates. Live preview. `npm run dev` theatrical flow. Blob deploy. |
| **JSON Formatter** | Developer Tools | Syntax highlighting, error detection, minify/beautify, line numbers |
| **API Tester** | Developer Tools | Mini Postman. GET/POST/PUT/PATCH/DELETE. Headers, body, auth. Response timeline. |
| **JWT Decoder** | Developer Tools | Decode any token. Expiry countdown. Token anatomy visualization. |
| **Regex Tester** | Developer Tools | Live match highlighting. Capture groups. Built-in cheat sheet. |
| **CSS Gradient** | Design Tools | Visual builder. Drag color stops. 8 presets. Copy CSS. |
| **Color Picker** | Design Tools | HSV canvas. Hue + opacity sliders. Eyedropper API. History. |
| **Calculator** | Utilities | Clean scientific calculator. No `eval()`. |
| **Pomodoro** | Utilities | SVG progress ring. Session counter. Web Audio beep. |
| **Kanban** | Productivity | Drag and drop. Priorities. Labels. Persisted locally. |
| **QR Generator** | Utilities | Live QR code. Custom colors. Download PNG. |
| **ASCII Art** | Creative | Text → ASCII art. Full A-Z character map. Multiple styles. |
| **Pixel Canvas** | Creative | 16×16 pixel art editor. Flood fill. Export PNG. |

### SmitTV — The Flagship App
A YouTube client with a custom recommendation algorithm.

**Every visitor gets a unique feed. No two people see the same videos.**

```
How it works:

1. Preference Vector
   Each of 10 categories gets a random weight (0.1–0.9)
   Initialized uniquely per visitor using seeded random

2. Firebase Cache Layer  
   Netlify function scrapes YouTube via Invidious API
   Results cached in Firestore with 7-day TTL
   Subsequent requests: served from cache in <50ms
   Same pattern as a CDN

3. Feed Builder
   Weighted sample from each category
   Fisher-Yates shuffle with unique seed
   20 videos, different order every time

4. Real-time Personalization
   Watch >30s → category weight increases
   Decay function reduces all other weights
   Feed rebuilds automatically

5. Feed Modes
   DEEP WORK — boosts coding, science, suppresses entertainment
   CHAOS     — maximum variety, category switching
   INSPIRE   — motivation, startups, design
   LEARN     — educational, long-form content
   CHILL     — music, light content

6. Archetype Detection
   Builder / Explorer / Creator / Researcher
   Computed from preference vector distribution
   Updates as you watch
```

---

## Architecture

```
src/
├── app/
│   └── App.jsx                    ← Root, boot sequence
└── os/
    ├── apps/                      ← All app components
    │   ├── AppStore/              ← App Store UI
    │   ├── SmitTV/                ← YouTube client + algorithm
    │   │   ├── index.jsx          ← Main component
    │   │   └── algorithm.js       ← Preference engine
    │   ├── CodeEditor/            ← Playground + AI templates
    │   └── [13 more apps]
    ├── core/                      ← OS chrome
    │   ├── Window.jsx             ← Drag, resize, animations
    │   ├── WindowManager.jsx      ← AnimatePresence wrapper
    │   ├── Dock.jsx               ← Pinned + running apps
    │   ├── Launchpad.jsx          ← Full-screen app grid
    │   ├── CommandPalette.jsx     ← Ctrl+K global search
    │   ├── Desktop.jsx            ← Wallpapers, context menu, toasts
    │   └── BootScreen.jsx         ← Boot sequence
    ├── store/                     ← Zustand state
    │   ├── windowStore.js         ← Window lifecycle
    │   ├── appStoreStore.js       ← Install state
    │   └── settingsStore.js       ← Theme, wallpaper, preferences
    ├── hooks/
    │   ├── useWindowDrag.js       ← Pointer capture drag
    │   ├── useWindowResize.js     ← 8-direction resize
    │   └── useKonamiCode.js       ← ↑↑↓↓←→←→BA
    ├── system/
    │   ├── ThemeProvider.jsx      ← CSS custom properties
    │   ├── persistence.js         ← localStorage + schema versioning
    │   └── notificationStore.js   ← Toast notification system
    └── styles/
        └── tokens.js              ← Single source of truth for design
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | React 19 + Vite | Fast HMR, React compiler |
| State | Zustand 5 | Minimal, no boilerplate |
| Animation | Framer Motion | AnimatePresence for window lifecycle |
| Styling | Inline styles + tokens.js | Theme switching via CSS vars |
| Backend | Netlify Functions | Serverless, zero cold start |
| Database | Firebase Firestore | SmitTV video cache + real-time |
| Typography | JetBrains Mono + DM Sans | Mono for OS chrome, sans for content |
| PWA | vite-plugin-pwa | Installable on desktop + mobile |

**Zero UI libraries. Every component handwritten.**

---

## Design System

```js
// tokens.js — the entire visual identity in one file

colors: {
  bgCanvas:     '#0C0A08',  // warm near-black
  accent:       '#E8A020',  // amber — the only chromatic signal
  textPrimary:  '#F5F2EE',  // warm near-white
}

// One accent color. Total authority.
// Everything else is warm grayscale.
```

**Rules that make it consistent:**
- Amber `#E8A020` is the ONLY color used for interactive states
- `var(--os-accent)` everywhere — theme switching works in real time
- JetBrains Mono for OS chrome, DM Sans for app content
- Sharp corners on window frames (`border-radius: 0`)
- Warm shadows (`rgba(8,6,4,...)`) — never cold gray

---

## Getting Started

```bash
# Clone
git clone https://github.com/coder-smit/smit-os.git
cd smit-os

# Install
npm install

# Environment variables
cp .env.example .env
# Fill in your Firebase credentials

# Run
npm run dev
```

### Environment Variables

```env
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

> SmitTV requires Firebase. Everything else works without it.

---

## Adding Apps to the App Store

Adding a new app takes 4 steps:

**1. Build the component**
```
src/os/apps/YourApp/index.jsx
```

**2. Add to APP_CATALOG**
```js
// src/os/store/appStoreStore.js
{
  id: 'your-app',
  appId: 'yourApp',
  name: 'Your App',
  tagline: 'One line description',
  category: 'UTILITIES',
  version: '1.0.0',
  size: '1.2 MB',
  author: 'Your Name',
  featured: false,
  icon: '◈',
}
```

**3. Add to app registry**
```js
// src/os/apps/appRegistry.jsx
{ id: 'yourApp', name: 'Your App', icon: '◈',
  defaultSize: { width: 600, height: 400 },
  Component: YourApp }
```

**4. Add to WindowContent**
```js
// src/os/core/WindowContent.jsx
'yourApp': YourApp,
```

Install flow, dock integration, notifications — all automatic.

---

## Terminal Commands

```bash
help          # list all commands
neofetch      # system info with ASCII art
whoami        # current user
ls            # list filesystem
ls projects/  # list projects
cat resume.txt        # print resume
cat projects/playlistbridge  # project details
open [appId]  # open any app
sudo hire-me  # the good stuff
ssh smit@portfolio  # connect
npm run dev   # theatrical npm flow
git status    # version control
matrix        # ???
hack          # try it
age           # smit's age and why it matters
curl wttr.in/mumbai  # weather
```

> Some commands are hidden. Not listed here on purpose.

---

## Wallpapers

**Canvas series** — Pure CSS. No images.
- Canvas (default dark)
- Grid (amber dot grid)
- Noise (diagonal lines)

**Character series** — Amber line art on dark.
- Heisenberg (Walter White)
- Peter Griffin
- Sheldon Cooper
- Monkey D Luffy
- Pennywise
- Roger Smith

**Cinematic series**
- Iron Man

All wallpapers switch with a crossfade transition powered by Framer Motion `AnimatePresence`.

---

## Easter Eggs

There are several. Finding them is the point. Hints:

- The terminal has commands not listed in `help`
- The About headline reacts to rapid clicks
- There is a sequence of keys that activates something
- There is a file in the Files app that shouldn't exist
- `sudo rm -rf /` does something

---

## Performance

| Metric | Value |
|--------|-------|
| Initial bundle | ~180KB gzipped |
| App chunks | 20-50KB each (lazy loaded) |
| First paint | <1s on fast connection |
| Window open | 120ms spring animation |
| SmitTV cache hit | <50ms (Firebase) |

Apps load only when first opened. Vendor libraries split into separate cached chunks.

---

## About the Builder

**Smit Kapildeo Patil** — 19. Self-taught. Mumbai, India.

While others were doing tutorial clones, I was shipping products that rank #1 on Google and generate real revenue.

- **PlaylistBridge** — #1 Google rank, 780+ playlists generated, 200+ users/month
- **RMS Ads** — Live influencer ad platform, real clients, real earnings
- **AnswerHunt** — Content platform with live Google AdSense revenue

My stack is deliberately lean. Vanilla JS + Firebase + Netlify. No framework overhead. Every architectural decision is intentional.

I start BTech in August 2026. Right now, I build.

**Contact:**
- Email: pilgrim3201@gmail.com
- Instagram: [@coder_smit](https://instagram.com/coder_smit)
- Live: [smitdev.netlify.app](https://smitdev.netlify.app)

---

## License

MIT — use it, fork it, learn from it.

If you build something with this, I'd genuinely love to see it.

---

<div align="center">

**Built with zero frameworks on the frontend.**
**Zero CS classes taken.**
**Zero excuses.**

[smitdev.netlify.app](https://smitdev.netlify.app)

</div>
