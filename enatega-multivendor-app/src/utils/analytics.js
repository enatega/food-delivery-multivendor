import { useEffect } from 'react'
import useEnvVars from '../../environment'
import * as amplitude from '@amplitude/analytics-react-native'
import { getTrackingPermissions } from './useAppTrackingTrasparency'

const Analytics = () => {
  const { AMPLITUDE_API_KEY } = useEnvVars()
  let isInitialized = false
  const apiKey = AMPLITUDE_API_KEY

  const events = {
    USER_LOGGED_IN: 'USER_LOGGED_IN',
    USER_CREATED_ACCOUNT: 'USER_CREATED_ACCOUNT',
    USER_LOGGED_OUT: 'USER_LOGGED_OUT',
    USER_RECONNECTED: 'USER_RECONNECTED',
    ADD_TO_CART: 'ADD_TO_CART',
    NAVIGATE_TO_CART: 'NAVIGATE_TO_CART',
    OPENED_RESTAURANT_ITEM: 'OPENED_RESATURANT_ITEM',
    NAVIGATE_TO_ORDER_DETAIL: 'NAVIGATE_TO_ORDER_DETAIL',
    ORDER_PLACED: 'ORDER_PLACED',
    NAVIGATE_TO_MAIN: 'NAVIGATE_TO_MAIN',
    NAVIGATE_TO_ABOUT: 'NAVIGATE_TO_ABOUT',
    NAVIGATE_TO_ADDRESS: 'NAVIGATE_TO_ADDRESS',
    NAVIGATE_TO_CARTADDRESS: 'NAVIGATE_TO_CARTADDRESS',
    NAVIGATE_TO_CHAT: 'NAVIGATE_TO_CHAT',
    NAVIGATE_TO_COUPON: 'NAVIGATE_TO_COUPON',
    NAVIGATE_TO_CURRENTLOCATION: 'NAVIGATE_TO_CURRENTLOCATION',
    NAVIGATE_TO_EDITADDRESS: 'NAVIGATE_TO_EDITADDRESS',
    NAVIGATE_TO_FAVOURITES: 'NAVIGATE_TO_FAVOURITES',
    NAVIGATE_TO_FORGOTPASSWORD: 'NAVIGATE_TO_FORGOTPASSWORD',
    NAVIGATE_TO_FULLMAP: 'NAVIGATE_TO_FULLMAP',
    NAVIGATE_TO_HELP: 'NAVIGATE_TO_HELP',
    NAVIGATE_TO_HELPBROWSER: 'NAVIGATE_TO_HELPBROWSER',
    NAVIGATE_TO_MYORDERS: 'NAVIGATE_TO_MYORDERS',
    NAVIGATE_TO_NEWADDRESS: 'NAVIGATE_TO_NEWADDRESS',
    NAVIGATE_TO_PAYMENT: 'NAVIGATE_TO_PAYMENT',
    NAVIGATE_TO_PAYPAL: 'NAVIGATE_TO_PAYPAL',
    NAVIGATE_TO_PROFILE: 'NAVIGATE_TO_PROFILE',
    NAVIGATE_TO_RATEANDREVIEW: 'NAVIGATE_TO_RATEANDREVIEW',
    NAVIGATE_TO_REORDER: 'NAVIGATE_TO_REORDER',
    NAVIGATE_TO_RESTAURANTS: 'NAVIGATE_TO_RESTAURANTS',
    NAVIGATE_TO_SELECTLOCATION: 'NAVIGATE_TO_SELECTLOCATION',
    NAVIGATE_TO_SETTINGS: 'NAVIGATE_TO_SETTINGS',
    NAVIGATE_TO_STRIPE: 'NAVIGATE_TO_STRIPE',
    NAVIGATE_TO_TIPS: 'NAVIGATE_TO_TIPS'
  }

  const initialize = async () => {
    const trackingStatus = await getTrackingPermissions()
    if (isInitialized || !apiKey || trackingStatus !== 'granted') {
      return
    }
    await amplitude.init(apiKey)
    isInitialized = true
  }

  const identify = async (options, userId) => {
    await initialize()
    if (!isInitialized) return

    const properties = options

    if (!apiKey) return
    if (userId) {
      amplitude.setUserId(userId)
    }
    if (properties) {
      amplitude.Identify(properties)
    } else {
      const identifyObj = new amplitude.Identify()
      identifyObj.remove(properties)
      amplitude.Identify(identifyObj)
    }
  }

  const track = async (event, options) => {
    await initialize()
    if (!isInitialized) return

    const properties = options

    if (!apiKey) return

    if (properties) {
      await amplitude.track(event, properties)
    } else {
      await amplitude.track(event)
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  return {
    events,
    initialize,
    identify,
    track
  }
}

export default Analytics
