import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import ConfigurationContext from '../../../context/Configuration'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import CartItem from '../../components/Cart/CartItem'
import { scale, verticalScale } from '../../../utils/scaling'
import useFavoriteProducts from './useFavoriteProducts'
const PAGE_LIMIT = 10

const MyFavorites = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const configuration = useContext(ConfigurationContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [page, setPage] = useState(0)
  const { data: favoriteFoodsData, loading: favoriteFoodsLoading, error: favoriteFoodsError, refetch } = useFavoriteProducts({
    skip: 0,
    limit: PAGE_LIMIT,
    skipQuery: false
  })


  const [favoriteItems, setFavoriteItems] = useState([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    if (favoriteFoodsData?.getFavoriteFoodsSingleVendor?.data) {
      console.log('favoriteFoodsData', JSON.stringify(favoriteFoodsData?.getFavoriteFoodsSingleVendor?.data, null, 2));

      const transformedItems = favoriteFoodsData.getFavoriteFoodsSingleVendor.data.map((food) => {
        // Transform variations to include quantity property
        const transformedVariations = food.variations?.map(variation => ({
          ...variation,
          quantity: 1 // Default quantity for each variation
        })) || []

        // Calculate total price based on first available variation
        const availableVariation = transformedVariations.find(v => !v.isOutOfStock) || transformedVariations[0]
        const foodTotal = availableVariation ? (availableVariation.price * availableVariation.quantity).toFixed(2) : '0.00'

        return {
          key: food._id,
          _id: food._id,
          foodId: food._id,
          foodTitle: food.title,
          description: food.description || '',
          image: food.image || '',
          variations: transformedVariations,
          foodTotal: foodTotal,
          isOutOfStock: food.isOutOfStock,
          subCategory: food.subCategory
        }
      })

      if (page === 0) {
        setFavoriteItems(transformedItems)
      } else {
        setFavoriteItems(prev => [...prev, ...transformedItems])
      }
      setIsLoadingMore(false)
    }
  }, [favoriteFoodsData, page])

  const currencySymbol = configuration?.currencySymbol || '€'

  const handleLoadMore = async () => {
    if (isLoadingMore || favoriteFoodsLoading) return

    setIsLoadingMore(true)
    const nextPage = page + 1
    setPage(nextPage)

    const { data } = await refetch({
      skip: nextPage * PAGE_LIMIT,
      limit: PAGE_LIMIT
    })
  }

  const handleAddToCart = (item) => {
    // Navigate to ProductDetails screen to add item to cart
    console.log('Navigating to ProductDetails for item:', item)
    navigation.navigate('ProductDetails', {
      productId: item.foodId || item._id
    })
  }

  const renderItem = ({ item, index }) => (
    <CartItem
      key={item.key || index}
      item={item}
      currencySymbol={currencySymbol}
      isLastItem={index === favoriteItems.length - 1}
      isFavourite={true}
      onAddToCart={handleAddToCart}
    />
  )

  const keyExtractor = (item) => item.key || item.id

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
        headerText={t('My Favorites') || 'My Favorites'}
      />
      <FlatList
        data={favoriteItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles(currentTheme).listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={isLoadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} color={currentTheme?.main} /> : null}
      />
    </SafeAreaView>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF'
    },
    listContent: {
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12)
    }
  })

export default MyFavorites
