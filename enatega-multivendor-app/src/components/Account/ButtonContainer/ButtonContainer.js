import React from 'react'
import { Pressable, View } from 'react-native'
import styles from './styles.js'
import TextDefault from '../../Text/TextDefault/TextDefault.js'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useMultivendorTheme } from '../../../ui/designSystem'

const ButtonContainer = (props) => {
  const { t, i18n } = useTranslation()
  const { tokens } = useMultivendorTheme()
  const themedStyles = styles(tokens, i18n.dir() === 'rtl')
  const isDisabled = props?.onPress === 'null'
  const isVerifyDisabled = props?.status === 'null'
  const statusColor = props?.status === 'verified'
    ? tokens.colors.info
    : tokens.colors.danger
  const hasDetail = Boolean(props?.detail)

  return (
    <>
      <Pressable
          accessibilityRole={isDisabled ? undefined : 'button'}
          activeOpacity={isDisabled ? 1 : 0.7}
          style={({ pressed }) => [
            themedStyles.row,
            pressed && !isDisabled && themedStyles.pressed
          ]}
          onPress={isDisabled ? null : props?.onPress}
        >
          <View style={themedStyles.content}>
            <TextDefault
              textColor={hasDetail ? tokens.colors.textMuted : tokens.colors.textPrimary}
              style={hasDetail ? themedStyles.label : themedStyles.standaloneTitle}
            >
              {props?.title}
            </TextDefault>
            {hasDetail && (
              <TextDefault
                numberOfLines={1}
                textColor={tokens.colors.textPrimary}
                style={themedStyles.detail}
              >
                {props?.detail}
              </TextDefault>
            )}
            {!isVerifyDisabled && (
              <View style={themedStyles.verifyView}>
                <Ionicons
                  name={props?.status === 'verified' ? 'checkmark-circle-outline' : 'alert-circle-outline'}
                  size={14}
                  color={statusColor}
                />
                <TextDefault textColor={statusColor} style={themedStyles.status}>
                  {t(props?.status)}
                </TextDefault>
              </View>
            )}
          </View>
          {!isDisabled && (
            <Ionicons
              name={i18n.dir() === 'rtl' ? 'chevron-back' : 'chevron-forward'}
              size={18}
              color={tokens.colors.textMuted}
            />
          )}
        </Pressable>
    </>
  )
}

export default ButtonContainer
