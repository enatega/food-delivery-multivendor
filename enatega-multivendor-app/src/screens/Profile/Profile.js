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
  TextInput,
  ImageBackground
} from 'react-native'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { scale } from '../../utils/scaling'
import { updateUser } from '../../apollo/mutations'
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
import { Feather, Entypo, FontAwesome, Zocial } from '@expo/vector-icons'
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
  useEffect(async() => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_PROFILE)
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

  function showUserInfo() {
    return (
      <View style={styles().containerInfo}>
        <View style={styles().flexRow}>
          <View style={styles().icon}>
            <FontAwesome name="user" size={15} color="black" />
          </View>
          <View style={styles().details}>
            <TextDefault textColor={currentTheme.fontMainColor} small>
              {profile.name}
            </TextDefault>
          </View>
        </View>
        <View style={styles().flexRow}>
          <View style={styles().icon}>
            <Zocial name="email" size={15} color="black" />
          </View>
          <View style={styles().details}>
            <TextDefault textColor={currentTheme.fontMainColor} small>
              {profile.email}
            </TextDefault>
          </View>
        </View>

        <View style={styles().flexRow}>
          <View style={styles().icon}>
            <Entypo name="phone" size={15} color="black" />
          </View>
          <View style={styles().details}>
            <TextDefault textColor={currentTheme.fontMainColor} small>
              {profile.phone}
            </TextDefault>
          </View>
          {profile.phone !== '' && (
            <View
              style={{
                backgroundColor: '#F8A492',
                marginLeft: 10,
                padding: 5,
                borderRadius: 5
              }}>
              <TextDefault textColor={currentTheme.fontMainColor} small>
                {profile.phoneIsVerified ? 'Verified' : 'UnVerified'}
              </TextDefault>
            </View>
          )}
        </View>
      </View>
    )
  }
  return (
    <>
      <ChangePassword
        modalVisible={modelVisible}
        hideModal={() => {
          setModalVisible(false)
        }}
      />
      <View style={styles(currentTheme).formContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles().flex}>
          <ScrollView
            style={styles().flex}
            showsVerticalScrollIndicator={false}>
            <View style={styles(currentTheme).upperContainer}>
              <ImageBackground
                source={require('../../assets/images/Profile.png')}
                style={styles().backgroundImage}
                resizeMode="contain">
                <View style={styles(currentTheme).avatar}>
                  <TextDefault bolder H1 uppercase>
                    {profile?.name[0]}
                  </TextDefault>
                </View>
              </ImageBackground>
            </View>

            <View style={styles(currentTheme).lowerContainer}>
              <View style={styles(currentTheme).formSubContainer}>
                <View style={styles(currentTheme).containerHeading}>
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
                        style={styles(currentTheme).headingButton}
                        onPress={viewHideAndShow}>
                        <TextDefault
                          textColor={currentTheme.fontMainColor}
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
                  showUserInfo()
                ) : (
                  <View style={styles().containerInfo}>
                    <View style={styles().flexRow}>
                      <View style={styles().icon}>
                        <FontAwesome name="user" size={15} color="black" />
                      </View>
                      <View style={styles().details}>
                        <TextInput
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
                            ...textStyles.Bolder
                          }}
                          error={nameError}
                        />
                      </View>
                    </View>
                    <View style={{ ...alignment.MTlarge }}></View>
                    <View style={styles().flexRow}>
                      <View style={styles().icon}>
                        <Zocial name="email" size={15} color="black" />
                      </View>
                      <View style={styles().details}>
                        <TextDefault>{profile.email}</TextDefault>
                      </View>
                    </View>
                    <View style={{ ...alignment.MTlarge }}></View>

                    <View style={styles().flexRow}>
                      <View style={styles().icon}>
                        <Entypo name="phone" size={15} color="black" />
                      </View>
                      <View style={styles().phoneDetails}>
                        <View>
                          <TextDefault>{profile.phone}</TextDefault>
                        </View>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row'
                          }}>
                          {(profile.phone === '' ||
                            !profile.phoneIsVerified) && (
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
                        textColor={currentTheme.fontMainColor}
                        bolder
                        B700
                        small
                        uppercase
                        style={[alignment.MTsmall, alignment.MBsmall]}>
                        {'Save'}
                      </TextDefault>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  )
}

export default Profile
