import React, { useState, useEffect, useRef } from 'react';
import { appRegistry } from '../apps/appRegistry';
import { projects } from '../apps/Projects/projects.data';
import { tokens } from '../styles/tokens';
import { IconProjects } from '../icons/IconProjects';
import { IconContact } from '../icons/IconContact';
import { IconAbout } from '../icons/IconAbout';

export const CommandPalette = ({ openWindow }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };
        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }, [isOpen]);

    const buildResults = () => {
        const results = [];

        appRegistry.forEach(app => {
            results.push({
                type: 'app',
                label: app.name,
                sub: 'Open application',
                appId: app.id,
                icon: app.icon,
                action: () => {
                    openWindow(app.id);
                    setIsOpen(false);
                }
            });
        });

        projects.forEach(project => {
            if (project.url) {
                results.push({
                    type: 'project',
                    label: project.name,
                    sub: project.tagline,
                    url: project.url,
                    icon: <IconProjects size={16} />,
                    action: () => {
                        window.open(project.url, '_blank');
                        setIsOpen(false);
                    }
                });
            }
        });

        results.push(
            {
                type: 'action',
                label: 'Copy Email',
                sub: 'pilgrim3201@gmail.com',
                icon: <IconContact size={16} />,
                action: () => {
                    navigator.clipboard.writeText('pilgrim3201@gmail.com');
                    setIsOpen(false);
                }
            },
            {
                type: 'action',
                label: 'Open GitHub',
                sub: 'github.com/coder-smit',
                icon: <IconAbout size={16} />,
                action: () => {
                    window.open('https://github.com/coder-smit', '_blank');
                    setIsOpen(false);
                }
            },
            {
                type: 'action',
                label: 'Open Instagram',
                sub: '@coder_smit',
                icon: <IconAbout size={16} />,
                action: () => {
                    window.open('https://instagram.com/coder_smit', '_blank');
                    setIsOpen(false);
                }
            }
        );

        if (!query) return results.slice(0, 8);

        const lowerQuery = query.toLowerCase();
        return results.filter(r => 
            r.label.toLowerCase().includes(lowerQuery) || 
            r.sub.toLowerCase().includes(lowerQuery)
        ).slice(0, 8);
    };

    const results = buildResults();

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
            e.preventDefault();
        } else if (e.key === 'Enter') {
            if (results[selectedIndex]) {
                results[selectedIndex].action();
            }
            e.preventDefault();
        }
    };

    if (!isOpen) return null;

    const styles = {
        backdrop: {
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            backgroundColor: 'rgba(8,6,4,0.80)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '120px',
        },
        panel: {
            width: '560px',
            maxHeight: '420px',
            backgroundColor: tokens.colors.bgSurface,
            border: `1px solid ${tokens.colors.borderSubtle}`,
            borderRadius: '4px',
            boxShadow: '0px 36px 72px -12px rgba(8,6,4,0.80)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'paletteSlideIn 150ms ease-out',
        },
        searchRow: {
            padding: '0 16px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
        },
        iconCmd: {
            color: tokens.colors.accent,
            fontFamily: tokens.typography.fontMono,
            fontSize: '14px',
        },
        input: {
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: tokens.colors.textPrimary,
            fontFamily: tokens.typography.fontMono,
            fontSize: '14px',
        },
        hintText: {
            color: tokens.colors.textTertiary,
            fontSize: '11px',
            fontFamily: tokens.typography.fontMono,
        },
        resultsList: {
            overflowY: 'auto',
            flex: 1,
            padding: '8px 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
        },
        resultItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            cursor: 'pointer',
            transition: 'background 0.1s',
            boxSizing: 'border-box',
        },
        itemHovered: {
            backgroundColor: 'rgba(232,160,32,0.08)',
            borderLeft: '2px solid #E8A020',
        },
        itemNormal: {
            borderLeft: '2px solid transparent',
        },
        iconBox: {
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(240,237,232,0.04)',
            border: `1px solid ${tokens.colors.borderSubtle}`,
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: tokens.typography.fontMono,
            fontSize: '14px',
            color: tokens.colors.textSecondary,
        },
        textCol: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
        },
        label: {
            color: tokens.colors.textPrimary,
            fontSize: '13px',
            fontFamily: tokens.typography.fontMono,
            fontWeight: 500,
        },
        sub: {
            color: tokens.colors.textTertiary,
            fontSize: '11px',
            fontFamily: tokens.typography.fontMono,
        },
        badge: {
            fontSize: '10px',
            fontFamily: tokens.typography.fontMono,
        },
        emptyState: {
            padding: '24px 16px',
            color: tokens.colors.textTertiary,
            fontFamily: tokens.typography.fontMono,
            fontSize: '13px',
            textAlign: 'center',
        },
        footer: {
            height: '36px',
            borderTop: `1px solid ${tokens.colors.borderSubtle}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: '16px',
        },
        footerText: {
            color: '#3C3A38',
            fontSize: '10px',
            fontFamily: tokens.typography.fontMono,
        },
        sectionDivider: {
            padding: '6px 16px',
            borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
            borderTop: `1px solid ${tokens.colors.borderSubtle}`,
            color: '#3C3A38',
            fontSize: '10px',
            fontFamily: tokens.typography.fontMono,
            textTransform: 'uppercase',
            marginTop: '4px',
            marginBottom: '4px',
        }
    };

    let currentType = null;

    return (
        <div style={styles.backdrop} onClick={() => setIsOpen(false)}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes paletteSlideIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .cmd-input::placeholder {
                    color: ${tokens.colors.textTertiary};
                }
                .cmd-results::-webkit-scrollbar { display: none; }
            `}} />
            
            <div style={styles.panel} onClick={e => e.stopPropagation()}>
                <div style={styles.searchRow}>
                    <div style={styles.iconCmd}>⌘</div>
                    <input 
                        ref={inputRef}
                        className="cmd-input"
                        style={styles.input}
                        placeholder="Search apps, projects, actions..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div style={styles.hintText}>ESC to close</div>
                </div>

                <div style={styles.resultsList} className="cmd-results">
                    {results.length === 0 ? (
                        <div style={styles.emptyState}>No results for "{query}"</div>
                    ) : (
                        results.map((r, i) => {
                            const isSelected = i === selectedIndex;
                            const showDivider = r.type !== currentType;
                            if (showDivider) currentType = r.type;

                            return (
                                <React.Fragment key={`${r.type}-${r.label}`}>
                                    {showDivider && (
                                        <div style={styles.sectionDivider}>
                                            {r.type === 'app' ? 'APPS' : r.type === 'project' ? 'PROJECTS' : 'ACTIONS'}
                                        </div>
                                    )}
                                    <div 
                                        style={{...styles.resultItem, ...(isSelected ? styles.itemHovered : styles.itemNormal)}}
                                        onMouseEnter={() => setSelectedIndex(i)}
                                        onClick={r.action}
                                    >
                                        <div style={styles.iconBox}>{r.icon}</div>
                                        <div style={styles.textCol}>
                                            <div style={styles.label}>{r.label}</div>
                                            <div style={styles.sub}>{r.sub}</div>
                                        </div>
                                        <div style={{
                                            ...styles.badge, 
                                            color: r.type === 'project' ? tokens.colors.accent : tokens.colors.textTertiary
                                        }}>
                                            {r.type === 'app' ? 'APP' : r.type === 'project' ? 'PROJECT ↗' : 'ACTION'}
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })
                    )}
                </div>

                <div style={styles.footer}>
                    <span style={styles.footerText}>↑↓ navigate</span>
                    <span style={styles.footerText}>↵ open</span>
                    <span style={styles.footerText}>esc close</span>
                </div>
            </div>
        </div>
    );
};
