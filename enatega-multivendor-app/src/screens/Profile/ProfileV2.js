import React, {
  useState,
  useRef,
  useContext,
  useLayoutEffect,
  useEffect
} from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text
} from 'react-native'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { TextField, OutlinedTextField } from 'react-native-material-textfield'
import { scale } from '../../utils/scaling'
import { updateUser, login } from '../../apollo/mutations'
import ChangePassword from './ChangePassword'
import { theme } from '../../utils/themeColors'
import UserContext from '../../context/User'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import styles from './styles'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { useFocusEffect } from '@react-navigation/native'
import analytics from '../../utils/analytics'
import { Feather } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { useTranslation } from 'react-i18next'

const UPDATEUSER = gql`
  ${updateUser}
`

function Profile(props) {
  const Analytics = analytics()

  const { t } = useTranslation()
  const refName = useRef()
  const [nameError, setNameError] = useState('')
  const [toggleEmailView, setToggleEmailView] = useState(true)
  const [toggleNameView, setToggleNameView] = useState(true)
  const [toggleView, setToggleView] = useState(true)
  const [modelVisible, setModalVisible] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const backScreen = props.route.params ? props.route.params.backScreen : null
  const [mutate, { loading: loadingMutation }] = useMutation(UPDATEUSER, {
    onCompleted,
    onError
  })

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_PROFILE)
    }
    Track()
  }, [])
  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: t('titleProfile'),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleContainerStyle: {
        marginTop: '1%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        backgroundColor: currentTheme.black,
        borderWidth: 1,
        borderColor: currentTheme.white,
        borderRadius: scale(10),
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.headerBackground,
        shadowColor: 'transparent',
        shadowRadius: 0
      },
      passChecker: showPass,
      closeIcon: toggleView,
      closeModal: setToggleView,
      modalSetter: setModalVisible,
      passwordButton: setShowPass,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View style={styles().bacKButton}>
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props.navigation, showPass, toggleView])

  useEffect(() => {
    if (backScreen) {
      viewHideAndShowName()
      viewHideAndShowEmail()
    }
  }, [backScreen])

  function viewHideAndShowName() {
    setToggleNameView(prev => !prev)
  }
  function viewHideAndShowEmail() {
    setToggleEmailView(prev => !prev)
  }

  function onCompleted({ updateUser }) {
    if (updateUser) {
      FlashMessage({
        message: t('userInfoUpdated')
      })
      if (backScreen) {
        props.navigation.goBack()
      }
    }
  }

  const validateName = async () => {
    setNameError('')

    const name = refName.current.value()

    if (name !== profile.name) {
      if (!name.trim()) {
        refName.current.focus()
        setNameError(t('nameError'))
        return false
      }

      try {
        await mutate({
          variables: {
            name: name
          }
        })
      } catch (error) {
        return false
      }
    }

    return true
  }

  const updateName = async () => {
    const isValid = await validateName()
    if (isValid) {
      await mutate({
        variables: {
          name: refName.current.value(),
          phone: profile.phone
        }
      })
    }
  }

  const handleNamePress = () => {
    viewHideAndShowName()
  }
  const handleNamePressUpdate = async () => {
    await updateName()
    viewHideAndShowName()
  }

  function onError(error) {
    try {
      if (error.graphQLErrors) {
        FlashMessage({
          message: error.graphQLErrors[0].message
        })
      } else if (error.networkError) {
        FlashMessage({
          message: error.networkError.result.errors[0].message
        })
      }
    } catch (err) {}
  }

  function changeNameTab() {
    return (
      <>
        <View style={styles(currentTheme).containerInfo}>
          <TextDefault
            textColor={currentTheme.iconColor}
            style={{ fontSize: scale(13) }}
            bolder>
            {profile.name}
          </TextDefault>
        </View>
      </>
    )
  }

  function changeEmailTab() {
    return (
      <>
        <View style={styles(currentTheme).containerInfo}>
          <View style={styles(currentTheme).flexRow}>
            <TextDefault
              style={{ fontSize: scale(13) }}
              textColor={currentTheme.iconColor}
              bolder>
              {profile.email}
            </TextDefault>
          </View>
        </View>
      </>
    )
  }

  function changePasswordTab() {
    return (
      <>
        <View style={styles(currentTheme).containerInfo}>
          <TextDefault
            textColor={currentTheme.iconColor}
            style={{ fontSize: scale(13) }}
            bolder>
            ***********
          </TextDefault>
        </View>
      </>
    )
  }

  function changePhoneTab() {
    return (
      <>
        <View style={styles(currentTheme).containerInfo}>
          <View style={styles(currentTheme).flexRow}>
            <TextDefault
              style={{ fontSize: scale(13) }}
              textColor={currentTheme.iconColor}
              bolder>
              {profile.phone}
            </TextDefault>
          </View>
          {profile.phone !== '' && (
            <View
              style={[
                styles().verifiedButton,
                {
                  backgroundColor: profile.phoneIsVerified
                    ? currentTheme.main
                    : currentTheme.buttonText
                }
              ]}>
              <TextDefault textColor={currentTheme.white}>
                {profile.phoneIsVerified ? t('verified') : t('unverified')}
              </TextDefault>
            </View>
          )}
        </View>
      </>
    )
  }

  const showModal = () => {
    setModalVisible(true)
  }

  return (
    <>
      <ChangePassword
        modalVisible={modelVisible}
        hideModal={() => {
          setModalVisible(false)
        }}
      />
      <Text style={styles(currentTheme).titleContainer}>
        {t('profileDetail')}
      </Text>
      <View style={styles(currentTheme).formContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles(currentTheme).flex}>
          <View style={styles(currentTheme).formSubContainer}>
            <View style={styles(currentTheme).containerHeading}>
              {toggleNameView && (
                <>
                  <View style={styles(currentTheme).headingTitle}>
                    <TextDefault
                      H5
                      B700
                      bolder
                      textColor={currentTheme.darkBgFont}
                      style={styles(currentTheme).textAlignLeft}>
                      {t('name')}
                    </TextDefault>
                  </View>

                  <View style={styles().headingLink}>
                    <TouchableOpacity
                      activeOpacity={0.3}
                      style={styles().headingButton}
                      onPress={handleNamePress}>
                      <MaterialIcons
                        name="edit"
                        size={25}
                        color={currentTheme.darkBgFont}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
            {toggleNameView ? (
              changeNameTab()
            ) : (
              <View>
                <View style={styles(currentTheme).containerHeading}>
                  <View style={styles(currentTheme).headingTitle}>
                    <TextDefault
                      H5
                      B700
                      bolder
                      style={styles(currentTheme).textAlignLeft}>
                      {t('name')}
                    </TextDefault>
                  </View>
                </View>
                <View style={{ marginTop: 10 }}>
                  <OutlinedTextField
                    ref={refName}
                    defaultValue={profile.name}
                    autoFocus={true}
                    maxLength={20}
                    textColor={currentTheme.fontMainColor}
                    baseColor={currentTheme.fontSecondColor}
                    errorColor={currentTheme.textErrorColor}
                    tintColor={!nameError ? currentTheme.black : 'red'}
                    error={nameError}
                  />
                </View>

                <TouchableOpacity
                  disabled={loadingMutation}
                  activeOpacity={0.7}
                  style={styles(currentTheme).saveContainer}
                  onPress={handleNamePressUpdate}>
                  <TextDefault style={styles(currentTheme).textAlignLeft}>
                    {t('update')}
                  </TextDefault>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* email */}
          <View style={styles(currentTheme).formSubContainer}>
            <View style={styles().containerHeading}>
              <>
                <View style={styles().headingTitle}>
                  <TextDefault
                    H5
                    B700
                    bolder
                    textColor={currentTheme.darkBgFont}
                    style={styles(currentTheme).textAlignLeft}>
                    {t('email')}
                  </TextDefault>
                </View>
              </>
            </View>
            {changeEmailTab()}
          </View>

          {/* password */}
          <View style={styles(currentTheme).formSubContainer}>
            <View style={styles().containerHeading}>
              <>
                <View style={styles().headingTitle}>
                  <TextDefault
                    H5
                    B700
                    bolder
                    textColor={currentTheme.darkBgFont}
                    style={styles(currentTheme).textAlignLeft}>
                    {t('password')}
                  </TextDefault>
                </View>

                <View style={styles().headingLink}>
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={styles().headingButton}
                    onPress={showModal}>
                    <MaterialIcons
                      name="edit"
                      size={25}
                      color={currentTheme.darkBgFont}
                    />
                  </TouchableOpacity>
                </View>
              </>
            </View>
            {changePasswordTab()}
          </View>

          {/* phone */}
          <View style={styles(currentTheme).formSubContainer}>
            <View style={styles().containerHeading}>
              {toggleView && (
                <>
                  <View style={styles().headingTitle}>
                    <TextDefault
                      H5
                      B700
                      bolder
                      textColor={currentTheme.darkBgFont}
                      style={styles(currentTheme).textAlignLeft}>
                      {t('mobile')}
                    </TextDefault>
                  </View>
                  <View style={styles().headingLink}>
                    <TouchableOpacity
                      activeOpacity={0.3}
                      style={styles().headingButton}
                      onPress={() =>
                        props.navigation.navigate('PhoneNumber', {
                          prevScreen: 'Profile'
                        })
                      }>
                      <MaterialIcons
                        name="edit"
                        size={25}
                        color={currentTheme.darkBgFont}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
            {toggleView ? (
              changePhoneTab()
            ) : (
              <View>
                <View style={styles().containerHeading}>
                  <View style={styles().headingTitle}>
                    <TextDefault
                      textColor={currentTheme.fontMainColor}
                      H5
                      B700
                      bolder
                      style={styles(currentTheme).textAlignLeft}>
                      {t('mobile')}
                    </TextDefault>
                  </View>
                </View>

                <View>
                  <View style={{ ...alignment.MTxSmall }}></View>

                  <View style={styles().flexRow}>
                    <View>
                      <TextDefault>{profile.phone}</TextDefault>
                    </View>
                    <View style={styles().phoneDetailsContainer}>
                      {(profile.phone === '' || !profile.phoneIsVerified) && (
                        <TouchableOpacity
                          onPress={() =>
                            props.navigation.navigate(
                              profile.phone === '' ? 'PhoneNumber' : 'PhoneOtp',
                              { prevScreen: 'Profile' }
                            )
                          }
                          disabled={
                            profile.phoneIsVerified && profile.phone !== ''
                          }>
                          <TextDefault
                            bolder
                            textColor={
                              profile.phoneIsVerified
                                ? currentTheme.startColor
                                : currentTheme.textErrorColor
                            }>
                            {profile.phone === ''
                              ? t('addPhone')
                              : profile.phoneIsVerified
                              ? t('verified')
                              : t('verify')}
                          </TextDefault>
                        </TouchableOpacity>
                      )}
                      {profile.phone !== '' && (
                        <Feather
                          style={{ marginLeft: 10, marginTop: -5 }}
                          name="check"
                          size={20}
                          color={currentTheme.black}
                          onPress={() =>
                            props.navigation.navigate('PhoneNumber', {
                              prevScreen: 'Profile'
                            })
                          }
                        />
                      )}
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  )
}

export default Profile
