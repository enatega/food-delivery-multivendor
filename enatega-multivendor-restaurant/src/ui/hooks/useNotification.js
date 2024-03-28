import { useEffect } from 'react'
import { useMutation, useQuery, gql } from '@apollo/client'
import { Platform } from 'react-native'
import { saveToken, restaurantInfo } from '../../apollo'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { useTranslation } from 'react-i18next'

export default function useNotification() {
  const { t } = useTranslation()
  // get permission
  // request permission
  // send token to backend
  // toggle notification status
  // restaurant current permission on backend

  const { data } = useQuery(
    gql`
      ${restaurantInfo}
    `,
    { fetchPolicy: 'network-only' }
  )
  const [sendTokenToBackend, { loading }] = useMutation(
    gql`
      ${saveToken}
    `
  )
  useEffect(() => {
    registerForPushNotificationsAsync()
  }, [])
  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      alert(t('notificationText'))
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: true,
        lightColor: '#FF231F7C'
      })
    }
  }

  return {
    getPermission: Notifications.getPermissionsAsync,
    requestPermission: Notifications.requestPermissionsAsync,
    getExpoPushToken: Notifications.getExpoPushTokenAsync,
    sendTokenToBackend,
    restaurantData: data,
    savingToken: loading
  }
}
