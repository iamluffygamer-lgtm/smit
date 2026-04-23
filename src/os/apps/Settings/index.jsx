import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { clearState } from '../../system/persistence';
import { tokens } from '../../styles/tokens';

const PALETTE = [
    { name: 'Amber', hex: '#E8A020' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Cyan', hex: '#06B6D4' },
    { name: 'Amethyst', hex: '#8B5CF6' },
    { name: 'Crimson', hex: '#F43F5E' }
];

export default function Settings() {
    const themeColor = useSettingsStore(state => state.themeColor);
    const setThemeColor = useSettingsStore(state => state.setThemeColor);
    const clockFormat = useSettingsStore(state => state.clockFormat);
    const setClockFormat = useSettingsStore(state => state.setClockFormat);

    const handleReset = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("WARNING: This will obliterate all OS state, window positions, and caches. Proceed?")) {
            clearState();
            window.location.reload();
        }
    };

    const styles = {
        container: {
            padding: '24px',
            backgroundColor: tokens.colors.bgSurface,
            height: '100%',
            overflowY: 'auto',
            color: tokens.colors.textPrimary,
            fontFamily: tokens.typography.fontSans,
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            boxSizing: 'border-box'
        },
        section: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        sectionLabel: {
            color: tokens.colors.accent,
            fontFamily: tokens.typography.fontMono,
            fontSize: '11px',
            letterSpacing: '0.1em',
            borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
            paddingBottom: '8px',
            textTransform: 'uppercase'
        },
        swatchGrid: {
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
        },
        row: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
        },
        labelDesc: {
            fontSize: '13px',
            color: tokens.colors.textSecondary
        },
        dangerBtn: {
            backgroundColor: 'transparent',
            border: '1px solid #F43F5E',
            color: '#F43F5E',
            padding: '10px 16px',
            fontFamily: tokens.typography.fontMono,
            fontSize: '12px',
            cursor: 'pointer',
            alignSelf: 'flex-start',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        },
        toggleGroup: {
            display: 'flex',
            border: `1px solid ${tokens.colors.borderDefault}`,
            borderRadius: '2px',
            overflow: 'hidden'
        }
    };

    const Swatch = ({ entry }) => {
        const isActive = themeColor === entry.hex;
        return (
            <div 
                onClick={() => setThemeColor(entry.hex)}
                title={entry.name}
                style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: entry.hex,
                    cursor: 'pointer',
                    border: isActive ? `2px solid ${tokens.colors.textPrimary}` : '2px solid transparent',
                    outline: isActive ? `2px solid ${entry.hex}` : 'none',
                    outlineOffset: '2px',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box'
                }}
            />
        );
    };

    const ToggleBtn = ({ label, active, onClick }) => (
        <button
            onClick={onClick}
            style={{
                backgroundColor: active ? tokens.colors.accentMuted : 'transparent',
                color: active ? tokens.colors.accent : tokens.colors.textSecondary,
                border: 'none',
                padding: '6px 12px',
                fontFamily: tokens.typography.fontMono,
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}
        >
            {label}
        </button>
    );

    return (
        <div style={styles.container}>
            <div style={styles.section}>
                <div style={styles.sectionLabel}>// Personalization</div>
                <div style={styles.labelDesc}>Hardware Accent Color</div>
                <div style={styles.swatchGrid}>
                    {PALETTE.map(c => <Swatch key={c.hex} entry={c} />)}
                </div>
            </div>

            <div style={styles.section}>
                <div style={styles.sectionLabel}>// System Clock</div>
                <div style={styles.row}>
                    <div style={styles.labelDesc}>Time Format Protocol</div>
                    <div style={styles.toggleGroup}>
                        <ToggleBtn label="12 HR" active={clockFormat === '12hr'} onClick={() => setClockFormat('12hr')} />
                        <ToggleBtn label="24 HR" active={clockFormat === '24hr'} onClick={() => setClockFormat('24hr')} />
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <div style={styles.sectionLabel}>// Danger Zone</div>
                <div style={styles.labelDesc}>Eradicate all local changes, clear cache, and revert OS to standard baseline.</div>
                <button 
                    style={styles.dangerBtn}
                    onClick={handleReset}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(244, 63, 94, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                    }}
                >
                    Factory Reset OS
                </button>
            </div>
        </div>
    );
}
