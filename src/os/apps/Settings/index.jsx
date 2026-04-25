import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { tokens } from '../../styles/tokens';

export default function Settings() {
    const { 
        themeColor, setThemeColor, 
        clockFormat, setClockFormat,
        wallpaper, setWallpaper 
    } = useSettingsStore();

    const presets = [
        { name: 'Amber',   hex: '#E8A020' },
        { name: 'Cyan',    hex: '#06B6D4' },
        { name: 'Violet',  hex: '#8B5CF6' },
        { name: 'Rose',    hex: '#F43F5E' },
        { name: 'Emerald', hex: '#10B981' },
        { name: 'White',   hex: '#F0EDE8' },
    ];

    const handleReset = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Reset SMIT OS? All window positions will be cleared.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const styles = {
        container: {
            padding: '20px',
            backgroundColor: '#141210',
            height: '100%',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            boxSizing: 'border-box',
        },
        sectionLabel: {
            color: tokens.colors.accent,
            fontFamily: tokens.typography.fontMono,
            fontSize: '11px',
            letterSpacing: '0.1em',
            margin: '0',
        },
        sublabel: {
            color: tokens.colors.textTertiary,
            fontFamily: tokens.typography.fontSans,
            fontSize: '12px',
            margin: '4px 0 20px 0',
        },
        swatchRow: {
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            flexWrap: 'wrap',
        },
        customColorRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        customLabel: {
            color: tokens.colors.textTertiary,
            fontFamily: tokens.typography.fontMono,
            fontSize: '11px',
        },
        colorInput: {
            width: '40px',
            height: '28px',
            padding: 0,
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
        },
        marginTop: {
            marginTop: '32px',
        },
        toggleRow: {
            display: 'flex',
            gap: '8px',
            marginTop: '16px',
        },
        wallpaperRow: {
            display: 'flex',
            gap: '12px',
            marginTop: '16px',
            flexWrap: 'wrap',
        },
        resetBtn: {
            padding: '10px 20px',
            fontFamily: tokens.typography.fontMono,
            fontSize: '12px',
            border: '1px solid rgba(248,113,113,0.30)',
            color: '#F87171',
            backgroundColor: 'transparent',
            borderRadius: '2px',
            cursor: 'pointer',
            marginTop: '16px',
            transition: 'background-color 0.2s',
        }
    };

    return (
        <div style={styles.container} className="settings-container">
            <style dangerouslySetInnerHTML={{__html: `
                .settings-container::-webkit-scrollbar { display: none; }
                .reset-btn:hover { background-color: rgba(248,113,113,0.08) !important; }
            `}} />

            {/* SECTION 1 — ACCENT COLOR */}
            <div>
                <p style={styles.sectionLabel}>// ACCENT COLOR</p>
                <p style={styles.sublabel}>Changes the OS highlight color globally.</p>
                
                <div style={styles.swatchRow}>
                    {presets.map(preset => {
                        const isSelected = themeColor.toUpperCase() === preset.hex.toUpperCase();
                        return (
                            <div 
                                key={preset.hex}
                                onClick={() => setThemeColor(preset.hex)}
                                title={preset.name}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '2px',
                                    backgroundColor: preset.hex,
                                    cursor: 'pointer',
                                    border: isSelected ? '2px solid #F0EDE8' : '2px solid transparent',
                                    outline: isSelected ? `3px solid ${preset.hex}4D` : 'none',
                                    outlineOffset: '2px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        );
                    })}
                </div>

                <div style={styles.customColorRow}>
                    <span style={styles.customLabel}>CUSTOM</span>
                    <input 
                        type="color" 
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        style={styles.colorInput}
                    />
                </div>
            </div>

            {/* SECTION 2 — CLOCK FORMAT */}
            <div style={styles.marginTop}>
                <p style={styles.sectionLabel}>// CLOCK FORMAT</p>
                
                <div style={styles.toggleRow}>
                    {['12hr', '24hr'].map(fmt => {
                        const active = clockFormat === fmt;
                        return (
                            <button
                                key={fmt}
                                onClick={() => setClockFormat(fmt)}
                                style={{
                                    padding: '8px 20px',
                                    fontFamily: tokens.typography.fontMono,
                                    fontSize: '12px',
                                    letterSpacing: '0.05em',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    backgroundColor: active ? tokens.colors.accentMuted : 'transparent',
                                    borderColor: active ? tokens.colors.accentBorder : tokens.colors.borderSubtle,
                                    color: active ? tokens.colors.accent : tokens.colors.textTertiary,
                                    borderStyle: 'solid',
                                    borderWidth: '1px',
                                }}
                            >
                                {fmt.toUpperCase()}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 3 — WALLPAPER */}
            <div style={styles.marginTop}>
                <p style={styles.sectionLabel}>// DESKTOP WALLPAPER</p>
                
                <div style={styles.wallpaperRow}>
                    {[
                        { id: 'canvas', label: 'Canvas', 
                          bg: '#0C0A08' 
                        },
                        { id: 'grid', label: 'Grid', 
                          bg: '#0C0A08',
                          bgImg: 'radial-gradient(circle, #E8A020 1px, transparent 1px)',
                          bgSize: '24px 24px'
                        },
                        { id: 'noise', label: 'Noise', 
                          bg: '#0C0A08',
                          bgImg: 'repeating-linear-gradient(45deg, rgba(240,237,232,0.03) 0px, rgba(240,237,232,0.03) 1px, transparent 1px, transparent 8px)'
                        }
                    ].map(wp => {
                        const selected = wallpaper === wp.id;
                        return (
                            <div 
                                key={wp.id}
                                onClick={() => setWallpaper(wp.id)}
                                style={{
                                    border: selected ? `1px solid ${tokens.colors.accentBorder}` : `1px solid ${tokens.colors.borderSubtle}`,
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    padding: 0,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div style={{
                                    width: '100px',
                                    height: '64px',
                                    backgroundColor: wp.isImage ? 'transparent' : wp.bg,
                                    backgroundImage: wp.isImage ? `url(${wp.preview})` : (wp.bgImg || 'none'),
                                    backgroundSize: wp.isImage ? 'cover' : (wp.bgSize || 'auto'),
                                    backgroundPosition: wp.isImage ? 'center' : '0% 0%',
                                }} />
                                <div style={{
                                    padding: '6px 8px',
                                    fontSize: '11px',
                                    fontFamily: tokens.typography.fontMono,
                                    color: selected ? tokens.colors.accent : tokens.colors.textTertiary,
                                    borderTop: selected ? `1px solid ${tokens.colors.accentBorder}` : `1px solid ${tokens.colors.borderSubtle}`,
                                    backgroundColor: tokens.colors.bgSurface,
                                }}>
                                    {wp.label}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{
                    width: '100%',
                    marginTop: '16px',
                    marginBottom: '8px',
                    fontSize: '10px',
                    fontFamily: tokens.typography.fontMono,
                    color: tokens.colors.textTertiary,
                    letterSpacing: '0.1em',
                }}>
                    // CHARACTER SERIES
                </div>

                <div style={styles.wallpaperRow}>
                    {[
                        { id: 'walter',    label: 'Heisenberg', isImage: true, preview: '/wallpapers/walter.png' },
                        { id: 'peter',     label: 'Peter G.',   isImage: true, preview: '/wallpapers/peter.png' },
                        { id: 'sheldon',   label: 'Sheldon',    isImage: true, preview: '/wallpapers/sheldon.png' },
                        { id: 'luffy',     label: 'Luffy',      isImage: true, preview: '/wallpapers/luffy.png' },
                        { id: 'pennywise', label: 'Pennywise',  isImage: true, preview: '/wallpapers/pennywise.png' },
                        { id: 'roger',     label: 'Roger',      isImage: true, preview: '/wallpapers/roger.png' },
                    ].map(wp => {
                        const selected = wallpaper === wp.id;
                        return (
                            <div 
                                key={wp.id}
                                onClick={() => setWallpaper(wp.id)}
                                style={{
                                    border: selected ? `1px solid ${tokens.colors.accentBorder}` : `1px solid ${tokens.colors.borderSubtle}`,
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    padding: 0,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div style={{
                                    width: '100px',
                                    height: '64px',
                                    backgroundColor: wp.isImage ? 'transparent' : wp.bg,
                                    backgroundImage: wp.isImage ? `url(${wp.preview})` : (wp.bgImg || 'none'),
                                    backgroundSize: wp.isImage ? 'cover' : (wp.bgSize || 'auto'),
                                    backgroundPosition: wp.isImage ? 'center' : '0% 0%',
                                }} />
                                <div style={{
                                    padding: '6px 8px',
                                    fontSize: '11px',
                                    fontFamily: tokens.typography.fontMono,
                                    color: selected ? tokens.colors.accent : tokens.colors.textTertiary,
                                    borderTop: selected ? `1px solid ${tokens.colors.accentBorder}` : `1px solid ${tokens.colors.borderSubtle}`,
                                    backgroundColor: tokens.colors.bgSurface,
                                }}>
                                    {wp.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 4 — DANGER ZONE */}
            <div style={styles.marginTop}>
                <p style={styles.sectionLabel}>// SYSTEM</p>
                <button 
                    className="reset-btn"
                    style={styles.resetBtn}
                    onClick={handleReset}
                >
                    RESET OS
                </button>
            </div>
        </div>
    );
}
