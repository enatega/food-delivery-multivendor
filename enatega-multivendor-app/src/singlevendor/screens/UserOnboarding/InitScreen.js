import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect } from 'react'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import UserContext from '../../../context/User'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'

const InitScreen = () => {
  const themeContext = useContext(ThemeContext)
  const { t, i18n } = useTranslation()
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const navigation = useNavigation()
  const { isLoggedIn, authReady } = useContext(UserContext)
  console.log('isLoading ::: init Screen', isLoggedIn, authReady)

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token')
      console.log('Init Screen:', token)
      navigation.reset({
        index: 0,
        routes: [{ name: token ? 'Main' : 'UserOnboarding' }]
      })
    }
    init()
  }, [])

  return (
    <SafeAreaView style={[styles(currentTheme).container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator />
    </SafeAreaView>
  )
}

export default InitScreen
