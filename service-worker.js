/**
 * Service Worker for Task Scheduler PWA
 * Enhanced with better caching and offline support
 */

const CACHE_VERSION = 'v2. 0.0';
const CACHE_NAME = `task-scheduler-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/storage. js',
    '/js/notifications.js',
    '/js/push-notifications.js',
    '/js/pwa-install.js',
    '/manifest.json',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96. png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152. png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

// Maximum cache size limits
const CACHE_LIMITS = {
    [DYNAMIC_CACHE]: 50,
    [IMAGE_CACHE]: 30
};

// Install Event - Cache static assets
self.addEventListener('install', event => {
    console.log('[ServiceWorker] Installing version:', CACHE_VERSION);
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[ServiceWorker] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[ServiceWorker] Skip waiting');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[ServiceWorker] Installation failed:', error);
            })
    );
});

// Activate Event - Clean old caches
self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activating version:', CACHE_VERSION);
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            // Delete old versions
                            return cacheName.startsWith('task-scheduler-') && 
                                   cacheName !== CACHE_NAME &&
                                   cacheName !== STATIC_CACHE &&
                                   cacheName !== DYNAMIC_CACHE &&
                                   cacheName !== IMAGE_CACHE;
                        })
                        .map(cacheName => {
                            console.log('[ServiceWorker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[ServiceWorker] Claiming clients');
                return self.clients.claim();
            })
    );
});

// Fetch Event - Serve from cache with network fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and non-http requests
    if (! url.protocol.startsWith('http')) {
        return;
    }
    
    // Skip external requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // Handle different types of requests
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isImage(url)) {
        event. respondWith(cacheFirst(request, IMAGE_CACHE));
    } else if (isAPIRequest(url)) {
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    }
});

// Push Notification Event
self.addEventListener('push', event => {
    console.log('[ServiceWorker] Push notification received');
    
    let data = {
        title: 'Task Scheduler',
        body: 'Você tem uma nova notificação',
        icon: '/icons/icon-192x192. png',
        badge: '/icons/icon-96x96.png',
        tag: 'task-notification',
        requireInteraction: false
    };
    
    if (event.data) {
        try {
            data = { ...data, ...event.data. json() };
        } catch (e) {
            console.error('Error parsing push data:', e);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            badge: data.badge,
            tag: data.tag,
            requireInteraction: data. requireInteraction,
            vibrate: [200, 100, 200],
            data: data.data
        })
    );
});

// Notification Click Event
self.addEventListener('notificationclick', event => {
    console.log('[ServiceWorker] Notification clicked');
    
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                // If app is already open, focus it
                for (let client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // Otherwise, open a new window
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});

// Background Sync Event (for offline actions)
self.addEventListener('sync', event => {
    console.log('[ServiceWorker] Background sync:', event.tag);
    
    if (event.tag === 'sync-tasks') {
        event.waitUntil(syncTasks());
    }
});

// Periodic Background Sync (for reminders)
self.addEventListener('periodicsync', event => {
    console.log('[ServiceWorker] Periodic sync:', event.tag);
    
    if (event.tag === 'check-reminders') {
        event.waitUntil(checkReminders());
    }
});

// Message Event (communicate with app)
self.addEventListener('message', event => {
    console.log('[ServiceWorker] Message received:', event.data);
    
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data. action === 'clearCache') {
        event.waitUntil(clearAllCaches());
    }
    
    if (event.data. action === 'getCacheSize') {
        event. waitUntil(
            getCacheSize(). then(size => {
                event.ports[0].postMessage({ size });
            })
        );
    }
});

// ==================== CACHING STRATEGIES ====================

/**
 * Cache First - Try cache first, fallback to network
 * Best for: Static assets, images
 */
async function cacheFirst(request, cacheName) {
    try {
        const cached = await caches.match(request);
        
        if (cached) {
            return cached;
        }
        
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response. clone());
            await trimCache(cacheName);
        }
        
        return response;
    } catch (error) {
        console.error('[ServiceWorker] Cache first failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

/**
 * Network First - Try network first, fallback to cache
 * Best for: API requests, dynamic content
 */
async function networkFirst(request, cacheName) {
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
            await trimCache(cacheName);
        }
        
        return response;
    } catch (error) {
        console.log('[ServiceWorker] Network failed, trying cache');
        
        const cached = await caches.match(request);
        
        if (cached) {
            return cached;
        }
        
        return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Stale While Revalidate - Return cache immediately, update in background
 * Best for: Frequently updated content
 */
async function staleWhileRevalidate(request, cacheName) {
    const cached = await caches.match(request);
    
    const fetchPromise = fetch(request). then(response => {
        if (response.ok) {
            const cache = caches.open(cacheName);
            cache.then(c => {
                c.put(request, response.clone());
                trimCache(cacheName);
            });
        }
        return response;
    }). catch(() => cached);
    
    return cached || fetchPromise;
}

// ==================== HELPER FUNCTIONS ====================

function isStaticAsset(url) {
    const staticExtensions = ['. css', '.js', '.woff', '.woff2', '.ttf', '.eot'];
    return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

function isImage(url) {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '. gif', '.svg', '.webp', '.ico'];
    return imageExtensions.some(ext => url. pathname.endsWith(ext));
}

function isAPIRequest(url) {
    return url.pathname.startsWith('/api/');
}

async function trimCache(cacheName) {
    const limit = CACHE_LIMITS[cacheName];
    
    if (! limit) return;
    
    try {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        if (keys.length > limit) {
            const deleteCount = keys.length - limit;
            for (let i = 0; i < deleteCount; i++) {
                await cache.delete(keys[i]);
            }
            console.log(`[ServiceWorker] Trimmed ${deleteCount} items from ${cacheName}`);
        }
    } catch (error) {
        console.error('[ServiceWorker] Error trimming cache:', error);
    }
}

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
}

async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (let cacheName of cacheNames) {
        const cache = await caches. open(cacheName);
        const keys = await cache.keys();
        
        for (let request of keys) {
            const response = await cache.match(request);
            const blob = await response.blob();
            totalSize += blob.size;
        }
    }
    
    return totalSize;
}

async function syncTasks() {
    console.log('[ServiceWorker] Syncing tasks.. .');
    
    // Get pending tasks from IndexedDB or localStorage
    // This would sync with your backend if you have one
    
    try {
        // Example: fetch pending offline actions
        const tasks = await getPendingTasks();
        
        for (let task of tasks) {
            // Send to server
            // await fetch('/api/tasks', { method: 'POST', body: JSON.stringify(task) });
        }
        
        console.log('[ServiceWorker] Tasks synced successfully');
    } catch (error) {
        console. error('[ServiceWorker] Sync failed:', error);
        throw error; // Retry later
    }
}

async function checkReminders() {
    console.log('[ServiceWorker] Checking reminders...');
    
    try {
        // Check for upcoming tasks and show notifications
        const tasks = await getUpcomingTasks();
        
        for (let task of tasks) {
            await self.registration.showNotification('Lembrete de Tarefa', {
                body: `${task.title} em breve!`,
                icon: '/icons/icon-192x192. png',
                badge: '/icons/icon-96x96.png',
                tag: `reminder-${task.id}`,
                requireInteraction: true,
                vibrate: [200, 100, 200],
                data: { taskId: task.id }
            });
        }
    } catch (error) {
        console.error('[ServiceWorker] Check reminders failed:', error);
    }
}

async function getPendingTasks() {
    // Implement your logic to get pending tasks
    return [];
}

async function getUpcomingTasks() {
    // Implement your logic to get upcoming tasks
    return [];
}

// Log service worker version
console.log('[ServiceWorker] Version:', CACHE_VERSION);