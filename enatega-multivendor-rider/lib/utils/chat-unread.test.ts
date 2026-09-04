import { addChatUnread, clearChatUnread } from "./chat-unread";

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

  it("clears only the opened order chat", () => {
    const state = {
      "order-1": { count: 1, preview: "One", notificationIds: ["1"] },
      "order-2": { count: 1, preview: "Two", notificationIds: ["2"] },
    };

    expect(clearChatUnread(state, "order-1")).toEqual({
      "order-2": state["order-2"],
    });
  });
});
