import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from '../../screens/Membership/styles'

const SubscribeButton = ({ currentTheme, onPress }) => {
  const { t } = useTranslation()

  return (
    <View style={styles(currentTheme).bottomSection}>
      <TouchableOpacity
        style={styles(currentTheme).subscribeButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <TextDefault
          textColor={currentTheme.white}
          style={styles(currentTheme).subscribeButtonText}
          bold
        >
          {t('Subscribe')}
        </TextDefault>
      </TouchableOpacity>
    </View>
  )
}

export default SubscribeButton
