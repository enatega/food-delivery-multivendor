export interface ChatUnreadEntry {
  count: number;
  preview: string;
  notificationIds: string[];
  eventIds?: string[];
}

export type ChatUnreadState = Record<string, ChatUnreadEntry>;

type ChatUnreadListener = () => void;

export const createChatUnreadSubscriptions = () => {
  const listeners = new Map<string, Set<ChatUnreadListener>>();

  return {
    subscribe(orderId: string, listener: ChatUnreadListener) {
      const orderListeners = listeners.get(orderId) ?? new Set();
      orderListeners.add(listener);
      listeners.set(orderId, orderListeners);

      return () => {
        orderListeners.delete(listener);
        if (!orderListeners.size) listeners.delete(orderId);
      };
    },
    notifyChanged(previous: ChatUnreadState, next: ChatUnreadState) {
      const orderIds = new Set([
        ...Object.keys(previous),
        ...Object.keys(next),
      ]);
      orderIds.forEach((orderId) => {
        if (previous[orderId] === next[orderId]) return;
        listeners.get(orderId)?.forEach((listener) => listener());
      });
    },
  };
};

interface AddChatUnreadInput {
  orderId: string;
  eventId?: string;
  notificationId?: string;
  preview: string;
}

export const addChatUnread = (
  state: ChatUnreadState,
  { orderId, eventId, notificationId, preview }: AddChatUnreadInput,
): ChatUnreadState => {
  const current = state[orderId];
  const unreadEventId = eventId ?? notificationId;
  if (!unreadEventId) return state;
  const currentEventIds = current?.eventIds ?? current?.notificationIds ?? [];
  if (currentEventIds.includes(unreadEventId)) return state;

  return {
    ...state,
    [orderId]: {
      count: (current?.count ?? 0) + 1,
      preview,
      eventIds: [...currentEventIds, unreadEventId].slice(-50),
      notificationIds: notificationId
        ? [...(current?.notificationIds ?? []), notificationId].slice(-50)
        : (current?.notificationIds ?? []),
    },
  };
};

export const clearChatUnread = (
  state: ChatUnreadState,
  orderId: string,
): ChatUnreadState => {
  if (!state[orderId]) return state;
  const next = { ...state };
  delete next[orderId];
  return next;
};
