import React from 'react'
import { View, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from '../../screens/Membership/styles'

const MembershipLogo = ({ currentTheme }) => {
  const { t } = useTranslation()

  return (
    <View style={styles(currentTheme).logoContainer}>
      <Image
        source={require('../../assets/images/my-fast-logo.png')}
        style={styles(currentTheme).logo}
        resizeMode="contain"
      />
      <TextDefault
        textColor={currentTheme.colorTextMuted}
        style={styles(currentTheme).subtitle}
        bold
      >
        {t('Unlimited €1 Deliveries')}
      </TextDefault>
    </View>
  )
}

export default MembershipLogo
