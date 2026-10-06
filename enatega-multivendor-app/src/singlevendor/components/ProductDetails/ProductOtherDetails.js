import { StyleSheet, View } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useCheckoutPalette from '../Checkout/useCheckoutPalette'

// Header shared by every info block: icon badge + title, so each block reads as its own section.
export const InfoSectionHeader = ({ icon, title, palette }) => (
  <View style={headerStyles.row}>
    <View style={[headerStyles.badge, { backgroundColor: palette.brandSubtle }]}>
      <MaterialCommunityIcons name={icon} size={16} color={palette.brandText} />
    </View>
    <TextDefault bolder H5 textColor={palette.textPrimary} isRTL>
      {title}
    </TextDefault>
  </View>
)

// Ingredient lists ("flour, tomato, basil") read better as chips than as a paragraph.
const toList = (value) => {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean)
  const parts = String(value ?? '').split(/[,\n;•]+/).map((v) => v.trim()).filter(Boolean)
  return parts.length > 1 ? parts : null
}

const ProductOtherDetails = ({ t, productOtherDetails, title, icon = 'text-box-outline', variant = 'text' }) => {
  const { palette } = useCheckoutPalette()
  const s = styles(palette)
  const chips = variant === 'chips' ? toList(productOtherDetails) : null
  const text = Array.isArray(productOtherDetails) ? productOtherDetails.join(', ') : productOtherDetails

  return (
    <View style={s.section}>
      <InfoSectionHeader icon={icon} title={t(title)} palette={palette} />

      {chips
        ? (
        <View style={s.chips}>
          {chips.map((item, index) => (
            <View key={`${item}-${index}`} style={s.chip}>
              <TextDefault small textColor={palette.textPrimary} isRTL>
                {item}
              </TextDefault>
            </View>
          ))}
        </View>
          )
        : (
        <TextDefault textColor={palette.textSecondary} isRTL style={s.body}>
          {text}
        </TextDefault>
          )}
    </View>
  )
}

const headerStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export const infoSectionStyle = (palette) => ({
  marginHorizontal: 15,
  paddingHorizontal: 12,
  paddingVertical: 12,
  borderRadius: 14,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: palette.border,
  backgroundColor: palette.surface
})

const styles = (palette) =>
  StyleSheet.create({
    section: infoSectionStyle(palette),
    body: {
      // Regular weight + secondary colour so body copy is clearly distinct from the bold title.
      fontSize: 14,
      lineHeight: 20
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6
    },
    chip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: palette.surfaceMuted,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border
    }
  })

export default ProductOtherDetails
