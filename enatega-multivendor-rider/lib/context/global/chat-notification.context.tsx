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
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useTranslation } from "react-i18next";
import { AppState, AppStateStatus, Platform } from "react-native";

import { RIDER_ORDERS, SINGLE_VENDOR_RIDER_ORDERS } from "@/lib/apollo/queries";
import {
  SINGLE_VENDOR_SUBSCRIPTION_NEW_MESSAGE,
  SUBSCRIPTION_NEW_MESSAGE,
} from "@/lib/apollo/subscriptions";
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
  createChatUnreadSubscriptions,
} from "@/lib/utils/chat-unread";
import { isProcessingOrderForMode } from "@/lib/utils/order-state";
import { useRiderMode } from "./rider-mode.context";
import { useUserContext } from "./user.context";

interface ChatNotificationContextValue {
  getUnreadChat: (orderId: string) => ChatUnreadEntry | undefined;
  markChatRead: (orderId: string) => void;
  subscribeToUnreadChat: (orderId: string, listener: () => void) => () => void;
}

const ChatNotificationContext = createContext<ChatNotificationContextValue>({
  getUnreadChat: () => undefined,
  markChatRead: () => {},
  subscribeToUnreadChat: () => () => {},
});

const isChatNotification = (notification: Notifications.Notification) =>
  notification.request.content.data?.type === "chat";

interface IncomingChatMessage {
  id?: string | number;
  message?: string | null;
  image?: string | null;
  createdAt?: string | number | null;
  user?: { id?: string | number | null } | null;
}

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
  const unreadChatsRef = useRef<ChatUnreadState>({});
  const unreadSubscriptionsRef = useRef(createChatUnreadSubscriptions());
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

  useEffect(() => {
    const previous = unreadChatsRef.current;
    unreadChatsRef.current = unreadChats;
    unreadSubscriptionsRef.current.notifyChanged(previous, unreadChats);
  }, [unreadChats]);

  const recordUnreadMessage = useCallback(
    ({
      orderId,
      eventId,
      notificationId,
      preview,
      showInAppAlert,
    }: {
      orderId: string;
      eventId: string;
      notificationId?: string;
      preview: string;
      showInAppAlert: boolean;
    }) => {
      if (pathname === "/chat" && String(params.id ?? "") === orderId) return;

      setUnreadChats((current) =>
        addChatUnread(current, {
          orderId,
          eventId,
          notificationId,
          preview,
        }),
      );

      if (showInAppAlert) {
        FlashMessageComponent({
          message: preview
            ? `${t("New message from customer")}: ${preview}`
            : t("New message from customer"),
        });
      }
    },
    [params.id, pathname, t],
  );

  const recordChatNotification = useCallback(
    (notification: Notifications.Notification, showInAppAlert: boolean) => {
      if (!isChatNotification(notification)) return;
      const data = notification.request.content.data;
      const rawOrderId = data?._id ?? data?.orderId;
      if (typeof rawOrderId !== "string" && typeof rawOrderId !== "number") {
        return;
      }
      const orderId = String(rawOrderId);
      const rawMessageId = data?.messageId ?? data?.chatId;
      const notificationId = notification.request.identifier;

      recordUnreadMessage({
        orderId,
        eventId:
          typeof rawMessageId === "string" || typeof rawMessageId === "number"
            ? `message:${String(rawMessageId)}`
            : `notification:${notificationId}`,
        notificationId,
        preview: notification.request.content.body ?? "",
        showInAppAlert,
      });
    },
    [recordUnreadMessage],
  );

  const subscribedOrderIds = useMemo(
    () =>
      Array.from(
        new Set(
          (assignedOrders ?? [])
            .filter((order) => isProcessingOrderForMode(order, mode))
            .map((order) => String(order._id))
            .filter(Boolean),
        ),
      ).sort(),
    [assignedOrders, mode],
  );
  const subscribedOrderIdsKey = subscribedOrderIds.join("\u0000");

  useEffect(() => {
    if (!hydrated || !userId || !subscribedOrderIdsKey) return;

    const chatSubscription =
      mode === RIDER_SERVER_MODES.SINGLE
        ? SINGLE_VENDOR_SUBSCRIPTION_NEW_MESSAGE
        : SUBSCRIPTION_NEW_MESSAGE;
    const subscriptions = subscribedOrderIdsKey.split("\u0000").map((orderId) =>
      client
        .subscribe<{ subscriptionNewMessage?: IncomingChatMessage }>({
          query: chatSubscription,
          variables: { order: orderId },
        })
        .subscribe({
          next: ({ data }) => {
            const message = data?.subscriptionNewMessage;
            if (!message || String(message.user?.id ?? "") === String(userId)) {
              return;
            }

            const messageId =
              message.id ??
              `${message.createdAt ?? "unknown"}:${message.message ?? ""}:${message.image ?? ""}`;
            recordUnreadMessage({
              orderId,
              eventId: `message:${String(messageId)}`,
              preview: message.message ?? "",
              showInAppAlert: true,
            });
          },
          error: (error) => {
            if (__DEV__) {
              console.warn(
                `Unable to subscribe to chat messages for order ${orderId}`,
                error,
              );
            }
          },
        }),
    );

    return () =>
      subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, [
    client,
    hydrated,
    mode,
    recordUnreadMessage,
    subscribedOrderIdsKey,
    userId,
  ]);

  const reconcilePresentedNotifications = useCallback(async () => {
    const presented = await Notifications.getPresentedNotificationsAsync();
    presented.forEach((notification) =>
      recordChatNotification(notification, false),
    );
  }, [recordChatNotification]);

  const markChatRead = useCallback((orderId: string) => {
    const notificationIds =
      unreadChatsRef.current[orderId]?.notificationIds ?? [];
    setUnreadChats((current) => clearChatUnread(current, orderId));
    notificationIds.forEach((notificationId) => {
      void Notifications.dismissNotificationAsync(notificationId);
    });
  }, []);

  const handleNotificationResponse = useCallback(
    async (response: Notifications.NotificationResponse) => {
      if (!userId) return;
      const notification = response.notification;
      const data = notification.request.content.data;
      const rawOrderId = data?._id ?? data?.orderId;
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
    (orderId: string) => unreadChatsRef.current[orderId],
    [],
  );
  const subscribeToUnreadChat = useCallback(
    (orderId: string, listener: () => void) =>
      unreadSubscriptionsRef.current.subscribe(orderId, listener),
    [],
  );
  const value = useMemo(
    () => ({ getUnreadChat, markChatRead, subscribeToUnreadChat }),
    [getUnreadChat, markChatRead, subscribeToUnreadChat],
  );

  return (
    <ChatNotificationContext.Provider value={value}>
      {children}
    </ChatNotificationContext.Provider>
  );
};

export const useChatNotifications = () => useContext(ChatNotificationContext);

export const useUnreadChat = (orderId: string) => {
  const { getUnreadChat, subscribeToUnreadChat } = useChatNotifications();
  const subscribe = useCallback(
    (listener: () => void) => subscribeToUnreadChat(orderId, listener),
    [orderId, subscribeToUnreadChat],
  );
  const getSnapshot = useCallback(
    () => getUnreadChat(orderId),
    [getUnreadChat, orderId],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
