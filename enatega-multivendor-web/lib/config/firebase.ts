
import { getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseApps = new Map();

export function setupFirebase(firebaseConfig) {
  const key = firebaseConfig.projectId || "default";
  let firebaseApp = firebaseApps.get(key);
  if (!firebaseApp) {
    const name = `enatega-${key}`;
    firebaseApp = getApps().find((app) => app.name === name) || initializeApp(firebaseConfig, name);
    firebaseApps.set(key, firebaseApp);
  }
  const messaging = getMessaging(firebaseApp);
  return { firebaseApp, messaging };
}

export { getToken, onMessage };
