import React, { useState, useEffect } from 'react';
import { tokens } from '../../styles/tokens';

const decodeBase64Url = (str) => {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '=='.slice((base64.length + 2) % 4);
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  } catch (e) {
    return null;
  }
};

const formatTimeAgo = (timestamp) => {
  const diff = Date.now() / 1000 - timestamp;
  const absDiff = Math.abs(diff);
  const d = Math.floor(absDiff / 86400);
  const h = Math.floor((absDiff % 86400) / 3600);
  const m = Math.floor((absDiff % 3600) / 60);
  const s = Math.floor(absDiff % 60);

  let str = '';
  if (d > 0) str += `${d}d `;
  if (h > 0) str += `${h}h `;
  if (m > 0) str += `${m}m `;
  str += `${s}s`;

  if (diff > 0) {
    return `Expired ${str} ago`;
  } else {
    return `Expires in ${str}`;
  }
};

const syntaxHighlight = (json) => {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'color: #06B6D4;'; // number
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'color: #E8A020;'; // key
          } else {
              cls = 'color: #4ADE80;'; // string
          }
      } else if (/true|false/.test(match)) {
          cls = 'color: #F87171;'; // boolean
      } else if (/null/.test(match)) {
          cls = 'color: #F87171;'; // null
      }
      return '<span style="' + cls + '">' + match + '</span>';
  });
};

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [signature, setSignature] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [expiryStatus, setExpiryStatus] = useState('NO EXP'); // VALID, EXPIRED, NO EXP
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!token.trim()) {
      setHeader(null);
      setPayload(null);
      setSignature('');
      setIsValid(false);
      setExpiryStatus('NO EXP');
      return;
    }

    const parts = token.trim().split('.');
    if (parts.length === 3) {
      const decodedHeader = decodeBase64Url(parts[0]);
      const decodedPayload = decodeBase64Url(parts[1]);
      
      if (decodedHeader && decodedPayload) {
        setHeader(decodedHeader);
        setPayload(decodedPayload);
        setSignature(parts[2]);
        setIsValid(true);

        if (decodedPayload.exp) {
          if (Date.now() / 1000 > decodedPayload.exp) {
            setExpiryStatus('EXPIRED');
          } else {
            setExpiryStatus('VALID');
          }
        } else {
          setExpiryStatus('NO EXP');
        }
      } else {
        setIsValid(false);
      }
    } else {
      setIsValid(false);
    }
  }, [token]);

  useEffect(() => {
    let interval;
    if (isValid && payload && payload.exp) {
      const updateCountdown = () => {
        setCountdown(formatTimeAgo(payload.exp));
        if (Date.now() / 1000 > payload.exp) {
          setExpiryStatus('EXPIRED');
        }
      };
      updateCountdown();
      interval = setInterval(updateCountdown, 1000);
    } else {
      setCountdown('');
    }
    return () => clearInterval(interval);
  }, [isValid, payload]);

  const handleCopy = (data) => {
    navigator.clipboard.writeText(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  };

  const tokenParts = token.trim().split('.');

  const COLORS = {
    header: '#E8A020',   // Amber
    payload: '#4ADE80'   // Green
  };

  const getSignatureColor = () => {
    if (expiryStatus === 'EXPIRED') return '#F87171'; // Red
    if (expiryStatus === 'VALID') return '#4ADE80'; // Green
    return '#06B6D4'; // Cyan default if no expiry
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: tokens.colors.bgSurface, fontFamily: tokens.typography.fontMono, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      
      {/* TOPBAR */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${tokens.colors.borderSubtle}`, backgroundColor: tokens.colors.bgCanvas, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: '10px', color: tokens.colors.textTertiary, letterSpacing: '0.1em' }}>
          // JWT DECODER
        </div>
        
        {isValid && (
          <div style={{
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            backgroundColor: expiryStatus === 'VALID' ? '#4ADE8022' : expiryStatus === 'EXPIRED' ? '#F8717122' : tokens.colors.bgSurface,
            color: expiryStatus === 'VALID' ? '#4ADE80' : expiryStatus === 'EXPIRED' ? '#F87171' : tokens.colors.textSecondary,
            border: `1px solid ${expiryStatus === 'VALID' ? '#4ADE80' : expiryStatus === 'EXPIRED' ? '#F87171' : tokens.colors.borderSubtle}`
          }}>
            {expiryStatus === 'VALID' ? 'VALID TOKEN' : expiryStatus === 'EXPIRED' ? 'EXPIRED' : 'NO EXPIRY'}
          </div>
        )}
      </div>

      {expiryStatus === 'EXPIRED' && (
        <div style={{ backgroundColor: '#F87171', color: '#fff', padding: '8px 16px', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>
          ⚠ This token is expired
        </div>
      )}

      {/* INPUT AREA */}
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, borderBottom: `1px solid ${tokens.colors.borderSubtle}` }}>
        <textarea
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="Paste JWT token here..."
          spellCheck={false}
          style={{
            width: '100%',
            height: '120px',
            backgroundColor: 'transparent',
            border: 'none',
            padding: '16px',
            color: tokens.colors.textPrimary,
            fontFamily: tokens.typography.fontMono,
            fontSize: '12px',
            lineHeight: '1.6',
            resize: 'vertical',
            outline: 'none',
            wordBreak: 'break-all',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        />
      </div>

      {/* TOKEN ANATOMY VISUALIZATION */}
      {isValid && (
        <div style={{ padding: '16px', backgroundColor: tokens.colors.bgCanvas, borderBottom: `1px solid ${tokens.colors.borderSubtle}`, flexShrink: 0 }}>
          <div style={{ fontSize: '10px', color: tokens.colors.textTertiary, marginBottom: '8px', letterSpacing: '0.05em' }}>TOKEN ANATOMY</div>
          <div style={{ display: 'flex', fontSize: '11px', wordBreak: 'break-all', lineHeight: '1.6', flexWrap: 'wrap' }}>
            <span style={{ color: COLORS.header }}>{tokenParts[0]}</span>
            <span style={{ color: tokens.colors.textTertiary }}>.</span>
            <span style={{ color: COLORS.payload }}>{tokenParts[1]}</span>
            <span style={{ color: tokens.colors.textTertiary }}>.</span>
            <span style={{ color: getSignatureColor() }}>{tokenParts[2]}</span>
          </div>
        </div>
      )}

      {/* DECODED DATA */}
      {isValid ? (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          {/* HEADER */}
          <div style={{ borderLeft: `3px solid ${COLORS.header}`, paddingLeft: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: COLORS.header, letterSpacing: '0.05em' }}>HEADER: ALGORITHM & TOKEN TYPE</div>
              <button onClick={() => handleCopy(header)} style={{ backgroundColor: 'transparent', border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textTertiary, padding: '4px 8px', fontSize: '10px', cursor: 'pointer', fontFamily: tokens.typography.fontMono }}>COPY</button>
            </div>
            <div style={{ backgroundColor: tokens.colors.bgCanvas, padding: '16px', border: `1px solid ${tokens.colors.borderSubtle}`, fontSize: '12px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              <div dangerouslySetInnerHTML={{ __html: syntaxHighlight(header) }} />
            </div>
          </div>

          {/* PAYLOAD */}
          <div style={{ borderLeft: `3px solid ${COLORS.payload}`, paddingLeft: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: COLORS.payload, letterSpacing: '0.05em' }}>PAYLOAD: DATA</div>
              <button onClick={() => handleCopy(payload)} style={{ backgroundColor: 'transparent', border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textTertiary, padding: '4px 8px', fontSize: '10px', cursor: 'pointer', fontFamily: tokens.typography.fontMono }}>COPY</button>
            </div>
            
            {/* Claims UI */}
            <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(payload).map(([key, val]) => {
                let label = key;
                let valueDisplay = String(val);
                
                if (key === 'sub') label = 'Subject (sub)';
                if (key === 'aud') label = 'Audience (aud)';
                if (key === 'iss') label = 'Issuer (iss)';
                if (key === 'iat') {
                  label = 'Issued At (iat)';
                  valueDisplay = `${val} — ${new Date(val * 1000).toLocaleString()}`;
                }
                if (key === 'exp') {
                  label = 'Expires At (exp)';
                  valueDisplay = `${val} — ${new Date(val * 1000).toLocaleString()}`;
                }

                return (
                  <div key={key} style={{ display: 'flex', fontSize: '12px', padding: '6px 0', borderBottom: `1px solid ${tokens.colors.borderFaint}` }}>
                    <div style={{ width: '150px', color: tokens.colors.textSecondary }}>{label}</div>
                    <div style={{ flex: 1, color: tokens.colors.textPrimary, wordBreak: 'break-all' }}>{valueDisplay}</div>
                  </div>
                );
              })}
            </div>

            {countdown && (
              <div style={{ fontSize: '12px', color: expiryStatus === 'EXPIRED' ? '#F87171' : '#E8A020', marginBottom: '16px', fontWeight: 600 }}>
                {countdown}
              </div>
            )}

            <div style={{ backgroundColor: tokens.colors.bgCanvas, padding: '16px', border: `1px solid ${tokens.colors.borderSubtle}`, fontSize: '12px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              <div dangerouslySetInnerHTML={{ __html: syntaxHighlight(payload) }} />
            </div>
          </div>

          {/* SIGNATURE */}
          <div style={{ borderLeft: `3px solid ${getSignatureColor()}`, paddingLeft: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: getSignatureColor(), letterSpacing: '0.05em' }}>SIGNATURE: VERIFY</div>
              <button onClick={() => handleCopy(signature)} style={{ backgroundColor: 'transparent', border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textTertiary, padding: '4px 8px', fontSize: '10px', cursor: 'pointer', fontFamily: tokens.typography.fontMono }}>COPY</button>
            </div>
            <div style={{ marginBottom: '8px', fontSize: '12px', color: tokens.colors.textSecondary }}>
              Algorithm used: <span style={{ color: tokens.colors.textPrimary }}>{header?.alg || 'Unknown'}</span>
            </div>
            <div style={{ marginBottom: '12px', fontSize: '12px', color: tokens.colors.textSecondary }}>
              Signature cannot be verified without secret key
            </div>
            <div style={{ backgroundColor: tokens.colors.bgCanvas, padding: '16px', border: `1px solid ${tokens.colors.borderSubtle}`, fontSize: '12px', lineHeight: '1.6', wordBreak: 'break-all', color: tokens.colors.textPrimary }}>
              {signature}
            </div>
          </div>

        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.colors.textTertiary, fontSize: '12px' }}>
          {token.trim() ? 'Invalid JWT token format' : 'Paste a token above to decode'}
        </div>
      )}
    </div>
  );
}
