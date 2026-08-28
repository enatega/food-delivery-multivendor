import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'

const SmallOrderFeeTip = ({
  currencySymbol,
  minimumOrderAmount,
  onClose,
  currentTheme,
  t
}) => {
  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).iconContainer}>
        <Feather name='info' size={14} color={currentTheme.singleVendorBrandForeground} />
      </View>
      <View style={styles(currentTheme).content}>
        <TextDefault textColor={currentTheme.fontMainColor} H6 bolder>
          {t('smallOrderFeeTitle') || 'Small order fee applies'}
        </TextDefault>
        <TextDefault textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor} H6>
          {t('Orders under') || 'Orders under'} {minimumOrderAmount || 10}{currencySymbol} {t('are subject to a') || 'are subject to a'}{' '}
          {t('small order fee') || 'small order fee'}.
        </TextDefault>
      </View>
      <TouchableOpacity
        onPress={onClose}
        style={styles(currentTheme).closeButton}
        activeOpacity={0.7}
      >
        <Feather name='x' size={16} color={currentTheme.fontSecondColor} />
      </TouchableOpacity>
    </View>
  )
}

const styles = (props) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props?.cardBackground || '#fff',
      borderRadius: scale(9),
      paddingVertical: scale(8),
      paddingHorizontal: scale(10),
      marginTop: scale(7),
      marginBottom: scale(2)
    },
    iconContainer: {
      width: scale(24),
      height: scale(24),
      borderRadius: scale(12),
      backgroundColor: props?.colorBgTertiary || '#F3F4F6',
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
