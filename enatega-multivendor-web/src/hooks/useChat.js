import { useState, useEffect, useContext, useCallback, useRef } from "react";
import gql from "graphql-tag";
import {
  subscriptionNewMessage,
  sendChatMessage,
  chat,
} from "../apollo/server";
import { useMutation, useQuery } from "@apollo/client";
import UserContext from "../context/User";

export const useChatScreen = (id) => {
  const messageContainerRef = useRef()
  const { profile } = useContext(UserContext);
  const { subscribeToMore: subscribeToMessages, data: chatData } = useQuery(
    gql`
      ${chat}
    `,
    {
      variables: { order: id },
      fetchPolicy: "network-only",
      onError,
    }
  );
  const messageSetter = useCallback(() => {
    if (chatData) {
      setMessages(
        chatData.chat.map((message) => ({
          _id: message.id,
          text: message.message,
          createdAt: message.createdAt,
          user: {
            _id: message.user.id,
            name: message.user.name,
          },
        }))
      );
    }
  }, [chatData]);

  useEffect(() => {
    messageSetter();
  }, [chatData, messageSetter]);

  const [send] = useMutation(
    gql`
      ${sendChatMessage}
    `,
    {
      onError,
    }
  );
  function onError(error) {
    alert("Error onError", error.message);
  }
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages({
      document: gql`
        ${subscriptionNewMessage}
      `,
      variables: { order: id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return {
          chat: [...prev.chat, subscriptionData.data.subscriptionNewMessage],
        };
      },
    });
    return unsubscribe;
  });

  const onSend = (input) => {
    send({
      variables: {
        orderId: id,
        messageInput: {
          message: input,
          user: {
            id: profile._id,
            name: profile.name,
          },
        },
      },
    });
  };

  return {
    messages,
    onSend,
    profile,
    setMessages,
    messageSetter,
    messageContainerRef
  };
};
