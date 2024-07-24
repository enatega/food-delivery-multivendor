// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGHOUQpCknGw_EkNiegrYGC49_XVKMJ60",
  authDomain: "testapp2-8494f.firebaseapp.com",
  projectId: "testapp2-8494f",
  storageBucket: "testapp2-8494f.appspot.com",
  messagingSenderId: "166344865071",
  appId: "1:166344865071:web:aae144b35a437048bd9dda",
  measurementId: "G-LHVN6RSW8Z"
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
