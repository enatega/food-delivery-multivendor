import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useCheckoutPalette from './useCheckoutPalette'

const OrderSummaryError = ({ onRetry }) => {
  const { t } = useTranslation()
  const { palette } = useCheckoutPalette()

  return (
    <View style={styles(palette).container}>
      <View style={styles(palette).card}>
        <View style={styles().iconWrapper}>
          <Feather name="alert-circle" size={22} color={palette.warning} />
        </View>

        <TextDefault
          textColor={palette.textPrimary}
          H5
          bolder
          isRTL
          style={styles().title}
        >
          {t('Unable to load order summary') || 'Unable to load order summary'}
        </TextDefault>

        <TextDefault
          textColor={palette.textSecondary}
          small
          isRTL
          style={styles().description}
        >
          {t('Something went wrong while calculating your order. Please try again.') ||
            'Something went wrong while calculating your order. Please try again.'}
        </TextDefault>

        <TouchableOpacity
          style={styles(palette).retryButton}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Feather name="refresh-ccw" size={16} color={palette.onBrand} />
          <TextDefault
            textColor={palette.onBrand}
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

const styles = (palette) =>
  StyleSheet.create({
    container: {
      paddingBottom: scale(4)
    },
    card: {
      backgroundColor: palette.surfaceMuted,
      borderRadius: scale(14),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border,
      padding: scale(14)
    },
    iconWrapper: {
      alignSelf: 'center',
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      backgroundColor: palette.warningSubtle,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scale(10)
    },
    title: {
      textAlign: 'center',
      marginBottom: scale(4)
    },
    description: {
      textAlign: 'center',
      marginBottom: scale(14)
    },
    retryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.brand,
      minHeight: scale(42),
      borderRadius: scale(12)
    },
    retryText: {
      marginLeft: scale(8)
    }
  })

export default OrderSummaryError
