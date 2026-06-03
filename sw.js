const CACHE_NAME = 'impostor-game-v1';

// Only cache the 4 files that actually exist in your project
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './1780518954674.png' // Matches your manifest icon perfectly
];

// Install Event: Caches the game assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate Event: Cleans up old versions of the game cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Serving from cache for offline play
self.addEventListener('fetch', (e) => {
  // Bypass caching if your game hits external multiplayer servers/sockets
  if (e.request.url.includes('/api/') || e.request.url.includes('socket.io')) {
    return; 
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
