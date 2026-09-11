/*
 * Lease Management service worker.
 *
 * Deliberately small. The app is a private, data-heavy admin tool: caching API responses
 * would show people stale leases and invoices, so nothing from the API is ever cached. What
 * the worker buys us is installability and a usable shell when the network drops.
 *
 * Strategy:
 *   navigations  – network first, fall back to the cached shell (index.html) offline
 *   static build assets (/assets/*, icons, fonts) – cache first, they are content-hashed
 *   everything else (API calls) – straight to the network, never cached
 */

const VERSION = 'v1';
const SHELL_CACHE = `lease-shell-${VERSION}`;
const ASSET_CACHE = `lease-assets-${VERSION}`;
const SHELL_URL = '/index.html';

const PRECACHE = [SHELL_URL, '/manifest.json', '/pwa-192x192.png', '/pwa-512x512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      // One bad entry must not fail the whole install, so each is added on its own.
      .then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== SHELL_CACHE && name !== ASSET_CACHE)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/assets/') ||
    /\.(?:css|js|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|ico)$/i.test(url.pathname)
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Cross-origin (API, fonts CDN, PostHog) is left entirely alone.
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(SHELL_URL, copy));
          return response;
        })
        .catch(() => caches.match(SHELL_URL).then((cached) => cached || Response.error()))
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
  }
});

// Lets the page trigger an immediate update instead of waiting for every tab to close.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
