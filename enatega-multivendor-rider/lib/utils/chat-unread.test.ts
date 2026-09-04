import {
  addChatUnread,
  clearChatUnread,
  createChatUnreadSubscriptions,
} from "./chat-unread";

describe("chat unread state", () => {
  it("counts distinct notifications for the same order", () => {
    const first = addChatUnread(
      {},
      {
        orderId: "order-1",
        notificationId: "message-1",
        preview: "First",
      },
    );
    const second = addChatUnread(first, {
      orderId: "order-1",
      notificationId: "message-2",
      preview: "Second",
    });

    expect(second["order-1"]).toMatchObject({
      count: 2,
      preview: "Second",
    });
  });

  it("does not count the same notification twice", () => {
    const first = addChatUnread(
      {},
      {
        orderId: "order-1",
        notificationId: "message-1",
        preview: "Hello",
      },
    );

    expect(
      addChatUnread(first, {
        orderId: "order-1",
        notificationId: "message-1",
        preview: "Hello",
      }),
    ).toBe(first);
  });

  it("counts a live chat event without treating it as a system notification", () => {
    const next = addChatUnread(
      {},
      {
        orderId: "order-1",
        eventId: "message-1",
        preview: "Live message",
      },
    );

    expect(next["order-1"]).toMatchObject({
      count: 1,
      preview: "Live message",
      eventIds: ["message-1"],
      notificationIds: [],
    });
  });

  it("clears only the opened order chat", () => {
    const state = {
      "order-1": { count: 1, preview: "One", notificationIds: ["1"] },
      "order-2": { count: 1, preview: "Two", notificationIds: ["2"] },
    };

    expect(clearChatUnread(state, "order-1")).toEqual({
      "order-2": state["order-2"],
    });
  });

  it("notifies only subscribers for the order whose unread state changed", () => {
    const subscriptions = createChatUnreadSubscriptions();
    const orderOneListener = jest.fn();
    const orderTwoListener = jest.fn();
    subscriptions.subscribe("order-1", orderOneListener);
    subscriptions.subscribe("order-2", orderTwoListener);
    const previous = {
      "order-1": { count: 1, preview: "One", notificationIds: ["1"] },
      "order-2": { count: 1, preview: "Two", notificationIds: ["2"] },
    };

    subscriptions.notifyChanged(previous, {
      ...previous,
      "order-1": { count: 2, preview: "New", notificationIds: ["1", "3"] },
    });

    expect(orderOneListener).toHaveBeenCalledTimes(1);
    expect(orderTwoListener).not.toHaveBeenCalled();
  });
});
