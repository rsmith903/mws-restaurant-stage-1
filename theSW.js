elf.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        "/css/styles.css",
        "/js/main.js",
        "/js/restaurant_info.js"
      ]);
    })
  );
});

self.addEventListener("fetch", function(event) {
  console.log("Handling fetch event for", event.request.url);

  event.respondWith(
    caches.open("response-cache").then(function(cache) {
      return cache
        .match(event.request)
        .then(function(response) {
          if (response) {
            console.log("Found response in cache:", response);

            return response;
          }

          // console.log("Fetching request from the network");

          return fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());

            return networkResponse;
          });
        })
        .catch(function(error) {
          console.error("Error in fetch handler:", error);

          throw error;
        });
    })
  );
});
