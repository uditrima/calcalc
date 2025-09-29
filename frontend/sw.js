// Service Worker for Kalorie Tracker PWA
const CACHE_NAME = 'kalorie-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.js',
  '/styles/colors.css',
  '/styles/theme.css',
  '/styles/layout.css',
  '/styles/forms.css',
  '/styles/common.css',
  '/styles/gauge.css',
  '/styles/dashboard.css',
  '/styles/diary.css',
  '/styles/food.css',
  '/styles/meal-dropdown.css',
  '/styles/add-food.css',
  '/styles/add-menu.css',
  '/styles/settings.css',
  '/styles/edit-profile-page.css',
  '/styles/nutrition-goals.css',
  '/styles/animations.css',
  '/styles/data-tags.css',
  '/styles/types.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
