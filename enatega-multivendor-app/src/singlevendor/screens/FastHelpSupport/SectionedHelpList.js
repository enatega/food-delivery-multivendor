import React, { useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { FlashList } from '@shopify/flash-list'
import { Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import SectionHeader from '../../components/Profile/SectionHeader'
import { scale } from '../../../utils/scaling'

const SectionedHelpList = ({ data, currentTheme, sectionHeaderContainerStyle, sectionHeaderTextStyle, listItemStyle, itemTitleStyle, separatorStyle, listContentStyle, estimatedItemSize = 50 }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const themeValue = currentTheme || {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const renderItem = ({ item, index }) => {
    if (item.type === 'section') {
      return (
        <SectionHeader
          title={item.title}
          containerStyle={sectionHeaderContainerStyle}
          textStyle={sectionHeaderTextStyle}
        />
      )
    }

    // Check if there's a previous item and if it's not a section header
    const showSeparator = index > 0 && data[index - 1]?.type !== 'section'

    return (
      <View>
        {showSeparator && <View style={separatorStyle} />}
        <TouchableOpacity
          style={listItemStyle}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor={themeValue.fontMainColor}
            style={itemTitleStyle}
            bold
          >
            {item.title}
          </TextDefault>
          <Ionicons
            name={themeValue.isRTL ? 'chevron-back' : 'chevron-forward'}
            size={scale(20)}
            color={themeValue.iconColor}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const keyExtractor = (item) => item.id

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={estimatedItemSize}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={listContentStyle}
    />
  )
}

export default SectionedHelpList
