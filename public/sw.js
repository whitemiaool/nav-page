var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/static/js/bundle.js',
    '/manifest.json'
];
// console.log('i')
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                // console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(e) {
    // console.log('Fetch event ' + CACHE_NAME + ' :', e.request.url);
    e.respondWith( // 该策略先从网络中获取资源，如果获取失败则再从缓存中读取资源
      fetch(e.request.url)
      .then(function (httpRes) {
  
        // 请求失败了，直接返回失败的结果
        if (!httpRes || httpRes.status !== 200) {
            // return httpRes;
            return caches.match(e.request)
        }
  
        // 请求成功的话，将请求缓存起来。
        var responseClone = httpRes.clone();
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.delete(e.request)
            .then(function() {
                cache.put(e.request, responseClone);
            });
        });
  
        return httpRes;
      })
      .catch(function(err) { // 无网络情况下从缓存中读取
        // console.error(err);
        return caches.match(e.request);
      })
    )
  })


  self.addEventListener('activate', function(e) {
    // active事件中通常做一些过期资源释放的工作
    var cacheDeletePromises = caches.keys().then(cacheNames => {
    //   console.log('cacheNames', cacheNames, cacheNames.map);
      return Promise.all(cacheNames.map(name => {
        if (name !== CACHE_NAME) { // 如果资源的key与当前需要缓存的key不同则释放资源
        //   console.log('caches.delete', caches.delete);
          var deletePromise = caches.delete(name);
        //   console.log('cache delete result: ', deletePromise);
          return deletePromise;
        } else {
          return Promise.resolve();
        }
      }));
    });
  
    // console.log('cacheDeletePromises: ', cacheDeletePromises);
    e.waitUntil(
      Promise.all([cacheDeletePromises]
      ).then(() => {
        // console.log('activate event ' + CACHE_NAME);
        // console.log('Clients claims.')
        return self.clients.claim();
      })
    )
  })