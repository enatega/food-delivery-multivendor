import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useRef } from "react";
import Constants from "expo-constants";

// Constant
import useNotification from "@/lib/hooks/useNotification";
import { ROUTES, STORE_TOKEN } from "@/lib/utils/constants";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
import { getStoreId } from "@/lib/services";

function App() {
  const notificationRef = useRef(true);
  const router = useRouter();
  const {
    restaurantData,
    getPermission,
    getExpoPushToken,
    sendTokenToBackend,
    storeLookupComplete,
  } = useNotification();

  const init = useCallback(async () => {
    const token = await SecureStore.getItemAsync(STORE_TOKEN);
    const storeId = await getStoreId();

    if (token && storeId) {
      router.replace(ROUTES.home);
    } else {
      router.replace(ROUTES.login);
    }
  }, [router]);

  useEffect(() => {
    if (!storeLookupComplete) return;

    const checkToken = async () => {
      try {
        if (!restaurantData) {
          return;
        }

        if (
          restaurantData?.restaurant?.enableNotification &&
          notificationRef?.current
        ) {
          const permissionStatus = await getPermission();
          if (permissionStatus.granted) {
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            if (projectId) {
              const token = (await getExpoPushToken({ projectId })).data;
              await sendTokenToBackend({
                variables: { token, isEnabled: true },
              });
            }
          }
        }
        notificationRef.current = false;
      } catch {
        // Navigation must continue even when notification registration fails.
      } finally {
        await init();
      }
    };
    void checkToken();
  }, [
    getExpoPushToken,
    getPermission,
    init,
    restaurantData,
    sendTokenToBackend,
    storeLookupComplete,
  ]);

  return <SpinnerComponent />;
}

export default App;
