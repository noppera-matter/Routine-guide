// [Service Worker] PWA Notification & Caching
const CACHE_NAME = 'care-routine-v2';
const ASSETS = ['./index.html', './manifest.json', './icon.png'];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// 백그라운드 푸시 및 로컬 알림 처리
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: '알림', body: '루틴 시간입니다!' };
    const options = {
        body: data.body,
        icon: 'icon.png',
        badge: 'icon.png',
        vibrate: [200, 100, 200],
        data: { url: './index.html' }
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

// 알림 클릭 시 앱 실행/이동
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            for (let client of windowClients) {
                if (client.url.includes('index.html') && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('./index.html');
        })
    );
});
