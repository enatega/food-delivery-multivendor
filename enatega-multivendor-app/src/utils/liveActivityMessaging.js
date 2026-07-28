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
  if (
    typeof orderData !== 'string' ||
    !NativeModules.ActivityController?.updateLiveActivity
  ) {
    return
  }
  await NativeModules.ActivityController.updateLiveActivity(orderData)
  try {
    const payload = JSON.parse(orderData)
    if (payload.terminal === true || payload.terminal === 'true') {
      await LiveActivityService.clearAndroidSession()
    }
  } catch {
    // Native validation owns malformed payload handling.
  }
}

export const registerLiveActivityBackgroundHandler = () => {
  if (Platform.OS === 'android') {
    messaging().setBackgroundMessageHandler(handleMessage)
  }
}

export const registerLiveActivityForegroundHandler = () => {
  if (Platform.OS !== 'android') return () => {}
  const reregister = () =>
    messaging()
      .getToken()
      .then(LiveActivityService.reregisterAndroidSession)
      .catch(() => {})

  reregister()
  const unsubscribeMessage = messaging().onMessage(handleMessage)
  const unsubscribeToken = messaging().onTokenRefresh((token) => {
    LiveActivityService.reregisterAndroidSession(token).catch(() => {})
  })
  const appStateSubscription = AppState.addEventListener(
    'change',
    (nextState) => {
      if (nextState === 'active') reregister()
    }
  )
  return () => {
    unsubscribeMessage()
    unsubscribeToken()
    appStateSubscription.remove()
  }
}
