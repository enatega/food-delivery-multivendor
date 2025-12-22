import React, { useContext, useEffect } from 'react'
import {
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native'
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

import styles from './styles'

const Profile = () => {
  const Analytics = analytics()
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_PROFILE)
    }
    Track()
  }, [])

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Welcome Message */}
        <ProfileHeader userName={profile?.name || 'User'} />

        {/* Quick Actions Grid */}
        <QuickActionsGrid />

        {/* Promo Banner */}
        <PromoBanner />

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
