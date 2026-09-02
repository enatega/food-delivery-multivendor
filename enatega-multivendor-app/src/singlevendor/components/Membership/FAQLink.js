import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from '../../screens/Membership/styles'

const FAQLink = ({ currentTheme, onPress }) => {
  const { t } = useTranslation()

  return (
    <View style={styles(currentTheme).faqContainer}>
      <TextDefault
        textColor={currentTheme.colorTextMuted}
        style={styles(currentTheme).faqText}
        bold
      >
        {t('More questions? See our')}{' '}
      </TextDefault>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <TextDefault
          textColor={currentTheme.colorTextPrimary}
          style={styles(currentTheme).faqLink}
          bold
        >
          {t('FAQ')}
        </TextDefault>
      </TouchableOpacity>
    </View>
  )
}

export default FAQLink
