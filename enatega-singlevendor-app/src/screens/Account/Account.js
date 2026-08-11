import React, { useState, useRef, useContext, useEffect, useMemo } from 'react'
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, Modal, ScrollView, AppState, Linking, Switch, ActivityIndicator } from 'react-native'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { scale } from '../../utils/scaling'
import { Deactivate, pushToken, updateNotificationStatus } from '../../apollo/mutations'
import { theme } from '../../utils/themeColors'
import UserContext from '../../context/User'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import styles from './styles'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { useNavigation } from '@react-navigation/native'
import analytics from '../../utils/analytics'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import Spinner from '../../components/Spinner/Spinner'
import ButtonContainer from '../../components/Account/ButtonContainer/ButtonContainer'
import LogoutModal from '../../components/Sidebar/LogoutModal/LogoutModal'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import LanguageModal, { languageTypes } from '../../components/LanguageModalize/LanguageModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'
import Constants from 'expo-constants'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'
import { Divider, ScreenHeader, useMultivendorTheme } from '../../ui/designSystem'

const PUSH_TOKEN = gql`
  ${pushToken}
`
const UPDATE_NOTIFICATION_TOKEN = gql`
  ${updateNotificationStatus}
`

const DEACTIVATE = gql`
  ${Deactivate}
`

function Account(props) {
  const Analytics = analytics()
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const [toggleView, setToggleView] = useState(true)
  const [showPass, setShowPass] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [lngModalVisible, setLngModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedLanguage, setselectedLanguage] = useState('')
  const [spinnerLoading, setSpinnerLoading] = useState(false)
  // Once the profile has rendered once, we never blank the screen for a
  // background refetch again (prevents the toggle-triggered content flicker).
  const hasLoadedProfileRef = useRef(false)
  const stableProfileRef = useRef(null)

  const [orderNotification, orderNotificationSetter] = useState()
  const [offerNotification, offerNotificationSetter] = useState()
  const [btnText, setBtnText] = useState(null)
  const [uploadToken] = useMutation(PUSH_TOKEN)
  const { logout } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const { isConnected: connect } = useNetworkStatus()
  const { profile, loadingProfile, errorProfile } = useContext(UserContext)
  const [mutate, { loading }] = useMutation(UPDATE_NOTIFICATION_TOKEN, {
    onCompleted,
    onError
  })

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const { tokens } = useMultivendorTheme()
  const accountTheme = useMemo(
    () => ({ ...tokens, isRTL: currentTheme.isRTL }),
    [currentTheme.isRTL, tokens]
  )
  const resolvedProfile = useMemo(() => {
    if (!profile) return stableProfileRef.current
    return {
      ...(stableProfileRef.current ?? {}),
      ...profile
    }
  }, [profile])
  const safeOrderNotification = orderNotification ?? resolvedProfile?.isOrderNotification ?? false
  const safeOfferNotification = offerNotification ?? resolvedProfile?.isOfferNotification ?? false

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  }, [])

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_PROFILE)
    }
    Track()
  }, [])
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
      passChecker: showPass,
      closeIcon: toggleView,
      closeModal: setToggleView,
      modalSetter: setModalVisible,
      passwordButton: setShowPass
    })
    checkPermission()
  }, [props.navigation, showPass, toggleView, themeContext.ThemeValue, selectedLanguage])

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange)
  }, [])

  useEffect(() => {
    if (profile) {
      stableProfileRef.current = {
        ...(stableProfileRef.current ?? {}),
        ...profile
      }
    }
  }, [profile])

  useEffect(() => {
    if (loading) return
    orderNotificationSetter(resolvedProfile?.isOrderNotification ?? false)
    offerNotificationSetter(resolvedProfile?.isOfferNotification ?? false)
  }, [loading, resolvedProfile])

  useEffect(() => {
    if (!lngModalVisible) {
      fetchSelectedLanguage()
    }
  }, [lngModalVisible])

  useEffect(() => {
    return () => {
      setSpinnerLoading(false)
    }
  }, [])

  const _handleAppStateChange = async(nextAppState) => {
    if (nextAppState === 'active') {
      let token = null
      const permission = await getPermission()
      if (permission === 'granted') {
        if (!resolvedProfile?.notificationToken) {
          token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId
          })
          uploadToken({ variables: { token: token.data } })
        }
        offerNotificationSetter(resolvedProfile?.isOfferNotification)
        orderNotificationSetter(resolvedProfile?.isOrderNotification)
      } else {
        offerNotificationSetter(false)
        orderNotificationSetter(false)
      }
    }
  }

  const fetchSelectedLanguage = async() => {
    const lang = await AsyncStorage.getItem('enatega-language-name')
    const systemLangCode = Localization?.locale?.split('-')[0]

    if (lang) {
      setselectedLanguage(lang)
    } else {
      // Find the language value based on the system language code
      const matchedLanguage = languageTypes.find((langType) => langType.code === systemLangCode)
      // Set to the language value if found, otherwise default to 'English'
      setselectedLanguage(matchedLanguage ? matchedLanguage.value : 'English')
    }
  }

  async function checkPermission() {
    const permission = await getPermission()
    if (permission !== 'granted') {
      offerNotificationSetter(false)
      orderNotificationSetter(false)
    } else {
      offerNotificationSetter(resolvedProfile?.isOfferNotification)
      orderNotificationSetter(resolvedProfile?.isOrderNotification)
    }
  }

  async function getPermission() {
    const { status } = await Notifications.getPermissionsAsync()
    return status
  }

  async function requestPermission() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    return finalStatus
  }

  function toggleTheme() {
    if (themeContext.ThemeValue === 'Pink') {
      themeContext.dispatch({ type: 'Dark' })
    } else {
      themeContext.dispatch({ type: 'Pink' })
    }
  }

  const onCompletedDeactivate = () => {
    setDeleteModalVisible(false)
    // The auth-gated navigator remounts to guest Discovery once logout clears
    // the token — no manual navigation.
    logout()
      .then(() => {
        FlashMessage({ message: t('accountDeactivated'), duration: 5000 })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const onErrorDeactivate = (error) => {
    if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    } else if (error.networkError) {
      FlashMessage({
        message: error.networkError.result.errors[0].message
      })
    } else {
      FlashMessage({
        message: "Couldn't delete account. Please try again later"
      })
    }
  }

  const [deactivated, { loading: deactivateLoading }] = useMutation(DEACTIVATE, {
    onCompleted: onCompletedDeactivate,
    onError: onErrorDeactivate
  })

  const handleCancel = () => {
    setModalVisible(false)
  }
  const handleLogout = async() => {
    try {
      setSpinnerLoading(true)
      setModalVisible(false)
      await Analytics.track(Analytics.events.USER_LOGGED_OUT)
      await Analytics.identify(null, null)
      // logout() clears the token; the auth-gated navigator remounts itself to
      // the guest Discovery screen. No manual navigation needed (doing both
      // caused the Login-flash -> Discovery -> refresh jank).
      await logout()
      FlashMessage({ message: t('logoutMessage') })
    } catch (error) {
      setSpinnerLoading(false)
      console.error('Error during logout:', error)
    }
  }
  const logoutClick = () => {
    setModalVisible(true)
  }

  async function deactivatewithemail() {
    try {
      await deactivated({
        variables: { isActive: false, email: resolvedProfile?.email }
      })
      setDeleteModalVisible(false)
      await logout()
      FlashMessage({ message: t('accountDeactivated') })
    } catch (error) {
      console.error('Error during deactivation mutation:', error)
    }
  }

  function onCompleted() {
    FlashMessage({
      message: t('notificationStatusUpdated')
    })
  }

  function onError(error) {
    try {
      FlashMessage({
        message: error.networkError.result.errors[0].message
      })
    } catch (err) {}
  }

  async function updateNotificationStatus(notificationCheck) {
    let orderNotify, offerNotify
    if (!Device.isDevice) {
      FlashMessage({
        message: t('notificationNotWork')
      })
      console.log('Device is not available, returning early')
      return
    }

    // Request permission if not granted
    const permission = await requestPermission()

    if (permission !== 'granted') {
      console.log('Permission not granted, opening settings')
      FlashMessage({
        message: t('notificationPermissionDenied') || 'Please enable notifications in Settings'
      })
      Linking.openSettings()
      return
    }

    // Get push token if not available
    if (!resolvedProfile?.notificationToken) {
      try {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId
        })
        await uploadToken({ variables: { token: token.data } })
      } catch (error) {
        console.log('Error getting push token:', error)
        FlashMessage({
          message: t('notificationTokenError') || 'Error setting up notifications'
        })
        return
      }
    }

    if (notificationCheck === 'offer') {
      console.log('Updating offer notification')
      offerNotify = !safeOfferNotification
      orderNotify = safeOrderNotification
      offerNotificationSetter(offerNotify)
    }

    if (notificationCheck === 'order') {
      console.log('Updating order notification')
      orderNotify = !safeOrderNotification
      offerNotify = safeOfferNotification
      orderNotificationSetter(orderNotify)
    }

    console.log('Calling mutate with variables:', {
      offerNotification: offerNotify,
      orderNotification: orderNotify
    })
    mutate({
      variables: {
        offerNotification: offerNotify,
        orderNotification: orderNotify
      }
    })
  }

  if (errorProfile) {
    FlashMessage({
      message: t('errorInProfile')
    })
  }

  // Show the full-screen loader ONLY until the profile has loaded the first
  // time. After that, background refetches (e.g. toggling a notification
  // preference) may briefly flip loadingProfile true or return undefined data
  // from the cache-first refetch — but we must never blank the screen again,
  // or all the content below the toggles disappears and flickers back.
  if (resolvedProfile) hasLoadedProfileRef.current = true
  if ((loadingProfile && !hasLoadedProfileRef.current) || spinnerLoading) return <Spinner backColor={currentTheme.CustomLoadingBG} spinnerColor={currentTheme.main} />

  if (!connect) return <ErrorView refetchFunctions={[]} />

  return (
    <>
      <View style={styles(currentTheme).formContainer}>
        <ScreenHeader title={t('Account')} border />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={styles(currentTheme).flex}>
          <ScrollView
            style={styles().flex}
            contentContainerStyle={styles(accountTheme).screenContent}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
          >
            <View style={styles(currentTheme).mainContainer}>
              <View style={styles(currentTheme).subContainer}>
                <View>
                  <ButtonContainer title={t('email')} detail={resolvedProfile?.email} status={resolvedProfile?.emailIsVerified ? 'verified' : 'notVerified'} onPress='null' />
                  <Divider insetStart={tokens.spacing.lg} insetEnd={tokens.spacing.lg} />
                  <ButtonContainer
                    title={t('phone')}
                    detail={resolvedProfile?.phone}
                    status={resolvedProfile?.phoneIsVerified ? 'verified' : 'notVerified'}
                    onPress={() =>
                      navigation.navigate('PhoneNumber', {
                        prevScreen: 'Account'
                      })
                    }
                  />
                  <Divider insetStart={tokens.spacing.lg} insetEnd={tokens.spacing.lg} />
                  <ButtonContainer
                    title={t('name')}
                    detail={resolvedProfile?.name}
                    status='null'
                    onPress={() =>
                      navigation.navigate('EditName', {
                        name: resolvedProfile?.name,
                        phone: resolvedProfile?.phone
                      })
                    }
                  />
                  <Divider insetStart={tokens.spacing.lg} insetEnd={tokens.spacing.lg} />
                  <ButtonContainer
                    title={t('language')}
                    detail={selectedLanguage}
                    status='null'
                    onPress={() => setLngModalVisible(true)}
                  />
                  <Divider insetStart={tokens.spacing.lg} insetEnd={tokens.spacing.lg} />
                  <ButtonContainer title={t('DeleteAccount')} detail={''} status='null' onPress={() => setDeleteModalVisible(true)} />
                </View>

                <View style={styles(currentTheme).mainContainerArea}>
                  <TextDefault
                    bolder
                    textColor={tokens.colors.textPrimary}
                    style={styles(accountTheme).sectionTitle}
                    isRTL
                  >
                    {t('titleSettings')}
                  </TextDefault>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles(accountTheme).preferenceRow}
                    onPress={() => {
                      updateNotificationStatus('order')
                      setBtnText('order')
                    }}
                  >
                    <TextDefault textColor={tokens.colors.textSecondary} style={styles(accountTheme).preferenceText} isRTL>
                      {t('receivePushNotification')}
                    </TextDefault>
                    {loading && btnText === 'order'
                      ? <ActivityIndicator size='small' color={tokens.colors.accent} />
                      : (
                        <Switch
                          trackColor={{ false: tokens.colors.surfaceElevated, true: tokens.colors.accent }}
                          thumbColor={tokens.isDark ? tokens.colors.textPrimary : '#ffffff'}
                          ios_backgroundColor={tokens.colors.surfaceElevated}
                          onValueChange={() => {
                            updateNotificationStatus('order')
                            setBtnText('order')
                          }}
                          value={safeOrderNotification}
                        />
                        )}
                  </TouchableOpacity>
                  <Divider insetStart={tokens.spacing.lg} insetEnd={tokens.spacing.lg} />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles(accountTheme).preferenceRow}
                    onPress={() => {
                      updateNotificationStatus('offer')
                      setBtnText('offer')
                    }}
                  >
                    <TextDefault textColor={tokens.colors.textSecondary} style={styles(accountTheme).preferenceText} isRTL>
                      {t('receiveOfferByEmail')}
                    </TextDefault>
                    <View style={styles(accountTheme).controlRow}>
                      {loading && btnText === 'offer' && <ActivityIndicator size='small' color={tokens.colors.accent} />}
                      <Switch
                        trackColor={{ false: tokens.colors.surfaceElevated, true: tokens.colors.accent }}
                        thumbColor={tokens.isDark ? tokens.colors.textPrimary : '#ffffff'}
                        ios_backgroundColor={tokens.colors.surfaceElevated}
                        onValueChange={() => {
                          updateNotificationStatus('offer')
                          setBtnText('offer')
                        }}
                        value={safeOfferNotification}
                      />
                    </View>
                  </TouchableOpacity>
                  <Divider insetStart={tokens.spacing.lg} insetEnd={tokens.spacing.lg} />
                  <TouchableOpacity activeOpacity={0.7} style={styles(accountTheme).preferenceRow} onPress={toggleTheme}>
                    <TextDefault textColor={tokens.colors.textSecondary} style={styles(accountTheme).preferenceText} isRTL>
                      {t('turnOnDarkTheme')}
                    </TextDefault>
                    <Switch
                      trackColor={{ false: tokens.colors.surfaceElevated, true: tokens.colors.accent }}
                      thumbColor={tokens.isDark ? tokens.colors.textPrimary : '#ffffff'}
                      ios_backgroundColor={tokens.colors.surfaceElevated}
                      onValueChange={toggleTheme}
                      value={themeContext.ThemeValue === 'Dark'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles(accountTheme).sectionBlock}>
                  <TextDefault bolder textColor={tokens.colors.textPrimary} style={styles(accountTheme).sectionTitle} isRTL>
                    {t('legal')}
                  </TextDefault>
                  <ButtonContainer
                    title={t('serviceTerms')}
                    detail={''}
                    status='null'
                    onPress={() => {
                      Linking.openURL('https://multivendor.enatega.com/terms')
                    }}
                  />
                  <Divider insetStart={tokens.spacing.lg} insetEnd={tokens.spacing.lg} />

                  <ButtonContainer
                    title={t('privacyPolicy')}
                    detail={''}
                    status='null'
                    onPress={() => {
                      Linking.openURL('https://multivendor.enatega.com/privacy')
                    }}
                  />
                </View>

                {/* <View style={styles().padding}>
                  <TextDefault
                    H2
                    bolder
                    textColor={currentTheme.fontThirdColor}
                  >
                    {t('legal')}
                  </TextDefault>
                </View> */}

                <View style={styles(accountTheme).containerButton}>
                  <TouchableOpacity activeOpacity={0.5} style={styles(accountTheme).addButton} onPress={logoutClick}>
                    <View style={styles(currentTheme).contentContainer}>
                      <TextDefault bold H5 textColor={tokens.colors.danger}>
                        {t('Logout')}
                      </TextDefault>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          <Modal
            onBackdropPress={() => setDeleteModalVisible(false)}
            onBackButtonPress={() => setDeleteModalVisible(false)}
            visible={deleteModalVisible}
            onRequestClose={() => {
              setDeleteModalVisible(false)
            }}
          >
            <View style={styles().centeredView}>
              <View style={styles(currentTheme).modalView}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 24,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: scale(10)
                  }}
                >
                  <TextDefault bolder H3 textColor={currentTheme.newFontcolor} isRTL>
                    {t('DeleteConfirmation')}
                  </TextDefault>
                  <Feather name='x-circle' size={24} color={currentTheme.newFontcolor} onPress={() => setDeleteModalVisible(!deleteModalVisible)} />
                </View>
                <TextDefault H5 textColor={currentTheme.newFontcolor} isRTL>
                  {t('permanentDeleteMessage')}
                </TextDefault>
                <TouchableOpacity style={[styles(currentTheme).btn, styles().btnDelete, { opacity: deactivateLoading ? 0.5 : 1 }]} onPress={deactivatewithemail} disabled={deactivateLoading}>
                  {deactivateLoading
                    ? (
                    <Spinner backColor='transparent' size='small' />
                      )
                    : (
                    <TextDefault bolder H4 textColor={currentTheme.white}>
                      {t('yesSure')}
                    </TextDefault>
                      )}
                </TouchableOpacity>
                <TouchableOpacity style={[styles(currentTheme).btn, styles().btnCancel]} onPress={() => setDeleteModalVisible(false)} disabled={deactivateLoading}>
                  <TextDefault bolder H4 textColor={currentTheme.black}>
                    {t('noDelete')}
                  </TextDefault>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <LogoutModal visible={modalVisible} onCancel={handleCancel} onLogout={handleLogout} showCrossButton />
          <LanguageModal currentTheme={currentTheme} modalVisible={lngModalVisible} setModalVisible={setLngModalVisible} setselectedLanguage={setselectedLanguage} showCrossButton />
        </KeyboardAvoidingView>
      </View>
    </>
  )
}

export default Account
