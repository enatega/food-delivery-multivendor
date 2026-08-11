import React from 'react'
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const UpdateButton = ({ onPress, disabled, loading, currentTheme }) => {
  const { t } = useTranslation()

  return (
    <TouchableOpacity
      style={[
        styles(currentTheme).button,
        disabled && styles(currentTheme).buttonDisabled
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <TextDefault
          textColor={disabled ? currentTheme.gray300 || '#6B7280' : '#FFFFFF'}
          style={styles(currentTheme).buttonText}
          bold
        >
          {t('update')}
        </TextDefault>
      )}
    </TouchableOpacity>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    button: {
      backgroundColor: props?.singlevendorcolor || '#0090CD',
      borderRadius: scale(8),
      paddingVertical: verticalScale(14),
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonDisabled: {
      backgroundColor: props?.gray200 || '#E5E5E5'
    },
    buttonText: {
      fontSize: scale(16)
    }
  })

export default UpdateButton
