import React from 'react';
import { aboutData } from './about.data.js';
import { tokens } from '../../styles/tokens';

export const About = () => {
    // Base inline styles matching user tokens logic visually
    const styles = {
        container: {
            padding: '20px',
            backgroundColor: tokens.colors.bgSurface,
            height: '100%',
            overflowY: 'auto',
            boxSizing: 'border-box',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
        },
        // SECTION 1 — HEADER
        headerLabel: {
            color: tokens.colors.accent,
            fontFamily: tokens.typography.fontMono,
            fontSize: '11px',
            margin: '0 0 8px 0',
        },
        name: {
            color: tokens.colors.textPrimary,
            fontSize: '20px',
            fontFamily: tokens.typography.fontMono,
            fontWeight: 600,
            margin: '0 0 4px 0',
        },
        titleLine: {
            color: tokens.colors.textSecondary,
            fontSize: '13px',
            margin: '0 0 4px 0',
            fontFamily: tokens.typography.fontSans,
        },
        locationHandle: {
            color: tokens.colors.textTertiary,
            fontSize: '12px',
            fontFamily: tokens.typography.fontMono,
            margin: '0 0 16px 0',
        },
        hr: {
            width: '32px',
            height: '1px',
            backgroundColor: tokens.colors.accent,
            border: 'none',
            margin: '0 0 24px 0',
            padding: 0,
        },

        // SECTION 2 — HEADLINE
        headlineContainer: {
            borderLeft: `2px solid ${tokens.colors.accent}`,
            paddingLeft: '16px',
            marginBottom: '32px',
        },
        headline: {
            color: tokens.colors.textPrimary,
            fontSize: '18px',
            fontFamily: tokens.typography.fontSans,
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
            borderRight: `1px solid ${tokens.colors.borderSubtle}`,
            paddingRight: '24px',
            marginRight: '24px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        statValue: {
            color: tokens.colors.accent,
            fontSize: '24px',
            fontFamily: tokens.typography.fontMono,
            fontWeight: 700,
            margin: '0 0 4px 0',
        },
        statLabel: {
            color: tokens.colors.textSecondary,
            fontSize: '11px',
            fontFamily: tokens.typography.fontMono,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 2px 0',
        },
        statSub: {
            color: tokens.colors.textTertiary,
            fontSize: '10px',
            fontFamily: tokens.typography.fontMono,
            margin: 0,
        },

        // SECTION 4 — BIO
        bioSection: {
            marginBottom: '32px',
        },
        bioParagraph: {
            color: tokens.colors.textSecondary,
            fontSize: '14px',
            fontFamily: tokens.typography.fontSans,
            lineHeight: 1.7,
            margin: '0 0 12px 0',
        },

        // SECTION 5 — SKILLS
        skillsSection: {
            marginBottom: '24px',
        },
        skillsMainLabel: {
            color: tokens.colors.accent,
            fontSize: '11px',
            fontFamily: tokens.typography.fontMono,
            letterSpacing: '0.1em',
            margin: '0 0 16px 0',
        },
        skillCategoryGroup: {
            marginBottom: '16px',
        },
        skillCategoryLabel: {
            color: tokens.colors.textTertiary,
            fontSize: '11px',
            fontFamily: tokens.typography.fontMono,
            margin: '0 0 8px 0',
        },
        skillsItemsGroup: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        skillPill: {
            backgroundColor: tokens.colors.accentMuted,
            border: `1px solid ${tokens.colors.accentBorder}`,
            color: tokens.colors.accent,
            padding: '3px 10px',
            borderRadius: '2px',
            fontSize: '11px',
            fontFamily: tokens.typography.fontMono,
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
