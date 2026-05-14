// sw.js — Service Worker MoppyHome
// Ne cache PAS index.html pour éviter les problèmes de mise à jour

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const CACHE_NAME = 'moppyhome-v3';
// On exclut index.html du cache pour toujours avoir la dernière version
const ASSETS = ['/style.css', '/app2.js', '/manifest.json'];

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
  // Ne jamais cacher index.html — toujours aller sur le réseau
  if (e.request.url.includes('index.html') || e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/index.html')));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Firebase Messaging
firebase.initializeApp({
  apiKey: "AIzaSyAgpZQE7Nyik7q3Gff-KoY4YbbbL25oawE",
  authDomain: "moppyhome-cfc28.firebaseapp.com",
  projectId: "moppyhome-cfc28",
  storageBucket: "moppyhome-cfc28.firebasestorage.app",
  messagingSenderId: "821029349668",
  appId: "1:821029349668:web:7f1206b2079f59df4eabb1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || '🏠 MoppyHome', {
    body: body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
