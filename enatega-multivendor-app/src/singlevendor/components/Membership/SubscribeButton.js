import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from '../../screens/Membership/styles'

const SubscribeButton = ({ currentTheme, onPress, isDisable, title="Subscribe" }) => {
  const { t } = useTranslation()

  return (
    <View style={styles(currentTheme).bottomSection}>
      <TouchableOpacity
        style={styles(currentTheme, isDisable).subscribeButton}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={isDisable}
      >
        <TextDefault
          textColor={isDisable ? currentTheme.fontFifthColor : currentTheme.white}
          style={styles(currentTheme).subscribeButtonText}
          bold
        >
          {t(title)}
        </TextDefault>
      </TouchableOpacity>
    </View>
  )
}

export default SubscribeButton
