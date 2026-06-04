const CACHE_NAME = 'marketing-soul-v2';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/components.js',
  './js/state.js',
  './img/logo.png',
  './img/logo.ico',
  './img/icon-192.png',
  './img/icon-512.png',
  './manifest.json'
];

// Install Event - Pre-cache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching Core Assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing Old Cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Serve from Cache, Fallback to Network
self.addEventListener('fetch', (event) => {
  // Only intercept HTTP/S requests (e.g. ignore local file:// protocols if running locally via file, as service workers only register on HTTP/HTTPS)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      }).catch(() => {
        // Return cached index.html as fallback for offline routes
        return caches.match('./index.html');
      });
    })
  );
});
