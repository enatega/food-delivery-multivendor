import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'

const SectionHeader = ({ title, onSeeAll }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  return (
    <View style={styles(currentTheme).header}>
      <Text style={styles(currentTheme).title}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll} style={styles(currentTheme).seeAllButton}>
        <Text style={styles(currentTheme).seeAllText}>See all</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = (currentTheme) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: currentTheme.fontMainColor
  },
  seeAllButton: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8
  },
  seeAllText: {
    fontSize: 14,
    color: currentTheme.primaryBlue,
    fontWeight: '500'
  }
})

export default SectionHeader

