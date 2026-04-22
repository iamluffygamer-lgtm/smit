import React, { useState } from 'react';

export default function Contact() {
    const [hoveredRow, setHoveredRow] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('pilgrim3201@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleRowClick = (action) => {
        if (action === 'copy') {
            handleCopyEmail();
        } else if (action === 'link') {
            window.open('https://instagram.com/coder_smit', '_blank');
        } else if (action === 'phone') {
            window.location.href = 'tel:+919975034180';
        }
    };

    const styles = {
        container: {
            padding: '20px',
            backgroundColor: '#141210',
            height: '100%',
            overflowY: 'auto',
            boxSizing: 'border-box',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
        },
        sectionLabel: {
            color: '#E8A020',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: '11px',
            letterSpacing: '0.1em',
            marginBottom: '8px',
        },
        subtitle: {
            color: '#9C9590',
            fontSize: '13px',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            margin: '0 0 24px 0',
        },
        rowBase: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '14px 12px', // Add subtle horiz padding so hover background looks clean
            borderBottom: '1px solid rgba(240,237,232,0.06)',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer',
            boxSizing: 'border-box',
        },
        rowHovered: {
            backgroundColor: 'rgba(232,160,32,0.05)',
        },
        rowLeft: {
            color: '#5C5854',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            textTransform: 'uppercase',
            pointerEvents: 'none',
        },
        rowRight: {
            color: '#F0EDE8',
            fontSize: '14px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            pointerEvents: 'none', 
        },
        copiedText: {
            color: '#E8A020',
            fontSize: '11px',
            textTransform: 'lowercase', // As requested: "copied!"
            opacity: copied ? 1 : 0,
            transition: 'opacity 0.2s',
        },
        noticeBox: {
            backgroundColor: 'rgba(232,160,32,0.08)',
            border: '1px solid rgba(232,160,32,0.20)',
            borderRadius: '2px',
            padding: '16px',
            marginTop: '24px',
        },
        noticeTopLine: {
            color: '#E8A020',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
        },
        pulseDot: {
            display: 'inline-block',
            animation: 'contactPulseAnim 1.5s infinite alternate',
        },
        noticeBody: {
            color: '#9C9590',
            fontSize: '13px',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            margin: '0 0 12px 0',
        },
        noticeBottom: {
            color: '#E8A020',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            margin: 0,
        }
    };

    return (
        <div style={styles.container} className="contact-container">
            <style dangerouslySetInnerHTML={{__html: `
                .contact-container::-webkit-scrollbar {
                    display: none;
                }
                @keyframes contactPulseAnim {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.3);
                        opacity: 0.5;
                    }
                }
            `}} />
            
            {/* SECTION 1 — DIRECT CONTACT */}
            <div style={styles.sectionLabel}>// REACH OUT</div>
            <p style={styles.subtitle}>No middlemen. You talk to the person writing the code.</p>

            <div 
                style={{...styles.rowBase, ...(hoveredRow === 'email' ? styles.rowHovered : {})}}
                onMouseEnter={() => setHoveredRow('email')}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => handleRowClick('copy')}
            >
                <div style={styles.rowLeft}>EMAIL</div>
                <div style={styles.rowRight}>
                    <span style={styles.copiedText}>copied!</span>
                    pilgrim3201@gmail.com
                </div>
            </div>

            <div 
                style={{...styles.rowBase, ...(hoveredRow === 'instagram' ? styles.rowHovered : {})}}
                onMouseEnter={() => setHoveredRow('instagram')}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => handleRowClick('link')}
            >
                <div style={styles.rowLeft}>INSTAGRAM</div>
                <div style={styles.rowRight}>@coder_smit</div>
            </div>

            <div 
                style={{...styles.rowBase, ...(hoveredRow === 'phone' ? styles.rowHovered : {})}}
                onMouseEnter={() => setHoveredRow('phone')}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => handleRowClick('phone')}
            >
                <div style={styles.rowLeft}>PHONE</div>
                <div style={styles.rowRight}>+91 99750 34180</div>
            </div>

            {/* SECTION 2 — AVAILABILITY NOTICE */}
            <div style={styles.noticeBox}>
                <div style={styles.noticeTopLine}>
                    <span style={styles.pulseDot}>●</span> AVAILABLE FOR PROJECTS
                </div>
                <p style={styles.noticeBody}>
                    I take 2–3 projects/month. Slots go fast — reach out early.
                </p>
                <p style={styles.noticeBottom}>
                    Student rates. Senior output.
                </p>
            </div>
        </div>
    );
}
