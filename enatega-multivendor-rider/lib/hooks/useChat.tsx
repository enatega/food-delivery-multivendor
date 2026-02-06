import { useMutation, useQuery } from "@apollo/client";
import { useRoute } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "expo-router";

// Context
import UserContext from "../context/global/user.context";

// API
import { SEND_CHAT_MESSAGE } from "@/lib/apollo/mutations/chat.mutation";
import { CHAT } from "@/lib/apollo/queries";
import { SUBSCRIPTION_NEW_MESSAGE } from "@/lib/apollo/subscriptions";
import { IMessage } from "react-native-gifted-chat";

// Interface

export const useChatScreen = () => {
  const route = useRoute();

  const { id: orderId } = route.params as { id: string };

  const { dataProfile } = useContext(UserContext);

  // States
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [image, setImage] = useState([]);

  // API
  const { subscribeToMore: subscribeToMessages, data: chatData, refetch } = useQuery(
    CHAT,
    {
      variables: { order: orderId },
      fetchPolicy: "network-only",
      //, onError,
    },
  );
  const [send] = useMutation(SEND_CHAT_MESSAGE, {
    onCompleted /* , onError */,
  });

  function onCompleted({
    sendChatMessage: messageResult,
  }: {
    sendChatMessage: { success: boolean; message: string };
  }) {
    if (!messageResult?.success) {
      Alert.alert("Error", messageResult.message);
    }
  }
  /* function onError() {
    Alert.alert("Error", error.message);
  } */

  //Handler
  const onSend = () => {
    send({
      variables: {
        orderId: String(orderId),
        messageInput: {
          message: String(inputMessage),
          user: {
            id: String(dataProfile?._id),
            name: String(dataProfile?.name),
          },
        },
      },
    });
    setInputMessage("");
    setImage([]);
  };

  // Use Effect to refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Refetch chat messages when screen comes into focus
      if (refetch) {
        refetch();
      }
    }, [refetch])
  );

  // Use Effect for subscription
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
        chatData?.chat?.map((message: any) => ({
          _id: message?.id ?? "",
          text: message?.message ?? "",
          createdAt: message.createdAt,
          user: {
            _id: message.user.id ?? "",
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
