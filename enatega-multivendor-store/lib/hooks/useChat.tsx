import { useRoute } from "@react-navigation/native";
import { Alert } from "react-native";
import { useState, useEffect, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";

// Context
import UserContext from "../context/global/user.context";

// API
import { CHAT, GET_STORE_CHAT_MESSAGES } from "@/lib/apollo/queries";
import { SEND_CHAT_MESSAGE } from "@/lib/apollo/mutations/chat.mutation";
import { SUBSCRIPTION_NEW_MESSAGE } from "@/lib/apollo/subscriptions";

// Interface

export const useChatScreen = () => {
  const route = useRoute();

  const { id: orderId } = route.params;

  const { dataProfile } = useContext(UserContext);
  // States
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState(null);
  const [image, setImage] = useState([]);

  // API
    const {
    subscribeToMore: subscribeToMessages, data: chatData
  } = useQuery(GET_STORE_CHAT_MESSAGES, {
    variables: { order: orderId },
    skip: !orderId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    // onCompleted: (data) => {
    //   if (data?.storeChat) {
    //     // Sort messages by creation time to ensure proper order
    //     const sortedMessages = [...data.storeChat].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    //     setMessages(sortedMessages);
    //   }
    // },
    onError,
  });

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
  const onSend = () => {
    send({
      variables: {
        isStoreChat: true,
        orderId: orderId,
        messageInput: {
          message: inputMessage,
          user: {
            id: dataProfile?._id,
            name: dataProfile?.name,
          },
        },
      },
    });
    setInputMessage(null);
    setImage([]);
  };

  // Use Effect
  useEffect(() => {
    const unsubscribe = subscribeToMessages({
      document: SUBSCRIPTION_NEW_MESSAGE,
      variables: { order: orderId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return {
          storeChat: [subscriptionData?.data?.subscriptionNewMessage, ...(prev?.storeChat ?? [])],
        };
      },
    });
    return unsubscribe;
  });



  useEffect(() => {
    if (chatData) {
      setMessages(
        chatData?.storeChat?.map((message) => ({
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
