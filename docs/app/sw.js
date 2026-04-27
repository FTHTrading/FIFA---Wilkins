// Tap FIFA — Atlanta 2026 · offline service worker
const CACHE = 'tapfifa-v1';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // Network-first for routing API & tiles, cache-first for everything else
  const url = new URL(req.url);
  const isLive = url.hostname.includes('router.project-osrm.org') || url.hostname.includes('basemaps.cartocdn.com');
  if (isLive) {
    e.respondWith(fetch(req).catch(()=>caches.match(req)));
    return;
  }
  e.respondWith(
    caches.match(req).then(c => c || fetch(req).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(cache => cache.put(req, copy)).catch(()=>{});
      return r;
    }).catch(()=>caches.match('./index.html')))
  );
});
