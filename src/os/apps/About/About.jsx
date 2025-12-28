import React from 'react';
import { aboutData } from './about.data';

const styles = {
    container: {
        height: '100%',
        backgroundColor: '#ffffff',
        color: '#333333',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowY: 'auto',
        padding: '40px',
        lineHeight: '1.6',
    },
    header: {
        marginBottom: '32px',
        borderBottom: '1px solid #eaeaea',
        paddingBottom: '24px',
    },
    name: {
        fontSize: '32px',
        fontWeight: '700',
        margin: '0 0 8px 0',
        color: '#111',
    },
    role: {
        fontSize: '18px',
        color: '#666',
        fontWeight: '400',
        margin: 0,
    },
    section: {
        marginBottom: '32px',
    },
    sectionTitle: {
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '600',
        color: '#888',
        marginBottom: '16px',
    },
    text: {
        fontSize: '16px',
        color: '#444',
        maxWidth: '600px',
        margin: 0,
    },
    list: {
        margin: 0,
        paddingLeft: '20px',
        maxWidth: '600px',
    },
    listItem: {
        marginBottom: '8px',
        fontSize: '16px',
        color: '#444',
    },
    skillContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        maxWidth: '600px',
    },
    skillTag: {
        backgroundColor: '#f5f5f5',
        color: '#333',
        padding: '6px 12px',
        borderRadius: '4px',
        fontSize: '14px',
        border: '1px solid #e0e0e0',
    }
};

export const About = () => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.name}>{aboutData.name}</h1>
                <h2 style={styles.role}>{aboutData.role}</h2>
            </header>

            <section style={styles.section}>
                <div style={styles.sectionTitle}>Introduction</div>
                <p style={styles.text}>{aboutData.intro}</p>
            </section>

            <section style={styles.section}>
                <div style={styles.sectionTitle}>Core Principles</div>
                <ul style={styles.list}>
                    {aboutData.principles.map((principle, index) => (
                        <li key={index} style={styles.listItem}>{principle}</li>
                    ))}
                </ul>
            </section>

            <section style={styles.section}>
                <div style={styles.sectionTitle}>Technical Expertise</div>
                <div style={styles.skillContainer}>
                    {aboutData.skills.map((skill, index) => (
                        <span key={index} style={styles.skillTag}>{skill}</span>
                    ))}
                </div>
            </section>

            <section style={styles.section}>
                <div style={styles.sectionTitle}>Current Focus</div>
                <p style={styles.text}>{aboutData.currentFocus}</p>
            </section>
        </div>
    );
};
