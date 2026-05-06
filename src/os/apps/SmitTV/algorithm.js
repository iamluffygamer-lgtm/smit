const CATEGORIES = [
  'tech', 'coding', 'music', 'gaming',
  'science', 'design', 'motivation', 'funny',
  'documentary', 'startups',
];

const STORAGE_KEY = 'smittv-preferences';
const HISTORY_KEY = 'smittv-history';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PREFERENCE VECTOR
// Each category has a weight 0.01 to 1.0
// Higher weight = more videos from that category
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const getPreferences = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return generateRandomPreferences();
};

export const savePreferences = (prefs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
};

export const generateRandomPreferences = () => {
  const prefs = {};
  CATEGORIES.forEach(cat => {
    prefs[cat] = Math.random() * 0.8 + 0.1; // 0.1 to 0.9
  });
  return prefs;
};

// Normalize so all weights sum to 1.0
export const normalize = (prefs) => {
  const total = Object.values(prefs).reduce((a, b) => a + b, 0);
  const normalized = {};
  CATEGORIES.forEach(cat => {
    normalized[cat] = (prefs[cat] || 0.1) / total;
  });
  return normalized;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FEED BUILDER
// Weighted sample from category buckets
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const buildFeed = (videosByCategory, preferences, feedSize = 20) => {
  const normalized = normalize(preferences);
  const feed = [];
  const used = new Set();

  CATEGORIES.forEach(cat => {
    const videos = videosByCategory[cat] || [];
    const weight = normalized[cat];
    const take = Math.max(1, Math.round(weight * feedSize));
    
    const available = videos.filter(v => !used.has(v.id));
    const sampled = seededShuffle(available, Date.now()).slice(0, take);
    
    sampled.forEach(v => {
      used.add(v.id);
      feed.push({ ...v, category: cat });
    });
  });

  // Final shuffle for variety
  return seededShuffle(feed, Date.now() + 1).slice(0, feedSize);
};

// Seeded shuffle using Fisher-Yates
const seededShuffle = (arr, seed) => {
  const result = [...arr];
  let s = seed;
  
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (s >>> 0) / 0xFFFFFFFF;
  };
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PREFERENCE UPDATER
// Called when user watches a video
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const updatePreferences = (preferences, watchedCategory, watchDuration) => {
  // Only update if watched > 30 seconds
  if (watchDuration < 30) return preferences;
  
  const updated = { ...preferences };
  
  // Reward watched category
  const reward = watchDuration > 120 ? 0.15 : 0.08;
  updated[watchedCategory] = Math.min(1.0, (updated[watchedCategory] || 0.1) + reward);
  
  // Decay all other categories slightly
  CATEGORIES.forEach(cat => {
    if (cat !== watchedCategory) {
      updated[cat] = Math.max(0.01, (updated[cat] || 0.1) - 0.02);
    }
  });
  
  return updated;
};

// Manual boost — when user clicks a category chip
export const boostCategory = (preferences, category) => {
  const updated = { ...preferences };
  updated[category] = Math.min(1.0, (updated[category] || 0.1) + 0.25);
  return updated;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WATCH HISTORY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addToHistory = (video) => {
  const history = getHistory();
  const filtered = history.filter(v => v.id !== video.id);
  const updated = [{ ...video, watchedAt: Date.now() }, ...filtered].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const getAlgorithmExplanation = (preferences) => {
  const normalized = normalize(preferences);
  const sorted = Object.entries(normalized)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([cat, weight]) => `${cat} (${Math.round(weight * 100)}%)`);
  
  return `Your feed is ${sorted.join(', ')} based on watch history.`;
};

export { CATEGORIES };
