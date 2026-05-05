export const commands = [

  {
    name: 'help',
    description: 'List available commands',
    execute: ({ api, commands }) => {
      api.print('');
      api.print('  SMIT OS — available commands');
      api.print('  ─────────────────────────────────────');
      commands.forEach(cmd => {
        api.print(`  ${cmd.name.padEnd(16)} ${cmd.description}`);
      });
      api.print('');
      api.print('  tip: try "neofetch" or "sudo hire-me"');
      api.print('');
    }
  },

  {
    name: 'whoami',
    description: 'Current user info',
    execute: ({ api }) => {
      api.print('');
      api.print('  visitor@smit-os');
      api.print('  ───────────────────────────────────');
      api.print('  Role     : Guest / Recruiter / Dev');
      api.print('  Access   : Read-only');
      api.print('  Fun fact : The person who built this');
      api.print('             OS is 19 and has never');
      api.print('             taken a CS class.');
      api.print('');
    }
  },

  {
    name: 'about',
    description: 'About this OS',
    execute: ({ api }) => {
      api.print('');
      api.print('  SMIT OS v1.0.0');
      api.print('  ───────────────────────────────────');
      api.print('  A browser-based operating system');
      api.print('  built as a portfolio.');
      api.print('');
      api.print('  Stack    : React 19 + Vite');
      api.print('  State    : Zustand 5');
      api.print('  Styling  : Inline styles + tokens');
      api.print('  Storage  : localStorage');
      api.print('  UI libs  : 0');
      api.print('');
    }
  },

  {
    name: 'neofetch',
    description: 'System info',
    execute: ({ api }) => {
      api.print('');
      api.print('        ░██████╗███╗░░░███╗██╗████████╗');
      api.print('        ██╔════╝████╗░████║██║╚══██╔══╝');
      api.print('        ╚█████╗░██╔████╔██║██║░░░██║░░░');
      api.print('        ░╚═══██╗██║╚██╔╝██║██║░░░██║░░░');
      api.print('        ██████╔╝██║░╚═╝░██║██║░░░██║░░░');
      api.print('        ╚═════╝░╚═╝░░░░░╚═╝╚═╝░░░╚═╝░░░');
      api.print('');
      api.print('  OS         : SMIT OS v1.0.0');
      api.print('  Host       : Browser / Netlify');
      api.print('  Kernel     : React 19.0.0');
      api.print('  Shell      : smit-terminal v1.0');
      api.print('  Resolution : ' + window.innerWidth + 'x' + window.innerHeight);
      api.print('  CPU        : Ambition v19.0');
      api.print('  Memory     : Unlimited Ideas');
      api.print('  Storage    : 3 Live Products');
      api.print('  Uptime     : Since age 14');
      api.print('  Color      : ██████ Amber #E8A020');
      api.print('');
    }
  },

  {
    name: 'ls',
    description: 'List directory contents',
    execute: ({ api, args }) => {
      const dir = args[0] || '';
      api.print('');
      if (dir === '-la' || dir === '-al') {
        api.print('  drwxr-xr-x  smit  staff   ~/');
        api.print('  -rw-r--r--  smit  staff   .secret');
        api.print('  -rw-r--r--  smit  staff   resume.txt      12KB');
        api.print('  drwxr-xr-x  smit  staff   projects/');
        api.print('  drwxr-xr-x  smit  staff   docs/');
        api.print('  drwxr-xr-x  smit  staff   config/');
        api.print('  -rwxr-xr-x  smit  staff   .bash_history');
        api.print('');
        api.print('  tip: cat .bash_history');
      } else if (dir === 'projects' || dir === 'projects/') {
        api.print('  projects/');
        api.print('  ───────────────────────────────────');
        api.print('  playlistbridge/     4.2KB   LIVE ↗');
        api.print('  rmsads/             3.8KB   LIVE ↗');
        api.print('  answerhunt/         5.1KB   LIVE ↗');
        api.print('  smit-os/            ∞       IN DEV');
        api.print('');
        api.print('  type "cat projects/<name>" for details');
      } else {
        api.print('  ~/');
        api.print('  ───────────────────────────────────');
        api.print('  projects/           dir');
        api.print('  resume.txt          12KB');
        api.print('  about.txt           2KB');
        api.print('  contact.txt         1KB');
        api.print('  .secret             hidden');
        api.print('');
        api.print('  type "ls projects/" to see projects');
      }
      api.print('');
    }
  },

  {
    name: 'cat',
    description: 'Read a file',
    execute: ({ api, args }) => {
      const file = args[0] || '';
      api.print('');

      if (file === 'resume.txt') {
        api.print('  SMIT KAPILDEO PATIL');
        api.print('  ───────────────────────────────────');
        api.print('  19 · Self-taught · Mumbai, India');
        api.print('');
        api.print('  SKILLS');
        api.print('  Vanilla JS, HTML5, CSS3, React+Vite');
        api.print('  Firebase, Netlify, Serverless Fns');
        api.print('  SEO, PWA, Canvas API, YouTube API');
        api.print('  Spotify API, Odesli, 3rd-party proxy');
        api.print('');
        api.print('  EXPERIENCE');
        api.print('  Indie developer — self-employed');
        api.print('  Building since age 14');
        api.print('  3 live revenue products');
        api.print('  #1 Google rank (PlaylistBridge)');
        api.print('');
        api.print('  EDUCATION');
        api.print('  BTech — starting Aug 2026');
        api.print('  Everything else: self-taught');
        api.print('');
        api.print('  pilgrim3201@gmail.com');
      }

      else if (file === 'about.txt') {
        api.print('  While others are doing tutorial');
        api.print('  clones, I ship real products that');
        api.print('  rank on Google and generate revenue.');
        api.print('');
        api.print('  My stack is lean on purpose.');
        api.print('  Vanilla JS + Firebase + Netlify.');
        api.print('  No framework overhead. Every');
        api.print('  decision is intentional.');
        api.print('');
        api.print('  I start BTech in August 2026.');
        api.print('  Right now, I build.');
      }

      else if (file === 'contact.txt') {
        api.print('  EMAIL     pilgrim3201@gmail.com');
        api.print('  INSTAGRAM @coder_smit');
        api.print('  PHONE     +91 99750 34180');
        api.print('  SITE      smitdev.netlify.app');
      }

      else if (file === '.secret') {
        api.print('  nice try.');
        api.print('');
        api.print('  ...fine.');
        api.print('');
        api.print('  try "sudo hire-me"');
      }

      else if (file === '.bash_history') {
        api.print('  1  neofetch');
        api.print('  2  ls projects/');
        api.print('  3  cat resume.txt');
        api.print('  4  sudo rm -rf /');
        api.print('  5  git commit -m "ship it"');
        api.print('  6  npm run dev');
        api.print('  7  sudo hire-me');
        api.print('  8  cat .secret');
        api.print('  9  hack');
        api.print(' 10  ssh smit@portfolio');
      }

      else if (file === 'projects/playlistbridge') {
        api.print('  PlaylistBridge');
        api.print('  ───────────────────────────────────');
        api.print('  Converts AI playlists to Spotify,');
        api.print('  YouTube Music & YouTube instantly.');
        api.print('');
        api.print('  Zero login. Zero API keys.');
        api.print('  Full PWA. Works offline.');
        api.print('  Ranks #1 on Google.');
        api.print('  Gets AI referral traffic via llms.txt');
        api.print('');
        api.print('  Stack  : Vanilla JS, Serverless,');
        api.print('           Canvas API, YouTube API');
        api.print('  Status : LIVE — 200+ users/month');
        api.print('  URL    : playlistbridge.netlify.app');
      }

      else if (file === 'projects/rmsads') {
        api.print('  RMS Ads');
        api.print('  ───────────────────────────────────');
        api.print('  Influencer ad platform for Telegram');
        api.print('  Live campaigns, real revenue.');
        api.print('');
        api.print('  Manages affiliate campaigns across');
        api.print('  multiple EdTech brands. Tracks');
        api.print('  conversions, generates reports.');
        api.print('');
        api.print('  Stack  : Firebase, Vanilla JS');
        api.print('  Status : LIVE — real clients');
        api.print('  URL    : rmsads.com');
      }

      else if (file === 'projects/answerhunt') {
        api.print('  AnswerHunt');
        api.print('  ───────────────────────────────────');
        api.print('  Reddit + forum insights aggregated');
        api.print('  into structured verdict pages.');
        api.print('');
        api.print('  Insight Scores, Situation Filters,');
        api.print('  community YES/NO debates.');
        api.print('  Live Google AdSense revenue.');
        api.print('');
        api.print('  Stack  : Firebase, SEO architecture');
        api.print('  Status : LIVE — AdSense revenue');
        api.print('  URL    : answerhunt.com');
      }

      else {
        api.print('  cat: ' + file + ': No such file');
        api.print('  try "ls" to see available files');
      }
      api.print('');
    }
  },

  {
    name: 'open',
    description: 'Open an application',
    execute: ({ args, api }) => {
      const appId = args[0];
      if (!appId) {
        api.print('');
        api.print('  Usage: open <appId>');
        api.print('  Apps : about, projects, terminal,');
        api.print('         contact, settings');
        api.print('');
        return;
      }
      const apps = api.getApps();
      const exists = apps.some(a => a.id === appId);
      if (exists) {
        api.print('  Opening ' + appId + '...');
        api.openWindow(appId);
      } else {
        api.print('  Error: "' + appId + '" not found.');
      }
    }
  },

  {
    name: 'contact',
    description: 'Show contact info',
    execute: ({ api }) => {
      api.print('');
      api.print('  EMAIL     pilgrim3201@gmail.com');
      api.print('  INSTAGRAM @coder_smit');
      api.print('  PHONE     +91 99750 34180');
      api.print('  SITE      smitdev.netlify.app');
      api.print('');
      api.print('  or type "open contact" to open');
      api.print('  the contact window');
      api.print('');
    }
  },

  {
    name: 'ping',
    description: 'Ping a host',
    execute: ({ api, args }) => {
      const host = args[0] || 'smit-os';
      api.print('');
      api.print('  PING ' + host);
      api.print('  ───────────────────────────────────');
      const delays = [
        Math.floor(Math.random() * 8) + 2,
        Math.floor(Math.random() * 8) + 2,
        Math.floor(Math.random() * 8) + 2,
        Math.floor(Math.random() * 8) + 2,
      ];
      delays.forEach((d, i) => {
        api.print('  64 bytes: icmp_seq=' + i + ' ttl=64 time=' + d + ' ms');
      });
      api.print('');
      api.print('  4 packets transmitted, 4 received');
      api.print('  avg latency: ' + Math.floor(delays.reduce((a,b)=>a+b,0)/4) + ' ms');
      api.print('');
    }
  },

  {
    name: 'history',
    description: 'Show command history',
    execute: ({ api }) => {
      api.print('');
      api.print('  Use ↑ ↓ arrow keys to navigate');
      api.print('  command history in the input.');
      api.print('');
    }
  },

  {
    name: 'clear',
    description: 'Clear terminal output',
    execute: ({ api }) => {
      api.clear();
    }
  },

  {
    name: 'sudo',
    description: 'Execute as superuser',
    execute: ({ api, args }) => {
      const sub = args[0];
      api.print('');

      if (sub === 'hire-me') {
        api.print('  [sudo] password for smit: ');
        api.print('');
        api.print('  Authenticating...');
        api.print('  ✓ Identity verified');
        api.print('  ✓ Portfolio reviewed');
        api.print('  ✓ Projects confirmed live');
        api.print('  ✓ Revenue products: 3');
        api.print('  ✓ Google rank #1: confirmed');
        api.print('');
        api.print('  ██████████████████████ 100%');
        api.print('');
        api.print('  ACCESS GRANTED.');
        api.print('');
        api.print('  Smit Kapildeo Patil');
        api.print('  is available for projects.');
        api.print('');
        api.print('  pilgrim3201@gmail.com');
        api.print('  @coder_smit');
        api.print('');
        api.print('  Opening contact...');
        setTimeout(() => api.openWindow('contact'), 1500);
      }

      else if (sub === 'rm' && args[1] === '-rf') {
        api.print('  nice try.');
        api.print('  this OS has feelings.');
      }

      else {
        api.print('  sudo: ' + (sub || '(nothing)') + ': not allowed');
        api.print('  try "sudo hire-me"');
      }
      api.print('');
    }
  },

  {
    name: 'npm',
    description: 'Node package manager',
    execute: ({ api, args }) => {
      const sub = args[0];
      const sub2 = args[1];
      
      api.print('');

      if (sub === 'run' && sub2 === 'dev') {
        api.print('  > smit-os-playground@1.0.0 dev');
        api.print('  > vite');
        api.print('');
        
        // Fake timing with setTimeout
        setTimeout(() => {
          api.print('    VITE v5.4.0  ready in ' + (Math.floor(Math.random() * 80) + 60) + 'ms');
          api.print('');
          api.print('    ➜  Local:   http://localhost:5173/');
          api.print('    ➜  Network: http://192.168.1.1:5173/');
          api.print('');
          api.print('    Opening preview in Browser...');
          setTimeout(() => api.openWindow('browser'), 1000);
        }, 600);
        return;
      }

      if (sub === 'install' || sub === 'i') {
        const pkg = args[1] || 'dependencies';
        api.print('  npm warn idealTree already exists');
        setTimeout(() => {
          api.print('  added ' + (Math.floor(Math.random() * 200) + 100) + ' packages in ' + (Math.random() * 3 + 1).toFixed(1) + 's');
          api.print('');
        }, 800);
        return;
      }

      if (sub === 'start') {
        api.print('  Use "npm run dev" to start the dev server');
        api.print('');
        return;
      }

      api.print('  Usage:');
      api.print('  npm run dev     — start dev server');
      api.print('  npm install     — install packages');
      api.print('');
    }
  },

  {
    name: 'git',
    description: 'Version control system',
    execute: ({ api, args }) => {
      const sub = args[0];
      api.print('');
      
      if (sub === 'status') {
        api.print('  On branch main');
        api.print('  Your branch is up to date with origin/main');
        api.print('');
        api.print('  nothing to commit, working tree clean');
      } else if (sub === 'log') {
        api.print('  commit a3f2b1c (HEAD -> main, origin/main)');
        api.print('  Author: Smit Patil <pilgrim3201@gmail.com>');
        api.print('  Date:   ' + new Date().toDateString());
        api.print('');
        api.print('      ship it');
      } else if (sub === 'commit') {
        api.print('  [main ' + Math.random().toString(36).substr(2,7) + '] ' + (args.slice(2).join(' ') || 'update'));
        api.print('  1 file changed, 1 insertion(+)');
      } else {
        api.print('  git status  — check status');
        api.print('  git log     — view history');
        api.print('  git commit  — commit changes');
      }
      api.print('');
    }
  },

  {
    name: 'matrix',
    description: '???',
    execute: ({ api }) => {
      api.print('');
      api.print('  Initializing...');
      api.print('');
      api.print('  ｦ ｧ ｨ ｩ ｪ ｫ ｬ ｭ ｮ ｯ ｰ ｱ ｲ ｳ ｴ ｵ');
      api.print('  ｶ ｷ ｸ ｹ ｺ ｻ ｼ ｽ ｾ ｿ ﾀ ﾁ ﾂ ﾃ ﾄ ﾅ');
      api.print('  ﾆ ﾇ ﾈ ﾉ ﾊ ﾋ ﾌ ﾍ ﾎ ﾏ ﾐ ﾑ ﾒ ﾓ ﾔ ﾕ');
      api.print('');
      api.print('  Wake up, visitor.');
      api.print('  The OS has you.');
      api.print('');
      api.print('  smit built this.');
      api.print('  from scratch.');
      api.print('  at 19.');
      api.print('');
    }
  },

  {
    name: 'curl',
    description: 'Fetch a URL',
    execute: ({ api, args }) => {
      const url = args[0] || '';
      api.print('');
      if (url.includes('wttr') || url.includes('mumbai')) {
        api.print('  Weather for Mumbai, India');
        api.print('  ───────────────────────────────────');
        api.print('  ⛅ Partly Cloudy');
        api.print('  Temp     : 32°C');
        api.print('  Humidity : 78%');
        api.print('  Wind     : 14 km/h SW');
        api.print('  Feels    : Hot. Always hot.');
        api.print('');
        api.print('  Smit is probably coding anyway.');
      } else {
        api.print('  curl: ' + (url || '(no url)'));
        api.print('  try "curl wttr.in/mumbai"');
      }
      api.print('');
    }
  },

  {
    name: 'ssh',
    description: 'Connect to a remote host',
    execute: ({ api, args }) => {
      const host = args[0] || '';
      api.print('');
      if (host.includes('smit') || host === 'portfolio') {
        api.print('  SSH smit@portfolio');
        api.print('  ───────────────────────────────────');
        api.print('  Connecting to smit-os.netlify.app...');
        api.print('  ✓ Key exchange complete');
        api.print('  ✓ Encryption: AES-256');
        api.print('  ✓ Authenticated');
        api.print('');
        api.print('  Welcome to SMIT OS.');
        api.print('  You are already here.');
        api.print('');
        api.print('  "The destination was the');
        api.print('   portfolio all along."');
        api.print('');
      } else {
        api.print('  ssh: connect to host ' + host + ':');
        api.print('  Connection refused.');
        api.print('');
        api.print('  try "ssh smit@portfolio"');
      }
      api.print('');
    }
  },

  {
    name: 'open-url',
    description: 'Open a URL in browser',
    execute: ({ api, args }) => {
      const url = args[0];
      api.print('');

      if (!url) {
        api.print('  Usage: open-url <url>');
        api.print('  Example: open-url playlistbridge.netlify.app');
        api.print('');
        return;
      }

      let finalUrl = url.trim();

      // normalize URL
      if (!finalUrl.startsWith('http')) {
        finalUrl = 'https://' + finalUrl;
      }

      api.print('  Opening browser...');
      api.print('  → ' + finalUrl);

      // OPEN INSIDE OS (IMPORTANT)
      api.openWindow('browser', null, { url: finalUrl });

      api.print('');
    }
  },

  {
    name: 'note',
    description: 'Open notes app',
    execute: ({ api, args }) => {
      const text = args.join(' ');

      api.openWindow('notes', null, {
        prefill: text || ''
      });

      api.print('  Opening notes...');
    }
  },

  {
    name: 'paint',
    description: 'Open paint app',
    execute: ({ api, args }) => {
      const files = JSON.parse(localStorage.getItem('smit-os-paint-files') || '{}');

      if (args[0] === 'load') {
        const name = args[1];
        if (!files[name]) {
          api.print('  File not found');
          return;
        }

        api.openWindow('paint', null, {
          image: files[name]
        });

        api.print('  Loading ' + name);
        return;
      }

      api.openWindow('paint');
      api.print('  Opening paint...');
    }
  },

  {
    name: 'hack',
    hidden: true,
    execute: ({ api }) => {
      api.print('');
      api.print('  Initializing hack sequence...');
      api.print('  > scanning target...');
      api.print('  > bypassing firewall...');
      api.print('  > accessing mainframe...');
      api.print('  > downloading files...');
      api.print('  > ██████████████████ 100%');
      api.print('');
      api.print('  Just kidding. But you tried.');
      api.print('  That means you\'re curious.');
      api.print('  Smit likes curious people.');
      api.print('');
      api.print('  pilgrim3201@gmail.com');
      api.print('');
    }
  },

  {
    name: 'age',
    hidden: true,
    execute: ({ api }) => {
      api.print('');
      api.print('  19 years old.');
      api.print('  Self-taught.');
      api.print('  3 live revenue products.');
      api.print('  0 CS classes taken.');
      api.print('  Building since 14.');
      api.print('');
      api.print('  What\'s your excuse?');
      api.print('');
    }
  },

  {
    name: 'hire',
    hidden: true,
    execute: ({ api }) => {
      api.print('');
      api.print('  Redirecting to: sudo hire-me');
      api.print('');
      api.print('  Authenticating...');
      api.print('  ✓ Portfolio reviewed');
      api.print('  ✓ Projects confirmed live');
      api.print('  ✓ Revenue products: 3');
      api.print('  ✓ Google rank #1: confirmed');
      api.print('');
      api.print('  ACCESS GRANTED.');
      api.print('  Opening contact...');
      api.print('');
      setTimeout(() => api.openWindow('contact'), 1500);
    }
  },

  {
    name: 'exit',
    hidden: true,
    execute: ({ api }) => {
      api.print('');
      api.print('  logout');
      api.print('');
      api.print('  just kidding.');
      api.print('  you can\'t leave.');
      api.print('  this OS has you now.');
      api.print('');
    }
  },

  {
    name: 'date',
    hidden: true,
    execute: ({ api }) => {
      const now = new Date();
      api.print('');
      api.print('  ' + now.toString());
      api.print('');
    }
  },

  {
    name: 'uname',
    hidden: true,
    execute: ({ api }) => {
      api.print('');
      api.print('  SMIT-OS v1.0.0 Browser/React');
      api.print('  Built by Smit Kapildeo Patil');
      api.print('  Mumbai, India');
      api.print('');
    }
  }

];

const originalForEach = commands.forEach;
commands.forEach = function(callback) {
  originalForEach.call(this, (cmd, index, array) => {
    if (!cmd.hidden) callback(cmd, index, array);
  });
};
