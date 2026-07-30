import { gql, useMutation } from '@apollo/client'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useContext, useEffect, useMemo } from 'react'

import { pushToken } from '../apollo/mutations'
import UserContext from '../context/User'
import { PUSH_NOTIFICATION_TOKEN } from '../singlevendor/apollo/mutations'
import { useAppMode } from './AppModeContext'
import { APP_MODES } from './constants'

const MULTIVENDOR_PUSH_TOKEN = gql`
  ${pushToken}
`

const ModeNotificationRegistration = () => {
  const { mode } = useAppMode()
  const { profile } = useContext(UserContext)
  const document = useMemo(
    () => mode === APP_MODES.SINGLE
      ? PUSH_NOTIFICATION_TOKEN
      : MULTIVENDOR_PUSH_TOKEN,
    [mode]
  )
  const [registerToken] = useMutation(document)

  useEffect(() => {
    if (!profile?._id || !Device.isDevice) return

    let cancelled = false
    const register = async() => {
      try {
        const { status } = await Notifications.getPermissionsAsync()
        if (status !== 'granted') return

        const projectId = Constants.expoConfig?.extra?.eas?.projectId
        if (!projectId) return
        const token = await Notifications.getExpoPushTokenAsync({ projectId })
        if (!cancelled && token?.data) {
          await registerToken({ variables: { token: token.data } })
        }
      } catch (error) {
        console.warn(
          `Notification registration failed for ${mode}:`,
          error?.message || error
        )
      }
    }

    register().catch(() => {})
    return () => {
      cancelled = true
    }
  }, [mode, profile?._id, registerToken])

  return null
}

export default ModeNotificationRegistration
