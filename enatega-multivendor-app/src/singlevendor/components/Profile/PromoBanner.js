import React, { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
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
      <ImageBackground
        source={require('../../assets/images/promo-banner.png')}
        style={styles(currentTheme).banner}
        imageStyle={styles(currentTheme).bannerImage}
        resizeMode="cover"
      >
        <View style={styles(currentTheme).textContainer}>
          <TextDefault
            H3
            bolder
            textColor="#000000"
            style={styles(currentTheme).title}
          >
            {t('Unlimited Deliveries for €1')}
          </TextDefault>
          <TextDefault
            textColor="#000000"
            H3
            bolder
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
            textColor="#ffffff"
            style={styles(currentTheme).buttonText}
          >
            {t('Join now')}
          </TextDefault>
        </TouchableOpacity>
      </ImageBackground>
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
      borderRadius: scale(12),
      padding: scale(20),
      overflow: 'hidden',
      height: verticalScale(160),
      justifyContent: 'space-between'
    },
    bannerImage: {
      borderRadius: scale(12)
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center'
    },
    title: {
      fontSize: scale(20),
      marginBottom: verticalScale(6),
      lineHeight: scale(26)
    },
    subtitle: {
      fontSize: scale(15),
      lineHeight: scale(20),
      opacity: 0.95
    },
    button: {
      backgroundColor: currentTheme.singlevendorcolor,
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(24),
      borderRadius: scale(12),
      alignSelf: 'flex-start',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    buttonText: {
      fontSize: scale(15),
      letterSpacing: 0.3
    }
  })

export default PromoBanner
