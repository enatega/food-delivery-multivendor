import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import i18next from 'i18next'
import messaging from '@react-native-firebase/messaging'
import { gql } from '@apollo/client'
import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform
} from 'react-native'

const REGISTER_SESSION = gql`
  mutation RegisterLiveActivitySession(
    $orderId: ID!
    $activityId: String!
    $platform: String!
    $pushToken: String!
    $schemaVersion: Int
    $language: String
  ) {
    registerLiveActivitySession(
      orderId: $orderId
      activityId: $activityId
      platform: $platform
      pushToken: $pushToken
      schemaVersion: $schemaVersion
      language: $language
    ) {
      success
      message
    }
  }
`

const REMOVE_SESSION = gql`
  mutation RemoveLiveActivitySession($orderId: ID!, $activityId: String!) {
    removeLiveActivitySession(orderId: $orderId, activityId: $activityId) {
      success
      message
    }
  }
`

const { ActivityController } = NativeModules
const SESSION_KEY = 'enatega-live-activity-session-v2'
const RETRY_DELAYS_MS = [750, 2000, 5000]
const defaultConfiguration = {
  appGroupId: 'group.com.enatega.multivendor.shared',
  appScheme: 'enategamultivendor',
  brandName: 'N\'Dore.Ai',
  primaryColor: '#003B6F',
  accentColor: '#B3132B',
  logoResourceName: 'enatega_logo',
  riderResourceName: 'enatega_rider',
  ...(Constants.expoConfig?.extra?.liveActivity || {})
}

const apolloClients = new Map()
let activeMode = null
let tokenSubscription = null

const tokenFingerprint = (token) => {
  const value = String(token || '')
  if (!value) return 'empty'
  if (value.length <= 12) return `length=${value.length}`
  return `${value.slice(0, 6)}…${value.slice(-6)} length=${value.length}`
}

const liveActivityLog = (message, details) => {
  console.log(`[LiveActivity] ${message}`, details)
}

const language = () =>
  ['ar', 'he'].includes(i18next.resolvedLanguage || i18next.language)
    ? i18next.resolvedLanguage || i18next.language
    : 'en'

const parseNativeResult = (value) =>
  typeof value === 'string' ? JSON.parse(value) : value

const registerSession = async(
  orderId,
  activityId,
  platform,
  pushToken,
  mode = activeMode
) => {
  const apolloClient = apolloClients.get(mode)
  if (!apolloClient) throw new Error(`Live Activity Apollo client is unavailable for ${mode || 'current mode'}.`)
  liveActivityLog('registering session', {
    orderId,
    activityId,
    platform,
    pushToken: tokenFingerprint(pushToken),
    language: language()
  })
  await apolloClient.mutate({
    mutation: REGISTER_SESSION,
    variables: {
      orderId,
      activityId,
      platform,
      pushToken,
      schemaVersion: 2,
      language: language()
    }
  })
  liveActivityLog('session registered', {
    orderId,
    activityId,
    platform
  })
}

const registerSessionWithRetry = async(...args) => {
  let lastError
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      liveActivityLog('registration attempt', {
        orderId: args[0],
        activityId: args[1],
        platform: args[2],
        attempt: attempt + 1
      })
      await registerSession(...args)
      return
    } catch (error) {
      lastError = error
      const statusCode =
        error?.networkError?.statusCode ?? error?.networkError?.status
      const isGraphQLClientError =
        !error?.networkError && error?.graphQLErrors?.length > 0
      if (isGraphQLClientError) break
      if (statusCode !== undefined && statusCode < 500) break
      const delay = RETRY_DELAYS_MS[attempt]
      if (delay === undefined) break
      liveActivityLog('registration retry scheduled', {
        orderId: args[0],
        activityId: args[1],
        platform: args[2],
        attempt: attempt + 2,
        delay
      })
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw lastError
}

const initializeTokenObserver = () => {
  if (Platform.OS !== 'ios' || tokenSubscription || !ActivityController) return
  liveActivityLog('initializing iOS token observer')
  tokenSubscription = new NativeEventEmitter(ActivityController).addListener(
    'LiveActivityTokenUpdated',
    async({ orderId, activityId, pushToken }) => {
      liveActivityLog('received iOS push-token event', {
        orderId,
        activityId,
        pushToken: tokenFingerprint(pushToken)
      })
      if (orderId && activityId && pushToken) {
        const stored = await AsyncStorage.getItem(SESSION_KEY).catch(() => null)
        const sessionMode = stored ? JSON.parse(stored)?.mode : activeMode
        registerSessionWithRetry(
          orderId,
          activityId,
          'IOS',
          pushToken,
          sessionMode
        ).catch(() => {})
      }
    }
  )
}

const configure = (client, mode) => {
  activeMode = mode
  apolloClients.set(mode, client)
  liveActivityLog('service configured', {
    platform: Platform.OS,
    apolloClientAvailable: Boolean(client)
  })
  initializeTokenObserver()
}

const makeInitialState = () => ({
  schemaVersion: 2,
  status: 'PENDING',
  estimatedArrivalEpoch: 0,
  etaUpdatedAtEpoch: Math.floor(Date.now() / 1000),
  riderName: '',
  riderPhone: '',
  language: language()
})

const requestAndroidPermission = async() => {
  if (Platform.OS !== 'android' || Platform.Version < 33) return true
  const granted =
    (await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    )) === PermissionsAndroid.RESULTS.GRANTED
  liveActivityLog('Android notification permission resolved', { granted })
  return granted
}

const initiateForOrder = async({ orderId, displayOrderId, mode = activeMode }) => {
  liveActivityLog('starting activity', {
    orderId,
    displayOrderId,
    platform: Platform.OS
  })
  if (!ActivityController?.startLiveActivity) {
    throw new Error('Live Activity native module is unavailable.')
  }
  if (Platform.OS === 'android' && !(await requestAndroidPermission())) {
    throw new Error('Notification permission is required for delivery progress.')
  }

  initializeTokenObserver()
  const result = parseNativeResult(
    await ActivityController.startLiveActivity(
      JSON.stringify({
        orderId,
        displayOrderId,
        state: makeInitialState(),
        configuration: defaultConfiguration
      })
    )
  )
  liveActivityLog('native activity start completed', {
    orderId,
    activityId: result.activityId,
    alreadyRunning: Boolean(result.alreadyRunning),
    pushToken: tokenFingerprint(result.pushToken)
  })
  if (result.alreadyRunning) return result

  const platform = Platform.OS === 'ios' ? 'IOS' : 'ANDROID'
  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ orderId, activityId: result.activityId, mode, platform })
  )
  const pushToken =
    platform === 'IOS' ? result.pushToken : await messaging().getToken()
  liveActivityLog('resolved activity push token', {
    orderId,
    activityId: result.activityId,
    platform,
    pushToken: tokenFingerprint(pushToken)
  })
  if (pushToken) {
    registerSessionWithRetry(
      orderId,
      result.activityId,
      platform,
      pushToken,
      mode
    ).catch(() => {})
  }
  return result
}

const reregisterAndroidSession = async(pushToken) => {
  if (Platform.OS !== 'android' || !pushToken) return
  const stored = await AsyncStorage.getItem(SESSION_KEY)
  if (!stored) {
    liveActivityLog('Android re-registration skipped: no stored session')
    return
  }
  const { orderId, activityId, mode } = JSON.parse(stored)
  if (orderId && activityId) {
    liveActivityLog('re-registering Android session', {
      orderId,
      activityId,
      pushToken: tokenFingerprint(pushToken)
    })
    await registerSessionWithRetry(
      orderId,
      activityId,
      'ANDROID',
      pushToken,
      mode
    )
  }
}

const clearAndroidSession = async() => {
  await AsyncStorage.removeItem(SESSION_KEY)
  liveActivityLog('cleared persisted session')
}

const stop = async(orderId, activityId) => {
  liveActivityLog('stopping activity', { orderId, activityId })
  if (ActivityController?.stopLiveActivity) {
    await ActivityController.stopLiveActivity().catch(() => {})
  }
  const stored = await AsyncStorage.getItem(SESSION_KEY).catch(() => null)
  const mode = stored ? JSON.parse(stored)?.mode : activeMode
  const apolloClient = apolloClients.get(mode)
  await clearAndroidSession()
  if (orderId && apolloClient) {
    await apolloClient.mutate({
      mutation: REMOVE_SESSION,
      variables: { orderId, activityId }
    })
  }
}

const cleanAppGroupImages = async(maxAgeHours = 24) => {
  if (Platform.OS === 'ios' && ActivityController?.cleanAppGroupImages) {
    liveActivityLog('cleaning stale app-group images', { maxAgeHours })
    await ActivityController.cleanAppGroupImages(
      maxAgeHours,
      defaultConfiguration.appGroupId
    )
  }
}

export default {
  cleanAppGroupImages,
  clearAndroidSession,
  configure,
  initiateForOrder,
  makeInitialState,
  reregisterAndroidSession,
  stop
}
