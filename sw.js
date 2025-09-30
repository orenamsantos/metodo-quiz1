/**
 * Service Worker for Método Africano
 * Provides caching and offline functionality
 */

const CACHE_NAME = 'metodo-africano-v1.0.0';
const STATIC_CACHE_NAME = 'metodo-africano-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'metodo-africano-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/quiz-data.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap'
];

// Files to cache on first request
const DYNAMIC_FILES = [
    '/robots.txt',
    '/sitemap.xml'
];

// Maximum number of items in dynamic cache
const DYNAMIC_CACHE_LIMIT = 50;

/**
 * Install event - cache static files
 */
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
            .catch(error => {
                console.error('Service Worker: Error during activation', error);
            })
    );
});

/**
 * Fetch event - serve cached files or fetch from network
 */
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache', event.request.url);
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(event.request)
                    .then(networkResponse => {
                        // Check if response is valid
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Clone the response
                        const responseToCache = networkResponse.clone();
                        
                        // Cache dynamic content
                        if (shouldCacheDynamically(event.request.url)) {
                            caches.open(DYNAMIC_CACHE_NAME)
                                .then(cache => {
                                    console.log('Service Worker: Caching dynamic file', event.request.url);
                                    cache.put(event.request, responseToCache);
                                    
                                    // Limit cache size
                                    limitCacheSize(DYNAMIC_CACHE_NAME, DYNAMIC_CACHE_LIMIT);
                                })
                                .catch(error => {
                                    console.error('Service Worker: Error caching dynamic file', error);
                                });
                        }
                        
                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Service Worker: Network fetch failed', error);
                        
                        // Return offline fallback if available
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        throw error;
                    });
            })
            .catch(error => {
                console.error('Service Worker: Cache match failed', error);
                throw error;
            })
    );
});

/**
 * Message event - handle messages from main thread
 */
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('Service Worker: Received SKIP_WAITING message');
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            type: 'VERSION',
            version: CACHE_NAME
        });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        console.log('Service Worker: Clearing caches');
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
        }).then(() => {
            event.ports[0].postMessage({
                type: 'CACHE_CLEARED',
                success: true
            });
        }).catch(error => {
            console.error('Service Worker: Error clearing caches', error);
            event.ports[0].postMessage({
                type: 'CACHE_CLEARED',
                success: false,
                error: error.message
            });
        });
    }
});

/**
 * Background sync event - handle background synchronization
 */
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'quiz-data-sync') {
        event.waitUntil(syncQuizData());
    }
});

/**
 * Push event - handle push notifications
 */
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Nova atualização disponível!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver agora',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Método Africano', options)
    );
});

/**
 * Notification click event - handle notification interactions
 */
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

/**
 * Helper function to determine if a URL should be cached dynamically
 */
function shouldCacheDynamically(url) {
    // Cache images, fonts, and other assets
    return url.includes('/images/') || 
           url.includes('/icons/') || 
           url.includes('fonts.googleapis.com') ||
           url.includes('fonts.gstatic.com') ||
           DYNAMIC_FILES.some(file => url.includes(file));
}

/**
 * Helper function to limit cache size
 */
function limitCacheSize(cacheName, maxItems) {
    caches.open(cacheName)
        .then(cache => {
            cache.keys()
                .then(keys => {
                    if (keys.length > maxItems) {
                        // Delete oldest entries
                        const deletePromises = keys.slice(0, keys.length - maxItems)
                            .map(key => cache.delete(key));
                        return Promise.all(deletePromises);
                    }
                })
                .catch(error => {
                    console.error('Service Worker: Error limiting cache size', error);
                });
        })
        .catch(error => {
            console.error('Service Worker: Error opening cache for size limit', error);
        });
}

/**
 * Helper function to sync quiz data in background
 */
function syncQuizData() {
    return new Promise((resolve, reject) => {
        // This would typically sync quiz data with a server
        // For now, we'll just resolve immediately
        console.log('Service Worker: Quiz data sync completed');
        resolve();
    });
}

/**
 * Helper function to check for updates
 */
function checkForUpdates() {
    return fetch('/version.json')
        .then(response => response.json())
        .then(data => {
            if (data.version !== CACHE_NAME) {
                console.log('Service Worker: New version available', data.version);
                return self.registration.update();
            }
        })
        .catch(error => {
            console.error('Service Worker: Error checking for updates', error);
        });
}

// Check for updates periodically
setInterval(checkForUpdates, 60000 * 60); // Check every hour
