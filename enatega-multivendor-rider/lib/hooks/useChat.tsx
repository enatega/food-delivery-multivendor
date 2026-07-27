import { useMutation, useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

// Context
import UserContext from "../context/global/user.context";

// API
import { SEND_CHAT_MESSAGE } from "@/lib/apollo/mutations/chat.mutation";
import { UPLOAD_IMAGE_TO_S3 } from "@/lib/apollo/mutations/rider.mutation";
import { CHAT } from "@/lib/apollo/queries";
import { SUBSCRIPTION_NEW_MESSAGE } from "@/lib/apollo/subscriptions";

// Interface

export const useChatScreen = () => {
  const { id: orderId } = useLocalSearchParams<{ id: string }>();

  const { dataProfile } = useContext(UserContext);

  // States
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [image, setImage] = useState([]);

  const normalizeMessages = (incomingMessages: any[] = []) => {
    const uniqueMessages = new Map<string, any>();

    incomingMessages.forEach((message: any, index: number) => {
      const normalizedMessage = {
        _id: String(message?.id ?? message?._id ?? `${message?.createdAt ?? Date.now()}-${index}`),
        text: message?.message ?? message?.text ?? "",
        image: message?.image || undefined,
        createdAt: new Date(message?.createdAt ?? Date.now()),
        user: {
          _id: String(message?.user?.id ?? message?.user?._id ?? ""),
          name: message?.user?.name ?? "",
        },
      };

      uniqueMessages.set(normalizedMessage._id, normalizedMessage);
    });

    return Array.from(uniqueMessages.values()).sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  };

  // API
  const { subscribeToMore: subscribeToMessages, data: chatData } = useQuery(
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
  const [uploadImage] = useMutation(UPLOAD_IMAGE_TO_S3);
  const [uploading, setUploading] = useState(false);

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
    const trimmed = inputMessage?.trim();
    if (!trimmed) return;

    // Optimistically show the rider's own message immediately.
    const newMessage = {
      _id: Date.now().toString(),
      text: trimmed,
      createdAt: new Date(),
      user: {
        _id: dataProfile?._id ?? "",
        name: dataProfile?.name ?? "",
      },
    };
    setMessages((previousMessages: any[]) =>
      normalizeMessages([newMessage, ...previousMessages]),
    );

    send({
      variables: {
        orderId: String(orderId),
        messageInput: {
          message: trimmed,
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

  // Optimistically add an image-only message, then persist it.
  const sendImageMessage = (imageUrl: string) => {
    const newMessage = {
      _id: Date.now().toString(),
      text: "",
      image: imageUrl,
      createdAt: new Date(),
      user: {
        _id: dataProfile?._id ?? "",
        name: dataProfile?.name ?? "",
      },
    };
    setMessages((previousMessages: any[]) =>
      normalizeMessages([newMessage, ...previousMessages]),
    );

    send({
      variables: {
        orderId: String(orderId),
        messageInput: {
          message: "",
          image: imageUrl,
          user: {
            id: String(dataProfile?._id),
            name: String(dataProfile?.name),
          },
        },
      },
    });
  };

  // Pick from gallery -> upload to S3 -> send the returned URL.
  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow photo library access to attach images.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      base64: true,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.base64) return;
    try {
      setUploading(true);
      const { data } = await uploadImage({
        variables: { image: `data:image/jpeg;base64,${asset.base64}` },
      });
      const imageUrl = data?.uploadImageToS3?.imageUrl;
      if (!imageUrl) throw new Error("Image upload failed");
      sendImageMessage(imageUrl);
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Image upload failed");
    } finally {
      setUploading(false);
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
          chat: [
            subscriptionData.data.subscriptionNewMessage,
            ...(prev?.chat ?? []),
          ],
        };
      },
    });
    return unsubscribe;
  }, [orderId, subscribeToMessages]);

  useEffect(() => {
    if (chatData) {
      setMessages(normalizeMessages(chatData?.chat ?? []));
    }
  }, [chatData]);

  return {
    messages,
    onSend,
    pickImage,
    uploading,
    image,
    setImage,
    inputMessage,
    setInputMessage,
    profile: dataProfile,
  };
};
