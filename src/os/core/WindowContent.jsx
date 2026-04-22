import React from 'react';
import Terminal from '../apps/Terminal';
import About from '../apps/About';
import Projects from '../apps/Projects';
import Contact from '../apps/Contact';
import Browser from '../apps/Browser';
import Paint from '../apps/Paint';
import Settings from '../apps/Settings';
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
};

export const WindowContent = ({ appId }) => {
    const Component = apps[appId];

    if (!Component) {
        return (
            <div style={{ padding: 20, color: '#666' }}>
                App not found or not implemented: {appId}
            </div>
        );
    }

    return <Component />;
};
