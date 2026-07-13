import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale, verticalScale } from '../../../utils/scaling'
import { formatDateTime } from '../../../utils/formatDateTime'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { Ionicons } from '@expo/vector-icons'

const MessageBubble = ({ item, status }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const isMe = item?.senderType === 'user'

  return (
    <View style={[styles(currentTheme).messageContainer, { alignItems: isMe ? 'flex-end' : 'flex-start' }]}>
      <View style={[styles(currentTheme).messageBubble, {backgroundColor: isMe ? currentTheme?.lowOpacityBlue : currentTheme?.colorBgTertiary ?? '#F4F4F5', alignSelf: isMe ? 'flex-end' : 'flex-start'}]}>
        <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).messageText} bold>
          {item?.content}
        </TextDefault>
        {isMe && (status === 'open' ? <Ionicons name='checkmark-sharp' size={18} color={item?.isRead ? currentTheme?.primaryBlue : currentTheme?.iconColor} /> : <Ionicons name='checkmark-done-sharp' size={18} color={item?.isRead ? currentTheme?.primaryBlue : currentTheme?.iconColor} />)}
      </View>
      <TextDefault textColor={currentTheme.fontSecondColor} style={[styles(currentTheme).timestamp, { alignItems: isMe ? 'flex-end' : 'flex-start' }]} small bold>
        {formatDateTime(item?.createdAt, 'noyear')}
      </TextDefault>
    </View>
  )
}

export default MessageBubble

const styles = (currentTheme) =>
  StyleSheet.create({
    messageContainer: {
      marginBottom: verticalScale(24)
    },
    messageBubble: {
      display: 'flex',
      flexDirection: 'row',
      gap: scale(4),
      borderRadius: scale(16),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      marginBottom: verticalScale(4)
    },
    messageText: {
      fontSize: scale(15),
      lineHeight: scale(20)
    },
    timestamp: {
      color: currentTheme?.colorTextMuted ?? '#71717A',
      fontSize: scale(12),
      //   marginLeft: scale(4),
      opacity: 0.6
    }
  })
