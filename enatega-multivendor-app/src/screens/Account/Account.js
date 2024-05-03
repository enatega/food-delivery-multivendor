import React, {
  useState,
  useRef,
  useContext,
  useLayoutEffect,
  useEffect,
  useMemo
} from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  FlatList,
  ScrollView,
  AppState,
  Linking
} from 'react-native'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { TextField, OutlinedTextField } from 'react-native-material-textfield'
import { scale, verticalScale } from '../../utils/scaling'
import { updateUser, login, Deactivate } from '../../apollo/mutations'
import {
  FavouriteRestaurant,
  recentOrderRestaurantsQuery,
  profile
} from '../../apollo/queries'
import ChangePassword from './ChangePassword'
import { theme } from '../../utils/themeColors'
import UserContext from '../../context/User'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import styles from './styles'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import {
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native'
import analytics from '../../utils/analytics'
import {
  Feather,
  Entypo,
  MaterialIcons,
  Ionicons,
  EvilIcons
} from '@expo/vector-icons'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { useTranslation } from 'react-i18next'
import Spinner from '../../components/Spinner/Spinner'
import MainRestaurantCard from '../../components/Main/MainRestaurantCard/MainRestaurantCard'
import { useQuery } from '@apollo/client'
import { LocationContext } from '../../context/Location'
import NewRestaurantCard from '../../components/Main/RestaurantCard/NewRestaurantCard'
import Item from '../../components/Main/Item/Item'
import ButtonContainer from '../../components/Account/ButtonContainer/ButtonContainer'
import OrderAgainCard from '../../components/Profile/OrderAgainCard/OrderAgainCard'
import OrdersContext from '../../context/Orders'
import { pushToken, updateNotificationStatus } from '../../apollo/mutations'
import CheckboxBtn from '../../ui/FdCheckbox/CheckboxBtn'
import LogoutModal from '../../components/Sidebar/LogoutModal/LogoutModal'
import * as Notifications from 'expo-notifications'

const PUSH_TOKEN = gql`
  ${pushToken}
`
const UPDATE_NOTIFICATION_TOKEN = gql`
  ${updateNotificationStatus}
`

const UPDATEUSER = gql`
  ${updateUser}
`
const DEACTIVATE = gql`
  ${Deactivate}
`

const RESTAURANTS = gql`
  ${FavouriteRestaurant}
`
const PROFILE = gql`
  ${profile}
`

function Account(props) {
  const Analytics = analytics()
  const navigation = useNavigation()
  const route = useRoute()
  const { params } = route
  const { t } = useTranslation()
  const refName = useRef()
  const [nameError, setNameError] = useState('')
  const [toggleEmailView, setToggleEmailView] = useState(true)
  const [toggleNameView, setToggleNameView] = useState(params?.editName)
  const [toggleView, setToggleView] = useState(true)
  // const [modelVisible, setModalVisible] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const { location } = useContext(LocationContext)

  const { logout } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const backScreen = props.route.params ? props.route.params.backScreen : null

  const [orderNotification, orderNotificationSetter] = useState()
  const [offerNotification, offerNotificationSetter] = useState()
  const [darkTheme, setDarkTheme] = useState(themeContext.ThemeValue === 'Dark')
  const [btnText, setBtnText] = useState(null)
  const [appState, setAppState] = useState(AppState.currentState)
  const [uploadToken] = useMutation(PUSH_TOKEN)

  const { profile, loadingProfile, errorProfile } = useContext(UserContext)

  const [mutate, { loading }] = useMutation(UPDATE_NOTIFICATION_TOKEN, {
    onCompleted,
    onError,
    refetchQueries: [{ query: PROFILE }]
  })

  const [deactivated, { loading: deactivateLoading }] = useMutation(
    DEACTIVATE,
    {
      onCompleted: onCompletedDeactivate,
      onError: onErrorDeactivate
    }
  )

  const onCompletedDeactivate = () => {
    setDeleteModalVisible(false)
    logout()
    navigation.reset({
      routes: [{ name: 'Main' }]
    })
    FlashMessage({ message: t('accountDeactivated'), duration: 5000 })
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

  const handleCancel = () => {
    setModalVisible(false)
  }
  const handleLogout = async () => {
    setModalVisible(false)
    await Analytics.track(Analytics.events.USER_LOGGED_OUT)
    await Analytics.identify(null, null)
    logout()
    navigation.closeDrawer()
    FlashMessage({ message: t('logoutMessage') })
  }
  const logoutClick = () => {
    setModalVisible(true)
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
      <Spinner
        backColor={currentTheme.CustomLoadingBG}
        spinnerColor={currentTheme.main}
      />
    )

  const _handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'active') {
      let token = null
      const permission = await getPermission()
      if (permission === 'granted') {
        if (!profile.notificationToken) {
          token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId
          })
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

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
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
  useEffect(() => {
    props.navigation.setOptions({
      title: t('Account'),
      headerRight: null,
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
      },
      passChecker: showPass,
      closeIcon: toggleView,
      closeModal: setToggleView,
      modalSetter: setModalVisible,
      passwordButton: setShowPass,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View>
              <MaterialIcons
                name='arrow-back'
                size={25}
                color={currentTheme.newIconColor}
              />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
    checkPermission()
  }, [props.navigation, showPass, toggleView, themeContext.ThemeValue])

  async function deactivatewithemail() {
    try {
      setDeleteModalVisible(false)
      setDeleteConfirmationModalVisible(true)
      await deactivated({
        variables: { isActive: false, email: profile?.email }
      })
    } catch (error) {
      console.error('Error during deactivation mutation:', error)
    }
  }

  const handleTermsPress = () => {
    Linking.openURL('https://enatega.com/')
  }

  return (
    <>
      {/* <ChangePassword
        modalVisible={modelVisible}
        hideModal={() => {
          setModalVisible(false)
        }}
      /> */}
      <View style={styles(currentTheme).formContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles(currentTheme).flex}
        >
          <ScrollView
            style={styles().flex}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
          >
            <View style={styles(currentTheme).mainContainer}>
              <View>
                <TextDefault H2 bolder textColor={currentTheme.fontThirdColor}>
                  {t('Account')}
                </TextDefault>
              </View>

              <View style={styles(currentTheme).subContainer}>
                <View>
                  <ButtonContainer
                    title={t('email')}
                    detail={profile?.email}
                    onPress='none'
                  />
                  <ButtonContainer
                    title={t('phone')}
                    detail={profile?.phone}
                    onPress='none'
                  />
                  <ButtonContainer
                    title={t('name')}
                    detail={profile?.name}
                    onPress='none'
                  />
                  <ButtonContainer
                    title={t('DeleteAccount')}
                    detail={''}
                    onPress={() => setDeleteModalVisible(true)}
                  />
                </View>

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
                          <Spinner
                            size='small'
                            backColor='transparent'
                            spinnerColor={currentTheme.main}
                          />
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
                      <View
                        style={
                          styles(currentTheme).notificationChekboxContainer
                        }
                      >
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
                          <Spinner
                            size='small'
                            backColor='transparent'
                            spinnerColor={currentTheme.main}
                          />
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
                        checked={darkTheme}
                        onPress={() => toggleTheme()}
                      />
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => toggleTheme()}
                    >
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
                {/* </View> */}

                <View style={styles().legalView}>
                  <TextDefault
                    H2
                    bolder
                    textColor={currentTheme.fontThirdColor}
                  >
                    {t('legal')}
                  </TextDefault>
                  <ButtonContainer
                    title={t('serviceTerms')}
                    detail={''}
                    onPress={() => {
                      Linking.openURL('https://enatega.com/')
                    }}
                  />
                </View>

                <View style={styles().legalView}>
                  <TextDefault
                    H2
                    bolder
                    textColor={currentTheme.fontThirdColor}
                  >
                    {t('legal')}
                  </TextDefault>
                  <ButtonContainer
                    title={t('serviceTerms')}
                    detail={''}
                    onPress={() => {
                      Linking.openURL('https://enatega.com/')
                    }}
                  />
                </View>

                {/* <View> */}
                  <View style={styles(currentTheme).containerButton}>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={styles(currentTheme).addButton}
                      onPress={logoutClick}
                    >
                      <View style={styles(currentTheme).contentContainer}>
                        <TextDefault
                          bold
                          H5
                        >
                          {t('Logout')}
                        </TextDefault>
                      </View>
                    </TouchableOpacity>
                  </View>
                {/* </View> */}

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
                  <TextDefault bolder H3 textColor={currentTheme.newFontcolor}>
                    {t('DeleteConfirmation')}
                  </TextDefault>
                  <Feather
                    name='x-circle'
                    size={24}
                    color={currentTheme.newFontcolor}
                    onPress={() => setDeleteModalVisible(!deleteModalVisible)}
                  />
                </View>
                <TextDefault H5 textColor={currentTheme.newFontcolor}>
                  {t('permanentDeleteMessage')}
                </TextDefault>
                <TouchableOpacity
                  style={[
                    styles(currentTheme).btn,
                    styles().btnDelete,
                    { opacity: deactivateLoading ? 0.5 : 1 }
                  ]}
                  onPress={deactivatewithemail}
                  disabled={deactivateLoading}
                >
                  {deactivateLoading ? (
                    <Spinner backColor='transparent' size='small' />
                  ) : (
                    <TextDefault bolder H4 textColor={currentTheme.white}>
                      {t('yesSure')}
                    </TextDefault>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles(currentTheme).btn, styles().btnCancel]}
                  onPress={() => setDeleteModalVisible(false)}
                  disabled={deactivateLoading}
                >
                  <TextDefault bolder H4 textColor={currentTheme.black}>
                    {t('noDelete')}
                  </TextDefault>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <LogoutModal
            visible={modalVisible}
            onCancel={handleCancel}
            onLogout={handleLogout}
          />
        </KeyboardAvoidingView>
      </View>
    </>
  )
}

export default Account
