import React, { useEffect } from 'react';
import { useOSStore } from '../store/osStore';

export const BootScreen = () => {
    const setBooted = useOSStore(state => state.setBooted);

    useEffect(() => {
        // Simulate boot sequence
        const timer = setTimeout(() => {
            setBooted(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, [setBooted]);

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            background: '#000000',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            fontFamily: 'monospace',
            zIndex: 99999
        }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Smit OS</div>
            <div style={{ color: '#666' }}>Booting system...</div>
            {/* Simple loader */}
            <div style={{
                marginTop: '20px',
                width: '200px',
                height: '2px',
                background: '#333',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '50%',
                    background: '#fff',
                    animation: 'loading 1s infinite ease-in-out'
                }} />
            </div>
            <style>{`
            @keyframes loading {
                0% { left: -50%; }
                100% { left: 100%; }
            }
        `}</style>
        </div>
    );
};
