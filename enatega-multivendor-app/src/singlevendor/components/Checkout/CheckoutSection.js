import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useCheckoutPalette from './useCheckoutPalette'

// Card shell shared by every checkout section: icon badge, title, optional
// subtitle, then the section body.
const CheckoutSection = ({ icon, title, subtitle, children, style, bodyStyle }) => {
  const { palette } = useCheckoutPalette()
  const s = styles(palette)

  return (
    <View style={[s.card, style]}>
      {title
        ? (
        <View style={s.header}>
          {icon
            ? (
            <View style={s.iconBadge}>
              <MaterialCommunityIcons name={icon} size={scale(16)} color={palette.brandText} />
            </View>
              )
            : null}
          <View style={s.headerText}>
            <TextDefault textColor={palette.textPrimary} bolder H5 isRTL>
              {title}
            </TextDefault>
            {subtitle
              ? (
              <TextDefault textColor={palette.textMuted} small isRTL style={s.subtitle}>
                {subtitle}
              </TextDefault>
                )
              : null}
          </View>
        </View>
          )
        : null}
      <View style={bodyStyle}>{children}</View>
    </View>
  )
}

export const checkoutCardShadow = (palette) => ({
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: palette.shadowOpacity,
  shadowRadius: 10,
  elevation: palette.shadowOpacity ? 1 : 0
})

const styles = (palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: palette.surface,
      borderRadius: scale(16),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border,
      paddingHorizontal: scale(10),
      paddingVertical: scale(12),
      marginBottom: scale(10),
      ...checkoutCardShadow(palette)
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scale(8)
    },
    iconBadge: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(8),
      backgroundColor: palette.brandSubtle,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(10)
    },
    headerText: {
      flex: 1
    },
    subtitle: {
      marginTop: scale(1)
    }
  })

export default CheckoutSection
