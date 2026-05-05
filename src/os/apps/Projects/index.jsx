import React, { useState } from 'react';
import { projects } from './projects.data';
import { tokens } from '../../styles/tokens';

export default function Projects() {
    const [hoveredCard, setHoveredCard] = useState(null);

    const styles = {
        container: {
            padding: '20px',
            backgroundColor: tokens.colors.bgSurface,
            height: '100%',
            overflowY: 'auto',
            boxSizing: 'border-box',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
        },
        sectionLabel: {
            color: tokens.colors.accent,
            fontFamily: tokens.typography.fontMono,
            fontSize: '11px',
            letterSpacing: '0.1em',
            marginBottom: '24px',
        },
        grid: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
        },
        card: {
            border: `1px solid ${tokens.colors.borderSubtle}`,
            backgroundColor: 'transparent',
            padding: '20px',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
        },
        cardHovered: {
            backgroundColor: tokens.colors.accentMuted,
            border: `1px solid ${tokens.colors.accentBorder}`,
        },
        headerRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        name: {
            color: tokens.colors.textPrimary,
            fontSize: '18px',
            fontFamily: tokens.typography.fontSans,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            margin: 0,
        },
        category: {
            color: tokens.colors.accent,
            fontSize: '10px',
            fontFamily: tokens.typography.fontMono,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            border: `1px solid ${tokens.colors.accentBorder}`,
            padding: '2px 6px',
            borderRadius: '2px',
            backgroundColor: 'rgba(232,160,32,0.1)',
        },
        tagline: {
            color: tokens.colors.textSecondary,
            fontSize: '14px',
            fontFamily: tokens.typography.fontSans,
            fontWeight: 400,
            lineHeight: 1.6,
            margin: 0,
        },
        description: {
            color: tokens.colors.textSecondary,
            fontSize: '13px',
            fontFamily: tokens.typography.fontSans,
            fontWeight: 400,
            lineHeight: 1.7,
            margin: 0,
        },
        statsRow: {
            display: 'flex',
            gap: '16px',
            marginTop: '8px',
        },
        statBox: {
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px',
        },
        statValue: {
            color: '#E8A020',
            fontSize: '16px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontWeight: 700,
        },
        statLabel: {
            color: '#5C5854',
            fontSize: '10px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            textTransform: 'uppercase',
        },
        tagsGroup: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '8px',
        },
        tagPill: {
            color: '#9C9590',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            backgroundColor: 'rgba(240,237,232,0.04)',
            border: '1px solid rgba(240,237,232,0.08)',
            padding: '2px 8px',
            borderRadius: '2px',
        },
        footerRow: {
            display: 'flex',
            gap: '12px',
            marginTop: '8px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(240,237,232,0.06)',
        },
        linkBtn: {
            color: '#E8A020',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
        }
    };

    return (
        <div style={styles.container} className="projects-container">
            <style dangerouslySetInnerHTML={{__html: `
                .projects-container::-webkit-scrollbar {
                    display: none;
                }
                .project-link:hover {
                    text-decoration: underline !important;
                }
            `}} />

            <div style={styles.sectionLabel}>// SHIPPED PROJECTS</div>

            <div style={styles.grid}>
                {projects.map((project, idx) => (
                    <div 
                        key={project.id}
                        style={{
                            ...styles.card,
                            ...(hoveredCard === idx ? styles.cardHovered : {})
                        }}
                        onMouseEnter={() => setHoveredCard(idx)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div style={styles.headerRow}>
                            <h3 style={styles.name}>{project.name}</h3>
                            <div style={styles.category}>{project.category}</div>
                        </div>

                        <p style={styles.tagline}>{project.tagline}</p>
                        <p style={styles.description}>{project.description}</p>

                        {project.stats && (
                            <div style={styles.statsRow}>
                                <div style={styles.statBox}>
                                    <span style={styles.statValue}>{project.stats.value}</span>
                                    <span style={styles.statLabel}>{project.stats.label}</span>
                                </div>
                            </div>
                        )}

                        <div style={styles.tagsGroup}>
                            {project.tags.map((tag, tIdx) => (
                                <div key={tIdx} style={styles.tagPill}>{tag}</div>
                            ))}
                        </div>

                        {(project.url || project.github) && (
                            <div style={styles.footerRow}>
                                {project.url && (
                                    <a 
                                        href={project.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={styles.linkBtn}
                                        className="project-link"
                                    >
                                        [ Visit Live ↗ ]
                                    </a>
                                )}
                                {project.github && (
                                    <a 
                                        href={project.github} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={styles.linkBtn}
                                        className="project-link"
                                    >
                                        [ Source Code ]
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
