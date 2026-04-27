import React, { useContext } from 'react'
import { View, TouchableOpacity, Platform, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import styles from './styles'

const CategoryPageHeader = ({
  navigation,
  restaurantName,
  deliveryTime,
  onOpenSearch
}) => {
  const themeContext = useContext(ThemeContext)
  const { i18n } = useTranslation()

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <SafeAreaView style={styles(currentTheme).container} edges={['top']}>
      <View style={styles(currentTheme).headerContainer}>
        {/* Left Section - Back Button */}
        <View style={styles(currentTheme).leftSection}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name='arrow-back'
              color={currentTheme.fontMainColor}
              size={scale(17)}
            />
          </TouchableOpacity>
        </View>

        {/* Middle Section - Restaurant Info */}
        <View style={styles(currentTheme).restaurantInfoContainer}>
          <TextDefault
            H6
            bolder
            textColor={currentTheme.fontMainColor}
            numberOfLines={1} // Ensures text truncation
            ellipsizeMode='tail' // Adds "..." if text is too long
          >
            {restaurantName}
          </TextDefault>
          <TextDefault textColor={currentTheme.plusIcon}>
            Delivery in {deliveryTime} mins
          </TextDefault>
        </View>

        {/* Right Section - Search Icon */}
        <View style={styles(currentTheme).rightSection}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).iconButton}
            onPress={onOpenSearch}
          >
            <Ionicons
              name='search'
              size={scale(17)}
              color={currentTheme.fontMainColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CategoryPageHeader
