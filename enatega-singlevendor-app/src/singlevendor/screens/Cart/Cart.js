import React, { useContext, useLayoutEffect, useRef, useMemo } from 'react'
import { View, TouchableOpacity, StatusBar, Platform, SafeAreaView, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
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
import RecommendedProducts from '../../components/Cart/RecommendedProducts'
import styles from './Styles'
import useCart from './useCart'
import CartSkeleton from '../../components/Cart/CartSkeleton'
import useCartStore from '../../stores/useCartStore'
import { useMutation } from '@apollo/client'
import { CLEAR_CART } from '../../apollo/mutations'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'
import SectionErrorCard from '../../components/SectionErrorCard'
import AuthContext from '../../../context/Auth'

const Cart = (props) => {
  const { items, grandTotal, loading, error, isBelowMinimumOrder, clearCart } = useCartStore()
  const { token } = useContext(AuthContext)
  const visibleItems = token ? items : []
  const { refetch } = useCart()
  const { refreshing, handleRefresh, spinnerColor } = usePullToRefresh([refetch])
  // const items = [] // For testing empty cart
  const [mutateClearCart, { loading: emptyingCart }] = useMutation(CLEAR_CART, {
    onCompleted: () => {
      clearCart()
    },
    onError: () => {}
  })

  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const currencySymbol = configuration?.currencySymbol || '€'

  const initialRecommendedItemIdRef = useRef(
    visibleItems?.length > 0 ? visibleItems[0]?.foodId : null
  )
  const recommendedFooter = useMemo(
    () => (
      <View style={styles().recommendedSection}>
        <RecommendedProducts cartItemId={initialRecommendedItemIdRef.current} />
      </View>
    ),
    []
  )

  // Calculate cart count
  const cartCount = visibleItems.reduce((sum, item) => sum + item.variations.reduce((vSum, v) => vSum + v.quantity, 0), 0)

  useFocusEffect(() => {
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

  const formatAmount = (value) => {
    const number = Number(value)

    if (!Number.isFinite(number)) {
      return '0.00'
    }

    return number.toFixed(2)
  }

  // Cart Skeleton loading
  if (token && loading && visibleItems.length === 0) {
    return <CartSkeleton />
  }

  if (token && error && visibleItems.length === 0) {
    return (
      <SafeAreaView style={styles(currentTheme).mainContainer}>
        <SectionErrorCard
          title={t('Cart')}
          message={t('cartLoadFailed', { defaultValue: 'Your cart could not be loaded.' })}
          onRetry={refetch}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles(currentTheme).mainContainer}>
      <FlatList
        data={visibleItems}
        keyExtractor={(item, index) => item.key?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        style={[styles().scrollView, { marginTop: Platform.OS === 'android' ? insets.top : 0 }]}
        contentContainerStyle={styles().contentContainer}
        renderItem={({ item, index }) => <CartItem key={item?.foodId} item={item} currencySymbol={currencySymbol} isLastItem={index === visibleItems.length - 1} />}
        ListHeaderComponent={() =>
          visibleItems.length > 0 && (
            <View style={styles().headerRow}>
              <TextDefault textColor={currentTheme.fontMainColor} bolder H4>
                {t('yourItems') || 'Your items'}
              </TextDefault>

              {emptyingCart
                ? (
                <ActivityIndicator size={'small'} color={currentTheme.black}></ActivityIndicator>
                  )
                : (
                <TouchableOpacity
                  onPress={() => {
                    mutateClearCart()
                  }}
                >
                  <TextDefault textColor={currentTheme.primaryBlue} bolder>
                    {t('Clear cart') || 'Clear'}
                  </TextDefault>
                </TouchableOpacity>
                  )}
            </View>
          )
        }
        ListFooterComponent={recommendedFooter}
        ListEmptyComponent={() => <EmptyCart onStartShopping={handleStartShopping} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={spinnerColor} colors={[spinnerColor]} />}
      />

      {/* Sticky Checkout Button */}
      {visibleItems.length > 0 && <View style={styles(currentTheme).stickyCheckoutContainer}>
        <TouchableOpacity activeOpacity={0.7} style={[styles(currentTheme).checkoutButton, isBelowMinimumOrder && styles(currentTheme).checkoutButtonDisabled]} onPress={isBelowMinimumOrder ? null : handleCheckout} disabled={isBelowMinimumOrder}>
          <View style={styles().checkoutButtonContent}>
            <View style={[styles().cartBadge, !isBelowMinimumOrder && styles().cartBadgeActive]}>
              <TextDefault textColor={isBelowMinimumOrder ? currentTheme.gray300 : currentTheme.primaryBlue} bold small>
                {cartCount}
              </TextDefault>
            </View>
            <TextDefault textColor={isBelowMinimumOrder ? currentTheme.gray300 : currentTheme.white} bolder H5>
              {t('goToCheckout') || 'Go to checkout'}&nbsp;
              {formatAmount(grandTotal)} {currencySymbol}
            </TextDefault>
          </View>
        </TouchableOpacity>
      </View>}
    </SafeAreaView>
  )
}

export default Cart
