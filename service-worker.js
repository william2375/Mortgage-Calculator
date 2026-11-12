const CACHE_PREFIX = 'milk-tea-mortgage';
const APP_CACHE = `${CACHE_PREFIX}-app-v2`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-v2`;
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-1024.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && ![APP_CACHE, RUNTIME_CACHE].includes(key))
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // App navigation: network-first, then cached app shell for offline launch.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(APP_CACHE);
          cache.put('./index.html', response.clone()).catch(() => {});
        }
        return response;
      } catch (_) {
        const cache = await caches.open(APP_CACHE);
        return (await cache.match(request)) ||
               (await cache.match('./index.html')) ||
               new Response('目前離線，且尚未建立網頁快取。請先連線開啟一次本工具。', {
                 status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
               });
      }
    })());
    return;
  }

  // Same-origin app assets are cache-first; missing assets fall back to network.
  if (isSameOrigin) {
    event.respondWith((async () => {
      const cache = await caches.open(APP_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response && (response.ok || response.type === 'opaque')) {
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      } catch (_) {
        return cached || Response.error();
      }
    })());
    return;
  }

  // CDN scripts, stylesheets and web fonts: cache successful/opaque responses
  // after the app has been controlled once, allowing subsequent offline use.
  if (['script', 'style', 'font'].includes(request.destination) ||
      /fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.tailwindcss\.com/.test(url.hostname)) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      try {
        const response = await fetch(request);
        if (response && (response.ok || response.type === 'opaque')) {
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      } catch (_) {
        return (await cache.match(request)) || Response.error();
      }
    })());
  }
});
