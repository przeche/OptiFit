const CACHE_NAME = 'optifit-v3'; // Zwiększamy wersję, aby wymusić natychmiastowe czyszczenie starego cache w telefonie
const ASSETS = [
  './optifit/index.html',
  './optifit/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest'
];

// Instalacja Service Workera i zapisanie plików w pamięci podręcznej (cache)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache zainicjalizowany.');
      return cache.addAll(ASSETS);
    })
  );
});

// Aktywacja i czyszczenie starego cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Obsługa zapytań sieciowych (odczyt z cache, jeśli jesteśmy offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
