import { View, FlatList, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import ProductCard from './ProductCard'
import SectionHeader from './SectionHeader'
import { useNavigation } from '@react-navigation/native'
import LoadingSkeleton from './LoadingSkeleton'
import HorizontalProductsEmptyView from './HorizontalProductsEmptyView'

const HorizontalProductsList = ({ ListData = [], listTitle = 'Drinks', isLoading, isError, refetch }) => {
  const { i18n, t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const navigation = useNavigation()
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const handleSeeAll = () => {
    // Handle see all action
    console.log(`See all ${listTitle.toLowerCase()}`)
    navigation.navigate('ProductExplorer')
  }

  const handleAddToCart = (drink) => {
    // Handle add to cart action
    console.log('Add to cart:', drink.name)
  }

  const onProductPress = () => {
    
  }

  return (
    <View style={styles(currentTheme).container}>
      <SectionHeader title={listTitle} onSeeAll={handleSeeAll} />
      {isLoading ? (
        <View style={styles().skeletonContainer}>
          <LoadingSkeleton width='45%' height={200} borderRadius={10} />
          <LoadingSkeleton width='45%' height={200} borderRadius={10} />
        </View>
      ) : (
        <FlatList ListEmptyComponent={<HorizontalProductsEmptyView />} data={ListData} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles(currentTheme).scrollContent} keyExtractor={(item) => item.id.toString()} renderItem={({ item: drink }) => <ProductCard product={drink} onAddToCart={handleAddToCart} onCardPress={onProductPress} />} />
      )}
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      marginTop: 20,
      marginBottom: 10
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingRight: 10
    },
    skeletonContainer: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
      marginHorizontal: 6,
      gap: 20
    }
  })

export default HorizontalProductsList
