import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useCheckoutPalette from './useCheckoutPalette'

const FulfillmentTabs = ({ selectedMode, onSelectMode }) => {
  const { t } = useTranslation()
  const { palette } = useCheckoutPalette()
  const s = styles(palette)

  const handleModeSelect = (mode) => {
    console.log('🚚 Fulfillment Mode Selected:', mode === 'delivery' ? 'Delivery' : 'Click & Collect')
    onSelectMode(mode)
  }

  const tabs = [
    { id: 'delivery', icon: 'moped-outline', label: t('Delivery') || 'Delivery' },
    { id: 'collection', icon: 'shopping-outline', label: t('Click & Collect') || 'Click & Collect' }
  ]

  return (
    <View style={s.track}>
      {tabs.map((tab) => {
        const isSelected = selectedMode === tab.id
        return (
          <TouchableOpacity
            key={tab.id}
            style={[s.segment, isSelected && s.segmentSelected]}
            onPress={() => handleModeSelect(tab.id)}
            activeOpacity={0.8}
            accessibilityRole='tab'
            accessibilityState={{ selected: isSelected }}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={scale(18)}
              color={isSelected ? palette.brandText : palette.textMuted}
              style={s.segmentIcon}
            />
            <TextDefault textColor={isSelected ? palette.textPrimary : palette.textMuted} bold bolder={isSelected} isRTL>
              {tab.label}
            </TextDefault>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = (palette) =>
  StyleSheet.create({
    track: {
      flexDirection: 'row',
      backgroundColor: palette.track,
      borderRadius: scale(14),
      padding: scale(3),
      marginBottom: scale(10)
    },
    segment: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: scale(38),
      borderRadius: scale(11),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'transparent'
    },
    segmentSelected: {
      backgroundColor: palette.surface,
      borderColor: palette.border,
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: palette.shadowOpacity * 1.5,
      shadowRadius: 4,
      elevation: palette.shadowOpacity ? 2 : 0
    },
    segmentIcon: {
      marginRight: scale(6)
    }
  })

export default FulfillmentTabs
