import React, { useState, useEffect, useRef, useCallback } from 'react';
import { tokens } from '../../styles/tokens';

// --- MATH ---
const hsvToRgb = (h, s, v) => {
  s /= 100; v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let r=0, g=0, b=0;
  if (h >= 0 && h < 60) { r=c; g=x; b=0; }
  else if (h >= 60 && h < 120) { r=x; g=c; b=0; }
  else if (h >= 120 && h < 180) { r=0; g=c; b=x; }
  else if (h >= 180 && h < 240) { r=0; g=x; b=c; }
  else if (h >= 240 && h < 300) { r=x; g=0; b=c; }
  else if (h >= 300 && h < 360) { r=c; g=0; b=x; }
  return [Math.round((r+m)*255), Math.round((g+m)*255), Math.round((b+m)*255)];
};

const rgbToHex = (r, g, b) => {
  return '#' + [r,g,b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
};

const hsvToHsl = (h, s, v) => {
  s /= 100; v /= 100;
  let l = v * (1 - s/2);
  let sl = (l === 0 || l === 1) ? 0 : (v - l) / Math.min(l, 1-l);
  return [h, Math.round(sl*100), Math.round(l*100)];
};

const hexToRgb = (hex) => {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
  const num = parseInt(hex, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
};

const rgbToHsv = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
};

export default function ColorPicker() {
  const [hsv, setHsv] = useState({ h: 36, s: 79, v: 91 }); // Amber #E8A020 roughly
  const [alpha, setAlpha] = useState(1);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState('');

  const canvasRef = useRef(null);
  const isDraggingCanvas = useRef(false);
  const isDraggingHue = useRef(false);
  const isDraggingAlpha = useRef(false);

  const canvasRect = useRef({ width: 0, height: 0, left: 0, top: 0 });
  const hueRect = useRef({ width: 0, left: 0 });
  const alphaRect = useRef({ width: 0, left: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('smit-color-history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch(e) {}
    } else {
      setHistory(['#E8A020', '#4ADE80', '#06B6D4', '#F87171', '#8B5CF6']);
    }
  }, []);

  const saveHistory = (hex) => {
    setHistory(prev => {
      const filtered = prev.filter(c => c !== hex);
      const newHist = [hex, ...filtered].slice(0, 12);
      localStorage.setItem('smit-color-history', JSON.stringify(newHist));
      return newHist;
    });
  };

  // Draw Canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Fill white
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Hue gradient
    const hGrad = ctx.createLinearGradient(0,0,canvas.width,0);
    hGrad.addColorStop(0, 'rgba(255,255,255,0)');
    hGrad.addColorStop(1, `hsla(${hsv.h},100%,50%,1)`);
    ctx.fillStyle = hGrad;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Black gradient
    const vGrad = ctx.createLinearGradient(0,0,0,canvas.height);
    vGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = vGrad;
    ctx.fillRect(0,0,canvas.width,canvas.height);

  }, [hsv.h]);

  // Handle Canvas Drag
  const handleCanvasPointerDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    canvasRect.current = { width: rect.width, height: rect.height, left: rect.left, top: rect.top };
    isDraggingCanvas.current = true;
    updateCanvasColor(e.clientX, e.clientY);
    document.addEventListener('pointermove', handleCanvasPointerMove);
    document.addEventListener('pointerup', handleCanvasPointerUp);
  };
  const handleCanvasPointerMove = (e) => {
    if (isDraggingCanvas.current) {
      updateCanvasColor(e.clientX, e.clientY);
    }
  };
  const handleCanvasPointerUp = () => {
    isDraggingCanvas.current = false;
    document.removeEventListener('pointermove', handleCanvasPointerMove);
    document.removeEventListener('pointerup', handleCanvasPointerUp);
    
    // Save to history on mouse up
    setHsv((currentHsv) => {
        const [r,g,b] = hsvToRgb(currentHsv.h, currentHsv.s, currentHsv.v);
        saveHistory(rgbToHex(r,g,b));
        return currentHsv;
    });
  };
  const updateCanvasColor = (clientX, clientY) => {
    const { width, height, left, top } = canvasRect.current;
    let x = Math.max(0, Math.min(clientX - left, width));
    let y = Math.max(0, Math.min(clientY - top, height));
    const s = (x / width) * 100;
    const v = 100 - (y / height) * 100;
    setHsv(prev => ({ ...prev, s, v }));
  };

  // Handle Hue Drag
  const handleHuePointerDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    hueRect.current = { width: rect.width, left: rect.left };
    isDraggingHue.current = true;
    updateHue(e.clientX);
    document.addEventListener('pointermove', handleHuePointerMove);
    document.addEventListener('pointerup', handleHuePointerUp);
  };
  const handleHuePointerMove = (e) => {
    if (isDraggingHue.current) updateHue(e.clientX);
  };
  const handleHuePointerUp = () => {
    isDraggingHue.current = false;
    document.removeEventListener('pointermove', handleHuePointerMove);
    document.removeEventListener('pointerup', handleHuePointerUp);
  };
  const updateHue = (clientX) => {
    const { width, left } = hueRect.current;
    let x = Math.max(0, Math.min(clientX - left, width));
    const h = (x / width) * 360;
    setHsv(prev => ({ ...prev, h }));
  };

  // Handle Alpha Drag
  const handleAlphaPointerDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    alphaRect.current = { width: rect.width, left: rect.left };
    isDraggingAlpha.current = true;
    updateAlpha(e.clientX);
    document.addEventListener('pointermove', handleAlphaPointerMove);
    document.addEventListener('pointerup', handleAlphaPointerUp);
  };
  const handleAlphaPointerMove = (e) => {
    if (isDraggingAlpha.current) updateAlpha(e.clientX);
  };
  const handleAlphaPointerUp = () => {
    isDraggingAlpha.current = false;
    document.removeEventListener('pointermove', handleAlphaPointerMove);
    document.removeEventListener('pointerup', handleAlphaPointerUp);
  };
  const updateAlpha = (clientX) => {
    const { width, left } = alphaRect.current;
    let x = Math.max(0, Math.min(clientX - left, width));
    setAlpha(x / width);
  };

  // Conversions
  const [r, g, b] = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const hex = rgbToHex(r, g, b);
  const [hslH, hslS, hslL] = hsvToHsl(hsv.h, hsv.s, hsv.v);

  const formats = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
    { label: 'HSL', value: `hsl(${hslH}, ${hslS}%, ${hslL}%)` },
    { label: 'RGBA', value: `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})` },
  ];

  const handleCopy = (label, value) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  const handleHistoryClick = (hexColor) => {
    const [r, g, b] = hexToRgb(hexColor);
    const [h, s, v] = rgbToHsv(r, g, b);
    setHsv({ h, s, v });
    setAlpha(1);
    saveHistory(hexColor);
  };

  const pickFromScreen = async () => {
    if (!window.EyeDropper) {
      alert("Eyedropper not supported in this browser");
      return;
    }
    try {
      const dropper = new EyeDropper();
      const result = await dropper.open();
      handleHistoryClick(result.sRGBHex);
    } catch (e) {
      // user canceled
    }
  };

  // Calculate coordinates for thumbs
  const canvasX = `${hsv.s}%`;
  const canvasY = `${100 - hsv.v}%`;
  const hueX = `${(hsv.h / 360) * 100}%`;
  const alphaX = `${alpha * 100}%`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: tokens.colors.bgSurface, fontFamily: tokens.typography.fontMono, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      
      {/* CANVAS SECTION */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '70%', backgroundColor: '#000', flexShrink: 0 }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={280}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'crosshair', touchAction: 'none' }}
          onPointerDown={handleCanvasPointerDown}
        />
        {/* Thumb */}
        <div style={{
          position: 'absolute',
          top: canvasY,
          left: canvasX,
          width: '12px',
          height: '12px',
          marginLeft: '-6px',
          marginTop: '-6px',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* CONTROLS SECTION */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 }}>
        
        {/* HUE SLIDER */}
        <div style={{ position: 'relative', height: '12px', borderRadius: '6px', background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)', touchAction: 'none', cursor: 'pointer' }} onPointerDown={handleHuePointerDown}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: hueX,
            width: '16px',
            height: '16px',
            marginLeft: '-8px',
            marginTop: '-8px',
            borderRadius: '50%',
            backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
            border: '2px solid white',
            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* ALPHA SLIDER */}
        <div style={{ 
          position: 'relative', 
          height: '12px', 
          borderRadius: '6px', 
          background: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgCH7//v1fD1WGFgY1BRD+H1X2H1X2EQAAH1wLwQAAAABJRU5ErkJggg==')`,
          touchAction: 'none',
          cursor: 'pointer'
        }} onPointerDown={handleAlphaPointerDown}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '6px', background: `linear-gradient(to right, rgba(${r},${g},${b},0), rgba(${r},${g},${b},1))` }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: alphaX,
            width: '16px',
            height: '16px',
            marginLeft: '-8px',
            marginTop: '-8px',
            borderRadius: '50%',
            backgroundColor: `rgba(${r},${g},${b},${alpha})`,
            border: '2px solid white',
            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
            pointerEvents: 'none'
          }} />
        </div>

      </div>

      {/* EYEDROPPER & CURRENT SWATCH */}
      <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        <button
          onClick={pickFromScreen}
          title="Pick color from screen"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: tokens.colors.bgCanvas,
            border: `1px solid ${tokens.colors.borderSubtle}`,
            color: tokens.colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            fontSize: '16px'
          }}
        >
          ◧
        </button>
        
        <div style={{
          flex: 1,
          height: '40px',
          borderRadius: '4px',
          background: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgCH7//v1fD1WGFgY1BRD+H1X2H1X2EQAAH1wLwQAAAABJRU5ErkJggg==')`
        }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '4px', backgroundColor: `rgba(${r},${g},${b},${alpha})` }} />
        </div>
      </div>

      {/* OUTPUT FORMATS */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
        {formats.map(f => (
          <div
            key={f.label}
            onClick={() => handleCopy(f.label, f.value)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: tokens.colors.bgCanvas,
              border: `1px solid ${tokens.colors.borderFaint}`,
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'all 0.1s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = tokens.colors.borderDefault}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = tokens.colors.borderFaint}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: tokens.colors.textTertiary, width: '32px' }}>{f.label}</span>
              <span style={{ fontSize: '12px', color: tokens.colors.textPrimary }}>{f.value}</span>
            </div>
            {copied === f.label ? (
              <span style={{ fontSize: '10px', color: '#4ADE80', fontWeight: 600 }}>COPIED ✓</span>
            ) : (
              <span style={{ fontSize: '10px', color: tokens.colors.textTertiary }}>COPY</span>
            )}
          </div>
        ))}
      </div>

      {/* HISTORY */}
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ fontSize: '10px', color: tokens.colors.textTertiary, letterSpacing: '0.1em', marginBottom: '12px' }}>
          // HISTORY
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {history.map((h, i) => (
            <div
              key={i}
              onClick={() => handleHistoryClick(h)}
              title={h}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: h,
                border: `1px solid ${tokens.colors.borderFaint}`,
                cursor: 'pointer',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
