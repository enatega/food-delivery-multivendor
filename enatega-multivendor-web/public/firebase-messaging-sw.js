/* eslint-disable no-undef */
importScripts(
   "https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js"
);
importScripts(
   "https://www.gstatic.com/firebasejs/9.4.0/firebase-messaging-compat.js"
);
const app = firebase.initializeApp({
   apiKey: "AIzaSyDQq64IJXqTsjTNB0gxkmM1HLMfK1WIW20",
   authDomain: "enatega-multivendor-web.firebaseapp.com",
   projectId: "enatega-multivendor-web",
   storageBucket: "enatega-multivendor-web.appspot.com",
   messagingSenderId: "390014290500",
   appId: "1:390014290500:web:f451cecc859582326e0a11",
   measurementId: "G-M313VQ0YYM",
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
