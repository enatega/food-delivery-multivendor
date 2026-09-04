export interface ChatUnreadEntry {
  count: number;
  preview: string;
  notificationIds: string[];
}

export type ChatUnreadState = Record<string, ChatUnreadEntry>;

interface AddChatUnreadInput {
  orderId: string;
  notificationId: string;
  preview: string;
}

export const addChatUnread = (
  state: ChatUnreadState,
  { orderId, notificationId, preview }: AddChatUnreadInput,
): ChatUnreadState => {
  const current = state[orderId];
  if (current?.notificationIds.includes(notificationId)) return state;

  return {
    ...state,
    [orderId]: {
      count: (current?.count ?? 0) + 1,
      preview,
      notificationIds: [
        ...(current?.notificationIds ?? []),
        notificationId,
      ].slice(-50),
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
