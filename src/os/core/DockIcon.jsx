import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { tokens } from '../styles/tokens';

export const DockIcon = ({ app, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const iconRef = useRef(null);

  const bounceControls = useAnimation();
  const prevActive = useRef(isActive);

  useEffect(() => {
    if (!prevActive.current && isActive) {
      // Open bounce
      bounceControls.start({
        y: [0, -8, 0],
        transition: {
          duration: 0.35,
          ease: [0.36, 0.07, 0.19, 0.97],
        }
      });
    } else if (prevActive.current && !isActive) {
      // Minimize bounce (lands after 220ms flight)
      bounceControls.start({
        scale: [1, 1.15, 1],
        transition: {
          duration: 0.18,
          ease: 'easeOut',
          delay: 0.22
        }
      });
    }
    prevActive.current = isActive;
  }, [isActive, bounceControls]);

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      cursor: 'pointer',
      padding: '8px',
    },
    iconBox: {
      width: '36px',
      height: '36px',
      backgroundColor: isHovered ? tokens.colors.bgElevated : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      color: tokens.colors.textPrimary,
      fontFamily: tokens.typography.fontMono,
      borderRadius: tokens.radius.sm,
      userSelect: 'none',
      transition: 'background-color 0.1s ease',
    },
    indicatorContainer: {
      position: 'absolute',
      bottom: '2px',
      left: '50%',
      transform: 'translateX(-50%)',
      height: '2px',
      width: '16px',
    },
    indicator: {
      width: '100%',
      height: '100%',
      backgroundColor: tokens.colors.accent,
      opacity: isActive ? 1 : 0,
      borderRadius: '2px',
      transition: 'opacity 0.2s ease',
    },
    tooltip: {
      position: 'absolute',
      bottom: 'calc(100% + 4px)',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '4px 8px',
      backgroundColor: tokens.colors.bgElevated,
      color: tokens.colors.textSecondary,
      fontFamily: tokens.typography.fontMono,
      borderRadius: tokens.radius.sm,
      fontSize: '11px',
      opacity: isHovered ? 1 : 0,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      transition: 'opacity 0.2s ease',
    }
  };

  return (
    <div
      ref={iconRef}
      style={styles.container}
      onClick={() => {
        if (iconRef.current) {
          const rect = iconRef.current.getBoundingClientRect();
          onClick(app.id, {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          });
        } else {
          onClick(app.id);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.tooltip}>
        {app.name}
      </div>
      <div style={styles.indicatorContainer}>
        <motion.div
          style={styles.indicator}
          animate={{
            opacity: isActive ? 1 : 0,
            y: isHovered ? -2 : 0
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <motion.div
        style={styles.iconBox}
        animate={bounceControls}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.92 }}
        transition={{
          y: {
            type: 'spring',
            stiffness: 400,
            damping: 18,
          },
          scale: {
            type: 'spring',
            stiffness: 500,
            damping: 20,
          }
        }}
      >
        {app.icon}
      </motion.div>
    </div>
  );
};
