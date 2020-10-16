const cacheName = 'photos-v1';
const assetsToCache = [
  'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://unpkg.com/dbindexed@1.0.1/index.min.js',
  './src/js/PhotosService.js',
  './src/js/HtmlService.js',
  './src/img/favicon.ico',
  './src/css/main.css',
  './src/js/app.js',
  './'
];

function removeOldCache(key) {
  if (key !== cacheName) {
    return caches.delete(key);
  }
}

async function cacheCleanup() {
  const keyList = await caches.keys();
  return Promise.all(keyList.map(removeOldCache));
}

async function cacheStaticAssets() {
  const cache = await caches.open(cacheName);
  return cache.addAll(assetsToCache);
}

async function getData(request) {
  const cache = await caches.open(cacheName);
  const fetchResponse = await fetch(request.clone());
  cache.put(request, fetchResponse.clone());
  return fetchResponse;
}

async function networkFirst(request) {
  try {
    return await getData(request);
  } catch (error) {
    const cache = await caches.open(cacheName);
    return cache.match(request);
  }
}

async function cacheFirst(request) {
  try {
    const cache = await caches.open(cacheName);
    const response = await cache.match(request);
    return response || fetch(request);
  } catch (error) {
    console.log(error);
  }
}

self.addEventListener('install', event => {
  event.waitUntil(cacheStaticAssets());
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(cacheCleanup());
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(networkFirst(event.request));
});
