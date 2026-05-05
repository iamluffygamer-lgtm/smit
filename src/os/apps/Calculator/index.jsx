import React, { useState } from 'react';
import { tokens } from '../../styles/tokens';

export default function Calculator() {
    const [cur, setCur] = useState('0');
    const [prev, setPrev] = useState('');
    const [oper, setOper] = useState('');
    const [fresh, setFresh] = useState(false);
    const [expr, setExpr] = useState('');

    const num = (n) => {
        if (fresh) {
            setCur(n);
            setFresh(false);
        } else {
            setCur(c => c === '0' ? n : c + n);
        }
    };

    const dot = () => {
        if (fresh) {
            setCur('0.');
            setFresh(false);
        } else {
            setCur(c => c.includes('.') ? c : c + '.');
        }
    };

    const op = (o) => {
        setPrev(cur);
        setOper(o);
        setFresh(true);
        setExpr(`${cur} ${o}`);
    };

    const eq = () => {
        if (!oper) return;
        
        let result;
        const a = parseFloat(prev);
        const b = parseFloat(cur);
        switch(oper) {
            case '+': result = a + b; break;
            case '−': result = a - b; break;
            case '×': result = a * b; break;
            case '÷': result = b !== 0 ? a / b : 'Error'; break;
            default:  result = b;
        }

        setExpr(`${prev} ${oper} ${cur} =`);
        
        if (result === 'Error') {
            setCur('Error');
        } else {
            setCur(String(parseFloat(result.toFixed(8))));
        }
        
        setOper('');
        setFresh(true);
    };

    const clr = () => {
        setCur('0');
        setPrev('');
        setOper('');
        setFresh(false);
        setExpr('');
    };

    const tog = () => setCur(c => String(-parseFloat(c || '0')));
    const pct = () => setCur(c => String(parseFloat(c || '0') / 100));

    const containerStyle = {
        width: '100%',
        height: '100%',
        backgroundColor: tokens.colors.bgSurface,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: tokens.typography.fontMono,
    };

    const calcStyle = {
        background: tokens.colors.bgElevated,
        border: `1px solid ${tokens.colors.borderSubtle}`,
        borderRadius: '4px',
        padding: '16px',
        width: '280px',
    };

    const displayStyle = {
        background: tokens.colors.bgSunken,
        border: `1px solid ${tokens.colors.borderFaint}`,
        padding: '16px',
        textAlign: 'right',
        marginBottom: '12px',
        borderRadius: '2px',
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
    };

    const Button = ({ onClick, children, isOp, isEq, span2 }) => {
        const [hovered, setHovered] = useState(false);

        let bg = tokens.colors.bgSunken;
        let color = tokens.colors.textSecondary;
        let border = tokens.colors.borderFaint;
        let fw = 400;

        if (isOp) {
            color = 'var(--os-accent)';
        }
        
        if (isEq) {
            bg = 'var(--os-accent)';
            color = tokens.colors.bgCanvas;
            fw = 700;
            border = 'var(--os-accent)';
        }

        if (hovered) {
            if (isEq) {
                bg = '#F0B030'; // Brighter accent for equals
            } else {
                bg = tokens.colors.accentMuted;
                color = 'var(--os-accent)';
                border = tokens.colors.accentBorder;
            }
        }

        return (
            <button
                onClick={onClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    padding: '14px',
                    border: `1px solid ${border}`,
                    background: bg,
                    color: color,
                    fontFamily: tokens.typography.fontMono,
                    fontSize: '14px',
                    fontWeight: fw,
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.1s',
                    gridColumn: span2 ? 'span 2' : 'span 1',
                    outline: 'none',
                }}
            >
                {children}
            </button>
        );
    };

    return (
        <div style={containerStyle}>
            <div style={calcStyle}>
                <div style={displayStyle}>
                    <div style={{ fontSize: '11px', color: tokens.colors.textTertiary, minHeight: '16px', wordBreak: 'break-all' }}>
                        {expr}
                    </div>
                    <div style={{ fontSize: '28px', color: tokens.colors.textPrimary, marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cur}
                    </div>
                </div>
                <div style={gridStyle}>
                    <Button onClick={clr}>C</Button>
                    <Button onClick={tog}>+/-</Button>
                    <Button onClick={pct}>%</Button>
                    <Button isOp onClick={() => op('÷')}>÷</Button>
                    <Button onClick={() => num('7')}>7</Button>
                    <Button onClick={() => num('8')}>8</Button>
                    <Button onClick={() => num('9')}>9</Button>
                    <Button isOp onClick={() => op('×')}>×</Button>
                    <Button onClick={() => num('4')}>4</Button>
                    <Button onClick={() => num('5')}>5</Button>
                    <Button onClick={() => num('6')}>6</Button>
                    <Button isOp onClick={() => op('−')}>−</Button>
                    <Button onClick={() => num('1')}>1</Button>
                    <Button onClick={() => num('2')}>2</Button>
                    <Button onClick={() => num('3')}>3</Button>
                    <Button isOp onClick={() => op('+')}>+</Button>
                    <Button span2 onClick={() => num('0')}>0</Button>
                    <Button onClick={dot}>.</Button>
                    <Button isEq onClick={eq}>=</Button>
                </div>
            </div>
        </div>
    );
}
