import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';

const sizes = [192, 512];
mkdirSync('public/icons', { recursive: true });

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#0C0A08';
  ctx.fillRect(0, 0, size, size);
  
  // Amber S letter
  ctx.fillStyle = '#E8A020';
  ctx.font = `bold ${size * 0.6}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', size / 2, size / 2);
  
  writeFileSync(`public/icons/pwa-${size}.png`, canvas.toBuffer('image/png'));
  console.log(`Generated pwa-${size}.png`);
});
