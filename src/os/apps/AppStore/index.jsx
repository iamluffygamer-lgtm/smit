import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../../styles/tokens';
import { useAppStoreStore, APP_CATALOG } from '../../store/appStoreStore';
import { useWindowStore } from '../../store/windowStore';
import { useNotificationStore } from '../../system/notificationStore';

export default function AppStore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const { installed, installing, progress, installApp, uninstallApp, isInstalled } = useAppStoreStore();
  const openWindow = useWindowStore(state => state.openWindow);
  const addNotification = useNotificationStore(state => state.addNotification);

  const handleInstall = (app) => {
    if (isInstalled(app.id)) {
      openWindow(app.appId);
      return;
    }
    installApp(app.id);
    // Notification after install completes
    setTimeout(() => {
      addNotification(`${app.name} installed successfully`, 'success', 3000);
    }, 2400);
  };

  const featuredApp = APP_CATALOG.find(a => a.featured);
  const utilities = APP_CATALOG.filter(a => a.category === 'UTILITIES');
  const installedApps = APP_CATALOG.filter(a => isInstalled(a.id));

  const query = searchQuery.toLowerCase();
  const searchResults = APP_CATALOG.filter(a => 
    a.name.toLowerCase().includes(query) || 
    a.tagline.toLowerCase().includes(query)
  );

  // App Detail View
  if (selectedApp) {
    const app = selectedApp;
    const appInstalled = isInstalled(app.id);
    const appInstalling = installing === app.id;

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: tokens.colors.bgSurface,
        fontFamily: tokens.typography.fontMono,
      }}>
        {/* Back button */}
        <div style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <button
            onClick={() => setSelectedApp(null)}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${tokens.colors.borderSubtle}`,
              borderRadius: '2px',
              color: tokens.colors.textSecondary,
              fontFamily: tokens.typography.fontMono,
              fontSize: '11px',
              padding: '4px 10px',
              cursor: 'pointer',
            }}
          >
            ← BACK
          </button>
          <span style={{
            fontSize: '11px',
            color: tokens.colors.textTertiary,
            letterSpacing: '0.06em',
          }}>
            {app.category}
          </span>
        </div>

        {/* App detail */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '20px',
            marginBottom: '24px',
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              backgroundColor: tokens.colors.bgElevated,
              border: `1px solid ${tokens.colors.borderDefault}`,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              flexShrink: 0,
              color: 'var(--os-accent)',
            }}>
              {app.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 700,
                color: tokens.colors.textPrimary,
                marginBottom: '4px',
              }}>
                {app.name}
              </div>
              <div style={{
                fontSize: '12px',
                color: tokens.colors.textSecondary,
                marginBottom: '12px',
              }}>
                {app.tagline}
              </div>
              <div style={{
                display: 'flex',
                gap: '16px',
                fontSize: '11px',
                color: tokens.colors.textTertiary,
              }}>
                <span>v{app.version}</span>
                <span>{app.size}</span>
                <span>by {app.author}</span>
              </div>
            </div>
            <div>
              <InstallButton
                app={app}
                installed={appInstalled}
                installing={appInstalling}
                progress={progress}
                onInstall={() => handleInstall(app)}
                onOpen={() => openWindow(app.appId)}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{
            padding: '16px',
            backgroundColor: tokens.colors.bgElevated,
            border: `1px solid ${tokens.colors.borderSubtle}`,
            borderRadius: '2px',
            marginBottom: '16px',
          }}>
            <div style={{
              fontSize: '10px',
              color: tokens.colors.textTertiary,
              letterSpacing: '0.1em',
              marginBottom: '8px',
            }}>
              // ABOUT
            </div>
            <div style={{
              fontSize: '14px',
              fontFamily: tokens.typography.fontSans,
              fontWeight: 400,
              color: tokens.colors.textSecondary,
              lineHeight: 1.8,
            }}>
              {app.description}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: tokens.colors.bgSurface,
      fontFamily: tokens.typography.fontMono,
    }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{
            fontSize: '10px',
            color: tokens.colors.textTertiary,
            letterSpacing: '0.1em',
          }}>
            // APP STORE
          </div>
          <div style={{
            fontSize: '18px',
            fontFamily: tokens.typography.fontSans,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: tokens.colors.textPrimary,
          }}>
            SMIT OS Store
          </div>
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search apps..."
          style={{
            width: '180px',
            fontSize: '11px',
            fontFamily: tokens.typography.fontMono,
            backgroundColor: tokens.colors.bgElevated,
            border: `1px solid ${tokens.colors.borderSubtle}`,
            padding: '6px 12px',
            color: tokens.colors.textPrimary,
            outline: 'none',
            borderRadius: '2px',
          }}
        />
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        padding: '16px 20px',
      }}>
        {query ? (
          searchResults.length === 0 ? (
            <div style={{
              fontSize: '12px',
              color: tokens.colors.textTertiary,
              textAlign: 'center',
              padding: '40px',
            }}>
              no results for '{searchQuery}'
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {searchResults.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  installed={isInstalled(app.id)}
                  installing={installing === app.id}
                  progress={progress}
                  onInstall={() => handleInstall(app)}
                  onOpen={() => openWindow(app.appId)}
                  onSelect={() => setSelectedApp(app)}
                />
              ))}
            </div>
          )
        ) : (
          <>
            {/* HERO SECTION */}
            {featuredApp && (
              <div style={{
                height: '160px',
                background: `linear-gradient(135deg, rgba(232, 160, 32, 0.08) 0%, ${tokens.colors.bgElevated} 100%)`,
                border: `1px solid ${tokens.colors.accentBorder}`,
                borderRadius: '2px',
                padding: '24px',
                marginBottom: '24px',
                display: 'flex',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }} onClick={() => setSelectedApp(featuredApp)}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  backgroundColor: tokens.colors.bgSurface,
                  border: `1px solid ${tokens.colors.accentBorder}`,
                  borderRadius: '4px',
                  fontSize: '32px',
                  color: 'var(--os-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {featuredApp.icon}
                </div>
                <div style={{ flex: 1, padding: '0 20px' }}>
                  <div style={{ fontSize: '9px', color: 'var(--os-accent)', letterSpacing: '0.15em', marginBottom: '6px' }}>
                    FEATURED
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: tokens.colors.textPrimary, marginBottom: '4px' }}>
                    {featuredApp.name}
                  </div>
                  <div style={{ fontSize: '13px', color: tokens.colors.textSecondary, marginBottom: '12px' }}>
                    {featuredApp.tagline}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['HTML', 'CSS', 'JS', 'AI', 'Live Preview'].map(tag => (
                      <div key={tag} style={{
                        padding: '3px 8px',
                        backgroundColor: tokens.colors.bgSurface,
                        border: `1px solid ${tokens.colors.borderSubtle}`,
                        fontSize: '10px',
                        color: tokens.colors.textTertiary,
                        borderRadius: '2px',
                      }}>
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                  <InstallButton
                    app={featuredApp}
                    installed={isInstalled(featuredApp.id)}
                    installing={installing === featuredApp.id}
                    progress={progress}
                    onInstall={() => handleInstall(featuredApp)}
                    onOpen={() => openWindow(featuredApp.appId)}
                  />
                  <div style={{ fontSize: '10px', color: tokens.colors.textTertiary, textAlign: 'center', marginTop: '6px' }}>
                    v{featuredApp.version} · {featuredApp.size}
                  </div>
                </div>
              </div>
            )}

            {/* INSTALLED SECTION */}
            {installedApps.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', color: tokens.colors.textTertiary, letterSpacing: '0.1em' }}>
                    INSTALLED
                  </div>
                  <div style={{ flex: 1, height: '1px', backgroundColor: tokens.colors.bgElevated, marginLeft: '12px' }} />
                </div>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  paddingBottom: '4px',
                  marginBottom: '24px',
                }}>
                  {installedApps.map(app => (
                    <div key={app.id} style={{
                      width: '120px',
                      flexShrink: 0,
                      padding: '12px 8px',
                      backgroundColor: tokens.colors.bgElevated,
                      border: `1px solid ${tokens.colors.borderSubtle}`,
                      borderRadius: '2px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      boxSizing: 'border-box',
                    }}>
                      <div onClick={() => setSelectedApp(app)} style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: tokens.colors.bgSurface,
                        border: `1px solid ${tokens.colors.borderSubtle}`,
                        borderRadius: '4px',
                        fontSize: '22px',
                        color: 'var(--os-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}>
                        {app.icon}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: tokens.colors.textSecondary,
                        textAlign: 'center',
                        maxWidth: '100px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {app.name}
                      </div>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <InstallButton
                          app={app}
                          installed={true}
                          installing={false}
                          progress={0}
                          onInstall={() => {}}
                          onOpen={(e) => {
                            e.stopPropagation();
                            openWindow(app.appId);
                          }}
                        />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          uninstallApp(app.id);
                          addNotification(`${app.name} uninstalled`, 'info');
                        }}
                        style={{
                          fontSize: '9px',
                          color: 'rgba(248,113,113,0.5)',
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                        onMouseEnter={e => e.target.style.color = '#F87171'}
                        onMouseLeave={e => e.target.style.color = 'rgba(248,113,113,0.5)'}
                      >
                        REMOVE
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* UTILITIES SECTION */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: tokens.colors.textTertiary, letterSpacing: '0.1em' }}>
                UTILITIES
              </div>
              <div style={{ flex: 1, height: '1px', backgroundColor: tokens.colors.bgElevated, marginLeft: '12px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {utilities.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  installed={isInstalled(app.id)}
                  installing={installing === app.id}
                  progress={progress}
                  onInstall={() => handleInstall(app)}
                  onOpen={() => openWindow(app.appId)}
                  onSelect={() => setSelectedApp(app)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// App Card component
const AppCard = ({ app, installed, installing, progress, onInstall, onOpen, onSelect }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '14px',
        backgroundColor: hovered ? tokens.colors.bgSurface : tokens.colors.bgElevated,
        border: `1px solid ${hovered ? tokens.colors.borderDefault : tokens.colors.borderSubtle}`,
        borderRadius: '2px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        transition: 'all 0.15s',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        backgroundColor: tokens.colors.bgSurface,
        border: `1px solid ${tokens.colors.borderSubtle}`,
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        flexShrink: 0,
        color: 'var(--os-accent)',
      }}>
        {app.icon}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '15px', fontFamily: tokens.typography.fontSans, fontWeight: 600, letterSpacing: '-0.01em', color: tokens.colors.textPrimary }}>
          {app.name}
        </div>
        <div style={{ fontSize: '13px', fontFamily: tokens.typography.fontSans, fontWeight: 400, lineHeight: 1.5, color: tokens.colors.textSecondary, marginTop: '2px' }}>
          {app.tagline}
        </div>
        <div style={{ fontSize: '10px', color: tokens.colors.textTertiary, marginTop: '4px' }}>
          v{app.version} · {app.size}
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <InstallButton
          app={app}
          installed={installed}
          installing={installing}
          progress={progress}
          onInstall={(e) => {
            e.stopPropagation();
            onInstall();
          }}
          onOpen={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        />
      </div>

      {installing && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '2px',
            backgroundColor: 'var(--os-accent)',
          }}
        />
      )}
    </div>
  );
};

// Install Button component
const InstallButton = ({ app, installed, installing, progress, onInstall, onOpen }) => {
  if (installing) {
    return (
      <div style={{
        padding: '6px 14px',
        backgroundColor: tokens.colors.accentMuted,
        border: `1px solid ${tokens.colors.accentBorder}`,
        borderRadius: '2px',
        color: 'var(--os-accent)',
        fontFamily: tokens.typography.fontMono,
        fontSize: '11px',
        minWidth: '80px',
        textAlign: 'center',
      }}>
        {progress}%
      </div>
    );
  }

  if (installed) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onOpen) onOpen(e);
        }}
        style={{
          padding: '6px 14px',
          backgroundColor: tokens.colors.accentMuted,
          border: `1px solid ${tokens.colors.accentBorder}`,
          borderRadius: '2px',
          color: 'var(--os-accent)',
          fontFamily: tokens.typography.fontMono,
          fontSize: '11px',
          cursor: 'pointer',
          minWidth: '80px',
          letterSpacing: '0.05em',
        }}
      >
        OPEN
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (onInstall) onInstall(e);
      }}
      style={{
        padding: '6px 14px',
        backgroundColor: 'var(--os-accent)',
        border: 'none',
        borderRadius: '2px',
        color: '#0C0A08',
        fontFamily: tokens.typography.fontMono,
        fontSize: '11px',
        fontWeight: 700,
        cursor: 'pointer',
        minWidth: '80px',
        letterSpacing: '0.05em',
      }}
    >
      INSTALL
    </button>
  );
};
