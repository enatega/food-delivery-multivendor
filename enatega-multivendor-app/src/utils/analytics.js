// import  * as Amplitude  from 'expo-analytics-amplitude'
import * as amplitude from '@amplitude/analytics-react-native'
import { getTrackingPermissions } from './useAppTrackingTrasparency'
import getEnvVars from '../../environment'
const { AMPLITUDE_API_KEY } = getEnvVars()
let isInitialized = false
const apiKey = AMPLITUDE_API_KEY

export const events = {
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
export async function initialize() {
  const trackingStatus = await getTrackingPermissions()
  if (isInitialized || !apiKey || trackingStatus !== 'granted') {
    return
  }
  // await Amplitude.initializeAsync(AMPLITUDE_API_KEY)
  await amplitude.init(apiKey)
  isInitialized = true
}

export async function identify(options, userId) {
  await initialize()
  if (!isInitialized) return
  // eslint-disable-next-line no-undef
  const properties = options

  if (!apiKey) return
  if (userId) {
    // await Amplitude.setUserIdAsync(userId)
    amplitude.setUserId(userId)
  }
  if (properties) {
    amplitude.Identify(properties)
    // await Amplitude.setUserPropertiesAsync(properties)
  } else {
    // await Amplitude.clearUserPropertiesAsync()
    const identifyObj = new amplitude.Identify()
    identifyObj.remove(properties)
    amplitude.Identify(identifyObj)
  }
}
export async function track(event, options) {
  await initialize()
  if (!isInitialized) return
  const properties = options

  if (!apiKey) return

  if (properties) {
    // await Amplitude.logEventWithPropertiesAsync(event, properties)
    await amplitude.track(event, properties)
  } else {
    // await Amplitude.logEventAsync(event)
    await amplitude.track(event)
  }
}

export default {
  events,
  initialize,
  identify,
  track
}
