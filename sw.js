const CACHE_NAME = 'flashflag-neo-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Install: Cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch: Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Clone request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if valid
            if(!response || response.status !== 200 || response.type !== 'basic') {
              // Allows cross-origin images (flags) to be loaded but maybe not cached via 'basic' check
              // Removing 'basic' check allows opaque responses (like flags from other domains)
              if (response.type === 'opaque') {
                 // Cache opaque responses (flag images)
              } else {
                 // Standard check
              }
            }

            // Cache new requests (like flag images) dynamically
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                // Nur http/https requests cachen, keine chrome-extensions
                if(event.request.url.startsWith('http')) {
                    cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});
