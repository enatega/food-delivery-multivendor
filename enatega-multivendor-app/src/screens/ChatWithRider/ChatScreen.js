import React, { useContext } from 'react'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { useChatScreen } from './useChatScreen'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import CustomChat from '../../components/CustomChat/CustomChat'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import { scale } from '../../utils/scaling'
import ConfigurationContext from '../../context/Configuration'

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

  const { t } = useTranslation()

  const renderChatEmpty = props => {
    return (
      <View>
        <TextDefault
          style={styles().emptyChat}
          textColor={currentTheme.fontSecondColor}
          center
          H3>
          {t('chatWithRider')}
        </TextDefault>
      </View>
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

      <CustomChat
        messages={messages}
        user={{
          _id: profile._id
        }}
        onSend={onSend}
        renderChatEmpty={renderChatEmpty}
        placeholder={t('replyRider')}
        textInputProps={{
          autoFocus: false
        }}
        text={inputMessage}
        onInputTextChanged={m => setInputMessage(m)}
        currentTheme={currentTheme}
      />
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0} />
    </View>
  )
}

export default ChatScreen
