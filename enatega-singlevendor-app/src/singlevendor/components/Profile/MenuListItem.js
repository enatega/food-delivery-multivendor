import React, { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale, verticalScale } from '../../../utils/scaling'

const MenuListItem = ({ icon, title, onPress, rightElement }) => {
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
          size={scale(22)}
          color={currentTheme.colorTextMuted || currentTheme.iconColor}
        />
        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={styles(currentTheme).title}
        >
          {title}
        </TextDefault>
      </View>
      {rightElement || (
        <Ionicons
          name={currentTheme.isRTL ? 'chevron-back' : 'chevron-forward'}
          size={scale(20)}
          color={currentTheme.colorTextMuted || currentTheme.iconColor}
        />
      )}
    </TouchableOpacity>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: verticalScale(54),
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(16),
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF'
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    title: {
      marginLeft: scale(14),
      fontSize: scale(14)
    }
  })

export default MenuListItem
