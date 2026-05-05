import React, { useState, useEffect, useCallback } from 'react';
import { tokens } from '../../styles/tokens';

const COLORS = {
  key:    '#E8A020',
  string: '#4ADE80',
  number: '#06B6D4',
  bool:   '#F87171',
  null:   '#F87171',
  punct:  '#8A8480',
};

// Syntax highlight function
// Takes formatted JSON string, returns array of spans
const syntaxHighlight = (json) => {
  const lines = json.split('\n');
  return lines.map((line, i) => {
    // Parse line and colorize tokens
    const highlighted = line.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let color = COLORS.number;
        if (/^"/.test(match)) {
          color = /:$/.test(match) ? COLORS.key : COLORS.string;
        } else if (/true|false/.test(match)) {
          color = COLORS.bool;
        } else if (/null/.test(match)) {
          color = COLORS.null;
        }
        return `<span style="color:${color}">${match}</span>`;
      }
    );
    return { line: highlighted, number: i + 1 };
  });
};

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isMinified, setIsMinified] = useState(false);

  const format = useCallback((raw, minify = false) => {
    if (!raw.trim()) {
      setOutput('');
      setError(null);
      setLineCount(0);
      setCharCount(0);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const formatted = minify
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
      setLineCount(formatted.split('\n').length);
      setCharCount(formatted.length);
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  }, []);

  useEffect(() => {
    format(input, isMinified);
  }, [input, isMinified, format]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const highlighted = output ? syntaxHighlight(output) : [];

  const btnStyle = (active) => ({
    padding: '4px 12px',
    backgroundColor: active ? tokens.colors.accentMuted : 'transparent',
    border: `1px solid ${active ? tokens.colors.accentBorder : tokens.colors.borderSubtle}`,
    borderRadius: '2px',
    color: active ? 'var(--os-accent)' : tokens.colors.textTertiary,
    fontFamily: tokens.typography.fontMono,
    fontSize: '10px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'all 0.1s',
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: tokens.colors.bgSurface,
      fontFamily: tokens.typography.fontMono,
    }}>

      {/* TOOLBAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
        backgroundColor: tokens.colors.bgCanvas,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '10px', color: tokens.colors.textTertiary, letterSpacing: '0.1em', flex: 1 }}>
          // JSON FORMATTER
        </span>
        {output && (
          <span style={{ fontSize: '10px', color: tokens.colors.textTertiary }}>
            {lineCount} lines · {charCount} chars
          </span>
        )}
        <button style={btnStyle(isMinified)} onClick={() => setIsMinified(m => !m)}>
          {isMinified ? 'BEAUTIFY' : 'MINIFY'}
        </button>
        <button style={btnStyle(copied)} onClick={handleCopy} disabled={!output}>
          {copied ? 'COPIED ✓' : 'COPY'}
        </button>
        <button style={btnStyle(false)} onClick={() => { setInput(''); setOutput(''); setError(null); }}>
          CLEAR
        </button>
      </div>

      {/* PANELS */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT — Input */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${tokens.colors.borderSubtle}` }}>
          <div style={{ padding: '6px 12px', borderBottom: `1px solid ${tokens.colors.borderFaint}`, fontSize: '10px', color: tokens.colors.textTertiary, backgroundColor: tokens.colors.bgCanvas }}>
            INPUT — paste JSON here
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'{\n  "paste": "your JSON here"\n}'}
            spellCheck={false}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: '16px',
              color: tokens.colors.textSecondary,
              fontFamily: tokens.typography.fontMono,
              fontSize: '12px',
              lineHeight: '1.7',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          />
        </div>

        {/* RIGHT — Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '6px 12px', borderBottom: `1px solid ${tokens.colors.borderFaint}`, fontSize: '10px', backgroundColor: tokens.colors.bgCanvas, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: tokens.colors.textTertiary }}>OUTPUT</span>
            {error && <span style={{ color: '#F87171' }}>⚠ Error</span>}
            {!error && output && <span style={{ color: '#4ADE80' }}>✓ Valid</span>}
          </div>

          {error ? (
            <div style={{ padding: '20px', color: '#F87171', fontSize: '12px', lineHeight: 1.6 }}>
              <div style={{ marginBottom: '8px', fontWeight: 600 }}>Invalid JSON</div>
              <div style={{ color: tokens.colors.textTertiary }}>{error}</div>
            </div>
          ) : (
            <div style={{
              flex: 1,
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: '16px',
              display: 'flex',
              gap: '16px',
            }}>
              {/* Line numbers */}
              <div style={{ color: tokens.colors.textTertiary, fontSize: '12px', lineHeight: '1.7', userSelect: 'none', textAlign: 'right', minWidth: '32px' }}>
                {highlighted.map(({ number }) => (
                  <div key={number}>{number}</div>
                ))}
              </div>
              {/* Highlighted code */}
              <div style={{ flex: 1, fontSize: '12px', lineHeight: '1.7', overflow: 'hidden' }}>
                {highlighted.map(({ line, number }) => (
                  <div
                    key={number}
                    dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
