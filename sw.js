const CACHE_NAME = 'study-focus-v2';
const urlsToCache = [
  './index.html',
  './image_40f6a1.png',
  './manifest.json'
];

self.addEventListener('install', event => {
  // 新しいバージョンをすぐにインストール
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // 古いキャッシュを削除
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // キャッシュにあればそれを返し、なければネットワークへリクエスト
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
