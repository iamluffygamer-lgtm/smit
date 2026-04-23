import React from 'react';

export const IconTerminal = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" 
       fill="none" stroke={color} strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,8 10,12 6,16" />
    <line x1="14" y1="9" x2="14" y2="15" />
  </svg>
);
