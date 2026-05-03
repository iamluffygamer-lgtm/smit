import React, { useState, useEffect, useRef } from 'react';
import { tokens } from '../../styles/tokens';

const PRESETS = [
  { name: 'Amber Burn', type: 'linear', angle: 135, stops: [{c:'#E8A020',p:0},{c:'#F43F5E',p:100}] },
  { name: 'Ocean Dark', type: 'linear', angle: 135, stops: [{c:'#0C0A08',p:0},{c:'#06B6D4',p:100}] },
  { name: 'Neon Night', type: 'linear', angle: 135, stops: [{c:'#141210',p:0},{c:'#8B5CF6',p:100}] },
  { name: 'Gold Rush', type: 'linear', angle: 135, stops: [{c:'#F0B030',p:0},{c:'#E8A020',p:50},{c:'#C8800A',p:100}] },
  { name: 'Void', type: 'linear', angle: 135, stops: [{c:'#0C0A08',p:0},{c:'#141210',p:100}] },
  { name: 'Aurora', type: 'linear', angle: 135, stops: [{c:'#4ADE80',p:0},{c:'#06B6D4',p:50},{c:'#8B5CF6',p:100}] },
  { name: 'Sunset', type: 'linear', angle: 135, stops: [{c:'#F87171',p:0},{c:'#E8A020',p:50},{c:'#FBBF24',p:100}] },
  { name: 'Matrix', type: 'linear', angle: 135, stops: [{c:'#0C0A08',p:0},{c:'#4ADE80',p:100}] },
];

export default function CssGradient() {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(135);
  const [radialShape, setRadialShape] = useState('circle');
  const [radialPosition, setRadialPosition] = useState('center');
  const [stops, setStops] = useState([
    { id: '1', color: '#E8A020', position: 0 },
    { id: '2', color: '#141210', position: 100 }
  ]);
  const [activeStop, setActiveStop] = useState('1');
  const [copied, setCopied] = useState('');

  const stripRef = useRef(null);
  const isDraggingStop = useRef(null);

  const getGradientString = () => {
    const sortedStops = [...stops].sort((a,b) => a.position - b.position);
    const stopStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');

    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${stopStr})`;
    } else if (type === 'radial') {
      return `radial-gradient(${radialShape} at ${radialPosition}, ${stopStr})`;
    } else if (type === 'conic') {
      return `conic-gradient(from ${angle}deg at ${radialPosition}, ${stopStr})`;
    }
    return '';
  };

  const getWebkitGradientString = () => {
    const sortedStops = [...stops].sort((a,b) => a.position - b.position);
    const stopStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');

    if (type === 'linear') {
      return `-webkit-linear-gradient(${angle}deg, ${stopStr})`;
    } else if (type === 'radial') {
      return `-webkit-radial-gradient(${radialPosition}, ${radialShape}, ${stopStr})`;
    } else if (type === 'conic') {
      return ''; // Conic doesn't have a simple webkit equivalent in old syntax, standard is used
    }
    return '';
  };

  const cssVal = getGradientString();
  const webkitVal = getWebkitGradientString();

  const stripGradient = `linear-gradient(90deg, ${[...stops].sort((a,b)=>a.position-b.position).map(s => `${s.color} ${s.position}%`).join(', ')})`;

  // Interactions
  const handleStripClick = (e) => {
    if (!stripRef.current) return;
    const rect = stripRef.current.getBoundingClientRect();
    let pos = ((e.clientX - rect.left) / rect.width) * 100;
    pos = Math.max(0, Math.min(100, Math.round(pos)));
    
    const newId = Date.now().toString();
    setStops(prev => [...prev, { id: newId, color: '#FFFFFF', position: pos }]);
    setActiveStop(newId);
  };

  const handleStopPointerDown = (e, id) => {
    e.stopPropagation();
    setActiveStop(id);
    if (!stripRef.current) return;
    isDraggingStop.current = { id, rect: stripRef.current.getBoundingClientRect() };
    document.addEventListener('pointermove', handleStopPointerMove);
    document.addEventListener('pointerup', handleStopPointerUp);
  };

  const handleStopPointerMove = (e) => {
    if (!isDraggingStop.current) return;
    const { id, rect } = isDraggingStop.current;
    let pos = ((e.clientX - rect.left) / rect.width) * 100;
    pos = Math.max(0, Math.min(100, Math.round(pos)));
    
    setStops(prev => prev.map(s => s.id === id ? { ...s, position: pos } : s));
  };

  const handleStopPointerUp = () => {
    isDraggingStop.current = null;
    document.removeEventListener('pointermove', handleStopPointerMove);
    document.removeEventListener('pointerup', handleStopPointerUp);
  };

  const removeStop = (id) => {
    if (stops.length <= 2) return;
    setStops(prev => prev.filter(s => s.id !== id));
    if (activeStop === id) setActiveStop(stops.find(s => s.id !== id)?.id);
  };

  const handleStopDoubleClick = (e, id) => {
    e.stopPropagation();
    removeStop(id);
  };

  const updateStopColor = (id, color) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, color } : s));
  };

  const updateStopPosition = (id, position) => {
    let pos = parseInt(position, 10);
    if (isNaN(pos)) return;
    pos = Math.max(0, Math.min(100, pos));
    setStops(prev => prev.map(s => s.id === id ? { ...s, position: pos } : s));
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 1500);
  };

  const loadPreset = (preset) => {
    setType(preset.type);
    if (preset.angle !== undefined) setAngle(preset.angle);
    setStops(preset.stops.map((s, i) => ({
      id: i.toString(),
      color: s.c,
      position: s.p
    })));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: tokens.colors.bgSurface, fontFamily: tokens.typography.fontMono, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      
      {/* HEADER & PREVIEW */}
      <div style={{ flexShrink: 0, borderBottom: `1px solid ${tokens.colors.borderSubtle}` }}>
        <div style={{ padding: '12px 16px', fontSize: '10px', color: tokens.colors.textTertiary, letterSpacing: '0.1em', backgroundColor: tokens.colors.bgCanvas, borderBottom: `1px solid ${tokens.colors.borderFaint}` }}>
          // CSS GRADIENT
        </div>
        <div style={{ height: '160px', width: '100%', background: cssVal }} />
      </div>

      {/* CONTROLS */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flexShrink: 0 }}>
        
        {/* TYPE TABS */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['linear', 'radial', 'conic'].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                padding: '8px 16px',
                backgroundColor: type === t ? tokens.colors.bgElevated : 'transparent',
                border: `1px solid ${type === t ? 'var(--os-accent)' : tokens.colors.borderSubtle}`,
                color: type === t ? 'var(--os-accent)' : tokens.colors.textSecondary,
                fontSize: '11px',
                fontFamily: tokens.typography.fontMono,
                cursor: 'pointer',
                borderRadius: '2px',
                textTransform: 'uppercase'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* OPTIONS PER TYPE */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {type === 'linear' && (
            <>
              <div style={{ fontSize: '11px', color: tokens.colors.textTertiary }}>ANGLE:</div>
              <input
                type="number"
                value={angle}
                onChange={e => setAngle(e.target.value)}
                style={{ width: '60px', padding: '6px', backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, fontFamily: tokens.typography.fontMono, fontSize: '12px', outline: 'none' }}
              />
              <div style={{ fontSize: '12px', color: tokens.colors.textTertiary }}>deg</div>
              <div style={{ width: '1px', height: '16px', backgroundColor: tokens.colors.borderSubtle, margin: '0 8px' }} />
              <div style={{ display: 'flex', gap: '4px' }}>
                {[{l:'→',v:90}, {l:'↓',v:180}, {l:'↗',v:45}, {l:'↘',v:135}].map(p => (
                  <button key={p.v} onClick={() => setAngle(p.v)} style={{ padding: '4px 8px', backgroundColor: 'transparent', border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textSecondary, cursor: 'pointer', fontSize: '14px' }}>{p.l}</button>
                ))}
              </div>
            </>
          )}

          {type === 'radial' && (
            <>
              <div style={{ fontSize: '11px', color: tokens.colors.textTertiary }}>SHAPE:</div>
              <select value={radialShape} onChange={e => setRadialShape(e.target.value)} style={{ padding: '6px', backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, fontFamily: tokens.typography.fontMono, fontSize: '11px', outline: 'none' }}>
                <option value="circle">Circle</option>
                <option value="ellipse">Ellipse</option>
              </select>

              <div style={{ fontSize: '11px', color: tokens.colors.textTertiary, marginLeft: '16px' }}>POS:</div>
              <select value={radialPosition} onChange={e => setRadialPosition(e.target.value)} style={{ padding: '6px', backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, fontFamily: tokens.typography.fontMono, fontSize: '11px', outline: 'none' }}>
                {['center','top','bottom','left','right','top left','top right','bottom left','bottom right'].map(p => (
                  <option key={p} value={p}>{p.toUpperCase()}</option>
                ))}
              </select>
            </>
          )}

          {type === 'conic' && (
            <>
              <div style={{ fontSize: '11px', color: tokens.colors.textTertiary }}>ANGLE:</div>
              <input type="number" value={angle} onChange={e => setAngle(e.target.value)} style={{ width: '60px', padding: '6px', backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, fontFamily: tokens.typography.fontMono, fontSize: '12px', outline: 'none' }} />
              <div style={{ fontSize: '11px', color: tokens.colors.textTertiary, marginLeft: '16px' }}>POS:</div>
              <select value={radialPosition} onChange={e => setRadialPosition(e.target.value)} style={{ padding: '6px', backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, fontFamily: tokens.typography.fontMono, fontSize: '11px', outline: 'none' }}>
                {['center','top','bottom','left','right'].map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
              </select>
            </>
          )}
        </div>

        {/* STOP STRIP */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', color: tokens.colors.textTertiary }}>COLOR STOPS</div>
            <div style={{ fontSize: '10px', color: tokens.colors.textTertiary }}>Click strip to add • Double-click thumb to delete</div>
          </div>
          
          <div
            ref={stripRef}
            onClick={handleStripClick}
            style={{
              position: 'relative',
              height: '32px',
              borderRadius: '4px',
              background: stripGradient,
              boxShadow: `inset 0 0 0 1px ${tokens.colors.borderSubtle}`,
              cursor: 'crosshair',
              touchAction: 'none'
            }}
          >
            {stops.map(s => (
              <div
                key={s.id}
                onPointerDown={(e) => handleStopPointerDown(e, s.id)}
                onDoubleClick={(e) => handleStopDoubleClick(e, s.id)}
                style={{
                  position: 'absolute',
                  top: '-4px',
                  bottom: '-4px',
                  left: `calc(${s.position}% - 8px)`,
                  width: '16px',
                  backgroundColor: s.color,
                  border: activeStop === s.id ? '2px solid white' : '2px solid #ccc',
                  borderRadius: '2px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  cursor: 'ew-resize',
                  zIndex: activeStop === s.id ? 10 : 1
                }}
              />
            ))}
          </div>
        </div>

        {/* STOP LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[...stops].sort((a,b)=>a.position-b.position).map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', backgroundColor: activeStop === s.id ? tokens.colors.bgElevated : tokens.colors.bgCanvas, border: `1px solid ${activeStop === s.id ? tokens.colors.borderDefault : tokens.colors.borderFaint}`, borderRadius: '2px' }}>
              <input
                type="color"
                value={s.color}
                onChange={e => updateStopColor(s.id, e.target.value)}
                style={{ width: '32px', height: '32px', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
              />
              <input
                value={s.color.toUpperCase()}
                onChange={e => updateStopColor(s.id, e.target.value)}
                style={{ width: '80px', padding: '6px', backgroundColor: tokens.colors.bgSurface, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, fontFamily: tokens.typography.fontMono, fontSize: '11px', outline: 'none' }}
              />
              <div style={{ flex: 1 }} />
              <input
                type="number"
                value={s.position}
                onChange={e => updateStopPosition(s.id, e.target.value)}
                style={{ width: '60px', padding: '6px', backgroundColor: tokens.colors.bgSurface, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, fontFamily: tokens.typography.fontMono, fontSize: '11px', outline: 'none' }}
              />
              <span style={{ fontSize: '11px', color: tokens.colors.textTertiary }}>%</span>
              <button
                onClick={() => removeStop(s.id)}
                disabled={stops.length <= 2}
                style={{ width: '28px', height: '28px', backgroundColor: 'transparent', border: 'none', color: stops.length <= 2 ? tokens.colors.borderFaint : tokens.colors.textTertiary, cursor: stops.length <= 2 ? 'default' : 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >×</button>
            </div>
          ))}
        </div>

        {/* OUTPUT CSS */}
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '11px', color: tokens.colors.textTertiary, marginBottom: '8px' }}>CSS OUTPUT</div>
          <div style={{ backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, padding: '16px', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ color: tokens.colors.textPrimary, fontSize: '12px', lineHeight: '1.6', wordBreak: 'break-all' }}>
              background: {cssVal};
            </div>
            {webkitVal && (
              <div style={{ color: tokens.colors.textSecondary, fontSize: '12px', lineHeight: '1.6', wordBreak: 'break-all' }}>
                background: {webkitVal};
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={() => copyToClipboard(`background: ${cssVal};`, 'standard')}
                style={{ padding: '6px 12px', backgroundColor: tokens.colors.bgElevated, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, fontSize: '10px', fontFamily: tokens.typography.fontMono, cursor: 'pointer' }}
              >
                {copied === 'standard' ? 'COPIED ✓' : 'COPY STANDARD'}
              </button>
              <button
                onClick={() => copyToClipboard(`background: ${cssVal};\n${webkitVal ? `background: ${webkitVal};` : ''}`, 'all')}
                style={{ padding: '6px 12px', backgroundColor: tokens.colors.bgElevated, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, fontSize: '10px', fontFamily: tokens.typography.fontMono, cursor: 'pointer' }}
              >
                {copied === 'all' ? 'COPIED ✓' : 'COPY ALL'}
              </button>
            </div>
          </div>
        </div>

        {/* PRESETS */}
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '11px', color: tokens.colors.textTertiary, marginBottom: '8px' }}>PRESETS</div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {PRESETS.map(p => {
              const bg = `linear-gradient(${p.angle}deg, ${p.stops.map(s => `${s.c} ${s.p}%`).join(', ')})`;
              return (
                <div key={p.name} onClick={() => loadPreset(p)} style={{ cursor: 'pointer', flexShrink: 0 }}>
                  <div style={{ width: '80px', height: '60px', background: bg, borderRadius: '4px', border: `1px solid ${tokens.colors.borderSubtle}`, marginBottom: '6px' }} />
                  <div style={{ fontSize: '10px', color: tokens.colors.textSecondary, textAlign: 'center' }}>{p.name}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
