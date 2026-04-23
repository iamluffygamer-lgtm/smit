import React from 'react';

export const IconProjects = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" 
       fill="none" stroke={color} strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="6" height="6" fill={color} />
    <rect x="13" y="5" width="6" height="6" />
    <rect x="5" y="13" width="6" height="6" />
    <rect x="13" y="13" width="6" height="6" />
  </svg>
);
