/**
 * MonsoonGuard Service Worker
 * Provides offline caching with strategy-per-resource-type pattern.
 * 
 * Strategies:
 * - App Shell (HTML/CSS/JS): Cache-first
 * - API calls: Network-first with cache fallback
 * - Static assets: Stale-while-revalidate
 */

const CACHE_VERSION = 'monsoonguard-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;

/** Assets to pre-cache during install */
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

/**
 * Install event — pre-cache essential app shell assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate event — clean up old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name.startsWith('monsoonguard-') && name !== STATIC_CACHE && name !== API_CACHE)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

/**
 * Determine caching strategy based on request URL
 * @param {Request} request
 * @returns {'cache-first' | 'network-first' | 'stale-while-revalidate'}
 */
function getStrategy(request) {
  const url = new URL(request.url);
  
  // API calls — network-first with cache fallback
  if (
    url.hostname === 'generativelanguage.googleapis.com' ||
    url.hostname === 'api.openweathermap.org'
  ) {
    return 'network-first';
  }
  
  // Google Fonts — stale-while-revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    return 'stale-while-revalidate';
  }
  
  // App shell — cache-first
  return 'cache-first';
}

/**
 * Cache-first strategy: serve from cache, fall back to network
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

/**
 * Network-first strategy: try network, fall back to cache
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    return new Response(
      JSON.stringify({ error: 'offline', message: 'No network connection and no cached data available' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Stale-while-revalidate: serve cached immediately, update cache in background
 */
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const cache = caches.open(STATIC_CACHE);
        cache.then((c) => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => cached);
  
  return cached || fetchPromise;
}

/**
 * Fetch event — route requests to appropriate caching strategy
 */
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  const strategy = getStrategy(event.request);
  
  switch (strategy) {
    case 'cache-first':
      event.respondWith(cacheFirst(event.request));
      break;
    case 'network-first':
      event.respondWith(networkFirst(event.request));
      break;
    case 'stale-while-revalidate':
      event.respondWith(staleWhileRevalidate(event.request));
      break;
  }
});
