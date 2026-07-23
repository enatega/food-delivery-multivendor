import { useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";
import { useState, useEffect, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";

// Context
import UserContext from "../context/global/user.context";

// API
import { CHAT } from "@/lib/apollo/queries";
import { SEND_CHAT_MESSAGE } from "@/lib/apollo/mutations/chat.mutation";
import { SUBSCRIPTION_NEW_MESSAGE } from "@/lib/apollo/subscriptions";

// Interface

export const useChatScreen = () => {
  const { id: orderId } = useLocalSearchParams<{ id: string }>();

  const { dataProfile } = useContext(UserContext);
  // States
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState(null);
  const [image, setImage] = useState([]);

  // API
  const { subscribeToMore: subscribeToMessages, data: chatData } = useQuery(
    CHAT,
    {
      variables: { order: orderId },
      fetchPolicy: "cache-and-network",
      onError,
    },
  );
  const [send] = useMutation(SEND_CHAT_MESSAGE, { onCompleted, onError });

  function onCompleted({ sendChatMessage: messageResult }) {
    if (!messageResult?.success) {
      Alert.alert("Error", messageResult.message);
    }
  }
  function onError(error) {
    Alert.alert("Error", error.message);
  }

  //Handler
  const onSend = async () => {
    if (!orderId || !inputMessage || !dataProfile?._id) return;

    try {
      await send({
        variables: {
          orderId,
          messageInput: {
            message: inputMessage,
            user: {
              id: dataProfile._id,
              name: dataProfile.name,
            },
          },
        },
      });
      setInputMessage(null);
      setImage([]);
    } catch {
      Alert.alert("Error", "Failed to send message");
    }
  };

  // Use Effect
  useEffect(() => {
    const unsubscribe = subscribeToMessages({
      document: SUBSCRIPTION_NEW_MESSAGE,
      variables: { order: orderId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return {
          chat: [subscriptionData.data.subscriptionNewMessage, ...prev.chat],
        };
      },
    });
    return unsubscribe;
  }, [orderId, subscribeToMessages]);

  useEffect(() => {
    if (chatData) {
      setMessages(
        chatData?.chat?.map((message) => ({
          _id: message.id,
          text: message.message,
          createdAt: message.createdAt,
          user: {
            _id: message.user.id,
            name: message.user.name,
          },
        })),
      );
    }
  }, [chatData]);

  return {
    messages,
    onSend,
    image,
    setImage,
    inputMessage,
    setInputMessage,
    profile: dataProfile,
  };
};
