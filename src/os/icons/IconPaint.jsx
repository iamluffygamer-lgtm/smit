import React from 'react';

export const IconPaint = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" 
       fill="none" stroke={color} strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="14" height="14" transform="rotate(8 12 12)" />
    <line x1="3" y1="21" x2="21" y2="3" />
  </svg>
);
