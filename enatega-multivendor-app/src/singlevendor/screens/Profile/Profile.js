import React, { useContext, useEffect } from 'react'
import { View, ScrollView, SafeAreaView, Platform, StatusBar, RefreshControl } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import UserContext from '../../../context/User'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import analytics from '../../../utils/analytics'

import ProfileHeader from '../../components/Profile/ProfileHeader'
import QuickActionsGrid from '../../components/Profile/QuickActionsGrid'
import PromoBanner from '../../components/Profile/PromoBanner'
import AccountSection from '../../components/Profile/AccountSection'
import HelpSection from '../../components/Profile/HelpSection'
import AccountManagement from '../../components/Profile/AccountManagement'
import FreeDeliveriesCountCard from '../../components/FreeDeliveries/FreeDeliveriesCountCard'

import styles from './styles'
import AuthContext from '../../../context/Auth'
import VendorModeToggle from '../../../components/VendorModeToggle/VendorModeToggle'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'

const Profile = () => {
  const Analytics = analytics()
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const { profile, refetchProfile } = useContext(UserContext)
  const { refreshing, handleRefresh, spinnerColor } = usePullToRefresh([refetchProfile])
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const { token, setToken } = useContext(AuthContext)
  console.log('Profile Data::', token)

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
      <ScrollView style={styles(currentTheme).scrollView} contentContainerStyle={styles(currentTheme).scrollContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={spinnerColor} colors={[spinnerColor]} />}>
        {/* Header with Welcome Message */}
        <ProfileHeader userName={profile?.name || 'User'} />
        {/* <VendorModeToggle></VendorModeToggle> */}
        {/* Quick Actions Grid */}
        <QuickActionsGrid />


        {/* Promo Banner */}
        {/* <PromoBanner /> */}
        <FreeDeliveriesCountCard currentTheme={currentTheme} />

        {/* Account Section */}
        <AccountSection />

        {/* Help & Support Section */}
        <HelpSection />

        {/* Account Management Section */}
        <AccountManagement />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
