// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKjJRLT_Dr19k6AANgiH0N4b_gxBueguo",
  authDomain: "yalla-delivery-405911.firebaseapp.com",
  projectId: "yalla-delivery-405911",
  storageBucket: "yalla-delivery-405911.appspot.com",
  messagingSenderId: "139790486043",
  appId: "1:139790486043:web:60716d396e0f80e6d086be",
  measurementId: "G-55T439JHKJ"
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
