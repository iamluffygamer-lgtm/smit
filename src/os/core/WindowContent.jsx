import React from 'react';
import Terminal from '../apps/Terminal';
import About from '../apps/About';
// Import other apps as they are implemented
// import Projects from '../apps/Projects';
import { appRegistry } from '../apps/appRegistry';

// Lazy loading or direct mapping
const apps = {
    'terminal': Terminal,
    'about': About,
    // 'projects': Projects,
    // ...
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
