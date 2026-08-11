import React, { useContext } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

const FulfillmentTabs = ({ selectedMode, onSelectMode }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const handleModeSelect = (mode) => {
    console.log('🚚 Fulfillment Mode Selected:', mode === 'delivery' ? 'Delivery' : 'Click & Collect')
    onSelectMode(mode)
  }

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).tabsContainer}>
        <TouchableOpacity
          style={[
            styles(currentTheme).tab,
            selectedMode === 'delivery' && styles(currentTheme).tabSelected
          ]}
          onPress={() => handleModeSelect('delivery')}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor={selectedMode === 'delivery' ? currentTheme.primaryBlue : currentTheme.fontSecondColor}
            bold
            bolder={selectedMode === 'delivery'}
            isRTL
          >
            {t('Delivery') || 'Delivery'}
          </TextDefault>
          {selectedMode === 'delivery' && <View style={styles(currentTheme).activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles(currentTheme).tab,
            selectedMode === 'collection' && styles(currentTheme).tabSelected
          ]}
          onPress={() => handleModeSelect('collection')}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor={selectedMode === 'collection' ? currentTheme.primaryBlue : currentTheme.fontSecondColor}
            bold
            bolder={selectedMode === 'collection'}
            isRTL
          >
            {t('Click & Collect') || 'Click & Collect'}
          </TextDefault>
          {selectedMode === 'collection' && <View style={styles(currentTheme).activeIndicator} />}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = (props = null) => {
  const subtleBorder = props?.themeBackground === '#000'
    ? 'rgba(255, 255, 255, 0.13)'
    : 'rgba(15, 23, 42, 0.10)'

  return StyleSheet.create({
    container: {
      paddingHorizontal: scale(12),
      paddingTop: scale(12),
      paddingBottom: scale(12)
    },
    tabsContainer: {
      flexDirection: 'row',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: subtleBorder
    },
    tab: {
      flex: 1,
      paddingVertical: scale(12),
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    tabSelected: {
      backgroundColor: 'transparent'
    },
    activeIndicator: {
      position: 'absolute',
      bottom: -StyleSheet.hairlineWidth,
      width: scale(44),
      height: scale(3),
      borderRadius: scale(2),
      backgroundColor: props !== null ? props.primaryBlue : '#0EA5E9'
    }
  })
}

export default FulfillmentTabs
