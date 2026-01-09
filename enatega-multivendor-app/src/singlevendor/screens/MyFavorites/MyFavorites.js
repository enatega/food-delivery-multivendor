import React, { useContext, useState } from 'react'
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
  console.log('Favorite Foods Data:HERE', JSON.stringify(favoriteFoodsData, null, 2))
  // Dummy data for now
  const [favoriteItems, setFavoriteItems] = useState([
    {
      key: '1',
      title: 'Veggie Spring Rolls',
      description: 'Carrots, bell peppers, cucumbers, and cabbages wrapped in rice paper',
      price: 12.40,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
      addons: ['Dipping sauce', 'Peanut sauce']
    },
    {
      key: '2',
      title: 'Apple Juice',
      description: 'Golden Delicious Apples, Filter Water, Ascorbic Acid',
      price: 8.74,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
      addons: []
    },
    {
      key: '3',
      title: 'Veggie Spring Rolls',
      description: 'Carrots, bell peppers, cucumbers, and cabbages wrapped in rice paper',
      price: 12.40,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
      addons: ['Dipping sauce', 'Peanut sauce']
    },
    {
      key: '4',
      title: 'Apple Juice',
      description: 'Golden Delicious Apples, Filter Water, Ascorbic Acid',
      price: 8.74,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
      addons: []
    }
  ])

  const currencySymbol = configuration?.currencySymbol || '€'

  const handleAddQuantity = (itemKey) => {
    // TODO: Replace with your actual add quantity logic
    setFavoriteItems(prevItems =>
      prevItems.map(item =>
        item.key === itemKey ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const handleRemoveQuantity = (itemKey) => {
    // TODO: Replace with your actual remove quantity logic
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
