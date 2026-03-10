const CACHE_NAME = 'gadgetparc-v1';

const PRECACHE_URLS = [
  '/',
  '/offline',
];

const CACHE_STRATEGIES = {
  cacheFirst: [
    /\.(png|jpg|jpeg|webp|avif|gif|svg|ico|woff|woff2)$/,
    /cdn\.shopify\.com/,
    /images\.unsplash\.com/,
  ],
  staleWhileRevalidate: [
    /\/_next\/static\//,
    /\.(js|css)$/,
  ],
  networkFirst: [
    /\/api\//,
    /\/products\//,
    /\/categories\//,
  ],
};

function matchesAny(url, patterns) {
  return patterns.some((pattern) => pattern.test(url));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  if (request.method !== 'GET') return;

  if (matchesAny(url, CACHE_STRATEGIES.cacheFirst)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  if (matchesAny(url, CACHE_STRATEGIES.staleWhileRevalidate)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  if (matchesAny(url, CACHE_STRATEGIES.networkFirst)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/offline'))
        )
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request).then((cached) => cached || caches.match('/offline')))
  );
});
