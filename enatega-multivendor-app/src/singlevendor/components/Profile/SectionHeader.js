import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale, verticalScale } from '../../../utils/scaling'

const SectionHeader = ({ title }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault
        H4
        bolder
        textColor={currentTheme.fontMainColor}
        style={styles(currentTheme).title}
      >
        {title}
      </TextDefault>
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(8),
      paddingBottom: verticalScale(12),
      backgroundColor: currentTheme?.themeBackground
    },
    title: {
      fontSize: scale(16)
    }
  })

export default SectionHeader
