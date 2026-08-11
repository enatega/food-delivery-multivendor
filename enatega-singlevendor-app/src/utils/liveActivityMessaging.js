import messaging from '@react-native-firebase/messaging'
import { AppState, NativeModules, Platform } from 'react-native'

import LiveActivityService from './liveActivityService'

const handleMessage = async(message) => {
  if (
    Platform.OS !== 'android' ||
    message.data?.type !== 'live_activity_update'
  ) {
    return
  }
  const orderData = message.data.orderData
  console.log('[LiveActivity] received Android activity update', {
    messageId: message.messageId,
    hasOrderData: typeof orderData === 'string'
  })
  if (
    typeof orderData !== 'string' ||
    !NativeModules.ActivityController?.updateLiveActivity
  ) {
    return
  }
  await NativeModules.ActivityController.updateLiveActivity(orderData)
  console.log('[LiveActivity] applied Android activity update')
  try {
    const payload = JSON.parse(orderData)
    if (payload.terminal === true || payload.terminal === 'true') {
      console.log('[LiveActivity] received terminal Android activity update', {
        status: payload.status
      })
      await LiveActivityService.clearAndroidSession()
    }
  } catch {
    // Native validation owns malformed payload handling.
  }
}

export const registerLiveActivityBackgroundHandler = () => {
  if (Platform.OS === 'android') {
    console.log('[LiveActivity] registering Android background handler')
    messaging().setBackgroundMessageHandler(handleMessage)
  }
}

export const registerLiveActivityForegroundHandler = () => {
  if (Platform.OS !== 'android') return () => {}
  console.log('[LiveActivity] registering Android foreground handlers')
  const reregister = () =>
    messaging()
      .getToken()
      .then(LiveActivityService.reregisterAndroidSession)
      .catch(() => {})

  reregister()
  const unsubscribeMessage = messaging().onMessage(handleMessage)
  const unsubscribeToken = messaging().onTokenRefresh((token) => {
    console.log('[LiveActivity] Android FCM token refreshed')
    LiveActivityService.reregisterAndroidSession(token).catch(() => {})
  })
  const appStateSubscription = AppState.addEventListener(
    'change',
    (nextState) => {
      if (nextState === 'active') reregister()
    }
  )
  return () => {
    console.log('[LiveActivity] removing Android foreground handlers')
    unsubscribeMessage()
    unsubscribeToken()
    appStateSubscription.remove()
  }
}
