import React, { useState } from 'react';
import { tokens } from '../../styles/tokens';
import { useWindowStore } from '../../store/windowStore';

const PROJECT_URLS = {
  playlistbridge: 'https://playlistbridge.netlify.app',
  rmsads:         'https://rmsads.com',
  answerhunt:     'https://answerhunt.com',
  smitos:         null,
};

const FILE_SYSTEM = {
  root: {
    name: '~/',
    children: ['projects', 'docs', 'config'],
  },
  projects: {
    name: 'projects/',
    children: ['playlistbridge', 'rmsads', 'answerhunt', 'smitos'],
  },
  docs: {
    name: 'docs/',
    children: ['resume', 'about', 'contact'],
  },
  config: {
    name: 'config/',
    children: ['stack', 'philosophy'],
  },
};

const FILES = {
  playlistbridge: {
    name: 'playlistbridge.md',
    icon: '▣',
    size: '4.2 KB',
    modified: 'Mar 2024',
    content: [
      '# PlaylistBridge',
      '',
      'Converts AI playlists to Spotify, YouTube Music',
      'and YouTube links instantly.',
      '',
      'STATUS    LIVE — #1 Google rank',
      'USERS     200+ per month',
      'STACK     Vanilla JS, Serverless, Canvas API',
      'URL       playlistbridge.netlify.app',
      '',
      '## Features',
      '→ Zero login required',
      '→ Zero API keys from user',
      '→ Full PWA — works offline',
      '→ AI referral traffic via llms.txt',
      '→ 3-layer cache system',
      '→ Canvas image generation',
    ],
  },
  rmsads: {
    name: 'rmsads.md',
    icon: '▣',
    size: '3.8 KB',
    modified: 'Jan 2024',
    content: [
      '# RMS Ads',
      '',
      'Influencer ad platform for Telegram.',
      'Live campaigns, real revenue.',
      '',
      'STATUS    LIVE — real clients',
      'STACK     Firebase, Vanilla JS',
      'URL       rmsads.com',
      '',
      '## Features',
      '→ Affiliate tracking',
      '→ Multi-brand support',
      '→ Real-time revenue reports',
      '→ Client dashboard',
    ],
  },
  answerhunt: {
    name: 'answerhunt.md',
    icon: '▣',
    size: '5.1 KB',
    modified: 'Feb 2024',
    content: [
      '# AnswerHunt',
      '',
      'Reddit + forum insights aggregated into',
      'structured verdict pages.',
      '',
      'STATUS    LIVE — AdSense revenue',
      'STACK     Firebase, SEO architecture',
      'URL       answerhunt.com',
      '',
      '## Features',
      '→ Insight Scores',
      '→ Situation Filters',
      '→ Community YES/NO debates',
      '→ Google AdSense revenue',
    ],
  },
  smitos: {
    name: 'smit-os.md',
    icon: '▣',
    size: '∞',
    modified: 'Apr 2025',
    content: [
      '# SMIT OS',
      '',
      'This portfolio. A browser-based OS.',
      '',
      'STATUS    IN DEVELOPMENT',
      'STACK     React 19, Vite, Zustand, Framer',
      '',
      '## Features',
      '→ Full windowed environment',
      '→ Drag + resize + minimize + genie animation',
      '→ App registry + command palette',
      '→ Theme system + wallpapers',
      '→ Terminal with easter eggs',
      '→ Persistent state',
    ],
  },
  resume: {
    name: 'resume.txt',
    icon: '◻',
    size: '12 KB',
    modified: 'Apr 2025',
    content: [
      'SMIT KAPILDEO PATIL',
      '19 · Self-taught · Mumbai, India',
      '',
      'CONTACT',
      'pilgrim3201@gmail.com',
      '@coder_smit',
      '+91 99750 34180',
      '',
      'SKILLS',
      'Vanilla JS · HTML5 · CSS3 · React + Vite',
      'Firebase · Netlify · Serverless Functions',
      'SEO · PWA · Canvas API · YouTube API',
      'Spotify API · Odesli · 3rd-party proxy',
      '',
      'EXPERIENCE',
      'Indie Developer — Self-employed',
      'Building since age 14',
      '3 live revenue products',
      '#1 Google rank (PlaylistBridge)',
      '',
      'EDUCATION',
      'BTech — starting August 2026',
      'Everything else: self-taught',
    ],
  },
  about: {
    name: 'about.txt',
    icon: '◻',
    size: '2 KB',
    modified: 'Apr 2025',
    content: [
      'While others are doing tutorial clones,',
      'I ship real products that rank on Google',
      'and generate revenue.',
      '',
      'My stack is lean on purpose.',
      'Vanilla JS + Firebase + Netlify.',
      'No framework overhead.',
      'Every decision is intentional.',
      '',
      'I start BTech in August 2026.',
      'Right now, I build.',
    ],
  },
  contact: {
    name: 'contact.txt',
    icon: '◻',
    size: '1 KB',
    modified: 'Apr 2025',
    content: [
      'EMAIL     pilgrim3201@gmail.com',
      'INSTAGRAM @coder_smit',
      'PHONE     +91 99750 34180',
      'SITE      smitdev.netlify.app',
    ],
  },
  stack: {
    name: 'stack.config',
    icon: '⎔',
    size: '800 B',
    modified: 'Apr 2025',
    content: [
      '[core]',
      'language   = Vanilla JavaScript',
      'markup     = HTML5',
      'styling    = CSS3 + inline tokens',
      '',
      '[frameworks]',
      'frontend   = React 19 + Vite',
      'state      = Zustand 5',
      'animation  = Framer Motion',
      '',
      '[backend]',
      'database   = Firebase Firestore',
      'functions  = Netlify Serverless',
      'auth       = Firebase Auth',
      '',
      '[deploy]',
      'hosting    = Netlify',
      'domain     = smitdev.netlify.app',
      '',
      '[philosophy]',
      'ui_libs    = 0',
      'bloat      = none',
    ],
  },
  philosophy: {
    name: 'philosophy.txt',
    icon: '◻',
    size: '1.2 KB',
    modified: 'Apr 2025',
    content: [
      '// Why I build the way I build',
      '',
      'Every framework is a bet.',
      'I bet on the platform.',
      '',
      'Vanilla JS loads faster.',
      'Costs less to maintain.',
      "Doesn't break when a dep updates.",
      '',
      'My stack is small by design.',
      'Not because I can\'t learn more —',
      'because I respect your users\'',
      'bandwidth and your server bill.',
      '',
      'You\'re not hiring a student.',
      'You\'re hiring a builder.',
    ],
  },
};

export default function Files() {
  const openWindow = useWindowStore(state => state.openWindow);
  const [selectedFolder, setSelectedFolder] = useState('projects');
  const [selectedFile, setSelectedFile] = useState('playlistbridge');

  const folderFiles = {
    projects: ['playlistbridge', 'rmsads', 'answerhunt', 'smitos'],
    docs:     ['resume', 'about', 'contact'],
    config:   ['stack', 'philosophy'],
  };

  const currentFiles = folderFiles[selectedFolder] || [];
  const currentFile = FILES[selectedFile];

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      backgroundColor: tokens.colors.bgSurface,
      fontFamily: tokens.typography.fontMono,
    }}>

      {/* LEFT — Folder tree */}
      <div style={{
        width: '160px',
        borderRight: `1px solid ${tokens.colors.borderSubtle}`,
        padding: '12px 0',
        flexShrink: 0,
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}>
        <div style={{
          padding: '0 12px 8px',
          fontSize: '10px',
          color: tokens.colors.textTertiary,
          letterSpacing: '0.1em',
        }}>
          FOLDERS
        </div>
        {Object.entries(folderFiles).map(([folderId]) => (
          <div
            key={folderId}
            onClick={() => {
              setSelectedFolder(folderId);
              setSelectedFile(folderFiles[folderId][0]);
            }}
            style={{
              padding: '7px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              color: selectedFolder === folderId
                ? 'var(--os-accent)'
                : tokens.colors.textSecondary,
              backgroundColor: selectedFolder === folderId
                ? tokens.colors.accentMuted
                : 'transparent',
              borderLeft: selectedFolder === folderId
                ? '2px solid var(--os-accent)'
                : '2px solid transparent',
              transition: 'all 0.1s',
            }}
          >
            {folderId}/
          </div>
        ))}
      </div>

      {/* MIDDLE — File list */}
      <div style={{
        width: '200px',
        borderRight: `1px solid ${tokens.colors.borderSubtle}`,
        flexShrink: 0,
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}>
        <div style={{
          padding: '12px 12px 8px',
          fontSize: '10px',
          color: tokens.colors.textTertiary,
          letterSpacing: '0.1em',
          borderBottom: `1px solid ${tokens.colors.borderFaint}`,
        }}>
          {selectedFolder}/
        </div>
        {currentFiles.map((fileId) => {
          const file = FILES[fileId];
          if (!file) return null;
          const isSelected = selectedFile === fileId;
          return (
            <div
              key={fileId}
              onClick={() => setSelectedFile(fileId)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: isSelected
                  ? tokens.colors.bgElevated
                  : 'transparent',
                borderBottom: `1px solid ${tokens.colors.borderFaint}`,
                transition: 'background-color 0.1s',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '2px',
              }}>
                <span style={{
                  color: isSelected ? 'var(--os-accent)' : tokens.colors.textTertiary,
                  fontSize: '11px',
                }}>
                  {file.icon}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: isSelected
                    ? tokens.colors.textPrimary
                    : tokens.colors.textSecondary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {file.name}
                </span>
              </div>
              <div style={{
                fontSize: '10px',
                color: tokens.colors.textTertiary,
                paddingLeft: '19px',
              }}>
                {file.size} · {file.modified}
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT — File content */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}>
        {currentFile ? (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: `1px solid ${tokens.colors.borderFaint}`,
            }}>
              <span style={{ color: 'var(--os-accent)', fontSize: '14px' }}>
                {currentFile.icon}
              </span>
              <span style={{
                fontSize: '13px',
                color: tokens.colors.textPrimary,
                fontWeight: 600,
              }}>
                {currentFile.name}
              </span>
              {PROJECT_URLS[selectedFile] && (
                <button
                  onClick={() => openWindow('browser', null, { url: PROJECT_URLS[selectedFile] })}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--os-accent)',
                    borderRadius: '2px',
                    color: 'var(--os-accent)',
                    fontFamily: tokens.typography.fontMono,
                    fontSize: '10px',
                    padding: '2px 6px',
                    cursor: 'pointer',
                    marginLeft: '8px',
                    letterSpacing: '0.05em',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(232,160,32,0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  LIVE ↗
                </button>
              )}
              <span style={{
                marginLeft: 'auto',
                fontSize: '10px',
                color: tokens.colors.textTertiary,
              }}>
                {currentFile.size} · modified {currentFile.modified}
              </span>
            </div>
            {currentFile.content.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: '12px',
                  lineHeight: '1.8',
                  color: line.startsWith('#')
                    ? tokens.colors.textPrimary
                    : line.startsWith('//')
                    ? 'var(--os-accent)'
                    : line.startsWith('→')
                    ? tokens.colors.textSecondary
                    : line.startsWith('[')
                    ? 'var(--os-accent)'
                    : line === ''
                    ? tokens.colors.textTertiary
                    : tokens.colors.textSecondary,
                  fontWeight: line.startsWith('#') ? 600 : 400,
                }}
              >
                {line || '\u00A0'}
              </div>
            ))}
          </>
        ) : (
          <div style={{
            color: tokens.colors.textTertiary,
            fontSize: '12px',
          }}>
            Select a file to view
          </div>
        )}
      </div>
    </div>
  );
}
