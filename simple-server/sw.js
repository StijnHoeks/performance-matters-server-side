
var CACHE_NAME = 'PWA_Cache';
var urlsToCache = [
  '/public/css/styles.css',
  '/public/js/client.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});