import React, { useState, useRef } from 'react';
import { tokens } from '../../styles/tokens';

const MY_PROJECTS = [
  { label: 'PlaylistBridge', url: 'https://playlistbridge.netlify.app', domain: 'playlistbridge.netlify.app' },
  { label: 'AnswerHunt',     url: 'https://answerhunt.com',             domain: 'answerhunt.com' },
  { label: 'RMS Ads',        url: 'https://rmsads.com',                 domain: 'rmsads.com' },
  { label: 'smitdev',        url: 'https://smitdev.netlify.app',        domain: 'smitdev.netlify.app' },
];

const WEB_LINKS = [
  { label: 'Google',   url: 'https://google.com',            domain: 'google.com' },
  { label: 'GitHub',   url: 'https://github.com',            domain: 'github.com' },
  { label: 'YouTube',  url: 'https://youtube.com',           domain: 'youtube.com' },
  { label: 'Twitter',  url: 'https://twitter.com',           domain: 'twitter.com' },
  { label: 'Reddit',   url: 'https://reddit.com',            domain: 'reddit.com' },
  { label: 'Netlify',  url: 'https://netlify.com',           domain: 'netlify.com' },
];

const QuickCard = ({ item, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(item.url)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '120px',
        padding: '12px',
        backgroundColor: hovered
          ? tokens.colors.accentMuted
          : tokens.colors.bgElevated,
        border: `1px solid ${hovered
          ? tokens.colors.accentBorder
          : tokens.colors.borderSubtle}`,
        borderRadius: '2px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: '28px',
        height: '28px',
        backgroundColor: hovered
          ? 'rgba(232,160,32,0.2)'
          : tokens.colors.bgSubtle,
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px',
        fontFamily: tokens.typography.fontMono,
        fontSize: '13px',
        fontWeight: '600',
        color: 'var(--os-accent)',
      }}>
        {item.label[0]}
      </div>
      <div style={{
        fontSize: '12px',
        fontFamily: tokens.typography.fontSans,
        fontWeight: 500,
        color: hovered
          ? tokens.colors.textPrimary
          : tokens.colors.textSecondary,
        marginBottom: '2px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {item.label}
      </div>
      <div style={{
        fontSize: '11px',
        fontFamily: tokens.typography.fontSans,
        color: tokens.colors.textTertiary,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {item.domain}
      </div>
    </div>
  );
};

export default function Browser({ intentData }) {
  const [iframeUrl, setIframeUrl] = useState(intentData?.url || null);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  React.useEffect(() => {
    if (intentData && intentData.url) {
      setIframeUrl(intentData.url);
    }
  }, [intentData]);

  const navigate = (url, external = false) => {
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setIframeUrl(url);
    }
  };

  const handleSearchSubmit = () => {
    let url = input.trim();
    if (!url) return;

    if (!url.includes('.') && !url.startsWith('http')) {
      const googleUrl = 'https://www.google.com/search?q=' + encodeURIComponent(url);
      navigate(googleUrl, true);
    } else {
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      const isMyProject = MY_PROJECTS.some(p => url.includes(p.domain));
      navigate(url, !isMyProject);
    }
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  if (iframeUrl) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Mini topbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: tokens.colors.bgCanvas,
          borderBottom: '1px solid ' + tokens.colors.borderSubtle,
          flexShrink: 0,
        }}>
          <button onClick={() => setIframeUrl(null)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid ' + tokens.colors.borderSubtle,
              borderRadius: '2px',
              color: tokens.colors.textTertiary,
              fontFamily: tokens.typography.fontMono,
              fontSize: '12px',
              padding: '4px 10px',
              cursor: 'pointer',
            }}>
            ← home
          </button>
          <span style={{
            flex: 1,
            fontSize: '11px',
            fontFamily: tokens.typography.fontMono,
            color: tokens.colors.textTertiary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {iframeUrl}
          </span>
          <button onClick={() => window.open(iframeUrl, '_blank')}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid ' + tokens.colors.borderSubtle,
              borderRadius: '2px',
              color: tokens.colors.textTertiary,
              fontFamily: tokens.typography.fontMono,
              fontSize: '12px',
              padding: '4px 10px',
              cursor: 'pointer',
            }}>
            ↗
          </button>
        </div>

        {/* Iframe */}
        <iframe
          src={iframeUrl}
          style={{
            flex: 1,
            border: 'none',
            backgroundColor: '#fff',
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title="browser"
        />
      </div>
    );
  }

  return (
    <>
      <style>{`.browser-scroll::-webkit-scrollbar { display: none; }`}</style>
      <div 
        className="browser-scroll"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          backgroundColor: tokens.colors.bgSurface,
          padding: '32px 24px',
          paddingBottom: '24px',
          gap: '28px',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >

        {/* LOGO */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '26px',
            fontFamily: tokens.typography.fontMono,
            color: 'var(--os-accent)',
            letterSpacing: '0.2em',
            marginBottom: '4px',
          }}>
            SMIT / BROWSER
          </div>
          <div style={{
            fontSize: '11px',
            fontFamily: tokens.typography.fontMono,
            color: tokens.colors.textTertiary,
            letterSpacing: '0.08em',
          }}>
            search anything · opens in new tab
          </div>
        </div>

        {/* SEARCH BAR */}
        <div style={{
          width: '100%',
          maxWidth: '520px',
          display: 'flex',
          gap: '8px',
        }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: tokens.colors.bgSunken,
            border: `1px solid ${tokens.colors.borderDefault}`,
            borderRadius: '2px',
            padding: '0 16px',
            gap: '10px',
            height: '44px',
          }}>
            <span style={{
              color: tokens.colors.textTertiary,
              fontSize: '12px',
              fontFamily: tokens.typography.fontMono,
              flexShrink: 0,
            }}>◎</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search Google or enter URL..."
              autoFocus
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: tokens.colors.textPrimary,
                fontFamily: tokens.typography.fontMono,
                fontSize: '13px',
              }}
            />
          </div>
          <button
            onClick={handleSearchSubmit}
            style={{
              padding: '0 20px',
              height: '44px',
              backgroundColor: 'var(--os-accent)',
              border: 'none',
              borderRadius: '2px',
              color: tokens.colors.bgCanvas,
              fontFamily: tokens.typography.fontMono,
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ↗
          </button>
        </div>

        {/* MY PROJECTS */}
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <div style={{
            fontSize: '10px',
            fontFamily: tokens.typography.fontMono,
            color: tokens.colors.textTertiary,
            letterSpacing: '0.1em',
            marginBottom: '10px',
          }}>
            // MY PROJECTS
          </div>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
            {MY_PROJECTS.map(item => (
              <QuickCard key={item.url} item={item} onClick={(url) => navigate(url, false)} />
            ))}
          </div>
        </div>

        {/* WEB */}
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <div style={{
            fontSize: '10px',
            fontFamily: tokens.typography.fontMono,
            color: tokens.colors.textTertiary,
            letterSpacing: '0.1em',
            marginBottom: '10px',
          }}>
            // WEB
          </div>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
            {WEB_LINKS.map(item => (
              <QuickCard key={item.url} item={item} onClick={(url) => navigate(url, true)} />
            ))}
          </div>
        </div>

        {/* HINT */}
        <div style={{
          fontSize: '10px',
          fontFamily: tokens.typography.fontMono,
          color: tokens.colors.textDisabled,
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}>
          press Enter to search · web links open in new tab
        </div>

      </div>
    </>
  );
}
