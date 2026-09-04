import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import RiderChatIcon from '../../../assets/SVG/rider-chat'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'

export const ChatButton = ({ onCall, onMessage, riderName, theme, hasUnread }) => {
  const { t } = useTranslation()

  return (
    <View style={styles.riderCard(theme)}>
      <View style={styles.riderIdentity(theme)}>
        <RiderChatIcon />
        <View style={styles.riderCopy}>
          <TextDefault H5 bolder numberOfLines={1} textColor={theme.colors.textPrimary} isRTL>
            {riderName || t('yourRider', { defaultValue: 'Your rider' })}
          </TextDefault>
          <TextDefault small textColor={theme.colors.textSecondary} isRTL>
            {t('riderAssigned', { defaultValue: 'Rider assigned' })}
          </TextDefault>
        </View>
      </View>
      <View style={styles.riderActions(theme)}>
        {!!onCall && (
          <TouchableOpacity accessibilityLabel={t('callRider', { defaultValue: 'Call rider' })} accessibilityRole='button' activeOpacity={0.7} onPress={onCall} style={styles.riderAction(theme)}>
            <Ionicons name='call-outline' color={theme.colors.accent} size={scale(19)} />
          </TouchableOpacity>
        )}
        <TouchableOpacity accessibilityLabel={t('chatWithRider')} accessibilityRole='button' activeOpacity={0.7} onPress={onMessage} style={styles.riderAction(theme)}>
          <Ionicons name='chatbubble-outline' color={theme.colors.accent} size={scale(19)} />
          {hasUnread && <View style={styles.unreadDot(theme)} />}
        </TouchableOpacity>
      </View>
    </View>
  )
}
