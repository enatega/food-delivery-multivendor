import React from 'react'
import { Image, Platform, View } from 'react-native'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import { useChatScreen } from './useChatScreen'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Ionicons, Entypo } from '@expo/vector-icons'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import styles from './styles'
import {useTranslation} from 'react-i18next'

const ChatScreen = ({ navigation, route }) => {
  const {
    messages,
    onSend,
    currentTheme,
    image,
    setImage,
    inputMessage,
    setInputMessage,
    profile
  } = useChatScreen({ navigation, route })

  const filterImages = src => {
    setImage(image.filter(item => item !== src))
  }
  const {t} = useTranslation()
  const renderAccessory = props => {
    return (
      <View style={styles().rowDisplay}>
        {image.map(item => (
          <View key={item.uri} style={styles().accessoryContainer}>
            <Image source={{ uri: item }} style={styles().accessoryImg} />
            <Entypo
              onPress={() => filterImages(item)}
              name="circle-with-cross"
              size={18}
              style={styles().accessoryIcon}
              color="black"
            />
          </View>
        ))}
      </View>
    )
  }

  const renderSend = props => {
    return (
      <Send {...props} sendButtonProps={{ ...props, onPress: onSend }}>
        <View>
          <Ionicons
            name="send"
            size={30}
            color={currentTheme.black}
            style={styles().sendIcon}
          />
        </View>
      </Send>
    )
  }

  const renderChatEmpty = props => {
    return (
      <View>
        <TextDefault
          style={styles().emptyChat}
          textColor={currentTheme.fontSecondColor}
          H3>
          Lets chat with your rider
        </TextDefault>
      </View>
    )
  }

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: styles(currentTheme).bubbleRight,
          left: styles(currentTheme).bubbleLeft
        }}
        textStyle={{
          right: {
            color: currentTheme.white
          },
          left: {
            color: currentTheme.black
          }
        }}
      />
    )
  }

  const scrollToBottomComponent = () => {
    return (
      <FontAwesome
        name="angle-double-down"
        size={22}
        color={currentTheme.iconColorPink}
      />
    )
  }

  return (
    <GiftedChat
      messages={messages}
      user={{
        _id: profile._id
      }}
      renderBubble={renderBubble}
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      renderAvatar={null}
      renderUsernameOnMessage
      renderChatEmpty={renderChatEmpty}
      inverted={Platform.OS !== 'web' || messages.length === 0}
      timeTextStyle={{
        left: { color: currentTheme.statusSecondColor },
        right: { color: currentTheme.fontSecondColor }
      }}
      placeholder={t('message')}
      textInputStyle={{ paddingTop: 10 }}
      renderAccessory={image.length > 0 ? renderAccessory : null}
      text={inputMessage}
      onInputTextChanged={m => setInputMessage(m)}
    />
  )
}

export default ChatScreen
