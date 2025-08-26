"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { MessageBox } from "react-chat-elements";

// Subscriptions, Queries, and Mutations
import { CHAT_QUERY } from "@/lib/api/graphql/queries/chatWithRider";
import { SUBSCRIPTION_NEW_MESSAGE } from "@/lib/api/graphql/subscription/ChatWithRider";
import { SEND_CHAT_MESSAGE } from "@/lib/api/graphql/mutations/chatWithRider";
import { useTranslations } from "next-intl";

interface Message {
  _id: string;
  text: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
  };
}

interface ChatWithRiderModalProps {
  visible: boolean;
  onHide: () => void;
  orderId: string;
  currentUserId: string;
}

function ChatWithRiderModal({
  visible,
  onHide,
  orderId,
  currentUserId,
}: ChatWithRiderModalProps) {
  const t = useTranslations()
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  // Initial chat messages
  const { data: chatData } = useQuery(CHAT_QUERY, {
    variables: { order: orderId },
    fetchPolicy: "network-only",
    onError: (error) => alert(error.message),
  });

  // Subscription for new messages
  const { data: subscriptionData } = useSubscription(SUBSCRIPTION_NEW_MESSAGE, {
    variables: { order: orderId },
  });

  // Send message mutation
  const [sendChatMessage] = useMutation(SEND_CHAT_MESSAGE, {
    onCompleted: (data) => {
      if (!data.sendChatMessage.success) {
        alert("Error sending message: " + data.sendChatMessage.message);
      }
    },
    onError: (error) => alert(error.message),
  });

  // Load chat history
  useEffect(() => {
    if (chatData?.chat) {
      const formattedMessages = chatData.chat.map((message: any) => ({
        _id: message.id,
        text: message.message,
        createdAt: message.createdAt,
        user: {
          _id: message.user.id,
          name: message.user.name,
        },
      }));
      setMessages(formattedMessages.reverse()); // Newest messages at the bottom
    }
  }, [chatData]);

  // Handle new message via subscription
  useEffect(() => {
    if (subscriptionData?.subscriptionNewMessage) {
      const newMsg = subscriptionData.subscriptionNewMessage;

      const formattedMsg: Message = {
        _id: newMsg.id,
        text: newMsg.message,
        createdAt: newMsg.createdAt,
        user: {
          _id: newMsg.user.id,
          name: newMsg.user.name,
        },
      };

      setMessages((prevMessages) => [...prevMessages, formattedMsg]);
    }
  }, [subscriptionData]);

  // Handle sending a message
  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    await sendChatMessage({
      variables: {
        orderId,
        messageInput: {
          message: inputMessage,
          user: {
            id: currentUserId,
            name: "You",
          },
        },
      },
    });

    setInputMessage("");
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      modal
      className="w-full max-w-xs mx-0 relative"
      contentClassName="pb-6 m-0"
      showHeader={false}
      closable
      dismissableMask
      style={{
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        height: "80vh",
        overflow: "hidden",
        position: "fixed",
        bottom: "20px",
        right: "20px",
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center bg-[#5AC12F] text-white p-2">
          <div>{t("chat_with_rider_button")}</div>
          <button onClick={onHide}>
            <i className="pi pi-times" style={{ fontSize: "1rem" }}></i>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2">
          {messages.map((msg: Message) => (
            <div key={msg._id} className="mb-2">
              <MessageBox
                type="text"
                text={msg.text}
                date={new Date(msg.createdAt)}
                id={msg._id}
                title={msg.user.name}
                titleColor={msg.user._id === currentUserId ? "green" : "black"}
                position={msg.user._id === currentUserId ? "right" : "left"}
                className={
                  msg.user._id === currentUserId
                    ? "message-left"
                    : "message-right"
                }
                focus={false}
                forwarded={false}
                replyButton={false}
                removeButton={false}
                notch={true}
                retracted={false}
                status="read"
              />
            </div>
          ))}
        </div>

        {/* Input Area */}

        <div className="flex gap-2 p-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t("type_a_message_placeholder")}
            className="flex-1 border rounded p-2 focus:outline-none"
          />
          <button onClick={handleSend}>
          <i className="pi  pi-send" ></i>
          </button >
        </div>
      </div>
    </Dialog>
  );
}

export default ChatWithRiderModal;
