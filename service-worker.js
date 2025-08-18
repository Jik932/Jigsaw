self.addEventListener('install', e => {
  self.skipWaiting(); // neem meteen over
  e.waitUntil(
    caches.open('jigsaw-cache-v16').then(c => c.addAll([
      './',
      './index.html',
      './manifest.webmanifest',
      './icon-192.png',
      './icon-512.png'
    ]))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim()); // activeer direct
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
