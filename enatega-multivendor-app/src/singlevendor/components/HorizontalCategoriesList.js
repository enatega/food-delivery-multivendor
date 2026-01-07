import { View, FlatList, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import RenderCategoryCard from './RenderCategoryCard'
import { useNavigation } from '@react-navigation/native'

const HorizontalCategoriesList = ({ categoriesData = [] }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const navigation = useNavigation()
  const handleCategoryPress = (categoryViewType,categoryId) => {
    // Handle category press action
    console.log('Category pressed:',categoryViewType, categoryId)

    if (categoryViewType === 'see-all') {
      navigation.navigate('ProductExplorer')
    } else {
      navigation.navigate('ProductsList', {
        categoryId: categoryId

      })
    }
  }

  return (
    <View style={styles(currentTheme).container}>
      <FlatList
        data={categoriesData}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles(currentTheme).scrollContent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <RenderCategoryCard
            item={item}
            currentTheme={currentTheme}
            handleCategoryPress={handleCategoryPress}
          />
        )}
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
})

export default HorizontalCategoriesList

