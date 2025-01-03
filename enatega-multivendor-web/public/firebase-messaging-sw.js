/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.4.0/firebase-messaging-compat.js"
);
const app = firebase.initializeApp({
  apiKey: "AIzaSyAKjJRLT_Dr19k6AANgiH0N4b_gxBueguo",
  authDomain: "yalla-delivery-405911.firebaseapp.com",
  projectId: "yalla-delivery-405911",
  storageBucket: "yalla-delivery-405911.appspot.com",
  messagingSenderId: "139790486043",
  appId: "1:139790486043:web:60716d396e0f80e6d086be",
  measurementId: "G-55T439JHKJ"
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
