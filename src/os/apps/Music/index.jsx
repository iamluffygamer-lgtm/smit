import React, { useState, useEffect } from 'react';
import { tokens } from '../../styles/tokens';
import { useWindowStore } from '../../store/windowStore';

export default function Music() {
  const [input, setInput] = useState('');
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('music-history') || '[]');
    setHistory(saved);
  }, []);

  const handleParse = () => {
    const parsed = input.split('\n').filter(Boolean);
    setTracks(parsed);
  };

  const resolveTrack = (track) => {
    return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(track)}`;
  };

  const playTrack = (track) => {
    const url = resolveTrack(track);
    setCurrentTrack({ name: track, url });

    const updatedHistory = [track, ...history.filter(t => t !== track).slice(0, 9)];
    setHistory(updatedHistory);
    localStorage.setItem('music-history', JSON.stringify(updatedHistory));
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
          PlaylistBridge Player
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

      {/* PLAYER UI */}
      {currentTrack && (
        <div style={{
          margin: '12px 20px',
          border: `1px solid ${tokens.colors.borderSubtle}`,
          backgroundColor: tokens.colors.bgElevated,
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '8px',
            fontSize: '11px',
            color: tokens.colors.textSecondary,
            borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
          }}>
            NOW PLAYING — {currentTrack.name}
          </div>

          <iframe
            src={currentTrack.url}
            title="YouTube Audio Player"
            style={{
              width: '100%',
              height: '200px',
              border: 'none',
              backgroundColor: '#000',
            }}
            allow="autoplay"
          />
        </div>
      )}

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
              onClick={() => playTrack(track)}
              style={{
                padding: '6px 10px',
                cursor: 'pointer',
                backgroundColor:
                  currentTrack?.name === track
                    ? tokens.colors.bgElevated
                    : 'transparent',
                borderBottom: `1px solid ${tokens.colors.borderFaint}`,
                fontSize: '11px',
                color: currentTrack?.name === track ? 'var(--os-accent)' : tokens.colors.textSecondary,
                transition: 'background-color 0.1s',
              }}
            >
              {i + 1}. {track}
            </div>
          ))}
        </div>
      )}

      {/* HISTORY SECTION */}
      {history.length > 0 && (
        <div style={{ padding: '12px 20px', marginTop: 'auto' }}>
          <div style={{
            fontSize: '10px',
            color: tokens.colors.textTertiary,
            marginBottom: '6px',
          }}>
            RECENTLY PLAYED
          </div>

          {history.map((track, i) => (
            <div
              key={i}
              onClick={() => playTrack(track)}
              style={{
                fontSize: '10px',
                cursor: 'pointer',
                padding: '4px 0',
                color: tokens.colors.textTertiary,
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--os-accent)'}
              onMouseLeave={(e) => e.target.style.color = tokens.colors.textTertiary}
            >
              {track}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
