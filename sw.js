// [Service Worker] 나를 위한 관리 루틴 PWA
const CACHE_NAME = 'self-care-v1';
const ASSETS = [
    './index.html',
    './manifest.json',
    './icon.png'
];

// 설치 시 캐싱
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// 활성화 시 이전 캐시 삭제
self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
});

// 푸시 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow('./index.html');
        })
    );
});
