import React from 'react';

export const IconBrowser = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" 
       fill="none" stroke={color} strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="6" width="16" height="12" />
    <line x1="4" y1="10" x2="20" y2="10" />
    <polyline points="10,12 14,14 10,16" />
  </svg>
);
