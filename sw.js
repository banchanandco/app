const CACHE_NAME = 'banchan-v3';
const ASSETS = [
  '/app/index.html',
  '/app/main.html',
  '/app/inventory.html',
  '/app/statistics.html',
  '/app/schedule.html',
  '/app/cost.html',
  '/app/recipe.html',
  '/app/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Firebase 요청은 캐시 안 함
  if (e.request.url.includes('firebasejs') || e.request.url.includes('firestore') || e.request.url.includes('googleapis')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/app/index.html')))
  );
});
