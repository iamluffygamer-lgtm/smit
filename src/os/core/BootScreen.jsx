import React, { useEffect, useState } from 'react';
import { useOSStore } from '../store/osStore';
import { tokens } from '../styles/tokens';
import { motion, AnimatePresence } from 'framer-motion';

const asciiArt = `  ░██████╗███╗░░░███╗██╗████████╗
  ██╔════╝████╗░████║██║╚══██╔══╝
  ╚█████╗░██╔████╔██║██║░░░██║░░░
  ░╚═══██╗██║╚██╔╝██║██║░░░██║░░░
  ██████╔╝██║░╚═╝░██║██║░░░██║░░░
  ╚═════╝░╚═╝░░░░░╚═╝╚═╝░░░╚═╝░░░
        OS — v1.0.0`;

const LOG_LINES = [
  { text: 'Initializing system...',  color: 'secondary' },
  { text: 'Loading applications...', color: 'secondary' },
  { text: 'Mounting workspace...',   color: 'secondary' },
  { text: 'Ready.',                  color: 'secondary' },
  { text: '[ OK ] smit-os ready.',   color: 'accent'    },
];

export const BootScreen = () => {
    const setBooted = useOSStore(state => state.setBooted);
    const [visibleLines, setVisibleLines] = useState([]);
    const [currentTyped, setCurrentTyped] = useState('');
    const [lineIdx, setLineIdx] = useState(0);
    const [done, setDone] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let isCancelled = false;

        const runTyping = async () => {
            // Initial delay
            await new Promise(r => setTimeout(r, 600));

            for (let i = 0; i < LOG_LINES.length; i++) {
                if (isCancelled) return;
                const line = LOG_LINES[i];
                
                // Type character by character
                for (let charIdx = 0; charIdx <= line.text.length; charIdx++) {
                    if (isCancelled) return;
                    setCurrentTyped(line.text.slice(0, charIdx));
                    if (charIdx < line.text.length) {
                        await new Promise(r => setTimeout(r, 16));
                    }
                }

                // Line complete
                if (isCancelled) return;
                setVisibleLines(prev => [...prev, line]);
                setCurrentTyped('');
                setLineIdx(i + 1);

                // Pause before next line
                if (i < LOG_LINES.length - 1) {
                    await new Promise(r => setTimeout(r, 100));
                }
            }

            // All lines done
            if (isCancelled) return;
            setDone(true);
            await new Promise(r => setTimeout(r, 500));
            if (!isCancelled) setBooted(true);
        };

        runTyping();

        return () => {
            isCancelled = true;
        };
    }, [setBooted]);

    useEffect(() => {
        const totalLines = LOG_LINES.length;
        const currentLine = LOG_LINES[lineIdx];

        const charProgress = currentLine
            ? currentTyped.length / currentLine.text.length
            : 0;

        const computedProgress =
            ((lineIdx + charProgress) / totalLines) * 100;

        setProgress(computedProgress);
    }, [currentTyped, lineIdx]);

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            backgroundColor: tokens.colors.bgCanvas,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: tokens.typography.fontMono,
            zIndex: 99999
        }}>
            <style>
                {`
                @keyframes bootBlink {
                    0%, 100% { opacity: 1 }
                    50%      { opacity: 0 }
                }
                `}
            </style>
            <pre style={{
                color: tokens.colors.accent,
                fontSize: '13px',
                lineHeight: '1.2',
                marginBottom: '32px',
                textAlign: 'left'
            }}>
                {asciiArt}
            </pre>
            
            <div style={{ 
                textAlign: 'left', 
                minWidth: '240px', 
                fontSize: '13px',
                color: tokens.colors.textSecondary
            }}>
                <AnimatePresence>
                    {visibleLines.map((line, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                            style={{ 
                                color: line.color === 'accent' ? tokens.colors.accent : tokens.colors.textSecondary,
                                marginTop: idx === 3 || idx === 4 ? '8px' : '0px'
                            }}
                        >
                            {line.text}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {!done && (
                    <div style={{ 
                        marginTop: lineIdx === 3 || lineIdx === 4 ? '8px' : '0px',
                        color: LOG_LINES[lineIdx]?.color === 'accent' ? tokens.colors.accent : tokens.colors.textSecondary
                    }}>
                        {currentTyped}
                        <span style={{
                            animation: 'bootBlink 0.7s infinite',
                            color: tokens.colors.accent,
                        }}>|</span>
                    </div>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: lineIdx > 0 ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    width: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontFamily: tokens.typography.fontMono,
                    fontSize: '11px',
                    marginTop: '24px',
                }}
            >
                {/* Track */}
                <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: 'rgba(240,237,232,0.08)',
                    borderRadius: 0,
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    {/* Fill */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            backgroundColor: 'var(--os-accent)',
                        }}
                        animate={{
                            width: `${Math.min(progress, 100)}%`
                        }}
                        transition={{
                            duration: 0.25,
                            ease: 'easeOut'
                        }}
                    />
                </div>
                {/* Label */}
                <div style={{
                    color: progress >= 99.5
                        ? tokens.colors.accent
                        : tokens.colors.textTertiary,
                    fontSize: '10px',
                    fontFamily: tokens.typography.fontMono,
                    width: '32px',
                    textAlign: 'right',
                }}>
                    {progress >= 99.5 ? 'OK' : `${Math.round(progress)}%`}
                </div>
            </motion.div>
        </div>
    );
};
