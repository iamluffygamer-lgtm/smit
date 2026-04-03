import React, { useMemo } from 'react';
import { useOSNavigationStore } from '../store/osNavigationStore';
import { appRegistry } from '../apps/appRegistry'; // Assuming registry exports a lookup or array

// Helper to resolve app component from ID
const getAppComponent = (appId) => {
    const appDef = appRegistry.find(app => app.id === appId);
    // In a real app, appDef would likely have a .Component property 
    // or you would use a dedicated componentMap.
    return appDef ? appDef.Component : null;
};

export const MobileAppContainer = () => {
    // Subscribe to relevant state
    const mode = useOSNavigationStore((state) => state.mode);
    const mobileStack = useOSNavigationStore((state) => state.mobileStack);

    // 1. If not in mobile mode, render nothing (DesktopManager takes over)
    if (mode !== 'mobile') return null;

    // 2. If stack is empty, we are on the "Home Screen" (Wallpaper/Dock visible)
    if (mobileStack.length === 0) {
        return null;
    }

    // 3. Get the active (top) app instance
    const activeInstance = mobileStack[mobileStack.length - 1];
    const AppComponent = getAppComponent(activeInstance.appId);

    if (!AppComponent) {
        console.warn(`Mobile Navigation: Component for ${activeInstance.appId} not found.`);
        return null;
    }

    // 4. Render the Active App
    // We use a key to ensure React completely remounts if we somehow push the same app type twice,
    // preventing state pollution between instances.
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999, // Above everything
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#000', // Default background
                overflow: 'hidden'
            }}
        >
            <AppComponent
                key={activeInstance.instanceId}
                {...activeInstance.props}
                isMobile={true} // Inject mobile context flag
            />
        </div>
    );
};