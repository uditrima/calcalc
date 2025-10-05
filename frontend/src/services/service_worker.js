// Service Worker management for PWA functionality
// Handles service worker registration and caching

export class ServiceWorkerManager {
    constructor() {
        // Service worker registration is disabled by default
        // Can be enabled by calling this.registerServiceWorker()
    }
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Try to register external service worker first
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                        
                        // Fallback: Create inline service worker if external fails
                        this.createInlineServiceWorker();
                    });
            });
        }
    }
    
    createInlineServiceWorker() {
        try {
            // Create service worker code as blob
            const swCode = `
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

                self.addEventListener('install', (event) => {
                    event.waitUntil(
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                console.log('Opened cache');
                                return cache.addAll(urlsToCache);
                            })
                    );
                });

                self.addEventListener('fetch', (event) => {
                    event.respondWith(
                        caches.match(event.request)
                            .then((response) => {
                                return response || fetch(event.request);
                            }
                        )
                    );
                });

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
            `;
            
            // Create blob URL for service worker
            const swBlob = new Blob([swCode], { type: 'text/javascript' });
            const swUrl = URL.createObjectURL(swBlob);
            
            // Register inline service worker
            navigator.serviceWorker.register(swUrl)
                .then((registration) => {
                    console.log('Inline SW registered: ', registration);
                })
                .catch((error) => {
                    console.log('Inline SW registration also failed: ', error);
                });
                
        } catch (error) {
            console.log('Failed to create inline service worker: ', error);
        }
    }
    
    getCacheUrls() {
        return [
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
    }
}
