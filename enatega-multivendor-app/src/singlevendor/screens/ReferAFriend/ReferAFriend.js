import React, { useContext } from 'react'
import { SafeAreaView, Platform, Share, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import UserContext from '../../../context/User'
import OrdersContext from '../../../context/Orders'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { ReferHeader, ShopNowState, InviteState } from '../../components/ReferAFriend'

import styles from './styles'

const ReferAFriend = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const { profile } = useContext(UserContext)
  const { orders } = useContext(OrdersContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const referralCode = profile?.referralCode || 'ASD32F' // TODO: Get from backend
  const hasOrders = orders && orders.length > 0

  const handleCopyCode = async () => {
    // Direct copy using Share API
    try {
      await Share.share({
        message: referralCode
      })
    } catch (error) {
      // If share is cancelled, show alert
      Alert.alert(
        t('Referral Code'),
        referralCode,
        [{ text: t('OK') }]
      )
    }
  }

  const handleShare = async () => {
    const shareMessage = t('Join me on this amazing food delivery app! Use my referral code {{code}} and get 1 free delivery. Download now: {{url}}', {
      code: referralCode,
      url: 'https://yourapp.com/download' // TODO: Replace with actual app URL
    })

    try {
      if (Platform.OS === 'ios') {
        await Share.share({
          message: shareMessage,
          url: `https://yourapp.com/referral/${referralCode}` // TODO: Replace with actual URL
        })
      } else {
        await Share.share({
          message: shareMessage,
          title: t('Invite & Enjoy Free Delivery')
        })
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handleStartShopping = () => {
    navigation.navigate('Discovery')
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <ReferHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
      />

      {!hasOrders ? (
        <ShopNowState
          currentTheme={currentTheme}
          onStartShopping={handleStartShopping}
        />
      ) : (
        <InviteState
          currentTheme={currentTheme}
          referralCode={referralCode}
          onCopyCode={handleCopyCode}
          onShare={handleShare}
        />
      )}
    </SafeAreaView>
  )
}

export default ReferAFriend
