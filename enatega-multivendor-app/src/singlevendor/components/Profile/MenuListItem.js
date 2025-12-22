import React, { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale, verticalScale } from '../../../utils/scaling'

const MenuListItem = ({ icon, iconType = 'Ionicons', title, onPress }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <TouchableOpacity
      style={styles(currentTheme).container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles(currentTheme).leftContent}>
        <Ionicons
          name={icon}
          size={scale(24)}
          color={currentTheme.iconColor}
        />
        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={styles(currentTheme).title}
        >
          {title}
        </TextDefault>
      </View>
      <Ionicons
        name={currentTheme.isRTL ? 'chevron-back' : 'chevron-forward'}
        size={scale(20)}
        color={currentTheme.iconColor}
      />
    </TouchableOpacity>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: verticalScale(16),
      paddingHorizontal: scale(16),
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF'
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    title: {
      marginLeft: scale(16),
      fontSize: scale(15)
    }
  })

export default MenuListItem
