import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import ConfigurationContext from '../../../context/Configuration'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import CartItem from '../../components/Cart/CartItem'
import { scale, verticalScale } from '../../../utils/scaling'
import { GET_FAVORITE_FOODS_SINGLE_VENDOR } from '../../apollo/queries'
import { useQuery } from '@apollo/client'

const MyFavorites = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const configuration = useContext(ConfigurationContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const { data: favoriteFoodsData, loading: favoriteFoodsLoading, error: favoriteFoodsError } = useQuery(GET_FAVORITE_FOODS_SINGLE_VENDOR)
  
  const [favoriteItems, setFavoriteItems] = useState([])

  useEffect(() => {
    if (favoriteFoodsData?.getFavoriteFoodsSingleVendor?.data) {
      const transformedItems = favoriteFoodsData.getFavoriteFoodsSingleVendor.data.map((food) => {
        // Get the first available variation (not out of stock) or the first variation
        const availableVariation = food.variations?.find(v => !v.isOutOfStock) || food.variations?.[0]
        
        // Collect all addons from all variations
        const allAddons = food.variations?.flatMap(variation => 
          variation.addons?.map(addon => addon.name || addon) || []
        ) || []
        
        // Remove duplicate addons
        const uniqueAddons = [...new Set(allAddons)]
        
        return {
          key: food._id,
          _id: food._id,
          title: food.title,
          description: food.description || '',
          price: availableVariation?.price || 0,
          quantity: 1,
          image: food.image || '',
          addons: uniqueAddons,
          variations: food.variations,
          isOutOfStock: food.isOutOfStock,
          subCategory: food.subCategory
        }
      })
      setFavoriteItems(transformedItems)
    }
  }, [favoriteFoodsData])

  const currencySymbol = configuration?.currencySymbol || '€'

  const handleAddQuantity = (itemKey) => {
    setFavoriteItems(prevItems =>
      prevItems.map(item =>
        item.key === itemKey ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const handleRemoveQuantity = (itemKey) => {
    setFavoriteItems(prevItems =>
      prevItems.map(item =>
        item.key === itemKey ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
      ).filter(item => item.quantity > 0)
    )
  }

  const renderItem = ({ item, index }) => (
    <CartItem
      key={item.key || index}
      item={item}
      onAddQuantity={() => handleAddQuantity(item.key)}
      onRemoveQuantity={() => handleRemoveQuantity(item.key)}
      currencySymbol={currencySymbol}
      isLastItem={index === favoriteItems.length - 1}
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
