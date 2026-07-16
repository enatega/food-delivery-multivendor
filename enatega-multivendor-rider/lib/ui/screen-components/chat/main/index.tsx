// Core
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Gifted Chat
import { useApptheme } from "@/lib/context/global/theme.context";
import { useChatScreen } from "@/lib/hooks/useChat";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Actions, Bubble, GiftedChat } from "react-native-gifted-chat";

export default function ChatMain() {
  // Hooks
  const { appTheme, currentTheme } = useApptheme();
  const { t } = useTranslation();
  const {
    messages,
    onSend,
    pickImage,
    uploading,
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

  const renderActions = (props: any) => {
    return (
      <Actions
        {...props}
        containerStyle={{
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
        icon={() => (
          <Ionicons name="image-outline" size={26} color={appTheme.primary} />
        )}
        // Open the gallery directly (no ActionSheetProvider needed).
        onPressActionButton={pickImage}
      />
    );
  };

  const renderMessageImage = (props: any) => {
    const uri = props?.currentMessage?.image;
    if (!uri) return null;
    return (
      <Image
        source={{ uri }}
        resizeMode="cover"
        style={{
          width: 160,
          height: 160,
          borderRadius: 12,
          margin: 3,
        }}
      />
    );
  };

  const renderChatFooter = () => {
    if (!uploading) return null;
    return (
      <View style={styles.uploadingFooter}>
        <ActivityIndicator size="small" color={appTheme.primary} />
        <Text style={{ color: appTheme.fontMainColor }}>
          {t("Uploading image...")}
        </Text>
      </View>
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
        renderActions={renderActions}
        renderMessageImage={renderMessageImage}
        renderChatFooter={renderChatFooter}
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
  uploadingFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
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
