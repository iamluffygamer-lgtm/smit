import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Background: #0C0A08
ctx.fillStyle = '#0C0A08';
ctx.fillRect(0, 0, width, height);

// Draw a mock "screenshot" on the left side
ctx.fillStyle = '#1A1816'; // darker mock desktop
ctx.fillRect(40, 40, width / 2, height - 80);

// Mock window in the screenshot
ctx.fillStyle = '#2A2826';
ctx.fillRect(100, 100, 300, 250);
ctx.fillStyle = '#E8A020'; // mock header
ctx.fillRect(100, 100, 300, 24);

// Mock Dock
ctx.fillStyle = '#2A2826';
ctx.fillRect((width / 2 + 40) / 2 - 100, height - 90, 200, 40);

// Right side: Text block
const startX = width / 2 + 100;
let currentY = 160;

// "SMIT OS"
ctx.fillStyle = '#E8A020';
ctx.font = 'bold 80px monospace';
ctx.textAlign = 'left';
ctx.textBaseline = 'top';
ctx.fillText('SMIT OS', startX, currentY);
currentY += 110;

// "A Portfolio Built as an OS"
ctx.fillStyle = '#FFFFFF';
ctx.font = '36px sans-serif';
ctx.fillText('A Portfolio Built as an OS', startX, currentY);
currentY += 80;

// "Smit Patil · 19 · Mumbai"
ctx.fillStyle = '#8C8580';
ctx.font = '28px sans-serif';
ctx.fillText('Smit Patil · 19 · Mumbai', startX, currentY);
currentY += 100;

// "smitdev.netlify.app"
ctx.fillStyle = '#E8A020';
ctx.font = '24px monospace';
ctx.fillText('smitdev.netlify.app', startX, currentY);

// Bottom right: Small SMIT OS logo mark (◈ symbol)
ctx.fillStyle = '#E8A020';
ctx.font = '40px monospace';
ctx.fillText('◈', width - 80, height - 80);

writeFileSync('public/og-image.png', canvas.toBuffer('image/png'));
console.log('Generated mock public/og-image.png');
