import React, { useState, useEffect } from 'react';
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
        height: '40px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 16px',
        zIndex: 10000,
    },
    windowLayer: {
        position: 'absolute',
        inset: 0,
        zIndex: 1,
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
  walter:    { line1: '> I am not in danger.',      line2: '  I am the danger.' },
  peter:     { line1: '> logic failed',              line2: '  successfully.' },
  sheldon:   { line1: "> I'm not crazy.",            line2: '  my mother had me tested.' },
  luffy:     { line1: "> I don't want to conquer",   line2: '  anything. the most free person wins.' },
  pennywise: { line1: "> You'll float too.",         line2: '  they all float down here.' },
  roger:     { line1: "> I've lived a thousand",     line2: '  lives. none were yours.' },
};

export const Desktop = () => {
    const openWindow = useWindowStore(state => state.openWindow);
    const wallpaper = useSettingsStore(state => state.wallpaper);
    const brightness = useSettingsStore(state => state.brightness);
    const uiScale = useSettingsStore(state => state.uiScale);

    const [ctxMenu, setCtxMenu] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastLeaving, setToastLeaving] = useState(false);

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
        { icon: <IconTerminal size={13} />, label: 'Open Terminal',      appId: 'terminal' },
        { icon: <IconProjects size={13} />, label: 'Open Projects',      appId: 'projects' },
        { icon: <IconAbout size={13} />,    label: 'About This System',  appId: 'about'    },
        { divider: true },
        { icon: <IconSettings size={13} />, label: 'Settings',           appId: 'settings' },
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
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes ambientBreath {
                0%   { opacity: 0.05; transform: scale(1); }
                50%  { opacity: 0.08; transform: scale(1.03); }
                100% { opacity: 0.05; transform: scale(1); }
              }
            `}} />
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

            {/* ACCENT GLOW LAYER */}
            <div style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 1,
              background: `
                radial-gradient(
                  circle at 50% 40%,
                  var(--os-accent) 0%,
                  transparent 60%
                )
              `,
              opacity: 0.06,
              mixBlendMode: 'screen',
              animation: 'ambientBreath 6s ease-in-out infinite',
            }} />

            {/* VIGNETTE OVERLAY */}
            <div style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 2,
              background: `
                radial-gradient(
                  circle at center,
                  transparent 60%,
                  rgba(0,0,0,0.35) 100%
                )
              `,
            }} />

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


            <CommandPalette openWindow={openWindow} />
            <div style={styles.topBar}>
                <Clock />
                <div style={{ width: 16 }} />
                <SystemTray />
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
                            top:  Math.min(ctxMenu.y, window.innerHeight - 180),
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
