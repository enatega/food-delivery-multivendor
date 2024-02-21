// // Give the service worker access to Firebase Messaging.
// // Note that you can only use Firebase Messaging here, other Firebase libraries
// // are not available in the service worker.
importScripts(
    "https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js"
 );
 importScripts(
    "https://www.gstatic.com/firebasejs/9.4.0/firebase-messaging-compat.js"
 );
// // Initialize the Firebase app in the service worker by passing in the
// // messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyDx_iSQ9LroTF7NMm20aRvw2wJqhwSnJ3U",
    authDomain: "enatega-multivender-web.firebaseapp.com",
    projectId: "enatega-multivender-web",
    storageBucket: "enatega-multivender-web.appspot.com",
    messagingSenderId: "438532750182",
    appId: "1:438532750182:web:516b850eff4e0349f0a6a7",
    measurementId: "G-KLBJSEHRYQ",
});


// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
const messaging = firebase.messaging();


messaging.onBackgroundMessage(function (payload) {
    try {
        console.log('onBackgroundMessage')
        // Customize notification here
        const { title, body } = payload.notification;
        console.log('title', title, body)
        const notificationOptions = {
           body,
           icon: "/favicon.png",
        };
     
        // eslint-disable-next-line no-restricted-globals
        self.registration.showNotification(title, notificationOptions); 
    } catch (error) {
        console.log('error', error)
    }
    
 });
 