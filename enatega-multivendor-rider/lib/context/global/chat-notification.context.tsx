import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApolloClient } from "@apollo/client";
import * as Notifications from "expo-notifications";
import { useGlobalSearchParams, usePathname, useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { AppState, AppStateStatus, Platform } from "react-native";

import { RIDER_ORDERS, SINGLE_VENDOR_RIDER_ORDERS } from "@/lib/apollo/queries";
import {
  getChatUnreadKey,
  getHandledNotificationKey,
  RIDER_SERVER_MODES,
} from "@/lib/mode/rider-mode";
import FlashMessageComponent from "@/lib/ui/useable-components/flash-message";
import {
  addChatUnread,
  ChatUnreadEntry,
  ChatUnreadState,
  clearChatUnread,
} from "@/lib/utils/chat-unread";
import { useRiderMode } from "./rider-mode.context";
import { useUserContext } from "./user.context";

interface ChatNotificationContextValue {
  getUnreadChat: (orderId: string) => ChatUnreadEntry | undefined;
  markChatRead: (orderId: string) => void;
}

const ChatNotificationContext = createContext<ChatNotificationContextValue>({
  getUnreadChat: () => undefined,
  markChatRead: () => {},
});

const isChatNotification = (notification: Notifications.Notification) =>
  notification.request.content.data?.type === "chat";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isChat = isChatNotification(notification);
    return {
      shouldShowAlert: false,
      shouldShowBanner: false,
      shouldShowList: isChat,
      shouldPlaySound: isChat,
      shouldSetBadge: false,
    };
  },
});

export const ChatNotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const client = useApolloClient();
  const router = useRouter();
  const pathname = usePathname();
  const params = useGlobalSearchParams<{ id?: string }>();
  const { t } = useTranslation();
  const { mode } = useRiderMode();
  const { assignedOrders, userId } = useUserContext();
  const [unreadChats, setUnreadChats] = useState<ChatUnreadState>({});
  const [hydrated, setHydrated] = useState(false);
  const unreadStorageKey = getChatUnreadKey(mode);
  const handledNotificationKey = getHandledNotificationKey(mode);

  useEffect(() => {
    let mounted = true;
    setHydrated(false);
    AsyncStorage.getItem(unreadStorageKey)
      .then((stored) => {
        if (!mounted) return;
        setUnreadChats(stored ? JSON.parse(stored) : {});
      })
      .catch(() => {
        if (mounted) setUnreadChats({});
      })
      .finally(() => {
        if (mounted) setHydrated(true);
      });
    return () => {
      mounted = false;
    };
  }, [unreadStorageKey]);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(unreadStorageKey, JSON.stringify(unreadChats));
  }, [hydrated, unreadChats, unreadStorageKey]);

  const recordChatNotification = useCallback(
    (notification: Notifications.Notification, showInAppAlert: boolean) => {
      if (!isChatNotification(notification)) return;
      const rawOrderId = notification.request.content.data?._id;
      if (typeof rawOrderId !== "string" && typeof rawOrderId !== "number") {
        return;
      }
      const orderId = String(rawOrderId);
      if (pathname === "/chat" && String(params.id ?? "") === orderId) return;

      setUnreadChats((current) =>
        addChatUnread(current, {
          orderId,
          notificationId: notification.request.identifier,
          preview: notification.request.content.body ?? "",
        }),
      );

      if (showInAppAlert) {
        const preview = notification.request.content.body;
        FlashMessageComponent({
          message: preview
            ? `${t("New message from customer")}: ${preview}`
            : t("New message from customer"),
        });
      }
    },
    [params.id, pathname, t],
  );

  const reconcilePresentedNotifications = useCallback(async () => {
    const presented = await Notifications.getPresentedNotificationsAsync();
    presented.forEach((notification) =>
      recordChatNotification(notification, false),
    );
  }, [recordChatNotification]);

  const markChatRead = useCallback(
    (orderId: string) => {
      const notificationIds = unreadChats[orderId]?.notificationIds ?? [];
      setUnreadChats((current) => clearChatUnread(current, orderId));
      notificationIds.forEach((notificationId) => {
        void Notifications.dismissNotificationAsync(notificationId);
      });
    },
    [unreadChats],
  );

  const handleNotificationResponse = useCallback(
    async (response: Notifications.NotificationResponse) => {
      if (!userId) return;
      const notification = response.notification;
      const data = notification.request.content.data;
      const rawOrderId = data?._id;
      if (typeof rawOrderId !== "string" && typeof rawOrderId !== "number") {
        return;
      }
      const orderId = String(rawOrderId);
      const notificationId = notification.request.identifier;
      const lastHandledId = await AsyncStorage.getItem(handledNotificationKey);
      if (lastHandledId === notificationId) return;
      await AsyncStorage.setItem(handledNotificationKey, notificationId);

      if (data?.type === "chat") {
        const order = assignedOrders?.find((item) => item._id === orderId);
        markChatRead(orderId);
        router.navigate({
          pathname: "/chat",
          params: {
            id: orderId,
            orderId: String(data.order ?? order?.orderId ?? ""),
            phoneNumber: order?.user?.phone ?? "",
          },
        });
        return;
      }

      const riderOrdersQuery =
        mode === RIDER_SERVER_MODES.SINGLE
          ? SINGLE_VENDOR_RIDER_ORDERS
          : RIDER_ORDERS;
      await client.query({
        query: riderOrdersQuery,
        variables:
          mode === RIDER_SERVER_MODES.SINGLE
            ? { limit: 50, offset: 0 }
            : { userId },
        fetchPolicy: "network-only",
      });
      router.navigate({
        pathname: "/order-detail",
        params: { itemId: orderId },
      });
    },
    [
      assignedOrders,
      client,
      handledNotificationKey,
      markChatRead,
      mode,
      router,
      userId,
    ],
  );

  useEffect(() => {
    if (Platform.OS === "android") {
      void Notifications.setNotificationChannelAsync("default", {
        name: t("Messages and orders"),
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      });
    }
    void Notifications.getPermissionsAsync()
      .then((permissions) => {
        const isGranted =
          permissions.status === "granted" ||
          permissions.ios?.status ===
            Notifications.IosAuthorizationStatus.PROVISIONAL;
        if (!isGranted) {
          void Notifications.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowBadge: true,
              allowSound: true,
              allowProvisional: true,
            },
          });
        }
      })
      .catch((error) => {
        if (__DEV__)
          console.warn("Unable to request notification permissions", error);
      });
  }, [t]);

  useEffect(() => {
    if (!hydrated) return;
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        recordChatNotification(notification, true);
      },
    );

    void reconcilePresentedNotifications();
    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "active") void reconcilePresentedNotifications();
      },
    );

    return () => {
      receivedSubscription.remove();
      appStateSubscription.remove();
    };
  }, [hydrated, reconcilePresentedNotifications, recordChatNotification]);

  useEffect(() => {
    if (!userId) return;
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        void handleNotificationResponse(response);
      });
    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) void handleNotificationResponse(response);
    });

    return () => responseSubscription.remove();
  }, [handleNotificationResponse, userId]);

  const getUnreadChat = useCallback(
    (orderId: string) => unreadChats[orderId],
    [unreadChats],
  );
  const value = useMemo(
    () => ({ getUnreadChat, markChatRead }),
    [getUnreadChat, markChatRead],
  );

  return (
    <ChatNotificationContext.Provider value={value}>
      {children}
    </ChatNotificationContext.Provider>
  );
};

export const useChatNotifications = () => useContext(ChatNotificationContext);
