// Bump dit versienummer bij elke release
const CACHE = 'jigsaw-cache-v16';

self.addEventListener('install', e => {
  self.skipWaiting(); // neem meteen over
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll([
      './',
      './index.html',
      './manifest.webmanifest',
      './icon-192.png',
      './icon-512.png'
    ]))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    Promise.all([
      // oude caches opruimen
      caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))),
      self.clients.claim()
    ])
  );
});

// Network-first zodat nieuwe code altijd door komt
self.addEventListener('fetch', e => {
  const req = e.request;
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req))
  );
});
