import React, { useState } from 'react';
import { tokens } from '../../styles/tokens';

const GAMES = [
  {
    id: 'neon-surge',
    title: 'NEON SURGE: OVERDRIVE',
    description: 'Dodge obstacles. Survive as long as possible.',
    genre: 'ARCADE · SURVIVAL',
    file: '/games/neon-surge.html',
    built: 'Vanilla JS · Canvas API',
  },
];

export default function Games() {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#08080a',
      }}>
        {/* Back button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 12px',
          backgroundColor: tokens.colors.bgCanvas,
          borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
          flexShrink: 0,
        }}>
          <button
            onClick={() => setActiveGame(null)}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${tokens.colors.borderSubtle}`,
              borderRadius: '2px',
              color: tokens.colors.textSecondary,
              fontFamily: tokens.typography.fontMono,
              fontSize: '11px',
              padding: '4px 10px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            ← BACK
          </button>
          <span style={{
            fontSize: '11px',
            fontFamily: tokens.typography.fontMono,
            color: tokens.colors.textTertiary,
            letterSpacing: '0.08em',
          }}>
            {GAMES.find(g => g.id === activeGame)?.title}
          </span>
        </div>

        {/* Game iframe */}
        <iframe
          src={GAMES.find(g => g.id === activeGame)?.file}
          style={{
            flex: 1,
            border: 'none',
            width: '100%',
            height: '100%',
          }}
          title="game"
          allow="autoplay"
        />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: tokens.colors.bgSurface,
      fontFamily: tokens.typography.fontMono,
      padding: '20px',
      gap: '16px',
      overflowY: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      <div>
        <div style={{
          fontSize: '10px',
          color: tokens.colors.textTertiary,
          letterSpacing: '0.1em',
          marginBottom: '4px',
        }}>
          // GAMES
        </div>
        <div style={{
          fontFamily: tokens.typography.fontSans,
          fontSize: '12px',
          color: tokens.colors.textSecondary,
        }}>
          Built by Smit. Playable in your browser.
        </div>
      </div>

      {GAMES.map(game => (
        <div
          key={game.id}
          style={{
            padding: '16px',
            backgroundColor: tokens.colors.bgElevated,
            border: `1px solid ${tokens.colors.borderSubtle}`,
            borderRadius: '2px',
          }}
        >
          <div style={{
            fontSize: '10px',
            color: tokens.colors.textTertiary,
            letterSpacing: '0.1em',
            marginBottom: '6px',
          }}>
            {game.genre}
          </div>
          <div style={{
            fontSize: '18px',
            fontFamily: tokens.typography.fontMono,
            color: tokens.colors.textPrimary,
            fontWeight: 700,
            marginBottom: '6px',
            letterSpacing: '0.05em',
          }}>
            {game.title}
          </div>
          <div style={{
            fontFamily: tokens.typography.fontSans,
            fontSize: '14px',
            color: tokens.colors.textSecondary,
            marginBottom: '12px',
            lineHeight: 1.7,
          }}>
            {game.description}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: '10px',
              color: tokens.colors.textTertiary,
            }}>
              {game.built}
            </span>
            <button
              onClick={() => setActiveGame(game.id)}
              style={{
                padding: '8px 20px',
                backgroundColor: 'var(--os-accent)',
                border: 'none',
                borderRadius: '2px',
                color: tokens.colors.bgCanvas,
                fontFamily: tokens.typography.fontMono,
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.08em',
              }}
            >
              PLAY ▶
            </button>
          </div>
        </div>
      ))}

      <div style={{
        padding: '16px',
        border: `1px dashed ${tokens.colors.borderSubtle}`,
        borderRadius: '2px',
        textAlign: 'center',
        color: tokens.colors.textDisabled,
        fontSize: '11px',
      }}>
        more games coming soon...
      </div>
    </div>
  );
}
