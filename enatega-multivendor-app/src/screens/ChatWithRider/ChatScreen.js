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
import Spinner from '../../components/Spinner/Spinner'

const renderInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: '#0EA5E9',
        paddingHorizontal: scale(4),
        paddingBottom: scale(4),
        marginHorizontal: scale(6),
        borderRadius: scale(12)
      }}
    />
  )
}

// Todo: Can add actions later
// const renderActions = (props) => {
//   return (
//     <Actions
//       {...props}
//       containerStyle={{
//         width: scale(34),
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}
//       icon={() => (
//         <Image
//           source={require('../../assets/images/add.png')}
//           style={styles().addImg}
//           resizeMode='contain'
//         />
//       )}
//       options={{
//         'Choose From Library': () => {
//           console.log('Choose From Library')
//         },
//         Cancel: () => {
//           console.log('Cancel')
//         }
//       }}
//       optionTintColor='#222B45'
//     />
//   )
// }
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
    total,
    loading
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
          hitSlop={15}
          style={{
            width: scale(30),
            paddingBottom: scale(4)
          }}
        >
          <Ionicons name="paper-plane" size={scale(25)} color={currentTheme?.white} />
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
            right: { backgroundColor: currentTheme?.lowOpacityBlue },
            // left: { backgroundColor: '#000' }
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
        loadEarlier={loading}
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
            width: '85%',
            paddingHorizontal: scale(16),
            paddingVertical: scale(12),
            backgroundColor: '#fff',
            fontSize: 12,
            borderRadius: scale(12)
          },
          placeholderTextColor: '#6B7280',
          autoFocus: true
        }}
        renderTime={renderTime}
        // Todo: Can add actions later
        // renderActions={renderActions}
        renderInputToolbar={renderInputToolbar}
        renderAccessory={image.length > 0 ? renderAccessory : null}
        text={inputMessage}
        onInputTextChanged={(m) => setInputMessage(m)}
        messagesContainerStyle={{ paddingBottom: scale(40) }}
      />
      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={ Platform.OS === 'android' ? -300 : -200} />
    </View>
  )
}

export default ChatScreen
