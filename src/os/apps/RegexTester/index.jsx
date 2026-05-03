import React, { useState, useEffect, useRef } from 'react';
import { tokens } from '../../styles/tokens';

const FLAG_DESCS = {
  g: 'Global search',
  i: 'Case-insensitive',
  m: 'Multi-line',
  s: 'Dot matches newline',
  u: 'Unicode'
};

const CHEATSHEET = [
  { char: '\\d', desc: 'digit' },
  { char: '\\w', desc: 'word char' },
  { char: '\\s', desc: 'whitespace' },
  { char: '.', desc: 'any char' },
  { char: '^', desc: 'start' },
  { char: '$', desc: 'end' },
  { char: '*', desc: '0 or more' },
  { char: '+', desc: '1 or more' },
  { char: '?', desc: '0 or 1' },
  { char: '{n,m}', desc: 'n to m times' },
  { char: '[abc]', desc: 'char class' },
  { char: '(abc)', desc: 'group' },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState('[A-Z]\\w+');
  const [flags, setFlags] = useState({ g: true, i: false, m: true, s: false, u: false });
  const [testStr, setTestStr] = useState('Hello world! This is a Regex Tester.');
  
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  
  const [showCheatSheet, setShowCheatSheet] = useState(true);

  const textAreaRef = useRef(null);
  const highlightRef = useRef(null);

  // Sync scroll between textarea and highlight div
  const handleScroll = (e) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.target.scrollTop;
      highlightRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const toggleFlag = (f) => {
    setFlags(prev => ({ ...prev, [f]: !prev[f] }));
  };

  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError(null);
      return;
    }

    const flagStr = Object.keys(flags).filter(f => flags[f]).join('');
    
    // Check if regex needs to match repeatedly
    // matchAll requires global 'g' flag, else it throws exception
    let effectiveFlags = flagStr;
    if (!effectiveFlags.includes('g')) {
      effectiveFlags += 'g';
    }

    try {
      const regex = new RegExp(pattern, effectiveFlags);
      const m = [...testStr.matchAll(regex)];
      
      // If user didn't want 'g', only return first match
      if (!flagStr.includes('g') && m.length > 0) {
        setMatches([m[0]]);
      } else {
        setMatches(m);
      }
      setError(null);
    } catch (e) {
      setMatches([]);
      setError(e.message);
    }
  }, [pattern, flags, testStr]);

  const insertPattern = (str) => {
    setPattern(prev => prev + str);
  };

  // Generate highlighted text
  const renderHighlights = () => {
    if (error || !pattern) {
      return testStr;
    }

    let lastIndex = 0;
    const elements = [];
    
    matches.forEach((match, i) => {
      const start = match.index;
      const end = start + match[0].length;
      
      if (start >= lastIndex) {
        // text before match
        elements.push(testStr.substring(lastIndex, start));
        // highlighted match
        // varying intensity: alternate opacity: 0.35 and 0.5
        const intensity = i % 2 === 0 ? 'rgba(232,160,32,0.35)' : 'rgba(232,160,32,0.5)';
        
        elements.push(
          <mark key={`m_${i}_${start}`} style={{ backgroundColor: intensity, color: 'transparent', borderRadius: '2px' }}>
            {match[0]}
          </mark>
        );
        lastIndex = end;
      }
    });

    // remaining text
    if (lastIndex < testStr.length) {
      elements.push(testStr.substring(lastIndex));
    }

    // trailing newline support for textareas
    if (testStr.endsWith('\n')) {
      elements.push(<br key="br" />);
    }

    return elements;
  };

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: tokens.colors.bgSurface, fontFamily: tokens.typography.fontMono, overflow: 'hidden' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOPBAR */}
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${tokens.colors.borderSubtle}`, backgroundColor: tokens.colors.bgCanvas, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '10px', color: tokens.colors.textTertiary, letterSpacing: '0.1em' }}>
            // REGEX TESTER
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '11px' }}>
            <span style={{ color: error ? '#F87171' : '#4ADE80' }}>
              {error ? '✗ INVALID' : '✓ VALID'}
            </span>
            <span style={{ color: tokens.colors.textTertiary }}>
              {matches.length} matches
            </span>
            <button
              onClick={() => setShowCheatSheet(!showCheatSheet)}
              style={{ backgroundColor: showCheatSheet ? tokens.colors.bgSurface : 'transparent', border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, padding: '4px 8px', fontSize: '10px', cursor: 'pointer', fontFamily: tokens.typography.fontMono }}
            >
              CHEATSHEET
            </button>
          </div>
        </div>

        {/* INPUT PATTERN */}
        <div style={{ padding: '16px', borderBottom: `1px solid ${tokens.colors.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '18px', color: tokens.colors.textTertiary }}>/</div>
            <input
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="pattern"
              style={{
                flex: 1,
                backgroundColor: tokens.colors.bgCanvas,
                border: `1px solid ${error ? '#F87171' : tokens.colors.borderSubtle}`,
                color: error ? '#F87171' : 'var(--os-accent)',
                padding: '8px 12px',
                fontSize: '14px',
                fontFamily: tokens.typography.fontMono,
                outline: 'none',
              }}
            />
            <div style={{ fontSize: '18px', color: tokens.colors.textTertiary }}>/</div>
            
            {/* FLAGS */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {Object.keys(flags).map(f => (
                <button
                  key={f}
                  onClick={() => toggleFlag(f)}
                  title={FLAG_DESCS[f]}
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: flags[f] ? tokens.colors.bgElevated : tokens.colors.bgCanvas,
                    border: `1px solid ${flags[f] ? 'var(--os-accent)' : tokens.colors.borderSubtle}`,
                    color: flags[f] ? 'var(--os-accent)' : tokens.colors.textTertiary,
                    fontSize: '12px',
                    fontFamily: tokens.typography.fontMono,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {error && (
            <div style={{ fontSize: '11px', color: '#F87171' }}>Invalid regex: {error}</div>
          )}
        </div>

        {/* MIDDLE: TEST STRING OVERLAY */}
        <div style={{ flex: 1, position: 'relative', borderBottom: `1px solid ${tokens.colors.borderSubtle}`, backgroundColor: tokens.colors.bgSurface, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '6px 12px', fontSize: '10px', color: tokens.colors.textTertiary, backgroundColor: tokens.colors.bgCanvas, borderBottom: `1px solid ${tokens.colors.borderFaint}`, zIndex: 10 }}>
            TEST STRING
          </div>
          
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
            {/* HIGHLIGHT LAYER */}
            <div
              ref={highlightRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: '16px',
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: tokens.typography.fontMono,
                color: 'transparent',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowY: 'auto',
                pointerEvents: 'none',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {renderHighlights()}
            </div>

            {/* INPUT LAYER */}
            <textarea
              ref={textAreaRef}
              value={testStr}
              onChange={e => setTestStr(e.target.value)}
              onScroll={handleScroll}
              spellCheck={false}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: '16px',
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: tokens.typography.fontMono,
                color: tokens.colors.textPrimary,
                backgroundColor: 'transparent',
                border: 'none',
                resize: 'none',
                outline: 'none',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            />
          </div>
        </div>

        {/* BOTTOM: RESULTS PANEL */}
        <div style={{ height: '200px', backgroundColor: tokens.colors.bgCanvas, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '6px 12px', fontSize: '10px', color: tokens.colors.textTertiary, borderBottom: `1px solid ${tokens.colors.borderFaint}` }}>
            MATCHES
          </div>
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {matches.length === 0 ? (
              <div style={{ color: tokens.colors.textTertiary, fontSize: '12px' }}>No matches</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {matches.map((m, i) => (
                  <div key={i} style={{ fontSize: '12px', borderLeft: `2px solid var(--os-accent)`, paddingLeft: '12px' }}>
                    <div style={{ color: tokens.colors.textPrimary, marginBottom: '4px' }}>
                      <span style={{ color: tokens.colors.textTertiary }}>Match {i + 1}:</span> "{m[0]}" <span style={{ color: tokens.colors.textTertiary }}>at index {m.index}-{m.index + m[0].length}</span>
                    </div>
                    {m.length > 1 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '8px' }}>
                        {m.slice(1).map((group, gi) => (
                          <div key={gi} style={{ color: tokens.colors.textSecondary }}>
                            <span style={{ color: tokens.colors.textTertiary }}>Group {gi + 1}:</span> {group === undefined ? 'undefined' : `"${group}"`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: CHEATSHEET */}
      {showCheatSheet && (
        <div style={{ width: '180px', backgroundColor: tokens.colors.bgCanvas, borderLeft: `1px solid ${tokens.colors.borderSubtle}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '12px', fontSize: '10px', color: tokens.colors.textTertiary, borderBottom: `1px solid ${tokens.colors.borderFaint}`, letterSpacing: '0.1em' }}>
            // CHEATSHEET
          </div>
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', padding: '12px' }}>
            {CHEATSHEET.map((item, i) => (
              <div
                key={i}
                onClick={() => insertPattern(item.char)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  fontSize: '11px',
                  borderBottom: `1px solid ${tokens.colors.borderFaint}`,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--os-accent)'}
                onMouseLeave={(e) => e.currentTarget.style.color = tokens.colors.textPrimary}
              >
                <div style={{ fontWeight: 600, color: 'var(--os-accent)' }}>{item.char}</div>
                <div style={{ color: tokens.colors.textSecondary }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
