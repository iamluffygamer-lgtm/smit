import React, { useRef, useState, useEffect } from 'react';
import { tokens } from '../../styles/tokens';

const COLORS = [
  '#F0EDE8', '#E8A020', '#F87171',
  '#4ADE80', '#06B6D4', '#8B5CF6',
  '#F472B6', '#FBBF24', '#0C0A08',
];

export default function Paint({ intentData }) {
  const canvasRef = useRef(null);
  const historyRef = useRef([]);
  const redoRef = useRef([]);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#F0EDE8');
  const [size, setSize] = useState(3);
  const [lastPos, setLastPos] = useState(null);
  const [cursorPos, setCursorPos] = useState(null);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL();
    historyRef.current.push(dataURL);
    if (historyRef.current.length > 20) {
      historyRef.current.shift();
    }
    redoRef.current = [];
    localStorage.setItem('paint-autosave', dataURL);
  };

  const undo = () => {
    if (historyRef.current.length <= 1) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const current = historyRef.current.pop();
    redoRef.current.push(current);

    const prev = historyRef.current[historyRef.current.length - 1];

    const img = new Image();
    img.src = prev;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      localStorage.setItem('paint-autosave', prev);
    };
  };

  const redo = () => {
    if (redoRef.current.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const next = redoRef.current.pop();
    historyRef.current.push(next);

    const img = new Image();
    img.src = next;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      localStorage.setItem('paint-autosave', next);
    };
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'Z' || e.key === 'z')) {
        e.preventDefault();
        redo();
      }
      
      if (e.target.tagName !== 'INPUT') {
        if (e.key === 'b') setTool('pen');
        if (e.key === 'e') setTool('eraser');
        if (e.key === 'f') setTool('fill');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Initial Load
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Load from Intent
    if (intentData && intentData.image) {
      const img = new Image();
      img.src = intentData.image;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        historyRef.current = [intentData.image];
        localStorage.setItem('paint-autosave', intentData.image);
      };
      return;
    }

    const saved = localStorage.getItem('paint-autosave');

    if (saved) {
      const img = new Image();
      img.src = saved;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        historyRef.current = [saved];
      };
    } else {
      ctx.fillStyle = '#0C0A08';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      historyRef.current.push(canvas.toDataURL());
    }
  }, [intentData]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
      domX: clientX - rect.left,
      domY: clientY - rect.top,
      scaleX
    };
  };

  const startDrawing = (e) => {
    if (e.touches) e.preventDefault(); // prevents pull-to-refresh on mobile

    const canvas = canvasRef.current;
    
    if (tool === 'fill') {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
      return;
    }

    const pos = getPos(e, canvas);
    setIsDrawing(true);
    setLastPos(pos);
    setCursorPos({ x: pos.domX, y: pos.domY, scale: pos.scaleX });

    // Draw a dot on click
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, tool === 'eraser' ? size * 2 : size / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? '#0C0A08' : color;
    ctx.fill();
  };

  const draw = (e) => {
    if (e.touches) e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = getPos(e, canvas);
    setCursorPos({ x: pos.domX, y: pos.domY, scale: pos.scaleX });

    if (!isDrawing || !lastPos) return;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#0C0A08' : color;
    ctx.lineWidth = tool === 'eraser' ? size * 4 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    setLastPos(pos);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPos(null);
      saveState();
    }
  };

  const handleMouseLeave = () => {
    setCursorPos(null);
    stopDrawing();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0C0A08';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const saveToSystem = () => {
    const name = prompt('Save as:');
    if (!name) return;

    const files = JSON.parse(localStorage.getItem('smit-os-paint-files') || '{}');

    if (files[name]) {
      const confirmOverwrite = window.confirm('File exists. Overwrite?');
      if (!confirmOverwrite) return;
    }

    const canvas = canvasRef.current;
    files[name] = canvas.toDataURL();

    localStorage.setItem('smit-os-paint-files', JSON.stringify(files));
    alert('Saved to Files');
  };

  const TOOLS = [
    { id: 'pen',    label: '✏' },
    { id: 'eraser', label: '◻' },
    { id: 'fill',   label: '▧' },
  ];

  const SIZES = [2, 4, 8, 16];

  // Calculate visual brush size based on scale to match canvas output
  const visualRadius = cursorPos ? (tool === 'eraser' ? size * 2 : size / 2) / cursorPos.scale : 0;

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
        gap: '12px',
        padding: '8px 12px',
        borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>

        {/* Tools */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {TOOLS.map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              style={{
                width: '28px', height: '28px',
                backgroundColor: tool === t.id
                  ? tokens.colors.accentMuted
                  : 'transparent',
                border: `1px solid ${tool === t.id
                  ? tokens.colors.accentBorder
                  : tokens.colors.borderSubtle}`,
                borderRadius: '2px',
                color: tool === t.id
                  ? 'var(--os-accent)'
                  : tokens.colors.textSecondary,
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '20px',
          backgroundColor: tokens.colors.borderSubtle,
        }} />

        {/* Colors */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {COLORS.map(c => (
            <div
              key={c}
              onClick={() => { setColor(c); setTool(tool === 'eraser' ? 'pen' : tool); }}
              style={{
                width: '18px', height: '18px',
                backgroundColor: c,
                borderRadius: '2px',
                cursor: 'pointer',
                border: color === c && tool !== 'eraser'
                  ? '2px solid #F0EDE8'
                  : '2px solid transparent',
                boxSizing: 'border-box',
              }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={e => { setColor(e.target.value); setTool(tool === 'eraser' ? 'pen' : tool); }}
            style={{
              width: '18px', height: '18px',
              padding: 0, border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '2px',
            }}
            title="Custom color"
          />
        </div>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '20px',
          backgroundColor: tokens.colors.borderSubtle,
        }} />

        {/* Brush sizes */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {SIZES.map(s => (
            <div
              key={s}
              onClick={() => setSize(s)}
              style={{
                width: '28px', height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '2px',
                border: `1px solid ${size === s
                  ? tokens.colors.accentBorder
                  : tokens.colors.borderSubtle}`,
                backgroundColor: size === s
                  ? tokens.colors.accentMuted
                  : 'transparent',
              }}
            >
              <div style={{
                width: s < 8 ? s + 2 : s,
                height: s < 8 ? s + 2 : s,
                borderRadius: '50%',
                backgroundColor: size === s
                  ? 'var(--os-accent)'
                  : tokens.colors.textTertiary,
              }} />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          <button
            onClick={clearCanvas}
            style={{
              padding: '4px 10px',
              backgroundColor: 'transparent',
              border: `1px solid rgba(248,113,113,0.3)`,
              borderRadius: '2px',
              color: '#F87171',
              fontFamily: tokens.typography.fontMono,
              fontSize: '10px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            CLEAR
          </button>
          <button
            onClick={saveToSystem}
            style={{
              padding: '4px 10px',
              backgroundColor: tokens.colors.accentMuted,
              border: `1px solid ${tokens.colors.accentBorder}`,
              borderRadius: '2px',
              color: 'var(--os-accent)',
              fontFamily: tokens.typography.fontMono,
              fontSize: '10px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            SAVE ↓
          </button>
        </div>
      </div>

      {/* CANVAS */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {cursorPos && tool !== 'fill' && (
          <div style={{
            position: 'absolute',
            left: cursorPos.x - visualRadius,
            top: cursorPos.y - visualRadius,
            width: visualRadius * 2,
            height: visualRadius * 2,
            borderRadius: '50%',
            border: `1px solid ${tool === 'eraser' ? tokens.colors.textSecondary : 'var(--os-accent)'}`,
            pointerEvents: 'none',
            opacity: 0.6,
          }} />
        )}
        <canvas
          ref={canvasRef}
          width={1200}
          height={900}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={handleMouseLeave}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            cursor: 'none',
            touchAction: 'none',
          }}
        />
      </div>
    </div>
  );
}
