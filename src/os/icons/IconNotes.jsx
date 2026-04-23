import React from 'react';

export const IconNotes = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" 
       fill="none" stroke={color} strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 5 L16 5 L16 20 L4 20 L4 9 Z" />
    <path d="M4 9 L8 9 L8 5" />
    <line x1="6" y1="14" x2="14" y2="14" />
  </svg>
);
