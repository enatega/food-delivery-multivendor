// Core
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

// Gifted Chat
import { useApptheme } from "@/lib/context/global/theme.context";
import { useChatScreen } from "@/lib/hooks/useChat";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

export default function ChatMain() {
  // Hooks
  const { appTheme, currentTheme } = useApptheme();
  const { t } = useTranslation();
  const {
    messages,
    onSend,
    inputMessage,
    setInputMessage,
    profile,
  } = useChatScreen();

  const renderSend = () => {
    return (
      <Ionicons
        width={30}
        height={30}
        name="send"
        color={appTheme.primary}
        style={{ margin: 10 }}
        onPress={() => {
          if (inputMessage?.trim()) {
            // Only send if message is not empty
            onSend();
          }
        }}
      />
    );
  };

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: appTheme.fontMainColor,
            borderWidth: currentTheme === "dark" ? 1 : 0,
            borderColor: appTheme.borderLineColor,
            borderRadius: 12,
            paddingVertical: 4,
            paddingHorizontal: 15,
            alignItems: "center",
            justifyContent: "center",
          },
          left: {
            color: appTheme.fontMainColor,
          },
        }}
        wrapperStyle={{
          right: {
            ...styles.bubbleRight,
            backgroundColor: appTheme.themeBackground,
          },
          left: { ...styles.bubbleLeft, backgroundColor: appTheme.primary },
        }}
        usernameStyle={{ color: appTheme.fontMainColor }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <FontAwesome
        name="angle-double-down"
        size={22}
        color={appTheme.primary}
      />
    );
  };

  return (
    <View
      style={[
        styles.chatContainer,
        { flex: 1, backgroundColor: appTheme.screenBackground },
      ]}
    >
      <GiftedChat
        messages={messages}
        user={{
          _id: profile?._id ?? "",
          name: profile?.name,
        }}
        alwaysShowSend
        renderBubble={renderBubble}
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderAvatar={null}
        renderUsernameOnMessage
        inverted={Platform.OS !== "web" || messages.length === 0}
        timeTextStyle={{
          left: { color: appTheme.fontMainColor },
          right: { color: appTheme.primary },
        }}
        placeholder={t("Chats Here")}
        text={inputMessage ?? ""}
        onInputTextChanged={(m) => setInputMessage(String(m ?? ""))}
        messagesContainerStyle={{
          backgroundColor: appTheme.screenBackground,
        }}
      />
      {Platform.OS === "ios" && (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-200} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    marginBottom: 0,
  },
  bubbleRight: {
    padding: 5,
    marginBottom: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0,
  },
  bubbleLeft: {
    padding: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 15,
  },
});
