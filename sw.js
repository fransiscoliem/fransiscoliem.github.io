self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('first-app')
      .then(function(cache) {
        cache.addAll([
          '/',
          '/index.html',
          '/src/css/app.css',
          '/src/js/app.js'
        ])
      })
  );
  return self.clients.claim();
});
