const CACHE_NAME = 'impostor-game-v1';

// 1. You MUST list all the files your game needs to run here!
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './style.css',          // Your game's CSS
  './game.js',            // Your game's main logic script
  './assets/impostor.png', // Example: Player sprites/images
  './assets/kill-sound.mp3'// Example: Game audio
];

// Install Event: Caches all the game assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching game assets...');
      return cache.addAll(ASSETS);
    })
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
          .map((key) => {
            console.log('Removing old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Network-first approach for multiplayer, or Cache-first for static assets
self.addEventListener('fetch', (e) => {
  // If your game uses live server data (like WebSockets or API calls), 
  // don't try to cache those requests.
  if (e.request.url.includes('/api/') || e.request.url.includes('socket.io')) {
    return; 
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // Return the cached file if we have it, otherwise fetch from internet
      return cachedResponse || fetch(e.request);
    })
  );
});
