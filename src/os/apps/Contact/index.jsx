import React, { useState, useEffect } from 'react';
import { tokens } from '../../styles/tokens';

export default function Contact() {
    const [hoveredRow, setHoveredRow] = useState(null);
    const [copied, setCopied] = useState(false);

    const [activeRow, setActiveRow] = useState(null);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [opening, setOpening] = useState(false);
    const [composing, setComposing] = useState(false);

    useEffect(() => {
      const seen = localStorage.getItem('contact-seen');

      if (!seen) {
        setActiveRow('email');
        localStorage.setItem('contact-seen', 'true');
      }
    }, []);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('pilgrim3201@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleRowClick = (action) => {
        if (action === 'copy') {
            handleCopyEmail();
        } else if (action === 'link') {
            setOpening(true);
            setTimeout(() => {
                window.open('https://instagram.com/coder_smit', '_blank');
                setOpening(false);
            }, 300);
        } else if (action === 'phone') {
            window.location.href = 'tel:+919975034180';
        }
    };

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
            marginBottom: '8px',
        },
        subtitle: {
            color: tokens.colors.textSecondary,
            fontSize: '14px',
            fontFamily: tokens.typography.fontSans,
            fontWeight: 400,
            lineHeight: 1.6,
            margin: '0 0 24px 0',
        },
        rowBase: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '14px 12px',
            borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
            transition: 'background-color 0.2s ease',
            cursor: 'pointer',
            boxSizing: 'border-box',
        },
        rowHovered: {
            backgroundColor: tokens.colors.accentMuted,
        },
        rowLeft: {
            color: tokens.colors.textTertiary,
            fontSize: '11px',
            fontFamily: tokens.typography.fontMono,
            textTransform: 'uppercase',
            pointerEvents: 'none',
        },
        rowRight: {
            color: tokens.colors.textPrimary,
            fontSize: '14px',
            fontFamily: tokens.typography.fontMono,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            pointerEvents: 'none', 
        },
        copiedText: {
            color: tokens.colors.accent,
            fontSize: '11px',
            textTransform: 'lowercase',
            opacity: copied ? 1 : 0,
            transition: 'opacity 0.2s',
        },
        noticeBox: {
            backgroundColor: tokens.colors.accentMuted,
            border: `1px solid ${tokens.colors.accentBorder}`,
            borderRadius: '2px',
            padding: '16px',
            marginTop: '24px',
        },
        noticeTopLine: {
            color: tokens.colors.accent,
            fontSize: '11px',
            fontFamily: tokens.typography.fontMono,
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
            color: tokens.colors.textSecondary,
            fontSize: '13px',
            fontFamily: tokens.typography.fontSans,
            fontWeight: 400,
            lineHeight: 1.6,
            margin: '0 0 12px 0',
        },
        noticeBottom: {
            color: tokens.colors.accent,
            fontSize: '12px',
            fontFamily: tokens.typography.fontMono,
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
            <p style={styles.subtitle}>Click email to send a message directly.</p>

            <div 
                style={{
                  ...styles.rowBase, 
                  ...(hoveredRow === 'email' ? styles.rowHovered : {}),
                  transform: activeRow === 'email' ? 'scale(1.01)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  borderLeft: '2px solid var(--os-accent)'
                }}
                onMouseEnter={() => setHoveredRow('email')}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => {
                  setComposing(true);
                  setActiveRow(activeRow === 'email' ? null : 'email');

                  setTimeout(() => {
                    setComposing(false);
                  }, 300);
                }}
            >
                <div style={styles.rowLeft}>EMAIL</div>
                <div style={styles.rowRight}>
                  {composing ? 'composing...' : 'pilgrim3201@gmail.com'}
                  {!composing && (
                    <span style={{
                      fontSize: '10px',
                      color: tokens.colors.textTertiary,
                      marginLeft: '6px',
                      animation: 'contactPulseAnim 1.2s infinite alternate'
                    }}>
                      → message
                    </span>
                  )}
                </div>
            </div>
            {activeRow === 'email' && (
              <div style={{
                padding: '12px',
                borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
                backgroundColor: tokens.colors.bgCanvas,
              }}>
                <input
                  placeholder="your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    marginBottom: '8px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: tokens.colors.textPrimary,
                    fontFamily: tokens.typography.fontMono,
                  }}
                />

                <textarea
                  placeholder="your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: tokens.colors.textSecondary,
                    fontFamily: tokens.typography.fontMono,
                    resize: 'none',
                  }}
                />

                <button
                  onClick={() => {
                    if (!message) return;

                    setSending(true);

                    setTimeout(() => {
                      const body = encodeURIComponent(
                        `Name: ${name}\n\n${message}`
                      );

                      window.location.href =
                        `mailto:pilgrim3201@gmail.com?subject=Contact&body=${body}`;

                      setSending(false);
                    }, 400);
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '4px 10px',
                    backgroundColor: tokens.colors.accentMuted,
                    border: `1px solid ${tokens.colors.accentBorder}`,
                    color: 'var(--os-accent)',
                    fontFamily: tokens.typography.fontMono,
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                >
                  {sending ? 'sending...' : 'SEND'}
                </button>
              </div>
            )}

            <div 
                style={{
                  ...styles.rowBase, 
                  ...(hoveredRow === 'instagram' ? styles.rowHovered : {}),
                  transform: activeRow === 'instagram' ? 'scale(1.01)' : 'scale(1)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={() => setHoveredRow('instagram')}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => handleRowClick('link')}
            >
                <div style={styles.rowLeft}>INSTAGRAM</div>
                <div style={styles.rowRight}>
                    {opening ? 'opening...' : '@coder_smit'}
                </div>
            </div>

            <div 
                style={{...styles.rowBase, cursor: 'default'}}
            >
                <div style={styles.rowLeft}>STATUS</div>
                <div style={styles.rowRight}>
                    available · 2–3 projects/month
                </div>
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
