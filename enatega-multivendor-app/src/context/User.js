import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { v1 as uuidv1 } from 'uuid'
import { profile } from '../apollo/queries'
import { LocationContext } from './Location'
import AuthContext from './Auth'

import analytics from '../utils/analytics'

import { useTranslation } from 'react-i18next'
import { dismissSessionExpiredModal, isLogoutInProgress, setLogoutInProgress, subscribeToSessionInvalidation } from '../utils/session'
import { clearPublicToken } from '../utils/publicAccessToken'
import { deleteToken } from '../utils/secureToken'
import { useAppMode } from '../mode/AppModeContext'
import { APP_MODES } from '../mode/constants'
import {
  getModeItem,
  migrateMultivendorStorage,
  removeModeItem,
  setModeItem
} from '../mode/storage'

const v1options = {
  random: [0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36]
}

const PROFILE = gql`
  ${profile}
`

const SINGLE_VENDOR_PROFILE = gql`
  query SingleVendorProfile {
    profile {
      _id
      name
      phone
      phoneIsVerified
      email
      emailIsVerified
      notificationToken
      userType
      isActive
      isOrderNotification
      isOfferNotification
      addresses {
        _id
        label
        deliveryAddress
        details
        location {
          coordinates
        }
        selected
      }
      favourite
      stripe_plan_id
    }
  }
`

const UserContext = React.createContext({})

export const UserProvider = (props) => {
  const Analytics = analytics()
  const { mode } = useAppMode()

  const { t } = useTranslation()

  const { token, setToken } = useContext(AuthContext)
  const client = useApolloClient()
  const {
    location,
    setLocation,
    isLocationLoaded
  } = useContext(LocationContext)
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
      if (!data?.profile) return
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
  } = useQuery(
    mode === APP_MODES.SINGLE ? SINGLE_VENDOR_PROFILE : PROFILE,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
      onError,
      onCompleted,
      skip: !token
    }
  )

  useEffect(() => {
    let isSubscribed = true
    ;(async () => {
      if (mode === APP_MODES.MULTI) await migrateMultivendorStorage()

      const restaurant = await getModeItem('restaurant', mode)
      const cart = await getModeItem('cartItems', mode)
      const savedCoupon = await getModeItem('coupon', mode)
      isSubscribed && setRestaurant(restaurant || null)
      isSubscribed && setCart(cart ? JSON.parse(cart) : [])
      isSubscribed && setCoupon(savedCoupon ? JSON.parse(savedCoupon) : null)
    })()
    return () => {
      isSubscribed = false
    }
  }, [mode])

  useEffect(() => {
    if (
      mode !== APP_MODES.SINGLE ||
      !isLocationLoaded ||
      location ||
      !dataProfile?.profile
    ) return

    const selectedAddress = dataProfile.profile.addresses?.find(
      address => address?.selected
    )
    const coordinates = selectedAddress?.location?.coordinates
    if (!selectedAddress || !Array.isArray(coordinates)) return

    setLocation({
      _id: selectedAddress._id,
      label: selectedAddress.label,
      latitude: Number(coordinates[1]),
      longitude: Number(coordinates[0]),
      deliveryAddress: selectedAddress.deliveryAddress,
      details: selectedAddress.details
    })
  }, [
    dataProfile?.profile,
    isLocationLoaded,
    location,
    mode,
    setLocation
  ])

  const saveCoupon = useCallback(async (couponData) => {
    setCoupon(couponData)
    if (couponData) {
      await setModeItem('coupon', JSON.stringify(couponData), mode)
    } else {
      await removeModeItem('coupon', mode)
    }
  }, [mode])

  const clearCart = useCallback(async () => {
    setCart([])
    setRestaurant(null)
    setInstructions('')
    await saveCoupon(null)
    await removeModeItem('cartItems', mode)
    await removeModeItem('restaurant', mode)
  }, [mode, saveCoupon])

  const addQuantity = useCallback(async (key, quantity = 1) => {
    // Immutable update — never mutate the existing cart item objects (QUAL-009).
    const nextCart = cart.map((c) =>
      c.key === key ? { ...c, quantity: c.quantity + quantity } : c
    )
    setCart(nextCart)
    await setModeItem('cartItems', JSON.stringify(nextCart), mode)
  }, [cart, mode])

  const deleteItem = useCallback(async (key) => {
    const cartIndex = cart.findIndex((c) => c.key === key)
    if (cartIndex > -1) {
      cart.splice(cartIndex, 1)
      const items = [...cart.filter((c) => c.quantity > 0)]
      setCart(items)
      if (items.length === 0) setRestaurant(null)
      await setModeItem('cartItems', JSON.stringify(items), mode)
    }
  }, [cart, mode])

  const removeQuantity = useCallback(async (key) => {
    // Immutable update — never mutate the existing cart item objects (QUAL-009).
    const items = cart
      .map((c) => (c.key === key ? { ...c, quantity: c.quantity - 1 } : c))
      .filter((c) => c.quantity > 0)
    setCart(items)
    if (items.length === 0) setRestaurant(null)
    await setModeItem('cartItems', JSON.stringify(items), mode)
  }, [cart, mode])

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

    await setModeItem('cartItems', JSON.stringify([...cartItems]), mode)
    setCart([...cartItems])
  }, [cart, mode])

  const updateCart = useCallback(async (nextCart) => {
    setCart(nextCart)
    await setModeItem('cartItems', JSON.stringify(nextCart), mode)
  }, [mode])

  const setCartRestaurant = useCallback(async (id) => {
    setRestaurant(id)
    await setModeItem('restaurant', id, mode)
  }, [mode])

  const logout = useCallback(async (options = {}) => {
    const {
      clearStoredToken = true
    } = options

    try {
      setLogoutInProgress(true)
      await dismissSessionExpiredModal()

      if (clearStoredToken) {
        await deleteToken(mode)
      }
      await clearCart()
      if (mode === APP_MODES.MULTI) await clearPublicToken()
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

      // Do NOT navigate here. The root navigator is auth-gated with
      // key={isLoggedIn ? 'authed' : 'guest'}; clearing the token above flips
      // that key and remounts the navigator straight to the guest Discovery
      // screen. Navigating imperatively as well caused a double transition
      // (Login flash -> Main) and a visible refresh — the logout jank.
    } catch (error) {
      console.log('error on logout', error)
    } finally {
      setLogoutInProgress(false)
    }
  }, [clearCart, client, dataProfile?.profile?._id, dataProfile?.profile?.__typename, location, mode, setLocation, setToken, t])

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
    isLoggedIn: !!token,
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
