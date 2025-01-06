/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.4.0/firebase-messaging-compat.js"
);
const app = firebase.initializeApp({
  apiKey: "AIzaSyDx_iSQ9LroTF7NMm20aRvw2wJqhwSnJ3U",
  authDomain: "enatega-multivender-web.firebaseapp.com",
  projectId: "enatega-multivender-web",
  storageBucket: "enatega-multivender-web.appspot.com",
  messagingSenderId: "438532750182",
  appId: "1:438532750182:web:516b850eff4e0349f0a6a7",
  measurementId: "G-KLBJSEHRYQ",
});
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(function (payload) {
  // Customize notification here
  const { title, body } = payload.notification;
  const notificationOptions = {
    body,
    icon: "/favicon.png",
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(title, notificationOptions);
});
