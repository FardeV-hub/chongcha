// ชงชา — Service Worker v1.0
const CACHE_NAME = 'chongcha-v1';
const OFFLINE_URL = './Chongcha.html';

const PRECACHE_URLS = [
    './',
    './Chongcha.html',
    './manifest.json',
    './images/icon-512.jpg',
    './images/krapao.jpg',
    './images/tomyum.jpg',
    './images/somtam.jpg',
    './images/padthai.jpg',
    './images/greencurry.jpg',
    './images/khaomankai.jpg',
    './images/matcha.jpg',
    './images/thaitea.jpg',
    './images/latte.jpg',
    './images/lemonsoda.jpg',
    './images/smoothie.jpg',
    './images/mangostickyrice.jpg',
    './images/honeytoast.jpg',
    './images/bualoy.jpg',
    './images/matchacake.jpg',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Install — cache all core assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Pre-caching app assets');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('[SW] Removing old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch — cache-first strategy for assets, network-first for pages
self.addEventListener('fetch', event => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // For navigation requests (HTML pages) — network first, fallback to cache
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match(OFFLINE_URL))
        );
        return;
    }

    // For other assets — cache first, fallback to network
    event.respondWith(
        caches.match(request)
            .then(cached => {
                if (cached) return cached;

                return fetch(request).then(response => {
                    // Only cache successful responses
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    }
                    return response;
                });
            })
            .catch(() => {
                // Return offline fallback for images
                if (request.destination === 'image') {
                    return new Response(
                        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#f0f0f0" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="14">Offline</text></svg>',
                        { headers: { 'Content-Type': 'image/svg+xml' } }
                    );
                }
            })
    );
});

// Push notification (for future use)
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'ชงชา — แจ้งเตือน';
    const options = {
        body: data.body || 'คุณมีโปรโมชั่นใหม่!',
        icon: './images/icon-512.jpg',
        badge: './images/icon-512.jpg',
        vibrate: [200, 100, 200],
        data: { url: data.url || './Chongcha.html' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || './')
    );
});
