import { StyleSheet, View } from 'react-native'
import React from 'react'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useCheckoutPalette from '../Checkout/useCheckoutPalette'
import { InfoSectionHeader, infoSectionStyle } from './ProductOtherDetails'

const NutritionFacts = ({ t, title, productOtherDetails }) => {
  const { palette } = useCheckoutPalette()
  const s = styles(palette)
  const rows = (productOtherDetails || []).filter((item) => item?.name || item?.quantity)
  if (!rows.length) return null

  return (
    <View style={s.section}>
      <InfoSectionHeader icon='chart-donut' title={t(title)} palette={palette} />

      {/* Label/value table: muted label on the left, bold value on the right. */}
      <View style={s.table}>
        {rows.map((item, index) => (
          <View key={`${item?.name ?? 'nutrition'}-${index}`} style={[s.row, index % 2 === 1 && s.rowAlt]}>
            <TextDefault textColor={palette.textSecondary} isRTL style={s.label} numberOfLines={2}>
              {item.name}
            </TextDefault>
            <TextDefault bolder textColor={palette.textPrimary} isRTL>
              {item.quantity}
            </TextDefault>
          </View>
        ))}
      </View>
    </View>
  )
}

export default NutritionFacts

const styles = (palette) =>
  StyleSheet.create({
    section: infoSectionStyle(palette),
    table: {
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      minHeight: 36,
      paddingHorizontal: 12,
      paddingVertical: 7
    },
    rowAlt: {
      backgroundColor: palette.surfaceMuted
    },
    label: {
      flex: 1
    }
  })
