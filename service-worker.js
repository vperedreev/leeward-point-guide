/*
 * Basic service worker implementation to enable offline access.  It
 * precaches the site shell and returns cached responses when offline.
 */

const CACHE_NAME = 'leeward-point-cache-v1';
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
  '/icon-512.png'
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