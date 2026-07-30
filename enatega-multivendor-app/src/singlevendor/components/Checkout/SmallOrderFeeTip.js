import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
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
      <View style={styles(currentTheme).accent} />
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
        <AntDesign name="close" size={14} color={currentTheme.fontMainColor} />
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
      borderRadius: scale(10),
      borderWidth: 1,
      borderColor: props?.newBorderColor2 || '#E4E4E7',
      paddingVertical: scale(10),
      paddingHorizontal: scale(12),
      marginTop: scale(10),
      marginBottom: scale(4),
      shadowColor: props?.shadowColor || '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3
    },
    accent: {
      width: scale(6),
      height: '100%',
      borderRadius: scale(4),
      backgroundColor: props?.primaryBlue || '#0EA5E9',
      marginRight: scale(10)
    },
    content: {
      flex: 1,
      gap: scale(4)
    },
    closeButton: {
      width: scale(26),
      height: scale(26),
      borderRadius: scale(13),
      backgroundColor: props?.colorBgTertiary || '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: scale(8)
    }
  })

export default SmallOrderFeeTip
