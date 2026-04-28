import React, { useState } from 'react';
import { tokens } from '../../styles/tokens';

export default function Music() {
  const [input, setInput] = useState('');
  const [tracks, setTracks] = useState([]);

  const handleParse = () => {
    const parsed = input.split('\n').filter(Boolean);
    setTracks(parsed);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: tokens.colors.bgSurface,
      fontFamily: tokens.typography.fontMono,
      overflowY: 'auto',
      scrollbarWidth: 'none',
    }}>
      {/* HEADER */}
      <div style={{
        padding: '20px 20px 12px',
        borderBottom: `1px solid ${tokens.colors.borderFaint}`,
      }}>
        <div style={{
          fontSize: '10px',
          color: tokens.colors.textTertiary,
          letterSpacing: '0.1em',
          marginBottom: '4px',
        }}>
          // MUSIC
        </div>
        <div style={{
          fontSize: '18px',
          color: tokens.colors.textPrimary,
          fontWeight: 600,
          marginBottom: '4px',
        }}>
          Playlist Viewer
        </div>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste playlist here (one track per line)..."
          style={{
            width: '100%',
            height: '80px',
            backgroundColor: tokens.colors.bgCanvas,
            border: `1px solid ${tokens.colors.borderSubtle}`,
            color: tokens.colors.textSecondary,
            fontFamily: tokens.typography.fontMono,
            fontSize: '11px',
            padding: '8px',
            marginTop: '12px',
            resize: 'none',
            borderRadius: '2px',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={handleParse}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '8px',
            backgroundColor: 'var(--os-accent)',
            border: 'none',
            borderRadius: '2px',
            color: tokens.colors.bgCanvas,
            fontFamily: tokens.typography.fontMono,
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          LOAD PLAYLIST
        </button>
      </div>

      {/* TRACK LIST */}
      {tracks.length > 0 && (
        <div style={{ padding: '0 20px 12px' }}>
           <div style={{
            fontSize: '10px',
            color: tokens.colors.textTertiary,
            marginBottom: '6px',
            marginTop: '8px',
          }}>
            QUEUE
          </div>
          {tracks.map((track, i) => (
            <div
              key={i}
              style={{
                padding: '6px 10px',
                borderBottom: `1px solid ${tokens.colors.borderFaint}`,
                fontSize: '11px',
                color: tokens.colors.textSecondary,
              }}
            >
              {i + 1}. {track}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
