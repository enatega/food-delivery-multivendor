import React, { useState, useContext, useEffect, useRef } from 'react'
import {
  AppState,
  View,
  TouchableOpacity,
  Platform,
  Linking,
  StatusBar,
  ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import Modal from 'react-native-modal'
import { SafeAreaView } from 'react-native-safe-area-context'
import { profile } from '../../apollo/queries'

import {
  pushToken,
  updateNotificationStatus,
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
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import * as Constants from 'expo-constants'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import * as Device from 'expo-device'
import analytics from '../../utils/analytics'
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
  { value: 'العربية', code: 'ar', index: 5 },
  { value: 'עִברִית', code: 'he', index: 6 }
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

const appVersion = Constants.default.expoConfig.version

function Settings(props) {
  const Analytics = analytics()

  const {
    profile,
    loadingProfile,
    errorProfile,
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
  const [appState, setAppState] = useState(AppState.currentState)
  const [uploadToken] = useMutation(PUSH_TOKEN)
  const [mutate, { loading }] = useMutation(UPDATE_NOTIFICATION_TOKEN, {
    onCompleted,
    onError,
    refetchQueries: [{ query: PROFILE }]
  })

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_SETTINGS)
    }
    Track()
  }, [])
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  }, [])

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View>
              <MaterialIcons name="arrow-back" size={25} color={currentTheme.newIconColor} />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      ),
      headerTitle: t('titleSettings'),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        elevation: 0
      }
    })
    selectLanguage()
    checkPermission()
  }, [props.navigation, languageName, themeContext.ThemeValue])

  const _handleAppStateChange = async nextAppState => {
    if (nextAppState === 'active') {
      let token = null
      const permission = await getPermission()
      if (permission === 'granted') {
        if (!profile.notificationToken) {
          token = await Notifications.getExpoPushTokenAsync({  projectId: Constants.expoConfig.extra.eas.projectId})
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

  function toggleTheme() {
    if (themeContext.ThemeValue === 'Pink') {
      themeContext.dispatch({ type: 'Dark' })
    } else themeContext.dispatch({ type: 'Pink' })
    setDarkTheme(!darkTheme)
  }

  async function selectLanguage() {
    const lang = await AsyncStorage.getItem('enatega-language')
    if (lang) {
      const defLang = languageTypes.findIndex((el) => el.code === lang)
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
        const defLang = languageTypes.findIndex((el) => el.code === lang)
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
    } catch (err) {}
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
  if (loadingProfile)
    return (
      <Spinner backColor={currentTheme.CustomLoadingBG} spinnerColor={currentTheme.main} />
    )
  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={[styles().flex, styles(currentTheme).mainContainer]}
    >
      <View style={styles().flex}>
        <TouchableOpacity style={[styles(currentTheme).languageContainer]} onPress={() => modalVisibleSetter(true)}>
          <View style={{ flex: 1 }}>
            <View style={styles().changeLanguage}>
              <View>
                <TextDefault
                  numberOfLines={1}
                  textColor={currentTheme.fontSecondColor}
                >
                  {t('language')}
                </TextDefault>
              </View>
            </View>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bolder
              H5
              B700
              left
            >
              {languageName}
            </TextDefault>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => modalVisibleSetter(true)}
              style={styles().button}
            >
              <TextDefault H5 bold textColor={currentTheme.editProfileButton}>
                {t('edit')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View style={styles(currentTheme).mainContainerArea}>
          <View
            style={[
              styles(currentTheme).languageContainer,
              styles().checkboxSettings
            ]}
          >
            <View>
              <CheckboxBtn
                checked={orderNotification}
                onPress={() => {
                  updateNotificationStatus('order')
                  setBtnText('order')
                }}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                updateNotificationStatus('order')
                setBtnText('order')
              }}
            >
              <View style={styles().notificationChekboxContainer}>
                <TextDefault
                  numberOfLines={1}
                  textColor={currentTheme.darkBgFont}
                  style={alignment.MLsmall}
                >
                  {' '}
                  {t('receivePushNotification')}{' '}
                </TextDefault>
              </View>
              {loading && btnText === 'order' && (
                <View>
                  <Spinner size='small' backColor='transparent' spinnerColor={currentTheme.main} />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles(currentTheme).languageContainer,
              styles().checkboxSettings
            ]}
          >
            <View>
              <CheckboxBtn
                checked={offerNotification}
                onPress={() => {
                  updateNotificationStatus('offer')
                  setBtnText('offer')
                }}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                updateNotificationStatus('offer')
                setBtnText('offer')
              }}
            >
              <View style={styles(currentTheme).notificationChekboxContainer}>
                <TextDefault
                  numberOfLines={1}
                  textColor={currentTheme.darkBgFont}
                  style={alignment.MLsmall}
                >
                  {' '}
                  {t('receiveOfferByEmail')}{' '}
                </TextDefault>
              </View>
              {loading && btnText === 'offer' && (
                <View>
                  <Spinner size='small' backColor='transparent' spinnerColor={currentTheme.main} />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles(currentTheme).languageContainer,
              styles().checkboxSettings
            ]}
          >
            <View>
              <CheckboxBtn checked={darkTheme} onPress={() => toggleTheme()} />
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => toggleTheme()}>
              <View style={styles().notificationChekboxContainer}>
                <TextDefault
                  numberOfLines={1}
                  textColor={currentTheme.darkBgFont}
                  style={alignment.MLsmall}
                >
                  {' '}
                  {t('turnOnDarkTheme')}{' '}
                </TextDefault>
              </View>
            </TouchableOpacity>
          </View>
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
        onBackButtonPress={() => modalVisibleSetter(false)}
      >
        <View style={styles(currentTheme).modalContainer}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            bolder
            H5
            style={alignment.MBsmall}
          >
            {t('selectLanguage')}
          </TextDefault>

          {languageTypes.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              onPress={() => activeRadioSetter(item.index)}
              style={[styles(currentTheme).radioContainer]}
            >
              <RadioButton
                animation={'bounceIn'}
                size={13}
                outerColor={currentTheme.iconColorDark}
                innerColor={currentTheme.main}
                isSelected={activeRadio === item.index}
                onPress={() => activeRadioSetter(item.index)}
              />
              <TextDefault
                numberOfLines={1}
                textColor={currentTheme.fontMainColor}
                bold
                style={alignment.MLsmall}
              >
                {item.value}
              </TextDefault>
            </TouchableOpacity>
          ))}
          <View style={styles().modalButtonsContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles().modalButtons}
              onPress={() => modalVisibleSetter(false)}
            >
              <TextDefault
                numberOfLines={1}
                textColor={currentTheme.main}
                small
                bolder
                uppercase
              >
                {t('Cancel')}
              </TextDefault>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles().modalButtons}
              onPress={() => onSelectedLanguage()}
            >
              <TextDefault
                textColor={currentTheme.main}
                bolder
                uppercase
                small
              >
                {t('Select')}
              </TextDefault>
            </TouchableOpacity>
          </View>
          {loadinglang && (
            <View style={styles().loadingContainer}>
              <ActivityIndicator size='large' color={currentTheme.tagColor} />
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  )
}
export default Settings
