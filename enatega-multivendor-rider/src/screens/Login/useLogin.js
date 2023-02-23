import { useContext, useState } from 'react'
import { Dimensions } from 'react-native'
import { riderLogin } from '../../apollo/mutations'
import { AuthContext } from '../../context/auth'
import { FlashMessage } from '../../components/FlashMessage/FlashMessage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { gql, useMutation } from '@apollo/client'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'

const RIDER_LOGIN = gql`
  ${riderLogin}
`

const useLogin = () => {
  const [username, setUsername] = useState('rider1')
  const [password, setPassword] = useState('123123')
  const [showPassword, setShowPassword] = useState(true)
  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const { height } = Dimensions.get('window')

  const { setTokenAsync } = useContext(AuthContext)

  const [mutate, { loading }] = useMutation(RIDER_LOGIN, {
    onCompleted,
    onError
  })

  function validateForm() {
    let result = true
    setUsernameError('')
    setPasswordError('')

    if (!username) {
      setUsernameError('Username is required!')
      result = false
    }
    if (!password) {
      setPasswordError('Password is required!')
      result = false
    }
    return result
  }

  async function onCompleted(data) {
    FlashMessage({ message: 'Logged in' })
    await AsyncStorage.setItem('rider-id', data.riderLogin.userId)
    await setTokenAsync(data.riderLogin.token)
  }
  function onError(error) {
    console.log('error', JSON.stringify(error))
    let message = 'Check internet connection'
    try {
      message = error.message
    } catch (error) {}
    FlashMessage({ message: message })
  }

  async function onSubmit() {
    if (validateForm()) {
      const settings = await Notifications.getPermissionsAsync()
      let notificationPermissions = { ...settings }

      if (
        settings?.status !== 'granted' ||
        settings.ios?.status !==
          Notifications.IosAuthorizationStatus.PROVISIONAL
      ) {
        notificationPermissions = await Notifications.requestPermissionsAsync({
          ios: {
            allowProvisional: true,
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true
          }
        })
      }
      let notificationToken = null
      if (
        (notificationPermissions?.status === 'granted' ||
          notificationPermissions.ios?.status ===
            Notifications.IosAuthorizationStatus.PROVISIONAL) &&
        Device.isDevice
      ) {
        notificationToken = (await Notifications.getExpoPushTokenAsync()).data
      }
      mutate({
        variables: {
          username: username.toLowerCase(),
          password: password,
          notificationToken: notificationToken
        }
      })
    }
  }
  return {
    username,
    setUsername,
    password,
    setPassword,
    usernameError,
    passwordError,
    onSubmit,
    showPassword,
    setShowPassword,
    loading,
    height
  }
}

export default useLogin
