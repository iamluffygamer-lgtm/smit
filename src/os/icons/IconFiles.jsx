import React from 'react';

export const IconFiles = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" 
       fill="none" stroke={color} strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="9" width="12" height="15" />
    <rect x="6" y="7" width="12" height="15" />
    <path d="M8 5 L16 5 L20 9 L20 20 L8 20 Z" />
    <path d="M16 5 L16 9 L20 9" />
  </svg>
);
