import React, { useContext } from 'react'
import { Image, KeyboardAvoidingView, Platform, View } from 'react-native'
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  Actions,
  Time
} from 'react-native-gifted-chat'
import { useChatScreen } from './useChatScreen'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Ionicons, Entypo } from '@expo/vector-icons'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'
import ConfigurationContext from '../../context/Configuration'

const renderInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: '#90E36D',
        paddingVertical: scale(20)
      }}
    />
  )
}

const renderActions = (props) => {
  return (
    <Actions
      {...props}
      containerStyle={{
        width: scale(34),
        alignItems: 'center',
        justifyContent: 'center'
      }}
      icon={() => (
        <Image
          source={require('../../assets/images/add.png')}
          style={styles().addImg}
          resizeMode='contain'
        />
      )}
      options={{
        'Choose From Library': () => {
          console.log('Choose From Library')
        },
        Cancel: () => {
          console.log('Cancel')
        }
      }}
      optionTintColor='#222B45'
    />
  )
}
const ChatScreen = ({ navigation, route }) => {
  const configuration = useContext(ConfigurationContext)

  const {
    messages,
    onSend,
    currentTheme,
    image,
    setImage,
    inputMessage,
    setInputMessage,
    profile,
    orderNo,
    total
  } = useChatScreen({ navigation, route })

  const filterImages = (src) => {
    setImage(image.filter((item) => item !== src))
  }
  const { t } = useTranslation()
  const renderAccessory = (props) => {
    return (
      <View style={styles().rowDisplay}>
        {image.map((item) => (
          <View key={item.uri} style={styles().accessoryContainer}>
            <Image source={{ uri: item }} style={styles().accessoryImg} />
            <Entypo
              onPress={() => filterImages(item)}
              name='circle-with-cross'
              size={18}
              style={styles().accessoryIcon}
              color='black'
            />
          </View>
        ))}
      </View>
    )
  }

  const renderSend = (props) => {
    return (
      <Send
        {...props}
        sendButtonProps={{
          ...props,
          onPress: () => inputMessage.trim().length > 0 && onSend()
        }}
      >
        <View
          style={{
            width: scale(34),
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('../../assets/images/send-icon.png')}
            resizeMode='contain'
            color={currentTheme.black}
            style={styles().sendIcon}
          />
        </View>
      </Send>
    )
  }

  const renderChatEmpty = (props) => {
    return (
      <View>
        <TextDefault></TextDefault>
       {/*  <TextDefault
          style={styles().emptyChat}
          textColor={currentTheme.fontSecondColor}
          center
          H3
        >
          {t('chatWithRider')}
        </TextDefault> */}
      </View>
    )
  }

  const renderBubble = (props) => {
    return (
      <View>
        {props.position === 'left' && (
          <TextDefault
            normal
            textColor={currentTheme.btnText}
            style={{ ...alignment.PLsmall }}
          >
            {props.currentMessage.user.name}
          </TextDefault>
        )}
        <Bubble
          {...props}
          renderUsername={null}
          wrapperStyle={{
            right: { backgroundColor: 'transparent' },
            left: { backgroundColor: 'transparent' }
          }}
          textStyle={{
            right: styles(currentTheme).textRight,
            left: styles(currentTheme).textLeft
          }}
        />
      </View>
    )
  }
  const renderTime = (props) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: '#000',
            fontSize: 11
          },
          right: {
            color: '#000',
            fontSize: 11
          }
        }}
      />
    )
  }

  const scrollToBottomComponent = () => {
    return (
      <FontAwesome
        name='angle-double-down'
        size={22}
        color={currentTheme.main}
      />
    )
  }

  return (
    <View style={styles(currentTheme).chatSec}>
      <View style={styles(currentTheme).orderDetails}>
        <View style={styles(currentTheme).orderNoSec}>
          <TextDefault textColor={currentTheme.fontFourthColor} normal bold>
            {t('OrderNo')}
          </TextDefault>
          <View style={styles(currentTheme).orderNo}>
            <TextDefault textColor={currentTheme.fontNewColor} small bold>
              {orderNo}
            </TextDefault>
          </View>
        </View>
        <TextDefault textColor={currentTheme.fontFourthColor} normal bold>
          {configuration.currencySymbol}
          {total}
        </TextDefault>
      </View>

      <GiftedChat
        messages={messages}
        user={{
          _id: profile?._id
        }}
        alwaysShowSend={true}
        renderBubble={renderBubble}
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderAvatar={null}
        renderChatEmpty={renderChatEmpty}
        inverted={Platform.OS !== 'web' || messages.length === 0}
        placeholder={t('replyRider')}
        textInputProps={{
          style: {
            width: '75%',
            paddingHorizontal: scale(16),
            paddingVertical: scale(12),
            backgroundColor: '#fff',
            fontSize: 12,
            borderRadius: 14
          },
          placeholderTextColor: '#6B7280',
          autoFocus: true
        }}
        renderTime={renderTime}
        renderActions={renderActions}
        renderInputToolbar={renderInputToolbar}
        renderAccessory={image.length > 0 ? renderAccessory : null}
        text={inputMessage}
        onInputTextChanged={(m) => setInputMessage(m)}
        messagesContainerStyle={{ paddingBottom: scale(40) }}
      />
      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={-200} />
    </View>
  )
}

export default ChatScreen
