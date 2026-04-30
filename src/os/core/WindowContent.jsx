import React from 'react';
import Terminal from '../apps/Terminal';
import About from '../apps/About';
import Projects from '../apps/Projects';
import Contact from '../apps/Contact';
import Browser from '../apps/Browser';
import Paint from '../apps/Paint';
import Settings from '../apps/Settings';
import Files from '../apps/Files';
import Music from '../apps/Music';
import Notes from '../apps/Notes';
import Games from '../apps/Games';
import { appRegistry } from '../apps/appRegistry';

// Lazy loading or direct mapping
const apps = {
    'terminal': Terminal,
    'about': About,
    'projects': Projects,
    'contact': Contact,
    'browser': Browser,
    'paint': Paint,
    'settings': Settings,
    'files': Files,
    'music': Music,
    'notes': Notes,
    'games': Games,
};

export const WindowContent = ({ appId, intentData }) => {
    const Component = apps[appId];

    if (!Component) {
        return (
            <div style={{ padding: 20, color: '#666' }}>
                App not found or not implemented: {appId}
            </div>
        );
    }

    return <Component intentData={intentData} />;
};
