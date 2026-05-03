import React, { useState, useRef, useEffect } from 'react';
import { tokens } from '../../styles/tokens';
import { TEMPLATES, matchTemplate } from './templates';
import { useWindowStore } from '../../store/windowStore';
import { useNotificationStore } from '../../system/notificationStore';
import { motion } from 'framer-motion';

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    background: #0C0A08;
    font-family: 'JetBrains Mono', monospace;
    color: #F5F2EE;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    flex-direction: column;
    gap: 16px;
  }
  h1 { color: #E8A020; font-size: 24px; letter-spacing: 0.1em; }
  p { color: #8A8480; font-size: 12px; }
</style>
</head>
<body>
  <h1>HELLO WORLD</h1>
  <p>Edit the code and click RUN</p>
</body>
</html>`;

export default function CodeEditor({ intentData }) {
  const [code, setCode] = useState(() => {
    if (intentData?.prefill) return intentData.prefill;
    return localStorage.getItem('smit-code-editor-draft') || DEFAULT_HTML;
  });
  const [preview, setPreview] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [showConsole, setShowConsole] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [savedFilename, setSavedFilename] = useState(intentData?.filename || '');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState('');
  const iframeRef = useRef(null);
  const openWindow = useWindowStore(state => state.openWindow);
  const addNotification = useNotificationStore(state => state.addNotification);

  // Autosave to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('smit-code-editor-draft', code);
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 1500);
    }, 1000);
    return () => clearTimeout(timer);
  }, [code]);

  const handleSave = () => {
    const filename = savedFilename || `playground-${Date.now()}.html`;
    const filesData = JSON.parse(localStorage.getItem('smit-files-data') || '{"code":{}}');
    if (!filesData.code) filesData.code = {};
    filesData.code[filename] = code;
    localStorage.setItem('smit-files-data', JSON.stringify(filesData));
    
    addNotification('Saved to /code', 'success', 2000);
    setSavedFilename(filename);
  };

  const addLog = (msg, type = 'info') => {
    setConsoleLogs(prev => [...prev, {
      msg,
      type,
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
    }]);
  };

  const handleRun = () => {
    setShowConsole(true);
    setConsoleLogs([]);

    // Theatrical npm flow
    const logs = [
      { msg: '> npm run dev', type: 'cmd', delay: 0 },
      { msg: '', type: 'info', delay: 200 },
      { msg: '> smit-os-playground@1.0.0 dev', type: 'info', delay: 400 },
      { msg: '> vite', type: 'info', delay: 600 },
      { msg: '', type: 'info', delay: 700 },
      { msg: '  VITE v5.4.0  ready in ' + (Math.floor(Math.random() * 80) + 60) + 'ms', type: 'success', delay: 900 },
      { msg: '', type: 'info', delay: 1000 },
      { msg: '  ➜  Local:   http://localhost:5173/', type: 'link', delay: 1100 },
      { msg: '  ➜  Network: http://192.168.1.1:5173/', type: 'muted', delay: 1200 },
    ];

    logs.forEach(({ msg, type, delay }) => {
      setTimeout(() => addLog(msg, type), delay);
    });

    // Update preview
    setTimeout(() => {
      setPreview(code);
      setDeployedUrl('');
      addNotification('Preview updated', 'success', 2000);
    }, 1300);
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeployedUrl('');
    setShowConsole(true);
    setConsoleLogs([]);

    const buildLogs = [
      { msg: '> npm run build', type: 'cmd', delay: 0 },
      { msg: '', type: 'info', delay: 100 },
      { msg: '  vite v5.4.0 building for production...', type: 'info', delay: 200 },
      { msg: '  transforming...', type: 'info', delay: 500 },
      { msg: '  ✓ ' + (Math.floor(Math.random()*8)+4) + ' modules transformed.', type: 'success', delay: 900 },
      { msg: '  dist/index.html    ' + (Math.floor(Math.random()*5)+2) + '.00 kB', type: 'info', delay: 1000 },
      { msg: '  dist/assets/index  ' + (Math.floor(Math.random()*40)+20) + '.00 kB │ gzip: ' + (Math.floor(Math.random()*15)+8) + '.00 kB', type: 'info', delay: 1100 },
      { msg: '  ✓ built in ' + (Math.random()*0.8+0.4).toFixed(2) + 's', type: 'success', delay: 1200 },
      { msg: '', type: 'info', delay: 1400 },
      { msg: '  Deploying...', type: 'info', delay: 1500 },
      { msg: '  ● Uploading build output', type: 'info', delay: 1800 },
      { msg: '  ● Assigning domains', type: 'info', delay: 2100 },
      { msg: '  ● Finalizing', type: 'info', delay: 2400 },
    ];

    buildLogs.forEach(({ msg, type, delay }) => {
      setTimeout(() => addLog(msg, type), delay);
    });

    setTimeout(() => {
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setDeployedUrl(url);

      addLog('', 'info');
      addLog('  ✓ Build complete', 'success');
      setTimeout(() => addLog('', 'info'), 100);
      setTimeout(() => addLog('  ⚡  Preview ready — click to open', 'link'), 200);
      setTimeout(() => addLog('', 'info'), 300);
    }, 2800);

    setTimeout(() => {
      setIsDeploying(false);
      addNotification('Deployed — preview ready ⚡', 'success', 4000);
    }, 3200);
  };

  const handleAiSubmit = () => {
    if (!aiInput.trim()) return;
    setAiThinking(true);
    setAiMessage('');

    setTimeout(() => {
      const match = matchTemplate(aiInput);
      if (match) {
        setCode(match.html);
        setAiMessage(`✓ Loaded: ${match.name} template`);
        addNotification(`Template loaded: ${match.name}`, 'success');
      } else {
        setAiMessage('Try: calculator, todo, timer, quiz, landing, weather');
      }
      setAiThinking(false);
      setAiInput('');
    }, 800);
  };

  const logColor = (type) => {
    switch(type) {
      case 'cmd':     return 'var(--os-accent)';
      case 'success': return '#4ADE80';
      case 'link':    return '#06B6D4';
      case 'muted':   return tokens.colors.textTertiary;
      default:        return tokens.colors.textSecondary;
    }
  };

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
        padding: '6px 12px',
        borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
        gap: '8px',
        flexShrink: 0,
        backgroundColor: tokens.colors.bgCanvas,
      }}>
        <span style={{
          fontSize: '10px',
          color: tokens.colors.textTertiary,
          letterSpacing: '0.1em',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span>// CODE EDITOR · {savedFilename || 'playground'}</span>
          <span style={{
            opacity: autoSaved ? 0.5 : 0,
            transition: 'opacity 0.3s',
            fontStyle: 'italic'
          }}>
            // auto-saved
          </span>
        </span>
        <button
          onClick={handleSave}
          style={{
            padding: '4px 10px',
            backgroundColor: 'transparent',
            border: `1px solid ${tokens.colors.borderSubtle}`,
            borderRadius: '2px',
            color: tokens.colors.textTertiary,
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          SAVE
        </button>
        <button
          onClick={() => setShowConsole(s => !s)}
          style={{
            padding: '4px 10px',
            backgroundColor: 'transparent',
            border: `1px solid ${tokens.colors.borderSubtle}`,
            borderRadius: '2px',
            color: tokens.colors.textTertiary,
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          CONSOLE
        </button>
        <button
          onClick={handleRun}
          style={{
            padding: '4px 16px',
            backgroundColor: 'var(--os-accent)',
            border: 'none',
            borderRadius: '2px',
            color: tokens.colors.bgCanvas,
            fontFamily: tokens.typography.fontMono,
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.06em',
          }}
        >
          RUN ▶
        </button>
        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          style={{
            padding: '4px 16px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(74,222,128,0.3)',
            borderRadius: '2px',
            color: '#4ADE80',
            fontFamily: tokens.typography.fontMono,
            fontSize: '11px',
            fontWeight: 700,
            cursor: isDeploying ? 'default' : 'pointer',
            letterSpacing: '0.06em',
            opacity: isDeploying ? 0.5 : 1,
          }}
        >
          {isDeploying ? 'DEPLOYING...' : deployedUrl ? 'DEPLOYED ✓' : 'DEPLOY'}
        </button>
      </div>

      {/* MAIN AREA */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>

        {/* LEFT — AI Panel */}
        <div style={{
          width: '200px',
          flexShrink: 0,
          borderRight: `1px solid ${tokens.colors.borderSubtle}`,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: tokens.colors.bgSurface,
        }}>
          <div style={{
            padding: '12px',
            borderBottom: `1px solid ${tokens.colors.borderFaint}`,
            fontSize: '10px',
            color: tokens.colors.textTertiary,
            letterSpacing: '0.1em',
          }}>
            // AI TEMPLATES
          </div>

          {/* Prompt input */}
          <div style={{ padding: '12px', borderBottom: `1px solid ${tokens.colors.borderFaint}` }}>
            <input
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAiSubmit()}
              placeholder="describe your app..."
              style={{
                width: '100%',
                backgroundColor: tokens.colors.bgSunken,
                border: `1px solid ${tokens.colors.borderSubtle}`,
                borderRadius: '2px',
                padding: '8px',
                color: tokens.colors.textPrimary,
                fontFamily: tokens.typography.fontMono,
                fontSize: '11px',
                outline: 'none',
                marginBottom: '8px',
              }}
            />
            <button
              onClick={handleAiSubmit}
              disabled={aiThinking}
              style={{
                width: '100%',
                padding: '7px',
                backgroundColor: aiThinking ? tokens.colors.accentMuted : 'var(--os-accent)',
                border: 'none',
                borderRadius: '2px',
                color: aiThinking ? 'var(--os-accent)' : tokens.colors.bgCanvas,
                fontFamily: tokens.typography.fontMono,
                fontSize: '10px',
                fontWeight: 700,
                cursor: aiThinking ? 'default' : 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              {aiThinking ? 'LOADING...' : 'GENERATE ✦'}
            </button>
            {aiMessage && (
              <div style={{
                marginTop: '8px',
                fontSize: '10px',
                color: aiMessage.startsWith('✓') ? '#4ADE80' : tokens.colors.textTertiary,
                lineHeight: 1.4,
              }}>
                {aiMessage}
              </div>
            )}
          </div>

          {/* Template chips */}
          <div style={{
            padding: '12px',
            flex: 1,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            <div style={{
              fontSize: '10px',
              color: tokens.colors.textTertiary,
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}>
              QUICK LOAD
            </div>
            {Object.entries(TEMPLATES).map(([key, tmpl]) => (
              <div
                key={key}
                onClick={() => {
                  setCode(tmpl.html);
                  setAiMessage(`✓ Loaded: ${tmpl.name}`);
                }}
                style={{
                  padding: '8px 10px',
                  marginBottom: '6px',
                  backgroundColor: tokens.colors.bgElevated,
                  border: `1px solid ${tokens.colors.borderSubtle}`,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: tokens.colors.textSecondary,
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = tokens.colors.accentBorder;
                  e.currentTarget.style.color = 'var(--os-accent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = tokens.colors.borderSubtle;
                  e.currentTarget.style.color = tokens.colors.textSecondary;
                }}
              >
                {tmpl.name}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — Code Editor */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRight: `1px solid ${tokens.colors.borderSubtle}`,
          minWidth: 0,
        }}>
          <div style={{
            padding: '6px 12px',
            borderBottom: `1px solid ${tokens.colors.borderFaint}`,
            fontSize: '10px',
            color: tokens.colors.textTertiary,
            letterSpacing: '0.08em',
            backgroundColor: tokens.colors.bgCanvas,
            flexShrink: 0,
          }}>
            index.html
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              backgroundColor: tokens.colors.bgSurface,
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: '16px',
              color: tokens.colors.textSecondary,
              fontFamily: tokens.typography.fontMono,
              fontSize: '12px',
              lineHeight: '1.7',
              scrollbarWidth: 'none',
              tabSize: 2,
            }}
          />
        </div>

        {/* RIGHT — Preview */}
        <div style={{
          width: '40%',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}>
          <div style={{
            padding: '6px 12px',
            borderBottom: `1px solid ${tokens.colors.borderFaint}`,
            fontSize: '10px',
            color: tokens.colors.textTertiary,
            letterSpacing: '0.08em',
            backgroundColor: tokens.colors.bgCanvas,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>PREVIEW</span>
            {preview && (
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#4ADE80',
                display: 'inline-block',
              }} />
            )}
          </div>
          {deployedUrl ? (
            <div style={{
              flex: 1,
              backgroundColor: tokens.colors.bgCanvas,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  width: '56px',
                  height: '56px',
                  border: '1px solid rgba(74,222,128,0.3)',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(74,222,128,0.08)',
                  color: '#4ADE80',
                  fontSize: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✓
              </motion.div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#4ADE80', letterSpacing: '0.15em' }}>
                  DEPLOYED
                </div>
                <div style={{ fontSize: '11px', color: tokens.colors.textTertiary }}>
                  Preview opens in a new tab
                </div>
              </div>
              
              <button
                onClick={() => window.open(deployedUrl, '_blank')}
                style={{
                  padding: '6px 20px',
                  backgroundColor: 'var(--os-accent)',
                  border: 'none',
                  borderRadius: '2px',
                  color: tokens.colors.bgCanvas,
                  fontFamily: tokens.typography.fontMono,
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  marginTop: '8px'
                }}
              >
                OPEN PREVIEW ↗
              </button>
              
              <div
                onClick={() => setDeployedUrl('')}
                style={{
                  fontSize: '10px',
                  color: tokens.colors.textTertiary,
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
                onMouseEnter={e => e.target.style.color = tokens.colors.textSecondary}
                onMouseLeave={e => e.target.style.color = tokens.colors.textTertiary}
              >
                ← back to preview
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '24px' }}>
                <div style={{ fontSize: '10px', color: tokens.colors.textTertiary }}>
                  // blob URL — expires when tab closes
                </div>
                <div style={{ fontSize: '10px', color: tokens.colors.borderSubtle }}>
                  // upgrade path: live URL routing after hosting
                </div>
              </div>
            </div>
          ) : preview ? (
            <iframe
              ref={iframeRef}
              srcDoc={preview}
              style={{
                flex: 1,
                border: 'none',
                backgroundColor: '#0C0A08',
              }}
              sandbox="allow-scripts"
              title="preview"
            />
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '8px',
              color: tokens.colors.textTertiary,
              fontSize: '11px',
            }}>
              <span style={{ fontSize: '24px', opacity: 0.3 }}>▶</span>
              <span>Click RUN to preview</span>
            </div>
          )}
        </div>
      </div>

      {/* CONSOLE */}
      {showConsole && (
        <div style={{
          height: '140px',
          borderTop: `1px solid ${tokens.colors.borderSubtle}`,
          backgroundColor: tokens.colors.bgCanvas,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          <div style={{
            padding: '4px 12px',
            borderBottom: `1px solid ${tokens.colors.borderFaint}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: '10px',
              color: tokens.colors.textTertiary,
              letterSpacing: '0.08em',
            }}>
              CONSOLE
            </span>
            <span
              onClick={() => setConsoleLogs([])}
              style={{
                fontSize: '10px',
                color: tokens.colors.textTertiary,
                cursor: 'pointer',
              }}
            >
              CLEAR
            </span>
          </div>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px 12px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            {consoleLogs.map((log, i) => (
              <div key={i} style={{
                fontSize: '11px',
                fontFamily: tokens.typography.fontMono,
                color: logColor(log.type),
                lineHeight: '1.7',
                whiteSpace: 'pre',
              }}>
                {log.msg || ' '}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
