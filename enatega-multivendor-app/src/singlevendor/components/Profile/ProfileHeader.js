import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale, verticalScale } from '../../../utils/scaling'

const ProfileHeader = ({ userName }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault
        H1
        bolder
        textColor={currentTheme.fontMainColor}
        style={styles(currentTheme).welcomeText}
      >
        {t('Welcome back,')}
      </TextDefault>
      <TextDefault
        H1
        bolder
        textColor={currentTheme.fontMainColor}
        style={styles(currentTheme).nameText}
      >
        {userName}
      </TextDefault>
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(20),
      paddingBottom: verticalScale(24),
      backgroundColor: '#CCE9F5'
    },
    welcomeText: {
      fontSize: scale(14),
      marginBottom: verticalScale(4)
    },
    nameText: {
      fontSize: scale(24)
    }
  })

export default ProfileHeader
