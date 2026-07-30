import React, { useContext } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

const OrderSummaryError = ({ onRetry }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).card}>
        <View style={styles().iconWrapper}>
          <Feather name="alert-circle" size={28} color={currentTheme.warning || '#F59E0B'} />
        </View>

        <TextDefault
          textColor={currentTheme.fontMainColor}
          H5
          bolder
          isRTL
          style={styles().title}
        >
          {t('Unable to load order summary') || 'Unable to load order summary'}
        </TextDefault>

        <TextDefault
          textColor={currentTheme.fontSecondColor}
          small
          isRTL
          style={styles().description}
        >
          {t('Something went wrong while calculating your order. Please try again.') ||
            'Something went wrong while calculating your order. Please try again.'}
        </TextDefault>

        <TouchableOpacity
          style={styles(currentTheme).retryButton}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Feather name="refresh-ccw" size={16} color={currentTheme.white} />
          <TextDefault
            textColor={currentTheme.white}
            bolder
            style={styles().retryText}
          >
            {t('Try again') || 'Try again'}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingBottom: scale(8)
    },
    card: {
      backgroundColor: props?.colorBgTertiary || '#fff',
      borderRadius: scale(12),
      padding: scale(16),
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3
    },
    iconWrapper: {
      alignItems: 'center',
      marginBottom: scale(12)
    },
    title: {
      textAlign: 'center',
      marginBottom: scale(6)
    },
    description: {
      textAlign: 'center',
      marginBottom: scale(16)
    },
    retryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props?.primary || '#2563EB',
      paddingVertical: scale(10),
      borderRadius: scale(8)
    },
    retryText: {
      marginLeft: scale(8)
    }
  })

export default OrderSummaryError
