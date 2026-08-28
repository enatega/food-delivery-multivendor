/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyDx_iSQ9LroTF7NMm20aRvw2wJqhwSnJ3U',
  authDomain: 'enatega-multivender-web.firebaseapp.com',
  projectId: 'enatega-multivender-web',
  storageBucket: 'enatega-multivender-web.firebasestorage.app',
  messagingSenderId: '438532750182',
  appId: '1:438532750182:web:516b850eff4e0349f0a6a7',
  measurementId: 'G-KLBJSEHRYQ',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('📩 Background Notification Received:', payload);

  const { title, body, redirectUrl } = payload.data;

  if (!title || !body) {
    console.error('🚨 Missing notification payload:', payload);
    return;
  }

  const notificationOptions = {
    body,
    icon: 'https://e7.pngegg.com/pngimages/875/651/png-clipart-background-brush-texture-brush-black.png',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    tag: 'rider-updated',
    data: { redirectUrl },
    actions: [{ action: 'open', title: 'View Details' }],
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const redirectUrl = event.notification.data?.redirectUrl || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(() => {
      // Otherwise, open a new window/tab
      return clients.openWindow(redirectUrl);
    })
  );
});
