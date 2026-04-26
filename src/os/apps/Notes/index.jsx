import React, { useState, useEffect, useRef } from 'react';
import { tokens } from '../../styles/tokens';

const getStorageKey = (slot) => `smit-os-notes-${slot}`;
const NOTES_KEY = 'smit-os-notes-files';

export default function Notes({ intentData }) {
  const [slot, setSlot] = useState(1);
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const saveTimerRef = useRef(null);
  const textareaRef = useRef(null);
  const cursorMap = useRef({});

  // Load from localStorage on mount & slot change
  useEffect(() => {
    const savedData = localStorage.getItem(getStorageKey(slot));
    if (savedData) {
      setContent(savedData);
      updateWordCount(savedData);
    } else {
      setContent('');
      setWordCount(0);
    }
    // Focus textarea and restore cursor
    if (textareaRef.current) {
      textareaRef.current.focus();
      setTimeout(() => {
        if (textareaRef.current) {
          const pos = cursorMap.current[slot] || 0;
          textareaRef.current.setSelectionRange(pos, pos);
        }
      }, 0);
    }
  }, [slot]);

  // Slot switch feedback
  useEffect(() => {
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 200);
    return () => clearTimeout(t);
  }, [slot]);

  // Handle Intent Data (Prefill)
  useEffect(() => {
    if (intentData?.prefill) {
      setContent(intentData.prefill);
      updateWordCount(intentData.prefill);
      localStorage.setItem(getStorageKey(slot), intentData.prefill);
    }
  }, [intentData, slot]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        localStorage.setItem(getStorageKey(slot), content);
        setSaved(true);
      }

      if (e.altKey && e.key === 'l') {
        e.preventDefault();
        setContent('');
        setWordCount(0);
        localStorage.removeItem(getStorageKey(slot));
      }

      if (e.altKey && e.key === '1') {
        if (textareaRef.current) {
          cursorMap.current[slot] = textareaRef.current.selectionStart;
        }
        setSlot(1);
      }
      if (e.altKey && e.key === '2') {
        if (textareaRef.current) {
          cursorMap.current[slot] = textareaRef.current.selectionStart;
        }
        setSlot(2);
      }
      if (e.altKey && e.key === '3') {
        if (textareaRef.current) {
          cursorMap.current[slot] = textareaRef.current.selectionStart;
        }
        setSlot(3);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [content, slot]);

  const updateWordCount = (text) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  };

  const handleChange = (e) => {
    let val = e.target.value;

    // Check last typed word for slash commands
    const lines = val.split('\n');
    const lastLine = lines[lines.length - 1];
    const trimmed = lastLine.trim();

    if (trimmed === '/date') {
      lines[lines.length - 1] = new Date().toLocaleString();
      val = lines.join('\n');
    } else if (trimmed === '/todo') {
      lines[lines.length - 1] = '[ ] Task 1\n[ ] Task 2\n[ ] Task 3';
      val = lines.join('\n');

      // Move cursor to first task line
      setTimeout(() => {
        if (textareaRef.current) {
          const pos = val.length - 30; // approximate start of tasks
          textareaRef.current.setSelectionRange(pos, pos);
        }
      }, 0);
    } else if (trimmed === '/clear') {
      val = '';
    }

    setContent(val);
    setSaved(false);
    updateWordCount(val);

    // Autosave after 800ms of no typing
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(getStorageKey(slot), val);
      setSaved(true);
    }, 800);
  };

  const handleClear = () => {
    if (content.length === 0) return;
    if (window.confirm('Clear all notes?')) {
      setContent('');
      setWordCount(0);
      setSaved(true);
      localStorage.removeItem(getStorageKey(slot));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const saveNoteToSystem = () => {
    const name = prompt('Save note as:');
    if (!name) return;

    const notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    notes[name] = content;

    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    alert('Saved to Files'); // Optional nice UX
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: tokens.colors.bgSurface,
    }}>

      {/* TOOLBAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        borderBottom: `1px solid ${tokens.colors.borderFaint}`,
        gap: '12px',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '10px',
          fontFamily: tokens.typography.fontMono,
          color: tokens.colors.textTertiary,
          letterSpacing: '0.1em',
          flex: 1,
        }}>
          // NOTE-{slot}
        </span>

        <span style={{
          fontSize: '10px',
          fontFamily: tokens.typography.fontMono,
          color: saved ? tokens.colors.textTertiary : 'var(--os-accent)',
          letterSpacing: '0.05em',
          transition: 'color 0.3s',
        }}>
          {saved ? '● saved' : '○ saving...'}
        </span>

        <span style={{
          fontSize: '10px',
          fontFamily: tokens.typography.fontMono,
          color: tokens.colors.textTertiary,
        }}>
          {wordCount} words
        </span>

        <button
          onClick={handleCopy}
          style={{
            backgroundColor: 'transparent',
            border: `1px solid ${tokens.colors.borderSubtle}`,
            borderRadius: '2px',
            color: tokens.colors.textTertiary,
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            padding: '3px 8px',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--os-accent)'}
          onMouseLeave={e => e.target.style.color = tokens.colors.textTertiary}
        >
          COPY
        </button>

        <button
          onClick={saveNoteToSystem}
          style={{
            backgroundColor: tokens.colors.accentMuted,
            border: `1px solid ${tokens.colors.accentBorder}`,
            borderRadius: '2px',
            color: 'var(--os-accent)',
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            padding: '3px 8px',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          SAVE NOTE ↓
        </button>

        <button
          onClick={handleClear}
          style={{
            backgroundColor: 'transparent',
            border: `1px solid rgba(248,113,113,0.2)`,
            borderRadius: '2px',
            color: '#F87171',
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            padding: '3px 8px',
            cursor: 'pointer',
            letterSpacing: '0.05em',
            opacity: content.length === 0 ? 0.3 : 1,
          }}
        >
          CLEAR
        </button>
      </div>

      {/* TEXTAREA */}
      <style>{`.notes-textarea::placeholder { color: #3C3A38; }`}</style>
      <textarea
        ref={textareaRef}
        className="notes-textarea"
        value={content}
        onChange={handleChange}
        placeholder={`// your notes live here\n// they persist across sessions\n// start typing...`}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '20px',
          color: tokens.colors.textPrimary,
          fontFamily: tokens.typography.fontMono,
          fontSize: '13px',
          lineHeight: '1.8',
          scrollbarWidth: 'none',
        }}
      />

      {/* FOOTER */}
      <div style={{
        padding: '6px 16px',
        borderTop: `1px solid ${tokens.colors.borderFaint}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '10px',
          fontFamily: tokens.typography.fontMono,
          color: tokens.colors.textDisabled,
          letterSpacing: '0.05em',
        }}>
          autosaves locally · your notes, your data · [alt+1/2/3] to switch slots
        </span>
      </div>
    </div>
  );
}
