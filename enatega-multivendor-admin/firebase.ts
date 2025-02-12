// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

export const initialize = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyDx_iSQ9LroTF7NMm20aRvw2wJqhwSnJ3U',
    authDomain: 'enatega-multivender-web.firebaseapp.com',
    projectId: 'enatega-multivender-web',
    storageBucket: 'enatega-multivender-web.firebasestorage.app',
    messagingSenderId: '438532750182',
    appId: '1:438532750182:web:516b850eff4e0349f0a6a7',
    measurementId: 'G-KLBJSEHRYQ',
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  return messaging;
};

export const isFirebaseSupported = async () => {
  return await isSupported();
};
