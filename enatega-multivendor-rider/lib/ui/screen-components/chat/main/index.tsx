/* eslint-disable @typescript-eslint/no-explicit-any */
// Core
import {
  ActivityIndicator,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Gifted Chat
import { useApptheme } from "@/lib/context/global/theme.context";
import { useChatScreen } from "@/lib/hooks/useChat";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  Actions,
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
} from "react-native-gifted-chat";

export default function ChatMain() {
  // Hooks
  const { appTheme, currentTheme } = useApptheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const messageContainerRef = useRef<any>(null);
  const isAndroid = Platform.OS === "android";
  const {
    messages,
    onSend,
    pickImage,
    uploading,
    inputMessage,
    setInputMessage,
    profile,
  } = useChatScreen();

  useEffect(() => {
    if (!messages?.length) return;

    requestAnimationFrame(() => {
      messageContainerRef.current?.scrollToOffset?.({
        offset: 0,
        animated: true,
      });
    });
  }, [messages]);

  useEffect(() => {
    if (!isAndroid) return;

    const scrollToLatestMessage = () => {
      requestAnimationFrame(() => {
        messageContainerRef.current?.scrollToOffset?.({
          offset: 0,
          animated: true,
        });
      });
    };

    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      scrollToLatestMessage,
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      scrollToLatestMessage,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [isAndroid]);

  const renderSend = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.sendButtonWrap, { backgroundColor: appTheme.primary }]}
        onPress={() => {
          if (inputMessage?.trim()) {
            onSend();
          }
        }}
      >
        <Ionicons
          size={24}
          name="send"
          color={appTheme.white}
          style={styles.sendIcon}
        />
      </TouchableOpacity>
    );
  };

  const renderActions = (props: any) => {
    return (
      <Actions
        {...props}
        containerStyle={[
          styles.actionButton,
          {
            backgroundColor:
              currentTheme === "dark" ? "#1F2937" : "#F3F4F6",
            borderColor: appTheme.borderLineColor,
          },
        ]}
        icon={() => (
          <Ionicons
            name="image-outline"
            size={24}
            color={appTheme.primary}
          />
        )}
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

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: currentTheme === "dark" ? "#111111" : appTheme.white,
          borderTopColor: appTheme.borderLineColor,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingHorizontal: 10,
          paddingTop: 8,
          paddingBottom: isAndroid ? 4 : Math.max(insets.bottom, 6),
        }}
        primaryStyle={{
          alignItems: "center",
          minHeight: 60,
        }}
        renderComposer={(composerProps) => (
          <Composer
            {...composerProps}
            placeholderTextColor={
              currentTheme === "dark" ? appTheme.fontSecondColor : "#9CA3AF"
            }
            textInputStyle={{
              color: appTheme.fontMainColor,
              backgroundColor:
                currentTheme === "dark" ? "#111111" : appTheme.white,
              borderColor: appTheme.borderLineColor,
              borderWidth: StyleSheet.hairlineWidth,
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingTop: 11,
              paddingBottom: 11,
              marginLeft: 0,
              marginTop: 0,
              marginBottom: 0,
              minHeight: 48,
              lineHeight: 20,
            }}
            textInputProps={{
              ...composerProps.textInputProps,
              textAlignVertical: "center",
            }}
          />
        )}
        wrapperStyle={{
          alignItems: "center",
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
    <KeyboardAvoidingView
      style={[
        styles.chatContainer,
        { flex: 1, backgroundColor: appTheme.screenBackground },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled={Platform.OS === "ios"}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <GiftedChat
        messages={messages}
        messageContainerRef={messageContainerRef}
        user={{
          _id: profile?._id ?? "",
          name: profile?.name,
        }}
        alwaysShowSend
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderActions}
        renderMessageImage={renderMessageImage}
        renderChatFooter={renderChatFooter}
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderAvatar={null}
        renderUsernameOnMessage
        inverted={true}
        isKeyboardInternallyHandled={true}
        timeTextStyle={{
          left: { color: appTheme.fontMainColor },
          right: { color: appTheme.primary },
        }}
        placeholder={t("Chats Here")}
        keyboardShouldPersistTaps="handled"
        bottomOffset={0}
        minComposerHeight={44}
        maxComposerHeight={120}
        text={inputMessage ?? ""}
        onInputTextChanged={(m) => setInputMessage(String(m ?? ""))}
        textInputProps={{
          placeholderTextColor:
            currentTheme === "dark" ? appTheme.fontSecondColor : "#9CA3AF",
        }}
        messagesContainerStyle={{
          backgroundColor: appTheme.screenBackground,
          paddingBottom: 12,
        }}
        listViewProps={{
          keyboardDismissMode: Platform.OS === "ios" ? "interactive" : "on-drag",
          maintainVisibleContentPosition: {
            minIndexForVisible: 0,
          },
          showsVerticalScrollIndicator: false,
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginBottom: 2,
  },
  chatContainer: {
    marginBottom: 0,
  },
  sendIcon: {
    margin: 0,
    transform: [{ translateX: 1 }],
  },
  sendButtonWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 2,
    marginBottom: 1,
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
