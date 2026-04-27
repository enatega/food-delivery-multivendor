import { Platform, StyleSheet, Text, View } from "react-native";

import { useApptheme } from "@/lib/context/theme.context";
import { useChatScreen } from "@/lib/hooks/useChat";
import { SendIcon } from "@/lib/ui/useable-components/svg";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";

export default function ChatMain() {
  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();
  const { messages, onSend, inputMessage, setInputMessage, profile } =
    useChatScreen();

  // const filterImages = (src) => {
  //   setImage(image.filter((item) => item !== src));
  // };

  const renderSend = (props) => {
    return (
      <Send {...props} sendButtonProps={{ ...props, onPress: onSend }}>
        <View className="m-2">
          <SendIcon width={30} height={30} />
        </View>
      </Send>
    );
  };

  const renderChatEmpty = () => {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="font-[Inter] text-2xl text-gray-900 mt-[300px]">
          {t("No New Chats")}
        </Text>
      </View>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: "white",
          },
          left: {
            color: "black",
          },
        }}
        wrapperStyle={{
          right: styles.bubbleRight,
          left: styles.bubbleLeft,
        }}
        usernameStyle={{ color: "black" }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="green" />;
  };

  const styles = StyleSheet.create({
    chatContainer: {
      marginBottom: Platform.OS === "android" ? 80 : 0,
    },
    rowDisplay: {
      display: "flex",
      flexDirection: "row",
    },
    accessoryContainer: {
      height: 100,
      paddingLeft: 20,
      display: "flex",
      flexDirection: "row",
    },
    accessoryImg: {
      height: 40,
      width: 40,
      borderRadius: 5,
    },
    accessoryIcon: {
      marginLeft: -10,
      marginTop: -10,
      position: "relative",
      elevation: 999,
    },
    sendIcon: {
      marginBottom: 7,
      marginRight: 10,
    },
    emptyChat: {
      marginTop: 300,
      transform: [{ scaleY: -1 }],
      alignSelf: "center",
    },
    bubbleRight: {
      backgroundColor: appTheme.primary,
      padding: 5,
      marginBottom: 5,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 0,
    },
    bubbleLeft: {
      backgroundColor: appTheme.lowOpacityPrimaryColor,
      padding: 5,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 15,
    },
  });

  return (
    <View className="flex-1" style={styles.chatContainer}>
      <GiftedChat
        messages={messages}
        user={{
          _id: profile?._id ?? "",
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderAvatar={null}
        renderUsernameOnMessage
        renderChatEmpty={renderChatEmpty}
        inverted={Platform.OS !== "web" || messages.length === 0}
        timeTextStyle={{
          left: { color: "blue" },
          right: { color: "green" },
        }}
        placeholder={t("Type your message")}
        // textInputStyle={{ paddingTop: 10 }}
        // renderAccessory={image.length > 0 ? renderAccessory : <></>}
        text={inputMessage ?? ""}
        onInputTextChanged={(m) => setInputMessage(m)}
      />
    </View>
  );
}
