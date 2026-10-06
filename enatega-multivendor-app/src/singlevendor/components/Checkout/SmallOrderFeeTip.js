import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'
import useCheckoutPalette from './useCheckoutPalette'

const SmallOrderFeeTip = ({
  currencySymbol,
  minimumOrderAmount,
  onClose,
  currentTheme,
  t
}) => {
  const { palette } = useCheckoutPalette()
  return (
    <View style={styles(palette).container}>
      <View style={styles(palette).iconContainer}>
        <Feather name='info' size={14} color={palette.warning} />
      </View>
      <View style={styles(palette).content}>
        <TextDefault textColor={palette.textPrimary} small bolder>
          {t('smallOrderFeeTitle') || 'Small order fee applies'}
        </TextDefault>
        <TextDefault textColor={palette.textSecondary} small>
          {t('Orders under') || 'Orders under'} {minimumOrderAmount || 10}{currencySymbol} {t('are subject to a') || 'are subject to a'}{' '}
          {t('small order fee') || 'small order fee'}.
        </TextDefault>
      </View>
      <TouchableOpacity
        onPress={onClose}
        style={styles(palette).closeButton}
        activeOpacity={0.7}
      >
        <Feather name='x' size={16} color={palette.textMuted} />
      </TouchableOpacity>
    </View>
  )
}

const styles = (palette) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.warningSubtle,
      borderRadius: scale(12),
      paddingVertical: scale(8),
      paddingHorizontal: scale(10),
      marginTop: scale(8)
    },
    iconContainer: {
      width: scale(26),
      height: scale(26),
      borderRadius: scale(13),
      backgroundColor: palette.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(10)
    },
    content: {
      flex: 1,
      gap: scale(1)
    },
    closeButton: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(14),
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: scale(8)
    }
  })

export default SmallOrderFeeTip
