// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/app'
import { getMessaging, isSupported } from 'firebase/messaging'
import {
  FIREBASE_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MSG_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID
} from './config/constants'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: FIREBASE_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MSG_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
}

export const initialize = () => {
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig)
  const messaging = getMessaging(app)
  return messaging
}

export const isFirebaseSupported = async() => {
  return await isSupported()
}
