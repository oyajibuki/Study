const CACHE_NAME = 'study-focus-v3';

// HTMLは常にネットワークから取得し、アセットのみキャッシュする
const ASSETS_TO_CACHE = [
  './image_40f6a1.png',
  './manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // HTMLファイルは常にネットワークから取得（キャッシュを返さない）
  if (event.request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/Study/' || url.pathname === '/Study') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // アセット類はキャッシュを優先
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
