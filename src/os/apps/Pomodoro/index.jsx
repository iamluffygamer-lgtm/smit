import React, { useState, useEffect, useRef } from 'react';
import { tokens } from '../../styles/tokens';

const STORAGE_KEY = 'smit-pomodoro-sessions';

export default function Pomodoro() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [totalTime, setTotalTime] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' | 'break'
    const [sessions, setSessions] = useState(() => {
        try {
            return parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
        } catch {
            return 0;
        }
    });

    const timerRef = useRef(null);

    const beep = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.start();
            setTimeout(() => osc.stop(), 200);
        } catch (e) {
            console.error('AudioContext not supported');
        }
    };

    const handleComplete = () => {
        beep();
        if (mode === 'focus') {
            const next = sessions + 1;
            setSessions(next);
            localStorage.setItem(STORAGE_KEY, next.toString());
            setMode('break');
            setTimeLeft(5 * 60);
            setTotalTime(5 * 60);
        } else {
            setMode('focus');
            setTimeLeft(25 * 60);
            setTotalTime(25 * 60);
        }
        setIsRunning(false);
    };

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning, mode, sessions]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const setPreset = (mins) => {
        setIsRunning(false);
        const secs = mins * 60;
        setTotalTime(secs);
        setTimeLeft(secs);
        setMode('focus');
    };

    // SVG Ring Calculations
    const radius = 90;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (timeLeft / totalTime) * circumference;

    const accentColor = mode === 'focus' ? 'var(--os-accent)' : '#4ADE80';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: tokens.colors.bgSurface,
            fontFamily: tokens.typography.fontMono,
            color: tokens.colors.textPrimary,
            padding: '24px',
            userSelect: 'none',
        }}>
            {/* Mode Label */}
            <div style={{
                fontSize: '12px',
                color: tokens.colors.textTertiary,
                letterSpacing: '0.15em',
                marginBottom: '32px',
                textTransform: 'uppercase',
            }}>
                // {mode} SESSION
            </div>

            {/* SVG Ring & Timer */}
            <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '32px' }}>
                <svg
                    height="200"
                    width="200"
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    <circle
                        stroke={tokens.colors.borderFaint}
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx="100"
                        cy="100"
                    />
                    <circle
                        stroke={accentColor}
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx="100"
                        cy="100"
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    fontWeight: 700,
                    color: accentColor,
                    letterSpacing: '0.05em',
                }}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Session Dots */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                {[...Array(Math.max(4, sessions))].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: i < sessions ? 'var(--os-accent)' : tokens.colors.bgSunken,
                            border: `1px solid ${i < sessions ? 'var(--os-accent)' : tokens.colors.borderSubtle}`,
                        }}
                    />
                ))}
            </div>

            {/* Presets */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                {[25, 15, 10, 5].map(min => (
                    <button
                        key={min}
                        onClick={() => setPreset(min)}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: 'transparent',
                            border: `1px solid ${tokens.colors.borderSubtle}`,
                            color: tokens.colors.textSecondary,
                            fontFamily: tokens.typography.fontMono,
                            fontSize: '11px',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = tokens.colors.accentBorder;
                            e.currentTarget.style.color = 'var(--os-accent)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = tokens.colors.borderSubtle;
                            e.currentTarget.style.color = tokens.colors.textSecondary;
                        }}
                    >
                        {min}M
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '16px' }}>
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    style={{
                        padding: '10px 32px',
                        backgroundColor: isRunning ? tokens.colors.bgElevated : accentColor,
                        border: isRunning ? `1px solid ${tokens.colors.borderDefault}` : '1px solid transparent',
                        color: isRunning ? tokens.colors.textPrimary : tokens.colors.bgCanvas,
                        fontFamily: tokens.typography.fontMono,
                        fontSize: '12px',
                        fontWeight: 700,
                        borderRadius: '2px',
                        cursor: 'pointer',
                        letterSpacing: '0.08em',
                        transition: 'all 0.15s',
                    }}
                >
                    {isRunning ? 'PAUSE' : 'START'}
                </button>
                <button
                    onClick={() => {
                        setIsRunning(false);
                        setTimeLeft(totalTime);
                    }}
                    style={{
                        padding: '10px 24px',
                        backgroundColor: 'transparent',
                        border: `1px solid ${tokens.colors.borderSubtle}`,
                        color: tokens.colors.textSecondary,
                        fontFamily: tokens.typography.fontMono,
                        fontSize: '12px',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        letterSpacing: '0.08em',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = tokens.colors.textSecondary;
                        e.currentTarget.style.color = tokens.colors.textPrimary;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = tokens.colors.borderSubtle;
                        e.currentTarget.style.color = tokens.colors.textSecondary;
                    }}
                >
                    RESET
                </button>
            </div>
        </div>
    );
}
