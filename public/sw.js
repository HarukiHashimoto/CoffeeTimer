const CACHE_NAME = 'coffee-timer-cache-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/CoffeeTimer/',
        '/CoffeeTimer/index.html',
        '/CoffeeTimer/manifest.json',
        '/CoffeeTimer/icon-192x192.png',
        '/CoffeeTimer/icon-512x512.png',
        '/CoffeeTimer/timer-end.mp3',
        '/CoffeeTimer/globe.svg',
        '/CoffeeTimer/next.svg',
        '/CoffeeTimer/vercel.svg',
        '/CoffeeTimer/window.svg',
        '/CoffeeTimer/file.svg'
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
