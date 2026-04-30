import React, { useState, useEffect, useCallback } from 'react';
import { WindowManager } from './WindowManager';
import { Dock } from './Dock';
import { SystemTray } from '../system/SystemTray';
import { Clock } from '../system/Clock';
import { tokens } from '../styles/tokens';
import { useWindowStore } from '../store/windowStore';
import { useSettingsStore } from '../store/settingsStore';
import { CommandPalette } from './CommandPalette';
import { motion, AnimatePresence } from 'framer-motion';
import { IconTerminal } from '../icons/IconTerminal';
import { IconProjects } from '../icons/IconProjects';
import { IconAbout } from '../icons/IconAbout';
import { IconSettings } from '../icons/IconSettings';
import { IconFiles } from '../icons/IconFiles';
import { IconBrowser } from '../icons/IconBrowser';
import { IconNotes } from '../icons/IconNotes';
import { useKonamiCode } from '../hooks/useKonamiCode';

const styles = {
    wallpaper: {
        width: '100vw',
        height: '100vh',
        backgroundColor: tokens.colors.bgCanvas,
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
    },
    scanline: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(240,237,232,0.015) 2px,
            rgba(240,237,232,0.015) 4px
        )`
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 10000,
        backgroundColor: 'rgba(12,10,8,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(240,237,232,0.06)',
        WebkitAppRegion: 'no-drag',
    },
    windowLayer: {
        position: 'absolute',
        top: '32px',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        pointerEvents: 'none',
    }
};

const MenuItem = ({ item, onClick }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 14px',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: tokens.typography.fontMono,
                color: hovered ? tokens.colors.textPrimary : tokens.colors.textSecondary,
                backgroundColor: hovered ? tokens.colors.accentMuted : 'transparent',
                transition: 'all 0.1s',
                userSelect: 'none',
            }}
        >
            <span style={{
                color: 'var(--os-accent)',
                width: '16px',
                display: 'flex',
                alignItems: 'center',
            }}>
                {item.icon}
            </span>
            {item.label}
        </div>
    );
};

const wallpaperQuotes = {
    walter: { line1: '> I am not in danger.', line2: '  I am the danger.' },
    peter: { line1: '> logic failed', line2: '  successfully.' },
    sheldon: { line1: "> I'm not crazy.", line2: '  my mother had me tested.' },
    luffy: { line1: "> I don't want to conquer", line2: '  anything. the most free person wins.' },
    pennywise: { line1: "> You'll float too.", line2: '  they all float down here.' },
    roger: { line1: "> I've lived a thousand", line2: '  lives. none were yours.' },
};

const DesktopIcon = ({ icon, openWindow }) => {
  const [lastClick, setLastClick] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);

  const handleClick = () => {
    const now = Date.now();

    if (now - lastClick < 300) {
      openWindow(icon.id);
      setLastClick(0);
      return;
    }

    setLastClick(now);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '68px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* ICON BOX */}
      <div style={{
        width: '46px',
        height: '46px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        backgroundColor: hovered
          ? 'rgba(232,160,32,0.08)'
          : 'rgba(255,255,255,0.02)',
        border: hovered
          ? '1px solid var(--os-accent)'
          : '1px solid transparent',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'all 0.12s ease',
        color: tokens.colors.textPrimary,
      }}>
        {icon.icon}
      </div>

      {/* LABEL */}
      <div style={{
        marginTop: '6px',
        fontSize: '11px',
        color: tokens.colors.textSecondary,
        fontFamily: tokens.typography.fontMono,
        textAlign: 'center',
        lineHeight: '1.2',
      }}>
        {icon.label}
      </div>
    </div>
  );
};

const DESKTOP_ICONS = [
  {
    id: 'files',
    label: 'Files',
    icon: <IconFiles size={20} />,
  },
  {
    id: 'browser',
    label: 'Browser',
    icon: <IconBrowser size={20} />,
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: <IconNotes size={20} />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <IconSettings size={20} />,
  },
];

export const Desktop = () => {
    const openWindow = useWindowStore(state => state.openWindow);
    const hasFullscreenWindow = useWindowStore(state => state.windows.some(w => w.maximized && !w.minimized));
    const wallpaper = useSettingsStore(state => state.wallpaper);
    const brightness = useSettingsStore(state => state.brightness);
    const uiScale = useSettingsStore(state => state.uiScale);

    const [ctxMenu, setCtxMenu] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastLeaving, setToastLeaving] = useState(false);
    const [konamiActive, setKonamiActive] = useState(false);

    const handleKonami = useCallback(() => {
        setKonamiActive(true);
        setTimeout(() => setKonamiActive(false), 4000);
    }, []);

    useKonamiCode(handleKonami);

    useEffect(() => {
        const t = setTimeout(() => setShowToast(true), 8000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!showToast) return;
        const t = setTimeout(() => {
            setToastLeaving(true);
            setTimeout(() => setShowToast(false), 300);
        }, 5000);
        return () => clearTimeout(t);
    }, [showToast]);

    const menuItems = [
        { icon: <IconTerminal size={13} />, label: 'Open Terminal', appId: 'terminal' },
        { icon: <IconProjects size={13} />, label: 'Open Projects', appId: 'projects' },
        { icon: <IconAbout size={13} />, label: 'About This System', appId: 'about' },
        { divider: true },
        { icon: <IconSettings size={13} />, label: 'Settings', appId: 'settings' },
    ];

    let wallpaperStyle = { ...styles.wallpaper };
    if (wallpaper === 'grid') {
        wallpaperStyle.backgroundImage = 'radial-gradient(circle, rgba(232,160,32,0.4) 1px, transparent 1px)';
        wallpaperStyle.backgroundSize = '28px 28px';
    } else if (wallpaper === 'noise') {
        wallpaperStyle.backgroundImage = 'repeating-linear-gradient(45deg, rgba(240,237,232,0.025) 0px, rgba(240,237,232,0.025) 1px, transparent 1px, transparent 8px)';
    } else if (wallpaper === 'walter') {
        wallpaperStyle.backgroundImage = "url('/wallpapers/walter.png')";
        wallpaperStyle.backgroundSize = 'cover';
        wallpaperStyle.backgroundPosition = 'center center';
        wallpaperStyle.backgroundRepeat = 'no-repeat';
    } else if (wallpaper === 'peter') {
        wallpaperStyle.backgroundImage = "url('/wallpapers/peter.png')";
        wallpaperStyle.backgroundSize = 'cover';
        wallpaperStyle.backgroundPosition = 'center center';
        wallpaperStyle.backgroundRepeat = 'no-repeat';
    } else if (wallpaper === 'sheldon') {
        wallpaperStyle.backgroundImage = "url('/wallpapers/sheldon.png')";
        wallpaperStyle.backgroundSize = 'cover';
        wallpaperStyle.backgroundPosition = 'center center';
        wallpaperStyle.backgroundRepeat = 'no-repeat';
    } else if (wallpaper === 'luffy') {
        wallpaperStyle.backgroundImage = "url('/wallpapers/luffy.png')";
        wallpaperStyle.backgroundSize = 'cover';
        wallpaperStyle.backgroundPosition = 'center center';
        wallpaperStyle.backgroundRepeat = 'no-repeat';
    } else if (wallpaper === 'pennywise') {
        wallpaperStyle.backgroundImage = "url('/wallpapers/pennywise.png')";
        wallpaperStyle.backgroundSize = 'cover';
        wallpaperStyle.backgroundPosition = 'center center';
        wallpaperStyle.backgroundRepeat = 'no-repeat';
    } else if (wallpaper === 'roger') {
        wallpaperStyle.backgroundImage = "url('/wallpapers/roger.png')";
        wallpaperStyle.backgroundSize = 'cover';
        wallpaperStyle.backgroundPosition = 'center center';
        wallpaperStyle.backgroundRepeat = 'no-repeat';
    }

    return (
        <div
            style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: tokens.colors.bgCanvas, userSelect: 'none' }}
            onContextMenu={(e) => {
                e.preventDefault();
                setCtxMenu({ x: e.clientX, y: e.clientY });
            }}
            onClick={() => setCtxMenu(null)}
        >
            {/* WALLPAPER LAYER */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={wallpaper}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{
                        duration: 0.32,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                    style={{
                        ...wallpaperStyle,
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        willChange: 'opacity, transform'
                    }}
                />
            </AnimatePresence>

            {/* UI LAYER */}
            <div style={{
                position: 'relative',
                zIndex: 3,
                transform: `scale(${uiScale})`,
                transformOrigin: 'top left',
                width: `${100 / uiScale}%`,
                height: `${100 / uiScale}%`,
            }}>
                <div style={styles.scanline} />

                {!hasFullscreenWindow && (
                  <div style={{
                    position: 'absolute',
                    top: '90px',
                    left: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    zIndex: 0,
                  }}>
                    {DESKTOP_ICONS.map(icon => (
                      <DesktopIcon
                        key={icon.id}
                        icon={icon}
                        openWindow={openWindow}
                      />
                    ))}
                  </div>
                )}

                <CommandPalette openWindow={openWindow} />
                <div style={styles.topBar}>
                    {/* LEFT SECTION — OS identity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            fontSize: '11px',
                            fontFamily: tokens.typography.fontMono,
                            color: 'var(--os-accent)',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                        }}>
                            SMIT OS
                        </div>
                        <span style={{ 
                            color: 'rgba(240,237,232,0.15)', 
                            fontSize: '11px' 
                        }}>·</span>
                        {['terminal', 'projects', 'about'].map(appId => (
                            <div
                                key={appId}
                                onClick={() => openWindow(appId)}
                                style={{
                                    fontSize: '11px',
                                    fontFamily: tokens.typography.fontMono,
                                    color: tokens.colors.textTertiary,
                                    cursor: 'pointer',
                                    letterSpacing: '0.06em',
                                    textTransform: 'capitalize',
                                    transition: 'color 0.15s',
                                    padding: '0 2px',
                                }}
                                onMouseEnter={e => e.target.style.color = 'var(--os-accent)'}
                                onMouseLeave={e => e.target.style.color = tokens.colors.textTertiary}
                            >
                                {appId}
                            </div>
                        ))}
                    </div>

                    {/* CENTER SECTION */}
                    <div style={{
                        fontSize: '10px',
                        fontFamily: tokens.typography.fontMono,
                        color: 'rgba(240,237,232,0.15)',
                        letterSpacing: '0.1em',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}>
                        visitor@smit-os
                    </div>

                    {/* RIGHT SECTION */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                            width: '1px', height: '12px',
                            backgroundColor: 'rgba(240,237,232,0.1)',
                        }} />
                        <SystemTray />
                        <Clock />
                    </div>
                </div>

                <div style={styles.windowLayer}>
                    <WindowManager />
                </div>

                <Dock />

                <AnimatePresence>
                    {ctxMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.08 }}
                            style={{
                                position: 'fixed',
                                left: Math.min(ctxMenu.x, window.innerWidth - 180),
                                top: Math.min(ctxMenu.y, window.innerHeight - 180),
                                zIndex: 99999,
                                backgroundColor: tokens.colors.bgElevated,
                                border: `1px solid ${tokens.colors.borderDefault}`,
                                borderRadius: '2px',
                                boxShadow: tokens.shadowLg,
                                padding: '4px 0',
                                minWidth: '168px',
                                transformOrigin: 'top left',
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        >
                            {menuItems.map((item, i) =>
                                item.divider ? (
                                    <div key={i} style={{
                                        height: '1px',
                                        backgroundColor: tokens.colors.borderSubtle,
                                        margin: '4px 0',
                                    }} />
                                ) : (
                                    <MenuItem
                                        key={i}
                                        item={item}
                                        onClick={() => {
                                            openWindow(item.appId);
                                            setCtxMenu(null);
                                        }}
                                    />
                                )
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showToast && (
                        <motion.div
                            initial={{ opacity: 0, x: 80 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 80 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            style={{
                                position: 'fixed',
                                bottom: '80px',
                                right: '16px',
                                zIndex: 99997,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                backgroundColor: tokens.colors.bgElevated,
                                border: `1px solid ${tokens.colors.borderDefault}`,
                                borderRadius: '2px',
                                boxShadow: tokens.shadowMd,
                                minWidth: '260px',
                                maxWidth: '320px',
                            }}
                        >
                            <motion.div
                                style={{
                                    width: '6px', height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--os-accent)',
                                    flexShrink: 0,
                                }}
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '11px',
                                    fontFamily: tokens.typography.fontMono,
                                    color: 'var(--os-accent)',
                                    marginBottom: '2px',
                                }}>
                                    visitor@smit-os
                                </div>
                                <div style={{
                                    fontSize: '11px',
                                    fontFamily: tokens.typography.fontMono,
                                    color: tokens.colors.textTertiary,
                                }}>
                                    type 'help' in terminal to explore
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    setToastLeaving(true);
                                    setTimeout(() => setShowToast(false), 300);
                                }}
                                style={{
                                    color: tokens.colors.textDisabled,
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    lineHeight: 1,
                                    padding: '0 2px',
                                }}
                            >×</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {konamiActive && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 99999,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(8,6,4,0.96)',
                                fontFamily: "'JetBrains Mono', monospace",
                                pointerEvents: 'none',
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                                style={{
                                    fontSize: '64px',
                                    marginBottom: '24px',
                                    filter: 'drop-shadow(0 0 30px var(--os-accent))',
                                }}
                            >
                                ⚡
                            </motion.div>
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                style={{
                                    fontSize: '24px',
                                    color: 'var(--os-accent)',
                                    letterSpacing: '0.15em',
                                    marginBottom: '12px',
                                    fontWeight: 700,
                                }}
                            >
                                CHEAT CODE ACTIVATED
                            </motion.div>
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                style={{
                                    fontSize: '13px',
                                    color: '#9C9590',
                                    letterSpacing: '0.08em',
                                }}
                            >
                                ↑↑↓↓←→←→BA — you found it
                            </motion.div>
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                style={{
                                    marginTop: '16px',
                                    fontSize: '12px',
                                    color: '#5C5854',
                                    letterSpacing: '0.06em',
                                }}
                            >
                                smit put this here for people like you
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* BRIGHTNESS OVERLAY */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'black',
                opacity: 1 - brightness,
                pointerEvents: 'none',
                zIndex: 9999,
                transition: 'opacity 0.2s ease',
            }} />
        </div>
    );
};
