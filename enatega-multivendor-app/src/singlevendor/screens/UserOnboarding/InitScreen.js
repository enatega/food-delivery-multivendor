import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect } from 'react'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import UserContext from '../../../context/User'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'

const InitScreen = () => {
    const themeContext = useContext(ThemeContext)
    const { t, i18n } = useTranslation()
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const navigation = useNavigation()
  const { isLoggedIn, loadingProfile } = useContext(UserContext)

 
    
    
  useEffect(() => {
    if (loadingProfile) return
    if (isLoggedIn) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Main'
          }
        ]
      })
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'UserOnboarding'
          }
        ]
      })
    }

    return () => {}
  }, [loadingProfile])

  return (
    <SafeAreaView style={[styles(currentTheme).container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator />
    </SafeAreaView>
  )
}

export default InitScreen
