import React from 'react';
import { tokens } from '../../styles/tokens';

export default function Music() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      backgroundColor: tokens.colors.bgSurface,
      color: tokens.colors.textSecondary,
      fontFamily: tokens.typography.fontSans,
      fontSize: '14px',
    }}>
      Music App - Coming Soon
    </div>
  );
}
