const cacheName = "currency-calculator-pwa";
const filesToCache = ["/", "/index.html", "/main.css", "/main.js"];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(filesToCache)));
});

/* Serve cached content when offline */
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
