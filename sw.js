const cacheName = "currency-calculator-pwa";
const filesToCache = ["/", "/index.html", "/main.css", "/main.js"];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", e => {
  console.log("install event", e);

  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(filesToCache)));
});

self.addEventListener("activate", data => {
  console.log("Activating", data);
});

/* Serve cached content when offline */
self.addEventListener("fetch", e => {
  console.log("fetch event", e);

  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        return response;
      }
    
      
      return fetch(e.request).then(response => {
        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const responseToCache = response.clone();

        caches.open(cacheName).then(function(cache) {
          cache.put(e.request, responseToCache);
        });

        return response;
      });
    })
  );
});
