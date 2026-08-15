// sw.js — Service Worker Kelas 7.2
const CACHE_NAME = 'kelas72-cache-v1';
const CORE_ASSETS = [
  '/index.html',
  '/tokens.css',
  '/base.css',
  '/manifest.json',
  '/favicon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Strategi: network-first untuk halaman (biar data selalu update),
// cache-first untuk aset statis (css/font) biar app tetap kebuka offline.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

// ---- Push notification (dikirim lewat Firebase Cloud Messaging) ----
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const payload = event.data.json();
  const { title, body, icon, tag } = payload.notification || payload;
  event.waitUntil(
    self.registration.showNotification(title || 'Kelas 7.2', {
      body: body || '',
      icon: icon || '/public/icons/icon-hut-ri-192.png',
      badge: '/public/icons/icon-hut-ri-192.png',
      tag: tag || 'kelas72-notif',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      if (clients.length) return clients[0].focus();
      return self.clients.openWindow('/index.html');
    })
  );
});
