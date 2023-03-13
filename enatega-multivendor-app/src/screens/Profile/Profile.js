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
  ScrollView,
  Platform,
  StatusBar,
  Text
} from 'react-native'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { TextField } from 'react-native-material-textfield'
import { scale } from '../../utils/scaling'
import { updateUser } from '../../apollo/mutations'
import i18n from '../../../i18n'
import ChangePassword from './ChangePassword'
import { theme } from '../../utils/themeColors'
import UserContext from '../../context/User'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import styles from './styles'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { textStyles } from '../../utils/textStyles'
import screenOptions from './screenOptions'
import { useFocusEffect } from '@react-navigation/native'
import Analytics from '../../utils/analytics'
import { Feather } from '@expo/vector-icons'
const UPDATEUSER = gql`
  ${updateUser}
`

function Profile(props) {
  const refName = useRef()

  const [nameError, setNameError] = useState('')
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
    props.navigation.setOptions(
      screenOptions({
        title: profile.name,
        fontColor: currentTheme.headerText,
        backColor: currentTheme.headerBackground,
        passChecker: showPass,
        closeIcon: toggleView,
        closeModal: setToggleView,
        modalSetter: setModalVisible,
        passwordButton: setShowPass
      })
    )
  }, [props.navigation, showPass, toggleView])

  useEffect(() => {
    if (backScreen) {
      viewHideAndShow()
    }
  }, [backScreen])

  function viewHideAndShow() {
    setToggleView(prev => !prev)
  }

  function onCompleted({ updateUser }) {
    if (updateUser) {
      FlashMessage({
        message: "User's Info Updated"
      })
      if (backScreen) {
        props.navigation.goBack()
      }
    }
  }

  function validateInfo() {
    // clear errors
    setNameError('')

    const name = refName.current.value()

    if (name === profile.name) {
      return
    }

    let res = true
    if (!name.trim()) {
      refName.current.focus()
      setNameError('Name is required')
      res = false
    }
    return res
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

  function changePasswordTab() {
    return (
      <View style={styles().containerInfo}>
        <TextDefault textColor={currentTheme.fontSecondColor} small>
          {profile.name}
        </TextDefault>

        <View style={styles().flexRow}>
          <TextDefault
            style={{ ...alignment.MTxSmall }}
            textColor={currentTheme.fontSecondColor}
            small>
            {profile.email}
          </TextDefault>
        </View>

        <View style={styles().flexRow}>
          <TextDefault
            style={{ ...alignment.MTxSmall }}
            textColor={currentTheme.fontSecondColor}
            small>
            {profile.phone}
          </TextDefault>
          {profile.phone !== '' && (
            <TextDefault
              textColor={
                profile.phoneIsVerified
                  ? currentTheme.iconColorPink
                  : currentTheme.textErrorColor
              }>
              {profile.phoneIsVerified ? 'Verified' : 'UnVerified'}
            </TextDefault>
          )}
        </View>
      </View>
    )
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
          style={styles().flex}>
          <ScrollView style={styles().flex}>
            <View style={styles(currentTheme).formSubContainer}>
              <View style={styles().containerHeading}>
                <View style={styles().headingTitle}>
                  <TextDefault
                    // style={{ fontSize: scale(13)}}
                    textColor={currentTheme.fontMainColor}
                    H5
                    B700
                    bolder>
                    Contact info
                  </TextDefault>
                </View>
                {toggleView && (
                  <View style={styles().headingLink}>
                    <TouchableOpacity
                      activeOpacity={0.3}
                      style={styles().headingButton}
                      onPress={viewHideAndShow}>
                      <TextDefault
                        textColor={currentTheme.tagColor}
                        small
                        B700
                        bolder
                        uppercase>
                        Edit
                      </TextDefault>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {toggleView ? (
                changePasswordTab()
              ) : (
                <View style={styles().containerInfo}>
                  <View>
                    <View style={{ margin: scale(0) }}></View>
                    <TextField
                      label={i18n.t('name')}
                      ref={refName}
                      defaultValue={profile.name}
                      autoFocus={true}
                      labelFontSize={scale(12)}
                      fontSize={scale(12)}
                      maxLength={20}
                      textColor={currentTheme.fontMainColor}
                      baseColor={currentTheme.fontSecondColor}
                      errorColor={currentTheme.textErrorColor}
                      tintColor={!nameError ? currentTheme.tagColor : 'red'}
                      labelTextStyle={{
                        ...textStyles.Small,
                        ...textStyles.Bolder,
                        paddingTop: scale(1)
                      }}
                      error={nameError}
                    />

                    <View style={{ ...alignment.MTlarge }}></View>
                    <View style={{ ...alignment.MTxSmall }}>
                      <TextDefault bold>Email</TextDefault>
                    </View>
                    <View>
                      <TextDefault>{profile.email}</TextDefault>
                    </View>
                    <View style={{ ...alignment.MTlarge }}></View>
                    <View style={{ ...alignment.MTxSmall }}>
                      <TextDefault bold>Phone</TextDefault>
                    </View>
                    <View style={{ ...alignment.MTxSmall }}></View>

                    <View style={styles().flexRow}>
                      <View>
                        <TextDefault>{profile.phone}</TextDefault>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        {(profile.phone === '' || !profile.phoneIsVerified) && (
                          <TouchableOpacity
                            onPress={() =>
                              props.navigation.navigate(
                                profile.phone === ''
                                  ? 'PhoneNumber'
                                  : 'PhoneOtp',
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
                                ? 'Add Phone'
                                : profile.phoneIsVerified
                                  ? 'Verified'
                                  : 'Verify?'}
                            </TextDefault>
                          </TouchableOpacity>
                        )}
                        {profile.phone !== '' && (
                          <Feather
                            style={{ marginLeft: 10, marginTop: -5 }}
                            name="edit"
                            size={20}
                            color={currentTheme.iconColorPink}
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

                  <TouchableOpacity
                    disabled={loadingMutation}
                    activeOpacity={0.7}
                    style={styles(currentTheme).saveContainer}
                    onPress={() => {
                      if (validateInfo()) {
                        mutate({
                          variables: {
                            name: refName.current.value(),
                            phone: profile.phone
                          }
                        })
                      }
                    }}>
                    <TextDefault
                      textColor={currentTheme.buttonText}
                      bolder
                      B700
                      small
                      uppercase
                      style={[alignment.MTsmall, alignment.MBsmall]}>
                      {'Update'}
                    </TextDefault>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
       </View>
           </>
  )
}

export default Profile
