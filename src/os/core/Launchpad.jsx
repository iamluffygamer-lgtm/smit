import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../styles/tokens';
import { appRegistry } from '../apps/appRegistry';
import { useAppStoreStore, APP_CATALOG } from '../store/appStoreStore';
import { useWindowStore } from '../store/windowStore';
import { useSystemStateStore } from '../system/systemStateStore';

const AppTile = ({ app, isActive, onLaunch, isMobileMode }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 12, scale: 0.92 },
                visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 24
                    }
                }
            }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onLaunch(app.appId || app.id)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: isMobileMode ? '12px 4px' : '16px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: hovered ? tokens.colors.bgElevated : 'transparent',
                transition: 'background-color 0.15s ease',
            }}
        >
            <div style={{
                width: isMobileMode ? '48px' : '56px',
                height: isMobileMode ? '48px' : '56px',
                backgroundColor: tokens.colors.bgElevated,
                border: `1px solid ${hovered ? tokens.colors.borderDefault : tokens.colors.borderSubtle}`,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'var(--os-accent)',
                transition: 'all 0.15s ease',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                userSelect: 'none'
            }}>
                {app.icon}
            </div>
            <div style={{
                fontSize: isMobileMode ? '10px' : '11px',
                fontFamily: tokens.typography.fontMono,
                color: hovered ? tokens.colors.textPrimary : tokens.colors.textSecondary,
                textAlign: 'center',
                maxWidth: '80px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease',
                userSelect: 'none'
            }}>
                {app.name}
            </div>
            {/* Running indicator */}
            <div style={{
                width: '4px',
                height: '4px',
                backgroundColor: 'var(--os-accent)',
                borderRadius: '50%',
                opacity: isActive ? 1 : 0,
                marginTop: '-4px', // slight pull up since gap is 8px
            }} />
        </motion.div>
    );
};

export const Launchpad = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef(null);

    const { isInstalled } = useAppStoreStore();
    const windows = useWindowStore(state => state.windows);
    const openWindow = useWindowStore(state => state.openWindow);
    const isMobileMode = useSystemStateStore(state => state.isMobileMode);

    const isAppActive = (id) => windows.some(w => w.appId === id);

    const pinnedApps = ['terminal', 'about', 'appStore', 'contact'];
    const coreApps = appRegistry.filter(app => !pinnedApps.includes(app.id));
    const installedApps = APP_CATALOG.filter(app => isInstalled(app.id));

    const allApps = [...coreApps, ...installedApps];

    const filteredCore = coreApps.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredInstalled = installedApps.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredAll = allApps.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (searchQuery) {
                    setSearchQuery('');
                } else {
                    onClose();
                }
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, searchQuery, onClose]);

    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            if (inputRef.current) {
                // slight delay for focus to ensure component is mounted and transition started
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 50);
            }
        }
    }, [isOpen]);

    const handleLaunch = (id) => {
        openWindow(id);
        onClose();
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: isMobileMode ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '16px',
        width: '100%',
    };

    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03
            }
        }
    };

    const headerStyle = {
        fontSize: '10px',
        fontFamily: tokens.typography.fontMono,
        color: tokens.colors.textTertiary,
        letterSpacing: '0.1em',
        marginBottom: '12px',
        marginTop: '24px',
        gridColumn: '1 / -1' // Span full width of grid
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9998,
                        backgroundColor: 'rgba(0,0,0,0.75)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            width: '100%',
                            maxWidth: '720px',
                            margin: '0 auto',
                            padding: '48px 24px',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            height: '100%',
                            overflowY: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {/* Search Bar */}
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="search apps..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                padding: '8px 14px',
                                backgroundColor: tokens.colors.bgElevated,
                                border: `1px solid ${tokens.colors.borderSubtle}`,
                                borderRadius: '4px',
                                color: tokens.colors.textPrimary,
                                fontFamily: tokens.typography.fontMono,
                                fontSize: '13px',
                                outline: 'none',
                                caretColor: 'var(--os-accent)',
                                marginBottom: '16px'
                            }}
                        />

                        {/* Empty State */}
                        {searchQuery && filteredAll.length === 0 && (
                            <div style={{
                                marginTop: '40px',
                                color: tokens.colors.textTertiary,
                                fontSize: '12px',
                                fontFamily: tokens.typography.fontMono,
                                textAlign: 'center'
                            }}>
                                no apps match '{searchQuery}'
                            </div>
                        )}

                        {/* App Grid */}
                        <motion.div
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            style={gridStyle}
                        >
                            {!searchQuery ? (
                                <>
                                    {filteredCore.length > 0 && (
                                        <div style={headerStyle}>// CORE</div>
                                    )}
                                    {filteredCore.map(app => (
                                        <AppTile
                                            key={app.id}
                                            app={app}
                                            isActive={isAppActive(app.id)}
                                            onLaunch={handleLaunch}
                                            isMobileMode={isMobileMode}
                                        />
                                    ))}

                                    {filteredInstalled.length > 0 && (
                                        <div style={headerStyle}>// INSTALLED</div>
                                    )}
                                    {filteredInstalled.map(app => (
                                        <AppTile
                                            key={app.id}
                                            app={app}
                                            isActive={isAppActive(app.appId)}
                                            onLaunch={handleLaunch}
                                            isMobileMode={isMobileMode}
                                        />
                                    ))}
                                </>
                            ) : (
                                filteredAll.map(app => (
                                    <AppTile
                                        key={app.id}
                                        app={app}
                                        isActive={isAppActive(app.appId || app.id)}
                                        onLaunch={handleLaunch}
                                        isMobileMode={isMobileMode}
                                    />
                                ))
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
