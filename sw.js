const CACHE_NAME = "currency-calculator-v1";
const filesToCache = ["/", "/index.html", "/main.css", "/main.js"];

const MONEY_EXCHANGE_API = "https://api.exchangeratesapi.io";

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", e => {
  console.log("Installing service worker...");

  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(filesToCache))
  );
});

self.addEventListener("activate", data => {
  console.log("Activating service worker...");
  caches.keys().then(cacheNames => {
    cacheNames
      .filter(cacheName => {
        return cacheName !== CACHE_NAME;
      })
      .map(cacheName => {
        return caches.delete(cacheName);
      });
  });
});

/* Serve cached content when offline */
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        return response;
      }
      
      if (e.request.url.startsWith(MONEY_EXCHANGE_API)) {
        return fetch(e.request).then(response => {
          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          const responseToCache = response.clone();
  
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, responseToCache);
          });
  
          return response;
        });
      }

      return fetch(e.request)
    })
  );
});
