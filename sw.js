// sw.js — Service Worker MoppyHome
// Gère le cache offline + les notifications push Firebase (FCM)

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const CACHE_NAME = 'moppyhome-v2';
const ASSETS = ['/', '/index.html', '/style.css', '/app.js', '/manifest.json'];

// ── CACHE OFFLINE ──
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});

// ── FIREBASE MESSAGING (notifications push background) ──
firebase.initializeApp({
  apiKey: "AIzaSyAgpZQE7Nyik7q3Gff-KoY4YbbbL25oawE",
  authDomain: "moppyhome-cfc28.firebaseapp.com",
  projectId: "moppyhome-cfc28",
  storageBucket: "moppyhome-cfc28.firebasestorage.app",
  messagingSenderId: "821029349668",
  appId: "1:821029349668:web:7f1206b2079f59df4eabb1"
});

const messaging = firebase.messaging();

// Notification reçue quand l'app est en arrière-plan
messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: icon || '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200],
    data: payload.data,
  });
});

// Clic sur notification → ouvre l'app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
