const CATEGORIES = [
  'tech', 'coding', 'music', 'gaming',
  'science', 'design', 'motivation', 'funny',
  'documentary', 'startups',
];

export const FEED_MODES = {
  DEEP_WORK: {
    label: 'DEEP WORK',
    icon: '⬡',
    description: 'Focus mode. Technical content prioritized.',
    boosts: { coding: 0.4, science: 0.3, documentary: 0.2 },
    suppresses: { funny: 0.6, music: 0.5, gaming: 0.5 },
  },
  CHAOS: {
    label: 'CHAOS',
    icon: '◈',
    description: 'Maximum variety. Category switching enabled.',
    boosts: { funny: 0.3, gaming: 0.3, music: 0.2 },
    suppresses: { documentary: 0.3 },
    randomize: true,
  },
  INSPIRE: {
    label: 'INSPIRE',
    icon: '△',
    description: 'Motivation and creation. Ideas over execution.',
    boosts: { motivation: 0.4, startups: 0.3, design: 0.3 },
    suppresses: { gaming: 0.4, funny: 0.3 },
  },
  LEARN: {
    label: 'LEARN',
    icon: '◎',
    description: 'Educational content. Long-form preferred.',
    boosts: { coding: 0.3, science: 0.4, tech: 0.3 },
    suppresses: { funny: 0.5, music: 0.4, gaming: 0.5 },
  },
  CHILL: {
    label: 'CHILL',
    icon: '○',
    description: 'Low effort. Music and light content.',
    boosts: { music: 0.5, funny: 0.3, documentary: 0.2 },
    suppresses: { coding: 0.4, science: 0.3 },
  },
};

export const applyFeedMode = (preferences, mode) => {
  if (!mode || !FEED_MODES[mode]) return preferences;
  const config = FEED_MODES[mode];
  const updated = { ...preferences };
  
  Object.entries(config.boosts || {}).forEach(([cat, boost]) => {
    updated[cat] = Math.min(1.0, (updated[cat] || 0.1) + boost);
  });
  Object.entries(config.suppresses || {}).forEach(([cat, suppress]) => {
    updated[cat] = Math.max(0.01, (updated[cat] || 0.1) - suppress);
  });
  
  return updated;
};

export const getArchetype = (preferences) => {
  const normalized = normalize(preferences);
  const techScore = (normalized.coding||0) + (normalized.tech||0) + (normalized.science||0);
  const createScore = (normalized.design||0) + (normalized.startups||0) + (normalized.motivation||0);
  const entertainScore = (normalized.music||0) + (normalized.gaming||0) + (normalized.funny||0);
  const learnScore = (normalized.documentary||0) + (normalized.science||0) + (normalized.coding||0);

  const scores = {
    'Builder': techScore + createScore * 0.5,
    'Explorer': learnScore + entertainScore * 0.3,
    'Creator': createScore + (normalized.design||0),
    'Researcher': learnScore + techScore * 0.5,
  };
  
  const archetype = Object.entries(scores)
    .sort(([,a],[,b]) => b - a)[0][0];

  const insights = {
    Builder: ['High technical curiosity detected', 'Build-oriented content preference', 'Low entertainment bias'],
    Explorer: ['Broad category exploration detected', 'Diverse content appetite', 'High intellectual curiosity'],
    Creator: ['Design and creation affinity noted', 'Inspiration-seeking behavior', 'Aesthetic content preference'],
    Researcher: ['Long-form learning preference', 'Deep dive behavior detected', 'Knowledge accumulation pattern'],
  };

  return {
    archetype,
    insight: insights[archetype][Math.floor(Math.random() * 3)],
  };
};

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
    const sampled = [...available].sort(() => Math.random() - 0.5).slice(0, take);
    
    sampled.forEach(v => {
      used.add(v.id);
      feed.push({ ...v, category: cat });
    });
  });

  // Final shuffle for variety
  return [...feed].sort(() => Math.random() - 0.5).slice(0, feedSize);
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
  if (watchDuration < 30) return { prefs: preferences, message: null };
  
  const updated = { ...preferences };
  const reward = watchDuration > 120 ? 0.15 : 0.08;
  updated[watchedCategory] = Math.min(1.0, (updated[watchedCategory] || 0.1) + reward);
  
  CATEGORIES.forEach(cat => {
    if (cat !== watchedCategory) {
      updated[cat] = Math.max(0.01, (updated[cat] || 0.1) - 0.02);
    }
  });

  // Generate system message
  const messages = watchDuration > 120 ? [
    `${watchedCategory} affinity increased`,
    `Long-form ${watchedCategory} preference detected`,
    `Deep interest in ${watchedCategory} noted`,
    `Feed recalibrating toward ${watchedCategory}`,
  ] : [
    `${watchedCategory} signal received`,
    `Feed adapting to recent activity`,
    `${watchedCategory} weight updated`,
  ];
  
  const message = messages[Math.floor(Math.random() * messages.length)];
  return { prefs: updated, message };
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
