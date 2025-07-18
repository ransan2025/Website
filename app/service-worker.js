self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('rsg-cache').then(cache => {
      return cache.addAll([
        './',
        './card.html',
        './profile.jpg',
        './manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
