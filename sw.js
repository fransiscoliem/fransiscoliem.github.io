var CACHE_STATIC_NAME = 'static-v13';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/offline.html',
          'https://fonts.googleapis.com/css?family=Antic|Questrial&display=swap',
          'https://fonts.googleapis.com/css?family=Dosis|Libre+Franklin&display=swap',
          '/semantic/dist/semantic.min.css',
          'https://fonts.googleapis.com/css?family=Merriweather&display=swap',
          '/src/css/app.css',
          'https://code.jquery.com/jquery-3.1.1.min.js',
          '/semantic/dist/semantic.min.js',
          '/manifest.json',
          
        ]);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

// self.addEventListener('fetch', function (event) {
//   var url = 'https://httpbin.org/get';

//   if (event.request.url.indexOf(url) > -1) {
//     event.respondWith(
//       caches.open(CACHE_DYNAMIC_NAME)
//         .then(function (cache) {
//           return fetch(event.request)
//             .then(function (res) {
//               cache.put(event.request, res.clone());
//               return res;
//             });
//         })
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request)
//         .then(function (response) {
//           if (response) {
//             return response;
//           } else {
//             return fetch(event.request)
//               .then(function (res) {
//                 return caches.open(CACHE_DYNAMIC_NAME)
//                   .then(function (cache) {
//                     cache.put(event.request.url, res.clone());
//                     return res;
//                   })
//               })
//               .catch(function (err) {
//                 return caches.open(CACHE_STATIC_NAME)
//                   .then(function (cache) {
//                     return cache.match('/offline.html');
//                   });
//               });
//           }
//         })
//     );
//   }
// });

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  // cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function(err) {
              return caches.open(CACHE_STATIC_NAME)
                .then(function(cache) {
                  return cache.match('/offline.html');
                });
            });
        }
      })
  );
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function(res) {
//         return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   var res_clone = res.clone();
//                   res_clone.length = 1;
//                   // cache.put(event.request.url, res_clone);
//                   return res;
//                 })
//       })
//       .catch(function(err) {
//         return caches.match(event.request);
//       })
//   );
// });

// Cache-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });

// Network-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//   );
// });