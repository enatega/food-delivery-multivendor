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
    apiKey: "AIzaSyDQq64IJXqTsjTNB0gxkmM1HLMfK1WIW20",
    authDomain: "enatega-multivendor-web.firebaseapp.com",
    projectId: "enatega-multivendor-web",
    storageBucket: "enatega-multivendor-web.appspot.com",
    messagingSenderId: "390014290500",
    appId: "1:390014290500:web:f451cecc859582326e0a11",
    measurementId: "G-M313VQ0YYM",
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
 