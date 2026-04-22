import React from 'react';
import { aboutData } from './about.data.js';

export const About = () => {
    // Base inline styles matching user tokens logic visually
    const styles = {
        container: {
            padding: '20px',
            backgroundColor: '#141210',
            height: '100%',
            overflowY: 'auto',
            boxSizing: 'border-box',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
        },
        // SECTION 1 — HEADER
        headerLabel: {
            color: '#E8A020',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: '11px',
            margin: '0 0 8px 0',
        },
        name: {
            color: '#F0EDE8',
            fontSize: '20px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontWeight: 600,
            margin: '0 0 4px 0',
        },
        titleLine: {
            color: '#9C9590',
            fontSize: '13px',
            margin: '0 0 4px 0',
            fontFamily: "'DM Sans', system-ui, sans-serif",
        },
        locationHandle: {
            color: '#5C5854',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            margin: '0 0 16px 0',
        },
        hr: {
            width: '32px',
            height: '1px',
            backgroundColor: '#E8A020',
            border: 'none',
            margin: '0 0 24px 0',
            padding: 0,
        },

        // SECTION 2 — HEADLINE
        headlineContainer: {
            borderLeft: '2px solid #E8A020',
            paddingLeft: '16px',
            marginBottom: '32px',
        },
        headline: {
            color: '#F0EDE8',
            fontSize: '18px',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            lineHeight: 1.4,
            margin: 0,
        },

        // SECTION 3 — STATS ROW
        statsRow: {
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: '32px',
        },
        statBox: {
            borderRight: '1px solid rgba(240,237,232,0.08)',
            paddingRight: '24px',
            marginRight: '24px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        statValue: {
            color: '#E8A020',
            fontSize: '24px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontWeight: 700,
            margin: '0 0 4px 0',
        },
        statLabel: {
            color: '#9C9590',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 2px 0',
        },
        statSub: {
            color: '#5C5854',
            fontSize: '10px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            margin: 0,
        },

        // SECTION 4 — BIO
        bioSection: {
            marginBottom: '32px',
        },
        bioParagraph: {
            color: '#9C9590',
            fontSize: '14px',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            lineHeight: 1.7,
            margin: '0 0 12px 0',
        },

        // SECTION 5 — SKILLS
        skillsSection: {
            marginBottom: '24px',
        },
        skillsMainLabel: {
            color: '#E8A020',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            letterSpacing: '0.1em',
            margin: '0 0 16px 0',
        },
        skillCategoryGroup: {
            marginBottom: '16px',
        },
        skillCategoryLabel: {
            color: '#5C5854',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            margin: '0 0 8px 0',
        },
        skillsItemsGroup: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        skillPill: {
            backgroundColor: 'rgba(232,160,32,0.10)',
            border: '1px solid rgba(232,160,32,0.25)',
            color: '#E8A020',
            padding: '3px 10px',
            borderRadius: '2px',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            margin: '3px',
        }
    };

    return (
        <>
            {/* Inline style tag explicitly for the webkit scrollbar hiding fallback, while honoring the 'inline styles only' architecture constraint */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .about-container::-webkit-scrollbar {
                    display: none;
                }
            `}} />

            <div className="about-container" style={styles.container}>
                {/* SECTION 1 — HEADER */}
                <div style={styles.headerLabel}>// ABOUT</div>
                <div style={styles.name}>{aboutData.name}</div>
                <div style={styles.titleLine}>{aboutData.title}</div>
                <div style={styles.locationHandle}>
                    {aboutData.location} | {aboutData.handle} | {aboutData.email}
                </div>
                <hr style={styles.hr} />

                {/* SECTION 2 — HEADLINE */}
                <div style={styles.headlineContainer}>
                    <p style={styles.headline}>{aboutData.headline}</p>
                </div>

                {/* SECTION 3 — STATS ROW */}
                <div style={styles.statsRow}>
                    {aboutData.stats.map((stat, idx) => (
                        <div
                            key={idx}
                            style={{
                                ...styles.statBox,
                                ...(idx === aboutData.stats.length - 1 ? { borderRight: 'none', marginRight: 0 } : {})
                            }}
                        >
                            <div style={styles.statValue}>{stat.value}</div>
                            <div style={styles.statLabel}>{stat.label}</div>
                            <div style={styles.statSub}>{stat.sub}</div>
                        </div>
                    ))}
                </div>

                {/* SECTION 4 — BIO */}
                <div style={styles.bioSection}>
                    {aboutData.bio.map((paragraph, idx) => (
                        <p key={idx} style={styles.bioParagraph}>
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* SECTION 5 — SKILLS */}
                <div style={styles.skillsSection}>
                    <div style={styles.skillsMainLabel}>// CORE CAPABILITIES</div>
                    {aboutData.skills.map((categoryGroup, idx) => (
                        <div key={idx} style={styles.skillCategoryGroup}>
                            <div style={styles.skillCategoryLabel}>
                                {categoryGroup.category.toUpperCase()}
                            </div>
                            <div style={styles.skillsItemsGroup}>
                                {categoryGroup.items.map((item, itemIdx) => (
                                    <div key={itemIdx} style={styles.skillPill}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
