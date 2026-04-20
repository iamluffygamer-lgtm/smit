import React, { useEffect, useState } from 'react';
import { useOSStore } from '../store/osStore';

export const BootScreen = () => {
    const setBooted = useOSStore(state => state.setBooted);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const sequence = [
            { delay: 1000, step: 1 },
            { delay: 1100, step: 2 },
            { delay: 1200, step: 3 },
            { delay: 1300, step: 4 },
            { delay: 1900, step: 5 },
        ];

        let timeouts = sequence.map(s => setTimeout(() => {
            if (s.step === 5) {
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
            backgroundColor: '#000000',
            color: '#444444',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            zIndex: 99999
        }}>
            <div style={{
                color: '#ffffff',
                fontSize: '13px',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                SMIT OS
                <span className="blinking-cursor">_</span>
            </div>
            
            <div style={{ textAlign: 'left', minWidth: '200px', fontSize: '13px' }}>
                {step >= 1 && <div>Initializing system...</div>}
                {step >= 2 && <div>Loading applications...</div>}
                {step >= 3 && <div>Mounting workspace...</div>}
                {step >= 4 && <div style={{ color: '#ffffff', marginTop: '8px' }}>Ready.</div>}
            </div>

            <style>{`
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
            .blinking-cursor {
                animation: blink 0.5s step-end infinite;
            }
            `}</style>
        </div>
    );
};
