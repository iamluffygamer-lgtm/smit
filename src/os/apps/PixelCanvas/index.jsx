import React, { useState, useEffect, useRef, useCallback } from 'react';
import { tokens } from '../../styles/tokens';

const PALETTE = [
  '#0C0A08', '#141210', '#F5F2EE', '#E8A020',
  '#F87171', '#4ADE80', '#06B6D4', '#8B5CF6',
  '#F472B6', '#FBBF24', '#FB923C', '#34D399',
  '#60A5FA', '#A78BFA', '#F43F5E', '#000000',
];

export default function PixelCanvas() {
  const [gridSize, setGridSize] = useState(16);
  const [pixels, setPixels] = useState(() => Array(16 * 16).fill('#0C0A08'));
  const [color, setColor] = useState('#F5F2EE');
  const [tool, setTool] = useState('DRAW'); // DRAW, ERASE, FILL, EYEDROPPER
  const [history, setHistory] = useState([]);
  
  const isMouseDown = useRef(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('smit-os-pixel-canvas');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.gridSize && data.pixels) {
          setGridSize(data.gridSize);
          setPixels(data.pixels);
        }
      } catch (e) {}
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('smit-os-pixel-canvas', JSON.stringify({ gridSize, pixels }));
  }, [pixels, gridSize]);

  // Global mouse up
  useEffect(() => {
    const handleMouseUp = () => {
      isMouseDown.current = false;
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const saveToHistory = useCallback(() => {
    setHistory(prev => {
      const newHistory = [...prev, pixels].slice(-10); // Keep last 10
      return newHistory;
    });
  }, [pixels]);

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setPixels(previous);
  };

  const clearCanvas = () => {
    saveToHistory();
    setPixels(Array(gridSize * gridSize).fill('#0C0A08'));
  };

  const changeGridSize = (newSize) => {
    if (newSize === gridSize) return;
    saveToHistory();
    setGridSize(newSize);
    setPixels(Array(newSize * newSize).fill('#0C0A08'));
  };

  const floodFill = (currentPixels, index, targetColor, fillColor) => {
    if (targetColor === fillColor) return currentPixels;
    const newPixels = [...currentPixels];
    const stack = [index];
    while (stack.length) {
      const i = stack.pop();
      if (newPixels[i] !== targetColor) continue;
      newPixels[i] = fillColor;
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      if (row > 0) stack.push(i - gridSize);
      if (row < gridSize - 1) stack.push(i + gridSize);
      if (col > 0) stack.push(i - 1);
      if (col < gridSize - 1) stack.push(i + 1);
    }
    return newPixels;
  };

  const applyTool = (i, isDownEvent = false) => {
    if (tool === 'EYEDROPPER') {
      if (isDownEvent) setColor(pixels[i]);
      return;
    }

    if (tool === 'FILL') {
      if (isDownEvent) {
        saveToHistory();
        setPixels(floodFill(pixels, i, pixels[i], color));
      }
      return;
    }

    // DRAW or ERASE
    const newColor = tool === 'ERASE' ? '#0C0A08' : color;
    if (pixels[i] !== newColor) {
      setPixels(prev => {
        const next = [...prev];
        next[i] = newColor;
        return next;
      });
    }
  };

  const handlePixelDown = (i) => {
    isMouseDown.current = true;
    if (tool === 'DRAW' || tool === 'ERASE') saveToHistory();
    applyTool(i, true);
  };

  const handlePixelEnter = (i) => {
    if (isMouseDown.current) {
      applyTool(i, false);
    }
  };

  const exportPNG = () => {
    const canvas = document.createElement('canvas');
    const scale = gridSize === 16 ? 16 : 8; // scaled up nicely
    canvas.width = gridSize * scale;
    canvas.height = gridSize * scale;
    const ctx = canvas.getContext('2d');
    
    pixels.forEach((pxColor, i) => {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      ctx.fillStyle = pxColor;
      ctx.fillRect(col * scale, row * scale, scale, scale);
    });
    
    const link = document.createElement('a');
    link.download = `smit-os-pixelart-${gridSize}x${gridSize}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // UI styles
  const btnStyle = (isActive) => ({
    flex: 1,
    padding: '8px',
    backgroundColor: isActive ? tokens.colors.accentMuted : tokens.colors.bgSunken,
    border: `1px solid ${isActive ? 'var(--os-accent)' : tokens.colors.borderSubtle}`,
    color: isActive ? 'var(--os-accent)' : tokens.colors.textSecondary,
    fontFamily: tokens.typography.fontMono,
    fontSize: '10px',
    cursor: 'pointer',
    textAlign: 'center',
  });

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      backgroundColor: tokens.colors.bgSurface,
      fontFamily: tokens.typography.fontSans,
    }}>
      {/* LEFT: CANVAS AREA */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.colors.bgElevated,
        padding: '24px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '512px',
          aspectRatio: '1',
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          border: `1px solid ${tokens.colors.borderSubtle}`,
          boxShadow: tokens.shadowLg,
          cursor: tool === 'EYEDROPPER' ? 'crosshair' : 'default',
          userSelect: 'none',
          backgroundColor: '#0C0A08',
        }}>
          {pixels.map((pxColor, i) => (
            <div
              key={i}
              style={{
                backgroundColor: pxColor,
                border: '0.5px solid rgba(240,237,232,0.04)',
                boxSizing: 'border-box',
              }}
              onMouseDown={() => handlePixelDown(i)}
              onMouseEnter={() => handlePixelEnter(i)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: SIDEBAR */}
      <div style={{
        width: '220px',
        borderLeft: `1px solid ${tokens.colors.borderSubtle}`,
        backgroundColor: tokens.colors.bgCanvas,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        gap: '24px',
        flexShrink: 0,
        overflowY: 'auto'
      }}>
        
        {/* GRID SIZE */}
        <div>
          <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.colors.textTertiary, letterSpacing: '0.1em', marginBottom: '8px' }}>
            // GRID SIZE
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={btnStyle(gridSize === 16)} onClick={() => changeGridSize(16)}>16×16</button>
            <button style={btnStyle(gridSize === 32)} onClick={() => changeGridSize(32)}>32×32</button>
          </div>
        </div>

        {/* TOOLS */}
        <div>
          <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.colors.textTertiary, letterSpacing: '0.1em', marginBottom: '8px' }}>
            // TOOLS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button style={btnStyle(tool === 'DRAW')} onClick={() => setTool('DRAW')}>DRAW</button>
            <button style={btnStyle(tool === 'ERASE')} onClick={() => setTool('ERASE')}>ERASE</button>
            <button style={btnStyle(tool === 'FILL')} onClick={() => setTool('FILL')}>FILL</button>
            <button style={btnStyle(tool === 'EYEDROPPER')} onClick={() => setTool('EYEDROPPER')}>PICKER</button>
          </div>
        </div>

        {/* PALETTE */}
        <div>
          <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.colors.textTertiary, letterSpacing: '0.1em', marginBottom: '8px' }}>
            // PALETTE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: color,
              border: `2px solid ${tokens.colors.borderDefault}`,
              borderRadius: '2px',
            }} />
            <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '12px', color: tokens.colors.textPrimary }}>
              {color.toUpperCase()}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
            {PALETTE.map(c => (
              <div
                key={c}
                onClick={() => { setColor(c); if(tool === 'EYEDROPPER') setTool('DRAW'); }}
                style={{
                  aspectRatio: '1',
                  backgroundColor: c,
                  border: color === c ? '2px solid var(--os-accent)' : `1px solid ${tokens.colors.borderSubtle}`,
                  cursor: 'pointer',
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={undo}
              disabled={history.length === 0}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: tokens.colors.bgSunken,
                border: `1px solid ${tokens.colors.borderSubtle}`,
                color: history.length === 0 ? tokens.colors.textTertiary : tokens.colors.textSecondary,
                fontFamily: tokens.typography.fontMono,
                fontSize: '11px',
                cursor: history.length === 0 ? 'default' : 'pointer',
              }}
            >
              UNDO
            </button>
            <button
              onClick={clearCanvas}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: tokens.colors.bgSunken,
                border: `1px solid ${tokens.colors.borderSubtle}`,
                color: tokens.colors.textSecondary,
                fontFamily: tokens.typography.fontMono,
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              CLEAR
            </button>
          </div>
          <button
            onClick={exportPNG}
            style={{
              padding: '12px',
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
            EXPORT PNG
          </button>
        </div>

      </div>
    </div>
  );
}
