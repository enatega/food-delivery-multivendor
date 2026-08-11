import React, { useContext } from 'react'
import { SafeAreaView, Platform, Share, Alert, Clipboard } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import UserContext from '../../../context/User'
import OrdersContext from '../../../context/Orders'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { ReferHeader, ShopNowState, InviteState } from '../../components/ReferAFriend'

import styles from './styles'

const ReferAFriend = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const { profile } = useContext(UserContext)
  const { orders } = useContext(OrdersContext)
  console.log("Orders in refer friend:", orders)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const referralCode = profile?.referralCode || ''
  const appDownloadUrl =
    process.env.EXPO_PUBLIC_APP_DOWNLOAD_URL || 'https://enatega.com'
  const hasOrders = orders && orders.length > 0

  const handleCopyCode = async (code) => {
    // Direct copy using Share API
    const referralCodeToUse = code

    Clipboard.setString(referralCodeToUse)
    FlashMessage({ message: `${t('Referral code copied')}: ${referralCodeToUse}` })
    // try {
    //   await Share.share({
    //     message: referralCodeToUse
    //   })
    // } catch (error) {
    //   // If share is cancelled, show alert
    //   Alert.alert(
    //     t('Referral Code'),
    //     referralCodeToUse,
    //     [{ text: t('OK') }]
    //   )
    // }
  }

  const handleShare = async (referralCode) => {
    const shareMessage = t('Join me on this amazing food delivery app! Use my referral code {{code}} and get 1 free delivery. Download now: {{url}}', {
      code: referralCode,
      url: appDownloadUrl
    })

    try {
      if (Platform.OS === 'ios') {
        await Share.share({
          message: shareMessage,
          url: `${appDownloadUrl}?referral=${encodeURIComponent(referralCode)}`
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
    navigation.navigate('SVDiscovery')
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <ReferHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
      />

      {hasOrders ? (
        <InviteState
          currentTheme={currentTheme}
          referralCode={referralCode}
          onCopyCode={handleCopyCode}
          onShare={handleShare}
        />
      ) : (
        <ShopNowState
          currentTheme={currentTheme}
          onStartShopping={handleStartShopping}
        />

      )}
    </SafeAreaView>
  )
}

export default ReferAFriend
