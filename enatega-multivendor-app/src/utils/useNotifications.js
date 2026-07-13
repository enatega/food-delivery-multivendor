import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Alert, Linking, Platform } from 'react-native'
import Constants from 'expo-constants'

const useNotifications = () => {
  const registerForPushNotificationsAsync = async () => {
    try {
      if (!Device.isDevice) {
        alert('Must use a physical device for push notifications')
        return null
      }

      // Get current permission status
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      // Request permission if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
        if (status !== 'granted') {
          return null
        }
      }

      // Get project ID and token
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId
      if (!projectId) {
        console.warn('Project ID not found')
        return null
      }

      const token = await Notifications.getExpoPushTokenAsync({ projectId })
      return token.data
    } catch (error) {
      console.error('Notification error:', error)
      return null
    }
  }

  return { registerForPushNotificationsAsync }
}

export default useNotifications
