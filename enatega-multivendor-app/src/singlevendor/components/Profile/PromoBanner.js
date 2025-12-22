import React, { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale, verticalScale } from '../../../utils/scaling'

const PromoBanner = () => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).banner}>
        <View style={styles(currentTheme).textContainer}>
          <TextDefault
            H3
            bold
            textColor="#FFFFFF"
            style={styles(currentTheme).title}
          >
            {t('Unlimited Deliveries for €1')}
          </TextDefault>
          <TextDefault
            textColor="#FFFFFF"
            style={styles(currentTheme).subtitle}
          >
            {t('— Save €3.99 Each!')}
          </TextDefault>
        </View>
        <TouchableOpacity
          style={styles(currentTheme).button}
          activeOpacity={0.8}
        >
          <TextDefault
            bold
            textColor="#0EA5E9"
            style={styles(currentTheme).buttonText}
          >
            {t('Join now')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scale(16),
      marginBottom: verticalScale(24)
    },
    banner: {
      backgroundColor: '#0EA5E9',
      borderRadius: scale(12),
      padding: scale(16),
      overflow: 'hidden'
    },
    textContainer: {
      marginBottom: verticalScale(12)
    },
    title: {
      fontSize: scale(16),
      marginBottom: verticalScale(4)
    },
    subtitle: {
      fontSize: scale(14)
    },
    button: {
      backgroundColor: '#FFFFFF',
      paddingVertical: verticalScale(10),
      paddingHorizontal: scale(20),
      borderRadius: scale(8),
      alignSelf: 'flex-start'
    },
    buttonText: {
      fontSize: scale(14)
    }
  })

export default PromoBanner
