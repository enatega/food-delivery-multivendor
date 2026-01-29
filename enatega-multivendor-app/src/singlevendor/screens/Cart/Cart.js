import React, { useState, useContext, useLayoutEffect, useRef } from 'react'
import { View, ScrollView, TouchableOpacity, StatusBar, Platform, SafeAreaView, FlatList, ActivityIndicator } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/elements'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../../context/Configuration'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
import { textStyles } from '../../../utils/textStyles'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

import CartItem from '../../components/Cart/CartItem'
import EmptyCart from '../../components/Cart/EmptyCart'
import OrderProgressBanner from '../../components/Cart/OrderProgressBanner'
import RecommendedProducts from '../../components/Cart/RecommendedProducts'
import { mockCartItems, mockRecommendedProducts } from '../../assets/cartMockData'
import styles from './Styles'
import useCart from './useCart'
import CartSkeleton from '../../components/Cart/CartSkeleton'
import useCartStore from '../../stores/useCartStore'
import MainModalize from '../../../components/Main/Modalize/MainModalize'
import UserContext from '../../../context/User'
import CustomHomeIcon from '../../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomWorkIcon from '../../../assets/SVG/imageComponents/CustomWorkIcon'
import CustomApartmentIcon from '../../../assets/SVG/imageComponents/CustomApartmentIcon'
import CustomOtherIcon from '../../../assets/SVG/imageComponents/CustomOtherIcon'
import AddressModalHeader from '../../components/Home/AddressModalHeader'
import AddressModalFooter from '../../components/Home/AddressModalFooter'
import { LocationContext } from '../../../context/Location'
import { selectAddress } from '../../../apollo/mutations'
import { gql, useMutation } from '@apollo/client'
import { CLEAR_CART } from '../../apollo/mutations'
const SELECT_ADDRESS = gql`
  ${selectAddress}
`
const Cart = (props) => {
  const { items, grandTotal, loading, error, maxOrderAmount, minOrderAmount, isBelowMinimumOrder, lowOrderFees, clearCart } = useCartStore()
  // const items = [] // For testing empty cart
  const [mutate] = useMutation(SELECT_ADDRESS, {
    onError: () => {}
  })

  const [mutateClearCart, { loading: emptyingCart }] = useMutation(CLEAR_CART, {
    onCompleted: () => {
      clearCart()
    },
    onError: () => {}
  })

  console.log('Cart Data::', items, grandTotal, maxOrderAmount, minOrderAmount, isBelowMinimumOrder, loading, error)

  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const minimumOrder = 10 // Minimum order to place
  const lowOrderFeeThreshold = 15 // Threshold to avoid low-order fee
  const lowOrderFee = 2 // Low-order fee amount
  const currencySymbol = configuration?.currencySymbol || '€'

  // Calculate cart count
  const cartCount = items.reduce((sum, item) => sum + item.variations.reduce((vSum, v) => vSum + v.quantity, 0), 0)

  useFocusEffect(() => {
    console.log('Cart Screen Focused')

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  })

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      title: t('cart') || 'Cart',
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        ...textStyles.H4,
        ...textStyles.Bolder
      },
      headerTitleContainerStyle: {
        paddingLeft: scale(25),
        paddingRight: scale(25)
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={{ ...alignment.PLsmall, alignItems: 'center' }}>
              <AntDesign name='arrowleft' size={22} color={currentTheme.newIconColor} />
            </View>
          )}
          onPress={() => navigation.goBack()}
        />
      )
    })
  }, [props?.navigation, currentTheme])

  const handleStartShopping = () => {
    // TODO: Navigate to your home/products screen
    navigation.goBack()
  }

  const handleCheckout = () => {
    navigation.navigate('SingleVendorCheckout')
  }

  const handleAddToCart = (product) => {
    // TODO: Replace with your actual add to cart logic
    console.log('Add to cart:', product)
  }

  const handleProductPress = (product) => {
    // TODO: Navigate to product detail
    console.log('Product pressed:', product)
  }

  const formatAmount = value => {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return '0.00'
  }

  return number.toFixed(2)
}


  //Cart Skeleton loading
  if (loading) {
    return <CartSkeleton />
  }

  return (
    <SafeAreaView style={styles(currentTheme).mainContainer}>
      {/* Top progress banner */}
      <OrderProgressBanner currentTotal={grandTotal} minimumOrder={minOrderAmount} lowOrderFeeThreshold={maxOrderAmount} lowOrderFee={lowOrderFees} currencySymbol={currencySymbol} />

      <FlatList
        data={items}
        keyExtractor={(item, index) => item.key?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        style={styles().scrollView}
        contentContainerStyle={styles().contentContainer}
        renderItem={({ item, index }) => <CartItem item={item} currencySymbol={currencySymbol} isLastItem={index === items.length - 1} />}
        ListHeaderComponent={() =>
          items.length > 0 && (
            <View style={styles().headerRow}>
              <TextDefault textColor={currentTheme.fontMainColor} bolder H4>
                {t('yourItems') || 'Your items'}
              </TextDefault>

              {emptyingCart ? (
                <ActivityIndicator size={'small'} color={currentTheme.black}></ActivityIndicator>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    mutateClearCart()
                  }}
                >
                  <TextDefault textColor={currentTheme.primary} bolder>
                    {t('Clear cart') || 'Clear'}
                  </TextDefault>
                </TouchableOpacity>
              )}
            </View>
          )
        }
        ListFooterComponent={() => (
          <View style={styles().recommendedSection}>
            <RecommendedProducts cartItemId={items?.length > 0 ? items[0]?.foodId : null} />
          </View>
        )}
        ListEmptyComponent={() => <EmptyCart onStartShopping={handleStartShopping} />}
      />

      {/* Sticky Checkout Button */}
      <View style={styles(currentTheme).stickyCheckoutContainer}>
        <TouchableOpacity activeOpacity={0.7} style={[styles(currentTheme).checkoutButton, isBelowMinimumOrder && styles(currentTheme).checkoutButtonDisabled]} onPress={isBelowMinimumOrder ? null : handleCheckout} disabled={isBelowMinimumOrder}>
          <View style={styles().checkoutButtonContent}>
            <View style={[styles().cartBadge, !isBelowMinimumOrder && styles().cartBadgeActive]}>
              <TextDefault textColor={isBelowMinimumOrder ? currentTheme.gray300 : currentTheme.primaryBlue} bold small>
                {cartCount}
              </TextDefault>
            </View>
            <TextDefault textColor={isBelowMinimumOrder ? currentTheme.gray300 : currentTheme.white} bolder H5>
              {t('goToCheckout') || 'Go to checkout'} {currencySymbol}
              {formatAmount(grandTotal)}
            </TextDefault>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Cart
