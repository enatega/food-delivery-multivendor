import React, { useLayoutEffect } from 'react'
import { View, Image, TouchableOpacity, Dimensions, StatusBar, ScrollView } from 'react-native'
import styles from './styles'
import FdGoogleBtn from '../../ui/FdSocialBtn/FdGoogleBtn/FdGoogleBtn'
import FdEmailBtn from '../../ui/FdSocialBtn/FdEmailBtn/FdEmailBtn'
import Spinner from '../../components/Spinner/Spinner'
import * as AppleAuthentication from 'expo-apple-authentication'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { useCreateAccount } from './useCreateAccount'
import { useTranslation } from 'react-i18next'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
import LoginHeader from '../../assets/SVG/imageComponents/LoginHeader'
import { SafeAreaView } from 'react-native-safe-area-context'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'
import { decodeJwtToken } from '../../utils/decode-jwt'

const CreateAccount = (props) => {
  const {
    enableApple,
    loginButton,
    loginButtonSetter,
    loading,
    themeContext,
    currentTheme,
    mutateLogin,
    navigateToLogin,
    navigation,
    signIn
    //user
  } = useCreateAccount()
  const { t } = useTranslation()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: '',
      headerRight: null,
      headerLeft: null,
      headerTransparent: true,
      headerTitleAlign: 'center'
    })
  }, [navigation])

  function renderAppleAction() {
    if (loading && loginButton === 'Apple') {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles(currentTheme).buttonBackground}>
            <Spinner backColor='transparent' spinnerColor={currentTheme.main} />
          </View>
        </View>
      )
    }
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={themeContext.ThemeValue === 'Dark' ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={scale(20)}
        style={styles().appleBtn}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL]
            })
            const access_token = credential?.identityToken

            const user_details = decodeJwtToken(access_token)

            if (!user_details) {
              throw 'Apple login failed.'
            }

            const { givenName, familyName } = credential.fullName || {}
            const name = givenName || familyName ? `${givenName ?? ''} ${familyName ?? ''}`.trim() : ''
            const appleId = credential.user ?? user_details?.sub
            const email = credential?.email ?? user_details?.email

            const user = {
              appleId,
              phone: '',
              email,
              password: '',
              name,
              picture: '',
              type: 'apple'
            }

            mutateLogin(user)
            loginButtonSetter('Apple')
          } catch (e) {
            console.error('Apple Sign In Error:', e)
            loginButtonSetter(null)
          }
        }}
      />
    )
  }

  function renderGoogleAction() {
    return <FdGoogleBtn loadingIcon={loading && loginButton === 'Google'} onPressIn={() => loginButtonSetter('Google')} disabled={loading && loginButton === 'Google'} onPress={signIn} />
  }

  function renderEmailAction() {
    return (
      <FdEmailBtn
        loadingIcon={loading && loginButton === 'Email'}
        onPress={() => {
          loginButtonSetter('Email')
          // eslint-disable-next-line no-unused-expressions
          navigateToLogin()
        }}
      />
    )
  }
  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[]} />

  return (
    <SafeAreaView style={styles(currentTheme).safeAreaViewStyles}>
      <StatusBar backgroundColor={currentTheme.main} barStyle={themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'} />
      <ScrollView style={styles().flex} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
        <View style={styles().container}>
          <View style={styles(currentTheme).image}>
            <View style={styles().image1}>
              <LoginHeader blackStroke={currentTheme.themeBackground} whiteStroke={currentTheme.darkBgFont} fillColor={currentTheme.svgFill} />
            </View>

            <View style={styles(currentTheme).mainHeadingTextOverlay}>
              <TextDefault center H3 bold>
                {t('brandName')}
              </TextDefault>
            </View>

            <View style={styles(currentTheme).burgerImage}>
              <Image
                source={require('../../assets/images/burger.png')}
                style={{
                  height: 300,
                  resizeMode: 'contain'
                }}
              />
            </View>
          </View>
          <View style={[styles(currentTheme).subContainer]}>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginBottom: scale(30),
                marginTop: scale(10)
              }}
            >
              <TextDefault H2 bolder center textColor={currentTheme.newFontcolor} style={{ marginBottom: scale(7) }}>
                {t('welcomeText')}
              </TextDefault>
              <TextDefault center H5 textColor={currentTheme.newFontcolor} style={styles().descText}>
                {t('createAccountDesc')}
              </TextDefault>
            </View>

            <View style={[styles().signupContainer]}>
              <View style={{ marginBottom: scale(5) }}>{renderGoogleAction()}</View>
              {enableApple && <View style={{ marginBottom: scale(5) }}>{renderAppleAction()}</View>}
              <View style={{ marginBottom: scale(5) }}>{renderEmailAction()}</View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles(currentTheme).line} />
                <View style={{ marginBottom: scale(5) }}>
                  <TextDefault H4 bolder textColor={currentTheme.newFontcolor} style={{ width: 50, textAlign: 'center' }}>
                    {t('or')}
                  </TextDefault>
                </View>
                <View style={styles(currentTheme).line} />
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles(currentTheme).guestButton}
                onPress={() => {
                  navigation.navigate('Discovery')
                }}
              >
                {props.loadingIcon ? (
                  <Spinner backColor='rgba(0,0,0,0.1)' spinnerColor={currentTheme.main} />
                ) : (
                  <>
                    <TextDefault H4 textColor={currentTheme.newFontcolor} style={alignment.MLsmall} bold>
                      {t('continueAsGuest')}
                    </TextDefault>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
export default CreateAccount
