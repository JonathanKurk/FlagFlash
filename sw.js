const CACHE_NAME = 'flashflag-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

// 1. Installieren und statische Dateien cachen
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Anfragen abfangen (Offline Logik)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Wenn im Cache, nimm es (z.B. index.html oder bereits geladene Flagge)
            if (cachedResponse) {
                return cachedResponse;
            }

            // Wenn nicht im Cache, lade es aus dem Internet
            return fetch(event.request).then((networkResponse) => {
                // Nur gültige Antworten cachen
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && !event.request.url.includes('flags')) {
                    return networkResponse;
                }

                // API und Flaggenbilder in den Cache klonen für später
                if(event.request.url.includes('restcountries') || event.request.url.includes('flag')) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }

                return networkResponse;
            }).catch(() => {
                // Falls Offline und nicht im Cache: Pech gehabt (oder Platzhalter anzeigen)
                console.log("Offline und nicht im Cache:", event.request.url);
            });
        })
    );
});