import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useApolloClient, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { v1 as uuidv1 } from 'uuid'
import { profile } from '../apollo/queries'
import { LocationContext } from './Location'
import AuthContext from './Auth'

import analytics from '../utils/analytics'

import { useTranslation } from 'react-i18next'
import navigationService from '../routes/navigationService'
import { dismissSessionExpiredModal, isLogoutInProgress, setLogoutInProgress, subscribeToSessionInvalidation } from '../utils/session'
import { clearPublicToken } from '../utils/publicAccessToken'

const v1options = {
  random: [0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36]
}

const PROFILE = gql`
  ${profile}
`

const UserContext = React.createContext({})

export const UserProvider = (props) => {
  const Analytics = analytics()

  const { t } = useTranslation()

  const { token, setToken } = useContext(AuthContext)
  const client = useApolloClient()
  const { location, setLocation } = useContext(LocationContext)
  const [cart, setCart] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [isPickup, setIsPickup] = useState(false)
  const [instructions, setInstructions] = useState('')
  const [coupon, setCoupon] = useState(null)

  const onError = useCallback((error) => {
    console.log('error context user', error.message)
  }, [])

  const onCompleted = useCallback(
    async (data) => {
      const { _id: userId, name, email, phone } = data?.profile
      await Analytics.identify(
        {
          userId,
          name,
          email,
          phone
        },
        userId
      )
      await Analytics.track(Analytics.events.USER_RECONNECTED, {
        userId: data?.profile?._id
      })
    },
    [Analytics]
  )

  const {
    called: calledProfile,
    loading: loadingProfile,
    error: errorProfile,
    data: dataProfile,
    refetch: refetchProfile,
    networkStatus
  } = useQuery(PROFILE, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError,
    onCompleted,
    skip: !token
  })

  useEffect(() => {
    let isSubscribed = true
    ;(async () => {
      const restaurant = await AsyncStorage.getItem('restaurant')

      const cart = await AsyncStorage.getItem('cartItems')
      const savedCoupon = await AsyncStorage.getItem('coupon')
      isSubscribed && setRestaurant(restaurant || null)
      isSubscribed && setCart(cart ? JSON.parse(cart) : [])
      isSubscribed && setCoupon(savedCoupon ? JSON.parse(savedCoupon) : null)
    })()
    return () => {
      isSubscribed = false
    }
  }, [])

  const saveCoupon = useCallback(async (couponData) => {
    setCoupon(couponData)
    if (couponData) {
      await AsyncStorage.setItem('coupon', JSON.stringify(couponData))
    } else {
      await AsyncStorage.removeItem('coupon')
    }
  }, [])

  const clearCart = useCallback(async () => {
    setCart([])
    setRestaurant(null)
    setInstructions('')
    await saveCoupon(null)
    await AsyncStorage.removeItem('cartItems')
    await AsyncStorage.removeItem('restaurant')
  }, [saveCoupon])

  const addQuantity = useCallback(async (key, quantity = 1) => {
    const cartIndex = cart.findIndex((c) => c.key === key)
    cart[cartIndex].quantity += quantity
    setCart([...cart])
    await AsyncStorage.setItem('cartItems', JSON.stringify([...cart]))
  }, [cart])

  const deleteItem = useCallback(async (key) => {
    const cartIndex = cart.findIndex((c) => c.key === key)
    if (cartIndex > -1) {
      cart.splice(cartIndex, 1)
      const items = [...cart.filter((c) => c.quantity > 0)]
      setCart(items)
      if (items.length === 0) setRestaurant(null)
      await AsyncStorage.setItem('cartItems', JSON.stringify(items))
    }
  }, [cart])

  const removeQuantity = useCallback(async (key) => {
    const cartIndex = cart.findIndex((c) => c.key === key)
    cart[cartIndex].quantity -= 1
    const items = [...cart.filter((c) => c.quantity > 0)]
    setCart(items)
    if (items.length === 0) setRestaurant(null)
    await AsyncStorage.setItem('cartItems', JSON.stringify(items))
  }, [cart])

  const checkItemCart = useCallback((itemId) => {
    const cartIndex = cart.findIndex((c) => c._id === itemId)
    if (cartIndex < 0) {
      return {
        exist: false,
        quantity: 0
      }
    }

    return {
      exist: true,
      quantity: cart[cartIndex].quantity,
      key: cart[cartIndex].key
    }
  }, [cart])

  const numberOfCartItems = useMemo(() => {
    return cart
      .map((c) => c.quantity)
      .reduce(function (a, b) {
        return a + b
      }, 0)
  }, [cart])

  const addCartItem = useCallback(async (_id, variation, quantity = 1, addons = [], clearFlag, specialInstructions = '') => {
    const cartItems = clearFlag ? [] : cart
    cartItems.push({
      key: uuidv1(v1options),
      _id,
      quantity: quantity,
      variation: {
        _id: variation
      },
      addons,
      specialInstructions
    })

    await AsyncStorage.setItem('cartItems', JSON.stringify([...cartItems]))
    setCart([...cartItems])
  }, [cart])

  const updateCart = useCallback(async (nextCart) => {
    setCart(nextCart)
    await AsyncStorage.setItem('cartItems', JSON.stringify(nextCart))
  }, [])

  const setCartRestaurant = useCallback(async (id) => {
    setRestaurant(id)
    await AsyncStorage.setItem('restaurant', id)
  }, [])

  const logout = useCallback(async (options = {}) => {
    const {
      clearStoredToken = true,
      shouldNavigate = true
    } = options

    try {
      setLogoutInProgress(true)
      await dismissSessionExpiredModal()

      if (clearStoredToken) {
        await AsyncStorage.removeItem('token')
      }
      await clearCart()
      await clearPublicToken()
      await AsyncStorage.removeItem('location')
      setToken(null)
      setCoupon(null)
      setCart([])
      setRestaurant(null)
      setInstructions('')
      if (location?._id) {
        setLocation({
          label: t('selectedLocation'),
          latitude: location.latitude,
          longitude: location.longitude,
          deliveryAddress: location.deliveryAddress
        })
      }
      if (dataProfile?.profile?._id && dataProfile?.profile?.__typename) {
        client.cache.evict({
          id: `${dataProfile.profile.__typename}:${dataProfile.profile._id}`
        })
      }
      await client.resetStore()
      await dismissSessionExpiredModal()

      if (shouldNavigate) {
        navigationService.navigate('Login')
      }
    } catch (error) {
      console.log('error on logout', error)
    } finally {
      setLogoutInProgress(false)
    }
  }, [clearCart, client, dataProfile?.profile?._id, dataProfile?.profile?.__typename, location, setLocation, setToken, t])

  useEffect(() => {
    const unsubscribe = subscribeToSessionInvalidation(() => {
      if (isLogoutInProgress()) return

      logout({
        clearStoredToken: false,
        shouldNavigate: false
      })
    })

    return unsubscribe
  }, [logout])

  const userContextValue = useMemo(() => ({
    isLoggedIn: !!token && dataProfile && !!dataProfile?.profile,
    loadingProfile: loadingProfile && calledProfile,
    errorProfile,
    profile: dataProfile && dataProfile?.profile ? dataProfile?.profile : null,
    logout,
    cart,
    cartCount: numberOfCartItems,
    clearCart,
    updateCart,
    addQuantity,
    removeQuantity,
    addCartItem,
    checkItemCart,
    deleteItem,
    restaurant,
    setCartRestaurant,
    refetchProfile,
    networkStatus,
    isPickup,
    setIsPickup,
    instructions,
    setInstructions,
    coupon,
    setCoupon: saveCoupon
  }), [
    addCartItem,
    addQuantity,
    calledProfile,
    cart,
    checkItemCart,
    clearCart,
    coupon,
    dataProfile,
    deleteItem,
    errorProfile,
    instructions,
    isPickup,
    logout,
    networkStatus,
    numberOfCartItems,
    refetchProfile,
    removeQuantity,
    restaurant,
    saveCoupon,
    setCartRestaurant,
    setInstructions,
    setIsPickup,
    updateCart,
    loadingProfile,
    token
  ])

  return (
    <UserContext.Provider value={userContextValue}>
      {props.children}
    </UserContext.Provider>
  )
}
export const useUserContext = () => useContext(UserContext)
export const UserConsumer = UserContext.Consumer
export default UserContext
