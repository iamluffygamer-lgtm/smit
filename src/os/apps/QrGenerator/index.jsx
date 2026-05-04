import React, { useState } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { tokens } from '../../styles/tokens';

export default function QrGenerator() {
  const [input, setInput] = useState('https://smitdev.netlify.app');
  const [qrSize, setQrSize] = useState(200);
  const [fgColor, setFgColor] = useState('#F0EDE8');
  const [bgColor, setBgColor] = useState('#0C0A08');
  const [copied, setCopied] = useState(false);

  const downloadQR = () => {
    const canvas = document.querySelector('.qr-container canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'smit-os-qr.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(input);
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
        width: '300px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        borderRight: `1px solid ${tokens.colors.borderSubtle}`,
        backgroundColor: tokens.colors.bgCanvas,
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <label style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            color: tokens.colors.textTertiary,
            letterSpacing: '0.1em',
          }}>
            // INPUT TEXT OR URL
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            style={{
              height: '100px',
              backgroundColor: tokens.colors.bgSunken,
              border: `1px solid ${tokens.colors.borderDefault}`,
              color: tokens.colors.textPrimary,
              fontFamily: tokens.typography.fontMono,
              fontSize: '12px',
              padding: '12px',
              borderRadius: '2px',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.5,
              wordBreak: 'break-all',
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
            // SIZE: {qrSize}PX
          </label>
          <input
            type="range"
            min="128"
            max="400"
            value={qrSize}
            onChange={(e) => setQrSize(parseInt(e.target.value))}
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
            // COLORS
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: `1px solid ${tokens.colors.borderSubtle}`,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  padding: 0,
                  backgroundColor: tokens.colors.bgSunken,
                }}
              />
              <span style={{ fontSize: '11px', color: tokens.colors.textSecondary }}>Foreground</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: `1px solid ${tokens.colors.borderSubtle}`,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  padding: 0,
                  backgroundColor: tokens.colors.bgSunken,
                }}
              />
              <span style={{ fontSize: '11px', color: tokens.colors.textSecondary }}>Background</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={copyUrl}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: tokens.colors.bgElevated,
              border: `1px solid ${tokens.colors.borderSubtle}`,
              color: tokens.colors.textSecondary,
              fontFamily: tokens.typography.fontMono,
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = tokens.colors.textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.color = tokens.colors.textSecondary; }}
          >
            {copied ? 'COPIED!' : 'COPY URL'}
          </button>

          <button
            onClick={downloadQR}
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
            DOWNLOAD PNG
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.colors.bgElevated,
      }}>
        <div 
          className="qr-container"
          style={{
            padding: '24px',
            backgroundColor: bgColor,
            borderRadius: '4px',
            border: `1px solid ${tokens.colors.borderSubtle}`,
            boxShadow: tokens.shadowLg,
          }}
        >
          <QRCode
            value={input || 'https://smitdev.netlify.app'}
            size={qrSize}
            fgColor={fgColor}
            bgColor={bgColor}
            style={{ borderRadius: '2px', display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
}
