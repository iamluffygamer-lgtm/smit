import React, { useEffect, useState } from 'react';
import { useOSStore } from '../store/osStore';
import { tokens } from '../styles/tokens';

const asciiArt = `  ░██████╗███╗░░░███╗██╗████████╗
  ██╔════╝████╗░████║██║╚══██╔══╝
  ╚█████╗░██╔████╔██║██║░░░██║░░░
  ░╚═══██╗██║╚██╔╝██║██║░░░██║░░░
  ██████╔╝██║░╚═╝░██║██║░░░██║░░░
  ╚═════╝░╚═╝░░░░░╚═╝╚═╝░░░╚═╝░░░
        OS — v1.0.0`;

export const BootScreen = () => {
    const setBooted = useOSStore(state => state.setBooted);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const sequence = [
            { delay: 1000, step: 1 },
            { delay: 1100, step: 2 },
            { delay: 1200, step: 3 },
            { delay: 1300, step: 4 },
            { delay: 1500, step: 5 },
            { delay: 1900, step: 6 },
        ];

        let timeouts = sequence.map(s => setTimeout(() => {
            if (s.step === 6) {
                setBooted(true);
            } else {
                setStep(s.step);
            }
        }, s.delay));

        return () => timeouts.forEach(clearTimeout);
    }, [setBooted]);

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
                {step >= 1 && <div>Initializing system...</div>}
                {step >= 2 && <div>Loading applications...</div>}
                {step >= 3 && <div>Mounting workspace...</div>}
                {step >= 4 && <div style={{ marginTop: '8px' }}>Ready.</div>}
                {step >= 5 && <div style={{ color: tokens.colors.textSecondary, marginTop: '8px' }}>[ OK ] smit-os ready.</div>}
            </div>
        </div>
    );
};
