
"use client";

import { useEffect } from "react";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import { setupFirebase, onMessage } from "./firebase";
import { isAppMode, modeStorage, useAppMode } from "@/lib/mode";

export default function FirebaseForegroundHandler() {
  const { mode, switchMode } = useAppMode();
  const {
    FIREBASE_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MSG_SENDER_ID,
    FIREBASE_APP_ID,
  } = useConfig();

  useEffect(() => {
    // Ensure all required keys are present
    const isReady =
      FIREBASE_KEY &&
      FIREBASE_AUTH_DOMAIN &&
      FIREBASE_PROJECT_ID &&
      FIREBASE_STORAGE_BUCKET &&
      FIREBASE_MSG_SENDER_ID &&
      FIREBASE_APP_ID;

    if (!isReady) {
      console.warn("⚠️ Firebase config not ready yet.");
      return;
    }

    const firebaseConfig = {
      apiKey: FIREBASE_KEY,
      authDomain: FIREBASE_AUTH_DOMAIN,
      projectId: FIREBASE_PROJECT_ID,
      storageBucket: FIREBASE_STORAGE_BUCKET,
      messagingSenderId: FIREBASE_MSG_SENDER_ID,
      appId: FIREBASE_APP_ID,
    };

    const { messaging } = setupFirebase(firebaseConfig);

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Message received:", payload);

      if (Notification.permission === "granted") {
        const { title, body } = payload.notification || {};
        const { redirectUrl, vendorMode, orderId } = payload.data || {};

        const notification = new Notification(title || "Notification", {
          body: body || "You have a new message!",
          icon: "/192.png",
        });

        notification.onclick = async () => {
          const targetMode = isAppMode(vendorMode) ? vendorMode : mode;
          const target = redirectUrl || (orderId ? `/order/${orderId}/tracking` : "/profile/order-history");
          if (targetMode !== mode) {
            if (!window.confirm("This order belongs to your other delivery service. Switch and open it?")) return;
            modeStorage.set("pendingOrderNavigation", target);
            if (!await switchMode(targetMode)) return;
          }
          window.location.assign(target);
        };
      } else {
        console.warn("❌ Notification permission not granted.");
      }
    });

    // Optional: Cleanup on unmount
    return () => {
      unsubscribe?.();
    };
  }, [
    FIREBASE_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MSG_SENDER_ID,
    FIREBASE_APP_ID,
    mode,
    switchMode,
  ]);

  return null;
}
