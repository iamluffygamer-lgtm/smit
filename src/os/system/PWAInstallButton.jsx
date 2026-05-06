import React, { useState, useEffect } from 'react';
import { tokens } from '../styles/tokens';

export const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowButton(false);
    setDeferredPrompt(null);
  };

  if (!showButton) return null;

  return (
    <div
      onClick={handleInstall}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        backgroundColor: tokens.colors.accentMuted,
        border: `1px solid ${tokens.colors.accentBorder}`,
        borderRadius: '2px',
        cursor: 'pointer',
        fontFamily: tokens.typography.fontMono,
        fontSize: '10px',
        color: 'var(--os-accent)',
        letterSpacing: '0.06em',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(232,160,32,0.2)'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = tokens.colors.accentMuted}
      title="Install SMIT OS as an app"
    >
      ↓ INSTALL
    </div>
  );
};
