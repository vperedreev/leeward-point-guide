/*
 * Basic service worker implementation to enable offline access.  It
 * precaches the site shell and returns cached responses when offline.
 */

// Bump the cache name whenever assets change to ensure clients pick up
// the latest version. v7 updates the UI design and colours.
// Bump the cache name whenever assets change to ensure clients receive the latest files.
const CACHE_NAME = 'leeward-point-cache-v11';
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

// Define a bounding box around the property to cache map tiles for offline use.
// Lat/lon values correspond roughly to an 80‑mile (~130 km) radius around
// Jacksonville, FL.  Zoom levels may be adjusted but higher zooms
// dramatically increase the number of tiles required.  We use zoom 12
// to balance detail with cache size.
const OFFLINE_TILE_BOUNDS = {
  latMin: 29.18,
  latMax: 31.48,
  lonMin: -82.98,
  lonMax: -80.32,
  zoomLevels: [12]
};

/**
 * Convert latitude/longitude to a Web Mercator tile coordinate at the
 * specified zoom level.  Based on the formula used by OpenStreetMap.
 * Returns an array [x, y].
 */
function latLonToTile(lat, lon, zoom) {
  const latRad = lat * Math.PI / 180;
  const n = Math.pow(2, zoom);
  const x = Math.floor((lon + 180) / 360 * n);
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return [x, y];
}

/**
 * Generate a list of tile URLs covering the bounding box for all specified
 * zoom levels.  Tiles are fetched from the OpenStreetMap tile server.
 */
function generateTileUrls(bounds) {
  const urls = [];
  bounds.zoomLevels.forEach(zoom => {
    const [xMinCandidate, yMaxCandidate] = latLonToTile(bounds.latMin, bounds.lonMin, zoom);
    const [xMaxCandidate, yMinCandidate] = latLonToTile(bounds.latMax, bounds.lonMax, zoom);
    const xMin = Math.min(xMinCandidate, xMaxCandidate);
    const xMax = Math.max(xMinCandidate, xMaxCandidate);
    const yMin = Math.min(yMinCandidate, yMaxCandidate);
    const yMax = Math.max(yMinCandidate, yMaxCandidate);
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        // Include the a/b/c subdomains to improve cache hit rates across
        // different load balancing hosts used by OpenStreetMap.
        ['a', 'b', 'c'].forEach(sub => {
          urls.push(`https://${sub}.tile.openstreetmap.org/${zoom}/${x}/${y}.png`);
        });
      }
    }
  });
  return urls;
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // First precache the standard site assets.
      await cache.addAll(PRECACHE_URLS);
      // Then prefetch map tiles within the offline bounds.  This fetches
      // hundreds of small PNG tiles.  If a tile fails to cache, catch
      // and ignore the error to ensure the installation completes.
      const tileUrls = generateTileUrls(OFFLINE_TILE_BOUNDS);
      await Promise.all(
        tileUrls.map(url => cache.add(url).catch(() => {}))
      );
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
  event.respondWith((async () => {
    const request = event.request;
    const url = request.url;
    // If the request is for OpenStreetMap tile imagery, serve from cache
    // and fall back to network, caching new tiles as they are fetched.
    if (/\.tile\.openstreetmap\.org\/.test(url)) {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      try {
        const response = await fetch(request);
        if (response && response.status === 200) {
          // Clone the response before caching because responses can only be
          // consumed once.
          cache.put(request, response.clone());
        }
        return response;
      } catch (err) {
        // If network fails and tile is not cached, return a fallback blank
        // image to avoid map errors.  Use a transparent PNG data URL.
        return new Response(
          new Blob([
            atob('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVR42mNgGAWjgH5gYmBI4T8GIhUyoCUjqYYGxBmUBkRsTAlgFQcAzi0AUAFhCNAODLZnAAAAAElFTkSuQmCC'),
          ], { type: 'image/png' })
        );
      }
    }
    // For all other requests, attempt to serve from cache and fall back to network
    const cached = await caches.match(request);
    return cached || fetch(request);
  })());
});