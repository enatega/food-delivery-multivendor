// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/app'
import { getMessaging, isSupported } from 'firebase/messaging'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const initialize = (
  FIREBASE_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MSG_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID
) => {
  const firebaseConfig = {
    apiKey: 'AIzaSyCHrV6bF7YPbDjmU5bSd7umSuJen71uUgI',
    authDomain: 'enatega-multivendor.firebaseapp.com',
    projectId: 'enatega-multivendor',
    storageBucket: 'enatega-multivendor.appspot.com',
    messagingSenderId: '650001300965',
    appId: '1:650001300965:web:68c10de22ea273b76bc30c',
    measurementId: 'G-C229R9TNPS'
  }

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig)
  const messaging = getMessaging(app)
  return messaging
}

export const isFirebaseSupported = async() => {
  return await isSupported()
}
