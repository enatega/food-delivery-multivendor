import { View, FlatList, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'

const HorizontalCategoriesList = ({ categoriesData = [] }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const handleCategoryPress = (category) => {
    // Handle category press action
    console.log('Category pressed:', category.name)
  }

  const renderCategoryCard = ({ item: category }) => {
    return (
      <TouchableOpacity
        style={styles(currentTheme).categoryCard}
        onPress={() => handleCategoryPress(category)}
        activeOpacity={0.7}
      >
        <View style={styles(currentTheme).imageContainer}>
          <Image
            source={category.image}
            style={styles(currentTheme).categoryImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles(currentTheme).categoryLabel}>{category.name}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles(currentTheme).container}>
      <FlatList
        data={categoriesData}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles(currentTheme).scrollContent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategoryCard}
      />
    </View>
  )
}

const styles = (currentTheme) => StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 10
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingRight: 10
  },
  categoryCard: {
    width: 80,
    marginRight: 16,
    alignItems: 'center'
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: currentTheme.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: currentTheme.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  categoryImage: {
    width: '100%',
    height: '100%'
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: currentTheme.fontMainColor,
    textAlign: 'center'
  }
})

export default HorizontalCategoriesList

