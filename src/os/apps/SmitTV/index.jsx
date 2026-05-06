import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../../styles/tokens';
import {
  getPreferences, savePreferences, buildFeed,
  updatePreferences, boostCategory, addToHistory,
  getHistory, getAlgorithmExplanation, CATEGORIES,
  generateRandomPreferences, normalize,
  applyFeedMode, FEED_MODES, getArchetype,
} from './algorithm';

const NETLIFY_FUNCTION = '/.netlify/functions/smittv-fetch';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function SmitTV() {
  const [preferences, setPreferences] = useState(getPreferences);
  const [videosByCategory, setVideosByCategory] = useState({});
  const [feed, setFeed] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState([]);
  const [showPrefs, setShowPrefs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('feed'); // feed | history
  const [playerReady, setPlayerReady] = useState(false);
  const [systemMsg, setSystemMsg] = useState(null);
  const [sessionStart] = useState(Date.now());
  const [sessionObservation, setSessionObservation] = useState(null);
  const [totalWatchTime, setTotalWatchTime] = useState(0);
  const [feedMode, setFeedMode] = useState(null);
  
  const watchStartRef = useRef(null);
  const watchTimerRef = useRef(null);

  const getTopCategory = (prefs) => {
    return Object.entries(prefs)
      .sort(([,a],[,b]) => b - a)[0]?.[0] || 'mixed';
  };

  useEffect(() => {
    if (totalWatchTime > 0 && totalWatchTime % 600 === 0) {
      const topCat = getTopCategory(preferences);
      const mins = Math.round(totalWatchTime / 60);
      setSessionObservation(
        `You've been exploring ${topCat} content for ${mins} minutes`
      );
      setTimeout(() => setSessionObservation(null), 5000);
    }
  }, [totalWatchTime]);

  // Fetch videos for all categories on mount
  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Rebuild feed when videos or preferences change
  useEffect(() => {
    if (Object.keys(videosByCategory).length > 0) {
      const effectivePrefs = feedMode 
        ? applyFeedMode(preferences, feedMode) 
        : preferences;
      const newFeed = buildFeed(videosByCategory, effectivePrefs);
      setFeed(newFeed);
      if (!currentVideo && newFeed.length > 0) {
        setCurrentVideo(newFeed[0]);
      }
    }
  }, [videosByCategory, preferences, feedMode]);

  const fetchAllCategories = async () => {
    setLoading(true);
    const cats = CATEGORIES.slice(0, 6); // fetch 6 categories initially
    
    const results = {};
    
    await Promise.allSettled(
      cats.map(async (cat) => {
        setLoadingCategories(prev => [...prev, cat]);
        try {
          const res = await fetch(`${NETLIFY_FUNCTION}?category=${cat}`);
          const data = await res.json();
          if (data.videos?.length) {
            results[cat] = data.videos;
          }
        } catch (e) {
          console.warn(`Failed to fetch ${cat}:`, e);
        }
        setLoadingCategories(prev => prev.filter(c => c !== cat));
      })
    );
    
    setVideosByCategory(results);
    setLoading(false);
  };

  // Track watch time
  const handleVideoLoad = useCallback(() => {
    setPlayerReady(true);
    watchStartRef.current = Date.now();
    
    // Check watch time every 5 seconds
    watchTimerRef.current = setInterval(() => {
      if (watchStartRef.current && currentVideo) {
        setTotalWatchTime(prev => prev + 5);
        const duration = (Date.now() - watchStartRef.current) / 1000;
        if (duration > 30) {
          const { prefs: updatedPrefs, message } = updatePreferences(
            preferences,
            currentVideo.category,
            duration
          );
          setPreferences(updatedPrefs);
          savePreferences(updatedPrefs);
          if (message) {
            setSystemMsg(message);
            setTimeout(() => setSystemMsg(null), 3000);
          }
        }
      }
    }, 5000);
    
    return () => clearInterval(watchTimerRef.current);
  }, [currentVideo, preferences]);

  const handleSelectVideo = (video) => {
    if (watchTimerRef.current) clearInterval(watchTimerRef.current);
    watchStartRef.current = null;
    setPlayerReady(false);
    setCurrentVideo(video);
    addToHistory(video);
  };

  const handleCategoryBoost = (category) => {
    const updated = boostCategory(preferences, category);
    setPreferences(updated);
    savePreferences(updated);
  };

  const handleRandomize = () => {
    const fresh = generateRandomPreferences();
    setPreferences(fresh);
    savePreferences(fresh);
  };

  const filteredFeed = searchQuery
    ? feed.filter(v =>
        v.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.channel?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : feed;

  const normalizedPrefs = normalize(preferences);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: tokens.colors.bgSurface,
      fontFamily: tokens.typography.fontMono,
      overflow: 'hidden',
      position: 'relative',
    }}>

      {(systemMsg || sessionObservation) && (
        <div style={{
          position: 'absolute',
          top: '48px',
          right: '12px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          pointerEvents: 'none',
        }}>
          {systemMsg && (
            <div style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              border: '1px solid rgba(var(--os-accent-rgb, 232,160,32), 0.3)',
              borderRadius: '2px',
              fontFamily: tokens.typography.fontMono,
              fontSize: '10px',
              color: 'var(--os-accent)',
              letterSpacing: '0.08em',
              opacity: 0.85,
              backdropFilter: 'blur(8px)',
            }}>
              {'> ' + systemMsg}
            </div>
          )}
          {sessionObservation && (
            <div style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '2px',
              fontFamily: tokens.typography.fontMono,
              fontSize: '10px',
              color: tokens.colors.textTertiary,
              letterSpacing: '0.06em',
              backdropFilter: 'blur(8px)',
            }}>
              {'// ' + sessionObservation}
            </div>
          )}
        </div>
      )}

      {/* TOP BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 16px',
        borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
        backgroundColor: tokens.colors.bgCanvas,
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--os-accent)',
          letterSpacing: '0.08em',
        }}>
          SMIT TV
        </div>
        
        <div style={{
          width: '1px', height: '16px',
          backgroundColor: tokens.colors.borderSubtle,
        }} />
        
        {/* Search */}
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="search feed..."
          style={{
            flex: 1,
            maxWidth: '240px',
            backgroundColor: tokens.colors.bgSunken,
            border: `1px solid ${tokens.colors.borderSubtle}`,
            borderRadius: '2px',
            padding: '4px 10px',
            color: tokens.colors.textPrimary,
            fontFamily: tokens.typography.fontMono,
            fontSize: '11px',
            outline: 'none',
          }}
        />
        
        {/* Algorithm explanation */}
        <div style={{
          fontSize: '10px',
          color: tokens.colors.textTertiary,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {getAlgorithmExplanation(preferences)}
        </div>
        
        {/* Preferences toggle */}
        <button
          onClick={() => setShowPrefs(s => !s)}
          style={{
            padding: '4px 10px',
            backgroundColor: showPrefs ? tokens.colors.accentMuted : 'transparent',
            border: `1px solid ${showPrefs ? tokens.colors.accentBorder : tokens.colors.borderSubtle}`,
            borderRadius: '2px',
            color: showPrefs ? 'var(--os-accent)' : tokens.colors.textTertiary,
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          ⚙ PREFS
        </button>

        <button
          onClick={handleRandomize}
          style={{
            padding: '4px 10px',
            backgroundColor: 'transparent',
            border: `1px solid ${tokens.colors.borderSubtle}`,
            borderRadius: '2px',
            color: tokens.colors.textTertiary,
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
          title="Randomize your feed"
        >
          ⟳ SHUFFLE
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>

        {/* LEFT — Player + Info */}
        <div style={{
          width: '55%',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRight: `1px solid ${tokens.colors.borderSubtle}`,
        }}>
          
          {/* Player */}
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9
            backgroundColor: '#000',
            flexShrink: 0,
          }}>
            {currentVideo ? (
              <iframe
                key={currentVideo.id}
                src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleVideoLoad}
                title={currentVideo.title}
              />
            ) : (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '8px',
                color: tokens.colors.textTertiary,
                fontSize: '11px',
              }}>
                {loading ? (
                  <>
                    <div style={{ color: 'var(--os-accent)', fontSize: '20px' }}>◉</div>
                    <div>Loading your feed...</div>
                    <div style={{ fontSize: '10px' }}>
                      {loadingCategories.length > 0 && `fetching: ${loadingCategories.join(', ')}`}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '24px', opacity: 0.3 }}>▶</div>
                    <div>Select a video to start</div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Video Info */}
          {currentVideo && (
            <div style={{
              padding: '12px 16px',
              borderBottom: `1px solid ${tokens.colors.borderFaint}`,
              flexShrink: 0,
            }}>
              <div style={{
                fontSize: '14px',
                fontFamily: tokens.typography.fontSans,
                fontWeight: 600,
                color: tokens.colors.textPrimary,
                lineHeight: 1.4,
                marginBottom: '4px',
              }}>
                {currentVideo.title}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '11px',
                color: tokens.colors.textTertiary,
              }}>
                <span>{currentVideo.channel}</span>
                {currentVideo.views && <span>{currentVideo.views}</span>}
                {currentVideo.published && <span>{currentVideo.published}</span>}
                <span style={{
                  marginLeft: 'auto',
                  padding: '2px 8px',
                  backgroundColor: tokens.colors.accentMuted,
                  border: `1px solid ${tokens.colors.accentBorder}`,
                  borderRadius: '2px',
                  color: 'var(--os-accent)',
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                }}>
                  {currentVideo.category?.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Category chips */}
          <div style={{
            padding: '10px 16px',
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            flexShrink: 0,
            borderBottom: `1px solid ${tokens.colors.borderFaint}`,
          }}>
            <div style={{
              fontSize: '10px',
              color: tokens.colors.textTertiary,
              letterSpacing: '0.08em',
              alignSelf: 'center',
              marginRight: '4px',
            }}>
              BOOST:
            </div>
            {CATEGORIES.slice(0, 8).map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryBoost(cat)}
                style={{
                  padding: '3px 8px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${tokens.colors.borderSubtle}`,
                  borderRadius: '2px',
                  color: tokens.colors.textTertiary,
                  fontFamily: tokens.typography.fontMono,
                  fontSize: '10px',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => {
                  e.target.style.borderColor = tokens.colors.accentBorder;
                  e.target.style.color = 'var(--os-accent)';
                }}
                onMouseLeave={e => {
                  e.target.style.borderColor = tokens.colors.borderSubtle;
                  e.target.style.color = tokens.colors.textTertiary;
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Algorithm visualization */}
          <div style={{
            padding: '10px 16px',
            flex: 1,
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}>
            <div style={{
              fontSize: '10px',
              color: tokens.colors.textTertiary,
              letterSpacing: '0.1em',
              marginBottom: '8px',
            }}>
              // YOUR PREFERENCE WEIGHTS
            </div>
            {CATEGORIES.map(cat => {
              const weight = normalizedPrefs[cat] || 0;
              return (
                <div key={cat} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px',
                }}>
                  <div style={{
                    width: '72px',
                    fontSize: '10px',
                    color: tokens.colors.textTertiary,
                    letterSpacing: '0.04em',
                    flexShrink: 0,
                  }}>
                    {cat}
                  </div>
                  <div style={{
                    flex: 1,
                    height: '4px',
                    backgroundColor: tokens.colors.bgElevated,
                    borderRadius: '0',
                    overflow: 'hidden',
                  }}>
                    <motion.div
                      animate={{ width: `${weight * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        backgroundColor: 'var(--os-accent)',
                        opacity: 0.6 + weight * 0.4,
                      }}
                    />
                  </div>
                  <div style={{
                    width: '32px',
                    fontSize: '10px',
                    color: 'var(--os-accent)',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}>
                    {Math.round(weight * 100)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Feed */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          
          {/* Feed tabs */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
            flexShrink: 0,
          }}>
            {['feed', 'history'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab
                    ? '2px solid var(--os-accent)'
                    : '2px solid transparent',
                  color: activeTab === tab
                    ? 'var(--os-accent)'
                    : tokens.colors.textTertiary,
                  fontFamily: tokens.typography.fontMono,
                  fontSize: '11px',
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {tab}
              </button>
            ))}
            
            {activeTab === 'feed' && (
              <div style={{
                marginLeft: 'auto',
                padding: '8px 16px',
                fontSize: '10px',
                color: tokens.colors.textTertiary,
                alignSelf: 'center',
              }}>
                {filteredFeed.length} videos
              </div>
            )}
          </div>

          {/* Video list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}>
            {loading ? (
              <div style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: tokens.colors.textTertiary,
                fontSize: '12px',
              }}>
                <div style={{
                  color: 'var(--os-accent)',
                  fontSize: '20px',
                  marginBottom: '8px',
                  animation: 'spin 2s linear infinite',
                }}>
                  ◉
                </div>
                <div>Building your feed...</div>
                <div style={{ fontSize: '10px', marginTop: '4px' }}>
                  Fetching {loadingCategories.length} categories
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <AnimatePresence>
                {(activeTab === 'feed' ? filteredFeed : getHistory()).map((video, i) => (
                  <VideoCard
                    key={`${video.id}-${i}`}
                    video={video}
                    isActive={currentVideo?.id === video.id}
                    index={i}
                    onSelect={handleSelectVideo}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* PREFERENCES PANEL — Slide in from right */}
      <AnimatePresence>
        {showPrefs && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '280px',
              height: '100%',
              backgroundColor: tokens.colors.bgElevated,
              borderLeft: `1px solid ${tokens.colors.borderDefault}`,
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: tokens.shadowLg,
            }}
          >
            <div style={{
              padding: '16px',
              borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--os-accent)',
                letterSpacing: '0.1em',
              }}>
                // PREFERENCES
              </div>
              <button
                onClick={() => setShowPrefs(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: tokens.colors.textTertiary,
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >×</button>
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              scrollbarWidth: 'none',
            }}>
              <div style={{
                fontSize: '11px',
                color: tokens.colors.textSecondary,
                fontFamily: tokens.typography.fontSans,
                lineHeight: 1.6,
                marginBottom: '16px',
              }}>
                Adjust weights to control your feed.
                Drag sliders or click categories to boost.
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  fontSize: '10px',
                  color: tokens.colors.textTertiary,
                  letterSpacing: '0.1em',
                  marginBottom: '10px',
                }}>
                  // FEED MODE
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {Object.entries(FEED_MODES).map(([key, mode]) => (
                    <div
                      key={key}
                      onClick={() => setFeedMode(feedMode === key ? null : key)}
                      style={{
                        padding: '5px 10px',
                        border: `1px solid ${feedMode === key ? 
                          'var(--os-accent)' : tokens.colors.borderSubtle}`,
                        borderRadius: '2px',
                        fontSize: '10px',
                        fontFamily: tokens.typography.fontMono,
                        color: feedMode === key ? 'var(--os-accent)' : tokens.colors.textTertiary,
                        cursor: 'pointer',
                        backgroundColor: feedMode === key ? 
                          'rgba(232,160,32,0.08)' : 'transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      {mode.icon} {mode.label}
                    </div>
                  ))}
                </div>
                {feedMode && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '10px',
                    color: tokens.colors.textTertiary,
                    fontFamily: tokens.typography.fontMono,
                  }}>
                    // {FEED_MODES[feedMode].description}
                  </div>
                )}
              </div>

              {CATEGORIES.map(cat => {
                const weight = preferences[cat] || 0.1;
                const pct = Math.round(weight * 100);
                return (
                  <div key={cat} style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}>
                      <span style={{
                        fontSize: '11px',
                        color: tokens.colors.textSecondary,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}>
                        {cat}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: 'var(--os-accent)',
                      }}>
                        {pct}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={pct}
                      onChange={(e) => {
                        const updated = {
                          ...preferences,
                          [cat]: parseInt(e.target.value) / 100,
                        };
                        setPreferences(updated);
                        savePreferences(updated);
                      }}
                      style={{
                        width: '100%',
                        accentColor: 'var(--os-accent)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                );
              })}

              {(() => {
                const { archetype, insight } = getArchetype(preferences);
                return (
                  <div style={{ marginTop: '20px', paddingTop: '16px',
                    borderTop: `1px solid ${tokens.colors.borderSubtle}` }}>
                    <div style={{
                      fontSize: '10px',
                      color: tokens.colors.textTertiary,
                      letterSpacing: '0.1em',
                      marginBottom: '8px',
                    }}>
                      // VIEWER PROFILE
                    </div>
                    <div style={{
                      fontSize: '13px',
                      fontFamily: tokens.typography.fontMono,
                      color: 'var(--os-accent)',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      marginBottom: '4px',
                    }}>
                      {archetype.toUpperCase()} ARCHETYPE
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: tokens.colors.textSecondary,
                      fontFamily: tokens.typography.fontMono,
                    }}>
                      {'> ' + insight}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={{
              padding: '12px 16px',
              borderTop: `1px solid ${tokens.colors.borderSubtle}`,
              display: 'flex',
              gap: '8px',
            }}>
              <button
                onClick={handleRandomize}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${tokens.colors.borderSubtle}`,
                  borderRadius: '2px',
                  color: tokens.colors.textTertiary,
                  fontFamily: tokens.typography.fontMono,
                  fontSize: '10px',
                  cursor: 'pointer',
                }}
              >
                RANDOMIZE
              </button>
              <button
                onClick={() => {
                  const fresh = generateRandomPreferences();
                  setPreferences(fresh);
                  savePreferences(fresh);
                  fetchAllCategories();
                  setShowPrefs(false);
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: 'var(--os-accent)',
                  border: 'none',
                  borderRadius: '2px',
                  color: tokens.colors.bgCanvas,
                  fontFamily: tokens.typography.fontMono,
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                REFRESH FEED
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIDEO CARD COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const VideoCard = ({ video, isActive, index, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      onClick={() => onSelect(video)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        gap: '10px',
        padding: '10px 12px',
        cursor: 'pointer',
        borderBottom: `1px solid ${tokens.colors.borderFaint}`,
        backgroundColor: isActive
          ? tokens.colors.accentMuted
          : hovered
          ? tokens.colors.bgElevated
          : 'transparent',
        borderLeft: isActive
          ? '2px solid var(--os-accent)'
          : '2px solid transparent',
        transition: 'all 0.1s',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '100px',
        height: '56px',
        flexShrink: 0,
        backgroundColor: tokens.colors.bgElevated,
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {video.thumbnail && !imgError ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tokens.colors.textTertiary,
            fontSize: '20px',
          }}>
            ▶
          </div>
        )}
        {video.duration && (
          <div style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            fontSize: '9px',
            padding: '1px 3px',
            borderRadius: '1px',
            fontFamily: tokens.typography.fontMono,
          }}>
            {video.duration}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '12px',
          fontFamily: tokens.typography.fontSans,
          fontWeight: 500,
          color: isActive ? tokens.colors.textPrimary : tokens.colors.textSecondary,
          lineHeight: 1.4,
          marginBottom: '3px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {video.title}
        </div>
        <div style={{
          fontSize: '10px',
          color: tokens.colors.textTertiary,
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
        }}>
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100px',
          }}>
            {video.channel}
          </span>
          {video.category && (
            <span style={{
              padding: '1px 5px',
              backgroundColor: 'rgba(232,160,32,0.1)',
              border: '1px solid rgba(232,160,32,0.2)',
              borderRadius: '2px',
              color: 'var(--os-accent)',
              fontSize: '9px',
              flexShrink: 0,
            }}>
              {video.category}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
