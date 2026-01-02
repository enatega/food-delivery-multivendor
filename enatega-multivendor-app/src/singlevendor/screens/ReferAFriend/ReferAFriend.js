import React, { useContext } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Share,
  Alert,
  Image
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons, AntDesign } from '@expo/vector-icons'

import UserContext from '../../../context/User'
import OrdersContext from '../../../context/Orders'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

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

  const renderContent = () => {
    if (!hasOrders) {
      // State 2: Shop now, refer later
      return (
        <View style={styles(currentTheme).contentContainer}>
          <View style={styles(currentTheme).illustrationContainer}>
            <Image
              source={require('../../assets/images/refer-a-friend-1.png')}
              style={styles(currentTheme).illustration}
              resizeMode="contain"
            />
          </View>

          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={styles(currentTheme).title}
            bolder
            H5
          >
            {t('Shop now, refer later')}
          </TextDefault>

          <TextDefault
            textColor={currentTheme.colorTextMuted}
            style={styles(currentTheme).description}
            center
            bold
          >
            {t('You need to have placed at least one order with FAST before you can invite friends.')}
          </TextDefault>

          <TouchableOpacity
            style={styles(currentTheme).primaryButton}
            onPress={handleStartShopping}
            activeOpacity={0.7}
          >
            <TextDefault
              textColor={currentTheme.colorTextPrimary}
              style={styles(currentTheme).buttonText}
              bold
            >
              {t('Start shopping')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      )
    }

    // State 3: Invite & Enjoy Free Delivery
    return (
      <View style={styles(currentTheme).contentContainer}>
        <View style={styles(currentTheme).illustrationContainer}>
          <Image
            source={require('../../assets/images/refer-a-friend-2.png')}
            style={styles(currentTheme).illustration}
            resizeMode="contain"
          />
        </View>

        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={styles(currentTheme).title}
          bolder
        >
          {t('Invite & Enjoy Free Delivery')}
        </TextDefault>

        <TextDefault
          textColor={currentTheme.colorTextMuted}
          style={styles(currentTheme).description}
          center
          bold
        >
          {t('You and your friend each get 1 free delivery when they try the app.')}
        </TextDefault>

        <View style={styles(currentTheme).codeContainer}>
          <TouchableOpacity
            style={styles(currentTheme).codeBox}
            onPress={handleCopyCode}
            activeOpacity={0.7}
          >
            <Ionicons
              name="copy-outline"
              size={20}
              color={currentTheme.colorTextPrimary}
              style={styles(currentTheme).codeIcon}
            />
            <TextDefault
              textColor={currentTheme.colorTextPrimary}
              style={styles(currentTheme).codeText}
              bold
              
            >
              {referralCode}
            </TextDefault>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles(currentTheme).shareButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Ionicons
            name="share-social-outline"
            size={20}
            color={currentTheme.white}
            style={styles(currentTheme).shareIcon}
          />
          <TextDefault
            textColor={currentTheme.white}
            style={styles(currentTheme).buttonText}
            bold
          >
            {t('Share invite link')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <View style={styles(currentTheme).header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles(currentTheme).backButton}
          activeOpacity={0.7}
        >
          <View style={styles(currentTheme).backButtonCircle}>
            <AntDesign
              name="arrowleft"
              size={20}
              color={currentTheme.fontMainColor}
            />
          </View>
        </TouchableOpacity>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={styles(currentTheme).headerTitle}
          bolder
        >
          {t('Refer a friend')}
        </TextDefault>
        <View style={styles(currentTheme).headerRight} />
      </View>

      {renderContent()}
    </SafeAreaView>
  )
}

export default ReferAFriend
