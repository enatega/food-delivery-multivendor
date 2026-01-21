import React, { useContext, useEffect, useLayoutEffect } from 'react'
import { View, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import UserContext from '../../../context/User'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import analytics from '../../../utils/analytics'
import styles from './styles'
import MainImage from '../../components/UserOnBoarding/MainImage'
import MainHeading from '../../components/UserOnBoarding/MainHeading'
import Actions from '../../components/UserOnBoarding/Actions'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


const UserOnboarding = () => {
  const Analytics = analytics()
  const { t, i18n } = useTranslation()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation])

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  })

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_PROFILE)
    }
    Track()
  }, [])

  

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <ScrollView style={styles(currentTheme).scrollView} contentContainerStyle={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles(currentTheme, insets).onBoardingContainer}>
          <MainHeading />
          <MainImage />
          <Actions t={t} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default UserOnboarding
