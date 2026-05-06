const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc, serverTimestamp } = require('firebase/firestore');

// Firebase config — use environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

if (!getApps().length) initializeApp(firebaseConfig);
const db = getFirestore();

const CACHE_TTL_DAYS = 7;
const CACHE_TTL_MS = CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;

const CATEGORY_QUERIES = {
  tech: 'tech news 2024 2025',
  coding: 'programming tutorial javascript react',
  music: 'music mix 2025 trending',
  gaming: 'gaming highlights montage 2025',
  science: 'science explained interesting',
  design: 'ui ux design inspiration',
  motivation: 'motivation productivity advice',
  funny: 'funny moments compilation',
  documentary: 'mini documentary interesting',
  startups: 'startup founder story build',
};

const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.privacyredirect.com',
  'https://yt.artemislena.eu',
];

const fetchVideosForCategory = async (query, category) => {
  // Try each Invidious instance
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const res = await fetch(
        `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video&fields=videoId,title,author,lengthSeconds,viewCount,published&sort_by=relevance`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) continue;
      
      return data.slice(0, 15).map(v => ({
        id: v.videoId,
        title: v.title || 'Unknown',
        channel: v.author || 'Unknown',
        thumbnail: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
        views: v.viewCount ? `${Math.round(v.viewCount/1000)}K views` : '',
        duration: v.lengthSeconds ? 
          `${Math.floor(v.lengthSeconds/60)}:${String(v.lengthSeconds%60).padStart(2,'0')}` : '',
        published: v.published ? new Date(v.published*1000).getFullYear().toString() : '',
        category,
      })).filter(v => v.id);
    } catch { continue; }
  }

  // Fallback: simple YouTube HTML scrape
  try {
    const ytRes = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      { 
        headers: { 'Accept-Language': 'en-US,en;q=0.9', 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(5000),
      }
    );
    const html = await ytRes.text();
    const matches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
    const ids = [...new Set(matches.map(m => m[1]))].slice(0, 15);
    
    return ids.map(id => ({
      id,
      title: 'Video',
      channel: '',
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      views: '', duration: '', published: '',
      category,
    }));
  } catch { return []; }
};
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const { category } = event.queryStringParameters || {};

    if (!category || !CATEGORY_QUERIES[category]) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid category' }),
      };
    }

    // Check Firebase cache
    const cacheRef = doc(db, 'smittv_videos', category);
    const cacheSnap = await getDoc(cacheRef);

    if (cacheSnap.exists()) {
      const cached = cacheSnap.data();
      const age = Date.now() - cached.cachedAt?.toMillis?.();

      if (age < CACHE_TTL_MS) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            videos: cached.videos,
            source: 'cache',
            age: Math.floor(age / (1000 * 60 * 60)) + 'h',
          }),
        };
      }
    }

    // Cache miss — scrape YouTube
    const query = CATEGORY_QUERIES[category];
    const videos = await fetchVideosForCategory(query, category);
    if (videos.length === 0) throw new Error('No videos found');

    // Save to Firebase cache
    await setDoc(cacheRef, {
      videos,
      category,
      cachedAt: serverTimestamp(),
      count: videos.length,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        videos,
        source: 'scrape',
        count: videos.length,
      }),
    };

  } catch (error) {
    console.error('SmitTV fetch error:', error);

    // Return fallback videos on error
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        videos: getFallbackVideos(),
        source: 'fallback',
        error: error.message,
      }),
    };
  }
};

// Fallback videos for when scraping fails
// These are real, handpicked video IDs
const getFallbackVideos = () => [
  // TECH
  { id: 'rHIkrotSwcc', title: '100 Seconds of Code', channel: 'Fireship', thumbnail: `https://img.youtube.com/vi/rHIkrotSwcc/maxresdefault.jpg`, views: '2M views', duration: '1:40', published: '2 years ago', category: 'tech' },
  { id: 'Tn6-PIqc4UM', title: 'React in 100 Seconds', channel: 'Fireship', thumbnail: `https://img.youtube.com/vi/Tn6-PIqc4UM/maxresdefault.jpg`, views: '1.5M views', duration: '1:42', published: '3 years ago', category: 'tech' },
  { id: 'zOjov-2OZ0E', title: 'JavaScript in 100 Seconds', channel: 'Fireship', thumbnail: `https://img.youtube.com/vi/zOjov-2OZ0E/maxresdefault.jpg`, views: '3M views', duration: '1:48', published: '3 years ago', category: 'coding' },
  { id: 'JdGnYNtuEtE', title: 'Rust in 100 Seconds', channel: 'Fireship', thumbnail: `https://img.youtube.com/vi/JdGnYNtuEtE/maxresdefault.jpg`, views: '1M views', duration: '1:55', published: '2 years ago', category: 'coding' },
  { id: 'DCSDgdziNVQ', title: 'Why Developers Are Switching to Bun', channel: 'Fireship', thumbnail: `https://img.youtube.com/vi/DCSDgdziNVQ/maxresdefault.jpg`, views: '500K views', duration: '4:37', published: '1 year ago', category: 'tech' },
  { id: 'p3qi-NaZjLE', title: 'The Most Powerful Idea in Programming', channel: 'Fireship', thumbnail: `https://img.youtube.com/vi/p3qi-NaZjLE/maxresdefault.jpg`, views: '800K views', duration: '5:09', published: '1 year ago', category: 'coding' },
  { id: 'vZBa63n6yE8', title: 'TypeScript in 100 Seconds', channel: 'Fireship', thumbnail: `https://img.youtube.com/vi/vZBa63n6yE8/maxresdefault.jpg`, views: '1.2M views', duration: '1:50', published: '2 years ago', category: 'coding' },
  { id: '8aGhZQkoFbQ', title: 'Promise in 100 Seconds', channel: 'Fireship', thumbnail: `https://img.youtube.com/vi/8aGhZQkoFbQ/maxresdefault.jpg`, views: '700K views', duration: '1:38', published: '3 years ago', category: 'coding' },

  // SCIENCE
  { id: 'nCMHzLkKOPQ', title: 'The Infinite Hotel Paradox', channel: 'TED-Ed', thumbnail: `https://img.youtube.com/vi/nCMHzLkKOPQ/maxresdefault.jpg`, views: '20M views', duration: '6:00', published: '8 years ago', category: 'science' },
  { id: 'OoU3-keOGBo', title: 'Could the Earth be Hollow?', channel: 'Kurzgesagt', thumbnail: `https://img.youtube.com/vi/OoU3-keOGBo/maxresdefault.jpg`, views: '7M views', duration: '8:52', published: '4 years ago', category: 'science' },

  // MOTIVATION  
  { id: 'mgmVOuLgFB0', title: 'Steve Jobs 2005 Stanford Commencement', channel: 'Stanford', thumbnail: `https://img.youtube.com/vi/mgmVOuLgFB0/maxresdefault.jpg`, views: '40M views', duration: '15:04', published: '14 years ago', category: 'motivation' },
  { id: 'Lp7E973zozc', title: 'Elon Musk: The mind behind Tesla', channel: 'TED', thumbnail: `https://img.youtube.com/vi/Lp7E973zozc/maxresdefault.jpg`, views: '12M views', duration: '18:04', published: '11 years ago', category: 'motivation' },

  // DESIGN
  { id: 'YqQx75OPRa0', title: 'Why does the universe exist?', channel: 'TED', thumbnail: `https://img.youtube.com/vi/YqQx75OPRa0/maxresdefault.jpg`, views: '5M views', duration: '7:51', published: '6 years ago', category: 'science' },

  // MUSIC
  { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', channel: 'Rick Astley', thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`, views: '1.4B views', duration: '3:33', published: '15 years ago', category: 'music' },
];
