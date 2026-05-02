import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../../styles/tokens';
import { useAppStoreStore, APP_CATALOG } from '../../store/appStoreStore';
import { useWindowStore } from '../../store/windowStore';
import { useNotificationStore } from '../../system/notificationStore';

export default function AppStore() {
  const [activeSection, setActiveSection] = useState('featured');
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

  const featured = APP_CATALOG.filter(a => a.featured);
  const utilities = APP_CATALOG.filter(a => a.category === 'UTILITIES');
  const installedApps = APP_CATALOG.filter(a => isInstalled(a.id));

  const SECTIONS = [
    { id: 'featured',  label: 'Featured' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'installed', label: `Installed (${installedApps.length})` },
  ];

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
              fontSize: '13px',
              color: tokens.colors.textSecondary,
              lineHeight: 1.7,
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
        padding: '16px 20px 0',
        borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
      }}>
        <div style={{
          fontSize: '10px',
          color: tokens.colors.textTertiary,
          letterSpacing: '0.1em',
          marginBottom: '4px',
        }}>
          // APP STORE
        </div>
        <div style={{
          fontSize: '16px',
          fontWeight: 700,
          color: tokens.colors.textPrimary,
          marginBottom: '12px',
        }}>
          SMIT OS Store
        </div>

        {/* Section tabs */}
        <div style={{ display: 'flex', gap: '0' }}>
          {SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeSection === section.id
                  ? `2px solid var(--os-accent)`
                  : '2px solid transparent',
                color: activeSection === section.id
                  ? 'var(--os-accent)'
                  : tokens.colors.textTertiary,
                fontFamily: tokens.typography.fontMono,
                fontSize: '11px',
                cursor: 'pointer',
                letterSpacing: '0.06em',
                transition: 'all 0.15s',
              }}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        padding: '16px 20px',
      }}>

        {activeSection === 'featured' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              fontSize: '10px',
              color: tokens.colors.textTertiary,
              letterSpacing: '0.1em',
              marginBottom: '4px',
            }}>
              // FEATURED
            </div>
            {featured.map(app => (
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
            <div style={{
              fontSize: '10px',
              color: tokens.colors.textTertiary,
              letterSpacing: '0.1em',
              marginTop: '8px',
              marginBottom: '4px',
            }}>
              // UTILITIES
            </div>
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
        )}

        {activeSection === 'utilities' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
        )}

        {activeSection === 'installed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {installedApps.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: tokens.colors.textTertiary,
                fontSize: '12px',
              }}>
                No apps installed yet.{'\n'}
                Browse Featured to get started.
              </div>
            ) : (
              installedApps.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  installed={true}
                  installing={false}
                  progress={0}
                  onInstall={() => {}}
                  onOpen={() => openWindow(app.appId)}
                  onSelect={() => setSelectedApp(app)}
                  showUninstall
                  onUninstall={() => {
                    uninstallApp(app.id);
                    addNotification(`${app.name} uninstalled`, 'info');
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// App Card component
const AppCard = ({ app, installed, installing, progress, onInstall, onOpen, onSelect, showUninstall, onUninstall }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '14px',
        backgroundColor: hovered ? tokens.colors.bgElevated : tokens.colors.bgSurface,
        border: `1px solid ${hovered ? tokens.colors.borderDefault : tokens.colors.borderSubtle}`,
        borderRadius: '2px',
        transition: 'all 0.15s',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Icon */}
        <div
          onClick={onSelect}
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: tokens.colors.bgElevated,
            border: `1px solid ${tokens.colors.borderSubtle}`,
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0,
            cursor: 'pointer',
            color: 'var(--os-accent)',
          }}
        >
          {app.icon}
        </div>

        {/* Info */}
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onSelect}>
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: tokens.colors.textPrimary,
            marginBottom: '2px',
          }}>
            {app.name}
          </div>
          <div style={{
            fontSize: '11px',
            color: tokens.colors.textSecondary,
            marginBottom: '4px',
          }}>
            {app.tagline}
          </div>
          <div style={{
            fontSize: '10px',
            color: tokens.colors.textTertiary,
          }}>
            {app.version} · {app.size}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {showUninstall && (
            <button
              onClick={onUninstall}
              style={{
                padding: '6px 10px',
                backgroundColor: 'transparent',
                border: `1px solid rgba(248,113,113,0.3)`,
                borderRadius: '2px',
                color: '#F87171',
                fontFamily: tokens.typography.fontMono,
                fontSize: '10px',
                cursor: 'pointer',
              }}
            >
              REMOVE
            </button>
          )}
          <InstallButton
            app={app}
            installed={installed}
            installing={installing}
            progress={progress}
            onInstall={onInstall}
            onOpen={onOpen}
          />
        </div>
      </div>

      {/* Install progress bar */}
      {installing && (
        <div style={{ marginTop: '10px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}>
            <span style={{
              fontSize: '10px',
              color: tokens.colors.textTertiary,
              fontFamily: tokens.typography.fontMono,
            }}>
              Installing...
            </span>
            <span style={{
              fontSize: '10px',
              color: 'var(--os-accent)',
              fontFamily: tokens.typography.fontMono,
            }}>
              {progress}%
            </span>
          </div>
          <div style={{
            height: '2px',
            backgroundColor: tokens.colors.bgElevated,
            borderRadius: '0',
            overflow: 'hidden',
          }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              style={{
                height: '100%',
                backgroundColor: 'var(--os-accent)',
              }}
            />
          </div>
        </div>
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
        onClick={onOpen}
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
      onClick={onInstall}
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
