
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

let firebaseApp;
let messaging;

export function setupFirebase(firebaseConfig) {

  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);
  }
  return { firebaseApp, messaging };
}

export { getToken, onMessage };

