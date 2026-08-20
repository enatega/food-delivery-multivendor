import { View, FlatList, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import RenderCategoryCard from './RenderCategoryCard'
import { useNavigation } from '@react-navigation/native'
import { scale } from '../../utils/scaling'

const HorizontalCategoriesList = ({ categoriesData = [] }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const navigation = useNavigation()
  const handleCategoryPress = (categoryViewType, categoryId) => {
    if (categoryViewType === 'see-all') {
      // navigation.navigate('ProductExplorer')
      navigation.navigate('ProductExplorer', {
        categoryId
      })
    } else {
      navigation.navigate('ProductsList', {
        categoryId

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
        renderItem={({ item }) => (
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
    paddingLeft: scale(12),
    paddingRight: scale(4)
  }
})

export default HorizontalCategoriesList
