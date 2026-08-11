import * as Device from "expo-device";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { ApolloError } from "@apollo/client";
import { FlashMessageComponent } from "@/lib/ui/useable-components";

export const getNotificationPermissions = async () => {
  try {
    const settings = await Notifications.getPermissionsAsync();

    if (
      settings?.status === "granted" ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    ) {
      return settings;
    }

    const requestedPermissions = await Notifications.requestPermissionsAsync({
      ios: {
        allowProvisional: true,
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });

    return requestedPermissions;
  } catch (error) {
    FlashMessageComponent({ message: "Failed to get notification permissions." });
    throw error;
  }
};

export const getNotificationToken = async (): Promise<string | null> => {
  try {
    const permissions = await getNotificationPermissions();

    if (
      (permissions?.status === "granted" ||
        permissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) &&
      Device.isDevice
    ) {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
      return token.data;
    }

    return null;
  } catch (error) {
    FlashMessageComponent({ message: "Failed to get notification token." });
    return null;
  }
};
