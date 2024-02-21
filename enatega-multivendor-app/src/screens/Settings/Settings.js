import React, { useState, useContext, useEffect, useRef } from 'react'
import {
  AppState,
  View,
  TouchableOpacity,
  Platform,
  Linking,
  StatusBar,
  ActivityIndicator,
  Text
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Updates from 'expo-updates'
import * as Notifications from 'expo-notifications'
import * as Localization from 'expo-localization'
import Modal from 'react-native-modal'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { profile } from '../../apollo/queries'

import {
  pushToken,
  updateNotificationStatus,
  Deactivate
} from '../../apollo/mutations'

import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import styles from './styles'
import CheckboxBtn from '../../ui/FdCheckbox/CheckboxBtn'
import RadioButton from '../../ui/FdRadioBtn/RadioBtn'
import Spinner from '../../components/Spinner/Spinner'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import UserContext from '../../context/User'
import { Modalize } from 'react-native-modalize'
import { useNavigation } from '@react-navigation/native'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import * as Constants from 'expo-constants'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import * as Device from 'expo-device'
import AuthContext from '../../context/Auth'
import analytics from '../../utils/analytics'
import { Divider } from 'react-native-paper'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { MaterialIcons } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
import i18next from '../../../i18next'
import { useTranslation } from 'react-i18next'

const languageTypes = [
  { value: 'English', code: 'en', index: 0 },
  { value: 'français', code: 'fr', index: 1 },
  { value: 'ភាសាខ្មែរ', code: 'km', index: 2 },
  { value: '中文', code: 'zh', index: 3 },
  { value: 'Deutsche', code: 'de', index: 4 },
  { value: 'arabic', code: 'ar', index: 5 }
]

const PUSH_TOKEN = gql`
  ${pushToken}
`
const UPDATE_NOTIFICATION_TOKEN = gql`
  ${updateNotificationStatus}
`
const PROFILE = gql`
  ${profile}
`
const DEACTIVATE = gql`
  ${Deactivate}
`

const appVersion = Constants.default.expoConfig.version

function Settings(props) {
  const Analytics = analytics()

  const { token, setToken } = useContext(AuthContext)
  const {
    profile,
    loadingProfile,
    errorProfile,
    logout,
    isLoggedIn
  } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const { t } = useTranslation()

  const [languageName, languageNameSetter] = useState('English')
  const [orderNotification, orderNotificationSetter] = useState()
  const [offerNotification, offerNotificationSetter] = useState()
  const [modalVisible, modalVisibleSetter] = useState(false)
  const [loadinglang, setLoadingLang] = useState(false)
  const [activeRadio, activeRadioSetter] = useState(languageTypes[0].index)
  const [darkTheme, setDarkTheme] = useState(themeContext.ThemeValue === 'Dark')
  const [btnText, setBtnText] = useState(null)
  const navigation = useNavigation()
  const [appState, setAppState] = useState(AppState.currentState)
  const [uploadToken] = useMutation(PUSH_TOKEN)
  const [mutate, { loading }] = useMutation(UPDATE_NOTIFICATION_TOKEN, {
    onCompleted,
    onError,
    refetchQueries: [{ query: PROFILE }]
  })
  const [deactivated] = useMutation(DEACTIVATE)
  const modalizeRef = useRef(null)
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_SETTINGS)
    }
    Track()
  }, [])
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.firstHeaderBackground)
    }
    StatusBar.setBarStyle('light-content')
  }, [])

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View style={styles().backButton}>
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      ),
      headerTitle: t('titleSettings'),
      headerTitleAlign: 'center',
      headerTitleContainerStyle: {
        marginTop: '1%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        borderRadius: scale(10),
        backgroundColor: currentTheme.black,
        borderWidth: 1,
        borderColor: currentTheme.white,
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.themeBackground
      }
    })
    selectLanguage()
    checkPermission()
  }, [props.navigation, languageName])

  async function deactivatewithemail() {
    console.log('Calling deactivatewithemail')
    try {
      await deactivated({
        variables: { isActive: false, email: profile.email }
      })
      logout()
      navigation.reset({
        routes: [{ name: 'Main' }]
      })
      FlashMessage({ message: t('accountDeactivated') })
    } catch (error) {
      console.error('Error during deactivation mutation:', error)
    }
  }

  const _handleAppStateChange = async nextAppState => {
    if (nextAppState === 'active') {
      let token = null
      const permission = await getPermission()
      if (permission === 'granted') {
        if (!profile.notificationToken) {
          token = await Notifications.getExpoPushTokenAsync()
          uploadToken({ variables: { token: token.data } })
        }
        offerNotificationSetter(profile.isOfferNotification)
        orderNotificationSetter(profile.isOrderNotification)
      } else {
        offerNotificationSetter(false)
        orderNotificationSetter(false)
      }
    }
    setAppState(nextAppState)
  }

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange)
  }, [])

  async function checkPermission() {
    const permission = await getPermission()
    if (permission !== 'granted') {
      offerNotificationSetter(false)
      orderNotificationSetter(false)
    } else {
      offerNotificationSetter(profile.isOfferNotification)
      orderNotificationSetter(profile.isOrderNotification)
    }
  }

  async function getPermission() {
    const { status } = await Notifications.getPermissionsAsync()
    return status
  }
  const onClose = () => {
    modalizeRef.current.close()
  }
  function toggleTheme() {
    if (themeContext.ThemeValue === 'Pink') {
      themeContext.dispatch({ type: 'Dark' })
    } else themeContext.dispatch({ type: 'Pink' })
    setDarkTheme(!darkTheme)
  }

  async function selectLanguage() {
    const lang = await AsyncStorage.getItem('enatega-language')
    console.log(lang)
    if (lang) {
      const defLang = languageTypes.findIndex(el => el.code === lang)
      const langName = languageTypes[defLang].value
      activeRadioSetter(defLang)
      languageNameSetter(langName)
    }
  }

  async function onSelectedLanguage() {
    try {
      // Display loading indicator
      setLoadingLang(true)
      const languageInd = activeRadio
      await AsyncStorage.setItem(
        'enatega-language',
        languageTypes[languageInd].code
      )

      var lang = await AsyncStorage.getItem('enatega-language')
      if (lang) {
        const defLang = languageTypes.findIndex(el => el.code === lang)
        const langName = languageTypes[defLang].value
        languageNameSetter(langName)
      }
      i18next.changeLanguage(lang)
      modalVisibleSetter(false)
    } catch (error) {
      console.error('Error during language selection:', error)
    } finally {
      setLoadingLang(false)
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
    } catch (err) { }
  }

  async function updateNotificationStatus(notificationCheck) {
    let orderNotify, offerNotify
    if (!Device.isDevice) {
      FlashMessage({
        message: t('notificationNotWork')
      })
      return
    }

    const permission = await getPermission()
    if (!profile.notificationToken || permission !== 'granted') {
      Linking.openSettings()
    }
    if (notificationCheck === 'offer') {
      offerNotificationSetter(!offerNotification)
      orderNotify = orderNotification
      offerNotify = !offerNotification
    }

    if (notificationCheck === 'order') {
      orderNotificationSetter(!orderNotification)
      orderNotify = !orderNotification
      offerNotify = offerNotification
    }
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
  if (loadingProfile) return <Spinner />
  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={[styles().flex, styles(currentTheme).mainContainer]}>
      <View style={styles().flex}>
        {/* {Platform.OS === 'android' && ( */}
        <View style={[styles(currentTheme).languageContainer, styles().shadow]}>
          <View style={styles().changeLanguage}>
            <View style={styles().width85}>
              <TextDefault
                numberOfLines={1}
                textColor={currentTheme.fontSecondColor}>
                {t('languageSetting')}
              </TextDefault>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => modalVisibleSetter(true)}
              style={styles().button}>
              <MaterialIcons
                name="edit"
                size={25}
                color={currentTheme.tagColor}
              />
            </TouchableOpacity>
          </View>
          <TextDefault textColor={currentTheme.fontMainColor} bolder H5 B700>
            {languageName}
          </TextDefault>
        </View>
        {/* )
        } */}
        <View style={styles(currentTheme).mainContainerArea}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              updateNotificationStatus('offer')
              setBtnText('offer')
            }}
            style={[styles(currentTheme).notificationContainer]}>
            <View style={styles(currentTheme).notificationChekboxContainer}>
              <TextDefault
                numberOfLines={1}
                textColor={currentTheme.darkBgFont}
                style={alignment.MLsmall}>
                {' '}
                {t('receiveSpecialOffers')}{' '}
              </TextDefault>
              <View>
                <CheckboxBtn
                  checked={offerNotification}
                  onPress={() => {
                    updateNotificationStatus('offer')
                    setBtnText('offer')
                  }}
                />
              </View>
            </View>
            {loading && btnText === 'offer' && (
              <View>
                <Spinner size="small" backColor="transparent" />
              </View>
            )}
          </TouchableOpacity>
          <Divider
            style={{
              backgroundColor: currentTheme.darkBgFont,
              width: '90%',
              alignSelf: 'center'
            }}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              updateNotificationStatus('order')
              setBtnText('order')
            }}
            style={[styles(currentTheme).notificationContainer]}>
            <View style={styles().notificationChekboxContainer}>
              <TextDefault
                numberOfLines={1}
                textColor={currentTheme.darkBgFont}
                style={alignment.MLsmall}>
                {' '}
                {t('getUpdates')}{' '}
              </TextDefault>
              <View>
                <CheckboxBtn
                  checked={orderNotification}
                  onPress={() => {
                    updateNotificationStatus('order')
                    setBtnText('order')
                  }}
                />
              </View>
            </View>
            {loading && btnText === 'order' && (
              <View>
                <Spinner size="small" backColor="transparent" />
              </View>
            )}
          </TouchableOpacity>
          <Divider
            style={{
              backgroundColor: currentTheme.darkBgFont,
              width: '90%',
              alignSelf: 'center'
            }}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => toggleTheme()}
            style={[styles(currentTheme).notificationContainer]}>
            <View style={styles().notificationChekboxContainer}>
              <TextDefault
                numberOfLines={1}
                textColor={currentTheme.darkBgFont}
                style={alignment.MLsmall}>
                {' '}
                {t('turnOnDarkTheme')}{' '}
              </TextDefault>
              <View>
                <CheckboxBtn
                  checked={darkTheme}
                  onPress={() => toggleTheme()}
                />
              </View>
            </View>
          </TouchableOpacity>
          <Divider
            style={{
              backgroundColor: currentTheme.darkBgFont,
              width: '90%',
              alignSelf: 'center'
            }}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => toggleTheme()}
            style={[styles(currentTheme).notificationContainer]}>
            <View style={styles().notificationChekboxContainer}>
              <View style={styles().buttonContainer}>
                <TouchableOpacity
                  style={styles().deleteButton}
                  onPress={() => {
                    modalizeRef.current.open('top')
                  }}>
                  <Ionicons name="trash-outline" size={30} color={'white'} />
                  <Text style={styles(currentTheme).deleteButtonText}>
                    {t('DELETEACCOUNT')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles().versionContainer}>
          <TextDefault textColor={currentTheme.statusSecondColor}>
            Version: {appVersion}
          </TextDefault>
        </View>
      </View>

      {/* Modal for language Changes */}

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => modalVisibleSetter(false)}
        onBackButtonPress={() => modalVisibleSetter(false)}>
        <View style={styles(currentTheme).modalContainer}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            bolder
            H5
            style={alignment.MBsmall}>
            {t('selectLanguage')}
          </TextDefault>

          {languageTypes.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              onPress={() => activeRadioSetter(item.index)}
              style={[styles(currentTheme).radioContainer]}>
              <RadioButton
                animation={'bounceIn'}
                size={13}
                outerColor={currentTheme.radioOuterColor}
                innerColor={currentTheme.radioColor}
                isSelected={activeRadio === item.index}
                onPress={() => activeRadioSetter(item.index)}
              />
              <TextDefault
                numberOfLines={1}
                textColor={currentTheme.fontMainColor}
                bold
                style={alignment.MLsmall}>
                {item.value}
              </TextDefault>
            </TouchableOpacity>
          ))}
          <View style={styles().modalButtonsContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles().modalButtons}
              onPress={() => modalVisibleSetter(false)}>
              <TextDefault
                numberOfLines={1}
                textColor={currentTheme.tagColor}
                small
                bolder
                uppercase>
                {t('Cancel')}
              </TextDefault>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles().modalButtons}
              onPress={() => onSelectedLanguage()}>
              <TextDefault
                textColor={currentTheme.tagColor}
                bolder
                uppercase
                small>
                {t('Select')}
              </TextDefault>
            </TouchableOpacity>
          </View>
          {loadinglang && (
            <View style={styles().loadingContainer}>
              <ActivityIndicator size="large" color={currentTheme.tagColor} />
            </View>
          )}
        </View>
      </Modal>
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        handlePosition="inside"
        avoidKeyboardLikeIOS={Platform.select({
          ios: true,
          android: true
        })}
        keyboardAvoidingOffset={2}
        keyboardAvoidingBehavior="height">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: currentTheme.backgroundColor3
          }}>
          <TextDefault
            bolder
            H5
            textColor={currentTheme.darkBgFont}
            style={{ marginTop: 20 }}>
            {t('DeleteConfirmation')}
          </TextDefault>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: currentTheme.main,
              borderRadius: 10,
              width: '70%',
              padding: 15,
              ...alignment.MTlarge
            }}
            onPress={deactivatewithemail}>
            <TextDefault center bold>
              {t('DeleteAccount')}
            </TextDefault>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ width: '100%', paddingTop: 30, paddingBottom: 40 }}
            onPress={() => onClose()}>
            <TextDefault textColor={currentTheme.darkBgFont} center>
              {' '}
              {t('Cancel')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </Modalize>
    </SafeAreaView>
  )
}
export default Settings
