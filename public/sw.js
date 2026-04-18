// Simple Service Worker for offline support
const CACHE_NAME = 'pair-prep-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - Network first, fall back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  // Firebase requests: network first
  if (request.url.includes('firebase') || request.url.includes('googleapis.com')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cache = caches.open(CACHE_NAME)
          cache.then((c) => c.put(request, response.clone()))
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Static assets: cache first
  event.respondWith(
    caches.match(request)
      .then((response) => response || fetch(request))
      .catch(() => {
        if (request.destination === 'document') {
          return caches.match('/index.html')
        }
      })
  )
})
