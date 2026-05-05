import React, { useState } from 'react';
import { tokens } from '../../styles/tokens';
import { CHAR_MAP } from './charMap';

export default function AsciiArt() {
  const [text, setText] = useState('SMIT');
  const [fontStyle, setFontStyle] = useState('BLOCK'); // BLOCK, BANNER, SHADOW, MINIMAL
  const [wrapWidth, setWrapWidth] = useState(80);
  const [charset, setCharset] = useState('█ ▓ ▒ ░');
  const [copied, setCopied] = useState(false);

  const charsets = [
    { label: 'Dense', value: '█ ▓ ▒ ░' },
    { label: 'ASCII', value: '# @ % * + = - .' },
    { label: 'Dots', value: '● ○ • ·' },
  ];

  const styles = ['BLOCK', 'BANNER', 'SHADOW', 'MINIMAL'];

  const renderASCII = (text, style, charsetStr, wrapWidth) => {
    if (!text) return '';
    const chars = text.toUpperCase().split('');
    const rows = 7;
    let output = '';
    
    const cs = charsetStr.split(' ').filter(Boolean);
    const mainChar = cs[0] || '#';
    const shadowChar = cs[3] || cs[cs.length - 1] || '.';

    let letterWidth = 5; 
    if (style === 'BLOCK') letterWidth = 5 * 2 + 2;
    else if (style === 'BANNER') letterWidth = 5 * 2 + 2;
    else if (style === 'SHADOW') letterWidth = 5 * 2 + 2;
    else if (style === 'MINIMAL') letterWidth = 5 * 1 + 1;
    
    const charsPerLine = Math.max(1, Math.floor(wrapWidth / letterWidth));
    
    const chunks = [];
    for (let i = 0; i < chars.length; i += charsPerLine) {
      chunks.push(chars.slice(i, i + charsPerLine));
    }

    chunks.forEach(chunk => {
      for (let row = 0; row < rows; row++) {
        let line = '';
        chunk.forEach((char) => {
          const grid = CHAR_MAP[char] || CHAR_MAP[' '];
          
          grid[row].forEach((pixel, col) => {
            if (pixel) {
              if (style === 'BLOCK') line += mainChar + ' ';
              else if (style === 'BANNER') line += mainChar + mainChar;
              else if (style === 'SHADOW') line += mainChar + mainChar;
              else if (style === 'MINIMAL') line += mainChar;
            } else {
              let isShadow = false;
              if (style === 'SHADOW') {
                if (row > 0 && col > 0 && grid[row-1][col-1] && !grid[row][col]) {
                   isShadow = true;
                }
              }
              
              if (isShadow) {
                line += shadowChar + shadowChar;
              } else {
                if (style === 'BLOCK') line += '  ';
                else if (style === 'BANNER') line += '  ';
                else if (style === 'SHADOW') line += '  ';
                else if (style === 'MINIMAL') line += ' ';
              }
            }
          });
          
          if (style === 'MINIMAL') line += ' ';
          else line += '  ';
        });
        output += line.replace(/\s+$/, '') + '\n';
      }
      output += '\n'; 
    });
    
    return output;
  };

  const asciiOutput = renderASCII(text, fontStyle, charset, wrapWidth);

  const copyArt = () => {
    navigator.clipboard.writeText(asciiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      backgroundColor: tokens.colors.bgSurface,
      fontFamily: tokens.typography.fontSans,
    }}>
      {/* LEFT PANEL */}
      <div style={{
        width: '280px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        borderRight: `1px solid ${tokens.colors.borderSubtle}`,
        backgroundColor: tokens.colors.bgCanvas,
        flexShrink: 0,
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            color: tokens.colors.textTertiary,
            letterSpacing: '0.1em',
          }}>
            // TEXT INPUT
          </label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              backgroundColor: tokens.colors.bgSunken,
              border: `1px solid ${tokens.colors.borderDefault}`,
              color: tokens.colors.textPrimary,
              fontFamily: tokens.typography.fontMono,
              fontSize: '12px',
              padding: '10px',
              borderRadius: '2px',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            color: tokens.colors.textTertiary,
            letterSpacing: '0.1em',
          }}>
            // STYLE
          </label>
          <select
            value={fontStyle}
            onChange={(e) => setFontStyle(e.target.value)}
            style={{
              backgroundColor: tokens.colors.bgSunken,
              border: `1px solid ${tokens.colors.borderDefault}`,
              color: tokens.colors.textPrimary,
              fontFamily: tokens.typography.fontMono,
              fontSize: '12px',
              padding: '8px',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            {styles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            color: tokens.colors.textTertiary,
            letterSpacing: '0.1em',
          }}>
            // WRAP WIDTH: {wrapWidth} CHR
          </label>
          <input
            type="range"
            min="40"
            max="120"
            value={wrapWidth}
            onChange={(e) => setWrapWidth(parseInt(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            color: tokens.colors.textTertiary,
            letterSpacing: '0.1em',
          }}>
            // CHARSET
          </label>
          <select
            value={charset}
            onChange={(e) => setCharset(e.target.value)}
            style={{
              backgroundColor: tokens.colors.bgSunken,
              border: `1px solid ${tokens.colors.borderDefault}`,
              color: tokens.colors.textPrimary,
              fontFamily: tokens.typography.fontMono,
              fontSize: '12px',
              padding: '8px',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            {charsets.map(c => <option key={c.label} value={c.value}>{c.label} ({c.value})</option>)}
          </select>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={copyArt}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'var(--os-accent)',
              border: 'none',
              color: tokens.colors.bgCanvas,
              fontFamily: tokens.typography.fontMono,
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              borderRadius: '2px',
            }}
          >
            {copied ? 'COPIED TO CLIPBOARD' : 'COPY ASCII ART'}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1,
        padding: '24px',
        backgroundColor: tokens.colors.bgElevated,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <pre style={{
          flex: 1,
          fontFamily: tokens.typography.fontMono,
          fontSize: '12px',
          lineHeight: '1.2',
          color: 'var(--os-accent)',
          backgroundColor: tokens.colors.bgSunken,
          padding: '20px',
          overflow: 'auto',
          whiteSpace: 'pre',
          borderRadius: '2px',
          border: `1px solid ${tokens.colors.borderSubtle}`,
          margin: 0,
        }}>
          {asciiOutput}
        </pre>
      </div>
    </div>
  );
}
