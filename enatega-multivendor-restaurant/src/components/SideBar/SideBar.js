import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  ImageBackground,
  Platform,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  AppState
} from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import { colors } from '../../utilities/colors'
import bg from '../../assets/restBackground.png'
import styles from './styles'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { useAccount } from '../../ui/hooks'
import { Image } from 'react-native-elements'
import useNotification from '../../ui/hooks/useNotification'
import { PRODUCT_URL, PRIVACY_URL, ABOUT_URL } from '../../utilities'
import { useNavigation } from '@react-navigation/native';
import i18next from '../../../i18n'
import {useTranslation} from 'react-i18next'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

export default function SideBar() {
  const {t} = useTranslation()
  const notificationRef = useRef(true)
  const openSettingsRef = useRef(false)
  const { logout, data, toggleSwitch, isAvailable } = useAccount()
  const [notificationStatus, setNotificationStatus] = useState(false)
  const appState = useRef(AppState.currentState)
  const navigation = useNavigation();
  const {
    restaurantData,
    getPermission,
    getExpoPushToken,
    requestPermission,
    sendTokenToBackend
  } = useNotification()

  useEffect(() => {
    const checkToken = async () => {
      if (restaurantData) {
        setNotificationStatus(restaurantData.restaurant.enableNotification)
        if (
          restaurantData.restaurant.enableNotification &&
          notificationRef.current
        ) {
          const permissionStatus = await getPermission()
          if (permissionStatus.granted) {
            setNotificationStatus(true)
            const token = (await getExpoPushToken()).data
            sendTokenToBackend({ variables: { token, isEnabled: true } })
          }
        }
        notificationRef.current = false
      }
    }
    checkToken()
  }, [restaurantData])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const checkTokenOnFocus = async () => {
          if (
            !notificationStatus &&
            (await getPermission()).granted &&
            openSettingsRef.current
          ) {
            setNotificationStatus(true)
            const token = (await getExpoPushToken()).data
            sendTokenToBackend({ variables: { token, isEnabled: true } })
          }
        }
        if (!notificationRef.current) checkTokenOnFocus()
      }

      appState.current = nextAppState
    })
    return () => {
      subscription && subscription.remove()
    }
  }, [])

  const handleClick = async () => {
    if (notificationStatus === false) {
      const permissionStatus = await getPermission()
      if (permissionStatus.granted) {
        setNotificationStatus(true)
        const token = (await getExpoPushToken()).data
        sendTokenToBackend({ variables: { token, isEnabled: true } })
      } else if (permissionStatus.canAskAgain) {
        const result = await requestPermission()
        if (result.granted) {
          setNotificationStatus(true)
          const token = (await getExpoPushToken()).data
          sendTokenToBackend({ variables: { token, isEnabled: true } })
        }
      } else {
        openSettingsRef.current = true
        Platform.OS === 'ios'
          ? Linking.openURL('app-settings:')
          : Linking.openSettings()
      }
    } else {
      setNotificationStatus(false)
      sendTokenToBackend({ variables: { token: null, isEnabled: false } })
    }
  }
  const handleSettingsClick = () => {
  navigation.navigate('Language');
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={bg} resizeMode="cover" style={styles.image}>
        <View style={styles.topContainer}>
          <View style={styles.profileContainer}>
            <View style={styles.avatar}>
              <Image
                source={{ uri: data && data.restaurant.image }}
                containerStyle={styles.item}
                style={{ borderRadius: 5 }}
                PlaceholderContent={<ActivityIndicator />}
              />
            </View>
            <View style={{ width: '50%' }}>
              <TextDefault
                H5
                bolder
                center
                textColor="white"
                style={{ marginLeft: 10, textAlign: 'left' }}>
                {data && data.restaurant.name}
              </TextDefault>
            </View>
          </View>
        </View>
        <View style={styles.middleContainer}>
          <View style={styles.status}>
            <TextDefault H4 bolder textColor="white">
              {t('status')}
            </TextDefault>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextDefault textColor="white" style={{ marginRight: 5 }}>
                {isAvailable ? t('online') : t('closed')}
              </TextDefault>
              <Switch
                trackColor={{
                  false: colors.fontSecondColor,
                  true: colors.green
                }}
                thumbColor={isAvailable ? colors.headerBackground : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isAvailable}
                style={{ marginTop: Platform.OS === 'android' ? -15 : -5 }}
              />
            </View>
          </View>
          <View style={styles.status}>
            <TextDefault H4 bolder textColor="white">
              {t('notifications')}
            </TextDefault>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextDefault textColor="white" style={{ marginRight: 5 }}>
                {notificationStatus ? t('onn') : t('off')}
              </TextDefault>
              <Switch
                trackColor={{
                  false: colors.fontSecondColor,
                  true: colors.green
                }}
                thumbColor={
                  notificationStatus ? colors.headerBackground : '#f4f3f4'
                }
                ios_backgroundColor="#3e3e3e"
                onValueChange={handleClick}
                value={notificationStatus}
                style={{ marginTop: Platform.OS === 'android' ? -15 : -5 }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.logout}
            activeOpacity={0.8}
            onPress={() =>
              Linking.canOpenURL(PRODUCT_URL).then(() => {
                Linking.openURL(PRODUCT_URL)
              })
            }>
            <View style={styles.icon}>
              <Icon
                type="font-awesome"
                color="white"
                name="product-hunt"
                size={26}
              />
            </View>
            <TextDefault H4 bolder style={styles.text}>
              {t('productPage')}
            </TextDefault>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logout}
            activeOpacity={0.8}
            onPress={() =>
              Linking.canOpenURL(
                'https://enatega.com/privacy-policy/'
              ).then(() => {
                Linking.openURL(
                  'https://enatega.com/privacy-policy/'
                )
              })
            }>
            <View style={styles.icon}>
              <Icon type="font-awesome" color="white" name="lock" size={26} />
            </View>

            <TextDefault H4 bolder style={styles.text}>
              {t('privacyPolicy')}
            </TextDefault>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logout}
            activeOpacity={0.8}
            onPress={() =>
              Linking.canOpenURL(ABOUT_URL).then(() => {
                Linking.openURL(ABOUT_URL)
              })
            }>
            <View style={styles.icon}>
              <Icon
                type="font-awesome"
                color="white"
                name="info-circle"
                size={26}
              />
            </View>
            <TextDefault H4 bolder style={styles.text}>
              {t('aboutUs')}
            </TextDefault>
          </TouchableOpacity>

        </View>
        <View style={styles.lowerContainer}>
          <TouchableOpacity style={styles.logout} onPress={logout}>
            <View style={styles.icon}>
              <Icon type="entypo" color="white" name="log-out" size={26} />
            </View>
            <TextDefault H4 bolder style={styles.text}>
            {t('titleLogout')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}