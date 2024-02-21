// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDx_iSQ9LroTF7NMm20aRvw2wJqhwSnJ3U",
  authDomain: "enatega-multivender-web.firebaseapp.com",
  projectId: "enatega-multivender-web",
  storageBucket: "enatega-multivender-web.appspot.com",
  messagingSenderId: "438532750182",
  appId: "1:438532750182:web:516b850eff4e0349f0a6a7",
  measurementId: "G-KLBJSEHRYQ",
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
