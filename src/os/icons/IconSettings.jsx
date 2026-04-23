import React from 'react';

export const IconSettings = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" 
       fill="none" stroke={color} strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2" />
    <line x1="12" y1="2" x2="12" y2="8" />
    <line x1="10" y1="2" x2="14" y2="2" />
    <line x1="12" y1="22" x2="12" y2="16" />
    <line x1="10" y1="22" x2="14" y2="22" />
    <line x1="2" y1="12" x2="8" y2="12" />
    <line x1="2" y1="10" x2="2" y2="14" />
    <line x1="22" y1="12" x2="16" y2="12" />
    <line x1="22" y1="10" x2="22" y2="14" />
  </svg>
);
