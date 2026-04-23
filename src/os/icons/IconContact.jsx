import React from 'react';

export const IconContact = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" 
       fill="none" stroke={color} strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="1.5" fill={color} />
    <line x1="4" y1="4" x2="7.5" y2="7.5" />
    <line x1="20" y1="4" x2="16.5" y2="7.5" />
  </svg>
);
