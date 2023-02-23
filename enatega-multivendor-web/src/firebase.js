// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: "AIzaSyDQq64IJXqTsjTNB0gxkmM1HLMfK1WIW20",
   authDomain: "enatega-multivendor-web.firebaseapp.com",
   projectId: "enatega-multivendor-web",
   storageBucket: "enatega-multivendor-web.appspot.com",
   messagingSenderId: "390014290500",
   appId: "1:390014290500:web:f451cecc859582326e0a11",
   measurementId: "G-M313VQ0YYM",
};

export const initialize = () => {
   // Initialize Firebase
   const app = firebase.initializeApp(firebaseConfig);
   const messaging = getMessaging(app);
   return messaging;
};

export const isFirebaseSupported = async () => {
   return await isSupported();
};
