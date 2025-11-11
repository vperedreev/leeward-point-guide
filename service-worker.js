/*
 * Basic service worker implementation to enable offline access.  It
 * precaches the site shell and returns cached responses when offline.
 */

// Bump the cache name whenever assets change to ensure clients pick up
// the latest version. v7 updates the UI design and colours.
// Bump the cache name whenever assets change to ensure clients receive the latest files.
const CACHE_NAME = 'leeward-point-cache-v10';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/info.html',
  '/subcategory.html',
  '/search.html',
  '/map.html',
  '/admin.html',
  '/style.css',
  '/script.js',
  '/data.json',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // ensure the hero image is cached for offline access
  '/hero.png',
  '/hero-button.png',
  // new pages for house tour and how-to
  '/house-tour.html',
  '/howto.html',
  '/howto-item.html',
  '/topic.html',
  // pre-cache new incoming images to ensure offline availability
  '/images/_incoming/0A740C08-D444-4C26-AC52-D4C65B1C6377.png',
  '/images/_incoming/0E8D1C7E-E189-4134-A62C-54BEAC462290.png',
  '/images/_incoming/0EA16F1C-6C3E-4E2A-80A9-3AB6CAE0186D.jpeg',
  '/images/_incoming/0EE26473-943E-4CA7-922F-7804FBF1A4E5.jpeg',
  '/images/_incoming/0F831DD5-FF18-4C1B-AF79-6870C1FBF2D.jpeg',
  '/images/_incoming/1A023195-03C2-45C2-8BC3-EE9A360D5381.jpeg'
  ,
  // New generic local-area images to support the updated local-area pages
  '/images/local_area/restaurant.png',
  '/images/local_area/cafe.png',
  '/images/local_area/bar_brewery.png',
  '/images/local_area/trail.png',
  '/images/local_area/beach.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    ))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});