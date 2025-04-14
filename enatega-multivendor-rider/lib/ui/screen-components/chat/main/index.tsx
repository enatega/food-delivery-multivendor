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
    // image,
    // setImage,
    inputMessage,
    setInputMessage,
    profile,
  } = useChatScreen();

  // const filterImages = (src) => {
  //   setImage(image.filter((item) => item !== src));
  // };

  const renderSend = () => {
    return (
      // <Send
      //   {...props}
      //   sendButtonProps={{ ...props, onPress: onSend }}
      // >
      //   <View className="m-2">

      <Ionicons
        width={30}
        height={30}
        name="send"
        color={appTheme.primary}
        onPress={onSend}
      />
      //   </View>
      // </Send>
    );
  };

  // const renderChatEmpty = () => {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <Text className="font-[Inter] text-2xl text-gray-900 mt-[300px]">
  //         {t("No New Chats")}
  //       </Text>
  //     </View>
  //   );
  // };

  const renderBubble = (props) => {
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

  // const renderAccessory = (props) => {
  //   return (
  //     <View>
  //       {image?.map((item) => (
  //         <View key={item?.uri ?? ""}>
  //           <Image source={{ uri: item }} />
  //           <Entypo
  //             onPress={() => filterImages(item)}
  //             name="circle-with-cross"
  //             size={18}
  //             style={styles.accessoryIcon}
  //             color="black"
  //           />
  //         </View>
  //       ))}
  //     </View>
  //   );
  // };

  return (
    <KeyboardAvoidingView className="flex-1">
      <View
        className="flex-1"
        style={[
          styles.chatContainer,
          { backgroundColor: appTheme.screenBackground },
        ]}
      >
        <GiftedChat
          messages={messages}
          user={{
            _id: profile?._id ?? "",
            name: profile?.name,
          }}
          renderBubble={renderBubble}
          renderSend={renderSend}
          scrollToBottom
          scrollToBottomComponent={scrollToBottomComponent}
          // messagesContainerStyle
          renderAvatar={null}
          renderUsernameOnMessage
          // renderChatEmpty={renderChatEmpty}
          inverted={Platform.OS !== "web" || messages.length === 0}
          timeTextStyle={{
            left: { color: appTheme.fontMainColor },
            right: { color: appTheme.primary },
          }}
          placeholder={t("Chats Here")}
          // textInputStyle={{ paddingTop: 10 }}
          // renderAccessory={image.length > 0 ? renderAccessory : null}
          text={inputMessage ?? ""}
          messagesContainerStyle={{
            backgroundColor: appTheme.screenBackground,
          }}
          onInputTextChanged={(m) => setInputMessage(String(m ?? ""))}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    marginBottom: 0,
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
  accessoryImg: { height: 40, width: 40, borderRadius: 5 },
  accessoryIcon: {
    marginLeft: -10,
    marginTop: -10,
    position: "relative",
    elevation: 999,
  },
  emptyChat: {
    marginTop: 300,
    transform: [{ scaleY: -1 }],
    alignSelf: "center",
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
