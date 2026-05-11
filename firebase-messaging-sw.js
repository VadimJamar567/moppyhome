// firebase-messaging-sw.js
// Ce fichier DOIT être à la racine du site pour que FCM fonctionne

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAgpZQE7Nyik7q3Gff-KoY4YbbbL25oawE",
  authDomain: "moppyhome-cfc28.firebaseapp.com",
  projectId: "moppyhome-cfc28",
  storageBucket: "moppyhome-cfc28.firebasestorage.app",
  messagingSenderId: "821029349668",
  appId: "1:821029349668:web:7f1206b2079f59df4eabb1"
});

const messaging = firebase.messaging();

// Notification reçue en arrière-plan
messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || '🏠 MoppyHome', {
    body: body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
  });
});

// Clic sur notification → ouvre l'app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
