import { Href, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef } from "react";
import Constants from "expo-constants";

// Constant
import useNotification from "@/lib/hooks/useNotification";
import { ROUTES, STORE_TOKEN } from "@/lib/utils/constants";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";

function App() {
  const notificationRef = useRef(true);
  const router = useRouter();
  const {
    restaurantData,
    getPermission,
    getExpoPushToken,
    getDevicePushToken,
    // requestPermission,
    sendTokenToBackend,
  } = useNotification();

  // Handler
  /*  const onInitNotification = async () => {
    try {
      if (!notificationStatus) {
        const permissionStatus = await getPermission();
        if (permissionStatus.granted) {
          setNotificationStatus(true);
          const token = (
            await getExpoPushToken({
              projectId: Constants?.expoConfig?.extra?.eas?.projectId,
            })
          ).data;
          await sendTokenToBackend({ variables: { token, isEnabled: true } });
        } else if (permissionStatus.canAskAgain) {
          const result = await requestPermission();
          if (result.granted) {
            setNotificationStatus(true);
            const token = (
              await getExpoPushToken({
                projectId: Constants?.expoConfig?.extra?.eas?.projectId,
              })
            ).data;
            await sendTokenToBackend({ variables: { token, isEnabled: true } });
          }
        }
      } else {
        setNotificationStatus(false);
        await sendTokenToBackend({
          variables: { token: null, isEnabled: false },
        });
      }
    } catch (error) {
      console.error("Error toggling notification:", error);
    }
  }; */
  const init = async () => {
    const token = await SecureStore.getItemAsync(STORE_TOKEN);
    if (token) {
      router.replace(ROUTES.home as Href);
    } else {
      router.replace(ROUTES.login as Href);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        if (!restaurantData) return;

        if (
          restaurantData?.restaurant?.enableNotification &&
          notificationRef?.current
        ) {
          const permissionStatus = await getPermission();
          if (permissionStatus.granted) {
            /*  const token = (
              await getExpoPushToken({
                projectId: Constants?.expoConfig?.extra?.eas.projectId,
              })
            ).data; */

            const token = (await getDevicePushToken()).data;

            try {
              console.log({ token });
              sendTokenToBackend({
                variables: { token, isEnabled: true },
                onCompleted: () => {
                  init();
                },
                onError: () => {
                  init();
                },
              });
            } catch (err) {
              init();
            }
          }
        }
        notificationRef.current = false;
      } catch (err) {
        console.log({ checkToken: JSON.stringify(err, null, 2) });
        init();
      }
    };
    checkToken();
  }, [restaurantData]);

  return <SpinnerComponent />;
}

export default App;
