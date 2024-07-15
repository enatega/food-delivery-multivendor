import React, { useLayoutEffect } from 'react'
import { View, Image, TouchableOpacity, Dimensions } from 'react-native'
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
const { height } = Dimensions.get('window')

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
    signIn,
    //user
  } = useCreateAccount()
  const { t } = useTranslation()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
      headerLeft: null,
      title: t(''),
      headerTransparent: true,
      headerTitleAlign: 'center'
    })
  }, [navigation])
  function renderAppleAction() {
    if (loading && loginButton === 'Apple') {
      return (
        <View style={styles(currentTheme).buttonBackground}>
          <Spinner backColor='transparent' spinnerColor={currentTheme.main} />
        </View>
      )
    }
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={
          themeContext.ThemeValue === 'Dark'
            ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
        }
        cornerRadius={scale(20)}
        style={styles().appleBtn}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL
              ]
            })
            const name = credential.fullName?.givenName
              ? credential.fullName?.givenName +
                ' ' +
                credential.fullName?.familyName
              : ''
            const user = {
              appleId: credential.user,
              phone: '',
              email: credential.email,
              password: '',
              name: name,
              picture: '',
              type: 'apple'
            }
            mutateLogin(user)
            loginButtonSetter('Apple')
            // signed in
          } catch (e) {
            if (e.code === 'ERR_CANCELLED') {
              // handle that the user canceled the sign-in flow
              loginButtonSetter(null)
            } else {
              // handle other errors
              loginButtonSetter(null)
            }
          }
        }}
      />
    )
  }

  function renderGoogleAction() {
    return (
      <FdGoogleBtn
        loadingIcon={loading && loginButton === 'Google'}
        onPressIn={() => {
          loginButtonSetter('Google')
        }}
        disabled={loading && loginButton === 'Google'}
        onPress={async () => {
          try {
            await signIn()
          } catch (error) {
            console.error('Google sign-in error:', error)
          }
        }}
      />
    )
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

  return (
    <View style={styles().container}>
      <View style={styles().image}>
        <Image
          source={require('../../assets/images/loginHeader.png')}
          resizeMode='cover'
          style={styles().image1}
        />
      </View>
      <View style={[styles(currentTheme).subContainer]}>
        <View style={[styles().signupContainer]}>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginBottom: scale(10)
            }}
          >
            <TextDefault
              H4
              bolder
              textColor={currentTheme.newFontcolor}
              style={{ marginBottom: scale(7) }}
            >
              {t('signUporSignIn')}
            </TextDefault>
            <TextDefault textColor={currentTheme.newFontcolor}>
              {t('signUpDiscount')}
            </TextDefault>
          </View>

          <View style={{ marginBottom: scale(5) }}>{renderGoogleAction()}</View>
          {enableApple && (
            <View style={{ marginBottom: scale(5) }}>
              {renderAppleAction()}
            </View>
          )}
          <View style={{ marginBottom: scale(5) }}>{renderEmailAction()}</View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles(currentTheme).line} />
            <View style={{ marginBottom: scale(5) }}>
              <TextDefault
                H4
                bolder
                textColor={currentTheme.newFontcolor}
                style={{ width: 50, textAlign: 'center' }}
              >
                {t('or')}
              </TextDefault>
            </View>
            <View style={styles(currentTheme).line} />
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).guestButton}
            onPress={() => {
              navigation.navigate('Main')
            }}
          >
            {props.loadingIcon ? (
              <Spinner
                backColor='rgba(0,0,0,0.1)'
                spinnerColor={currentTheme.main}
              />
            ) : (
              <>
                <TextDefault
                  H4
                  textColor={currentTheme.newFontcolor}
                  style={alignment.MLsmall}
                  bold
                >
                  {t('continueAsGuest')}
                </TextDefault>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
export default CreateAccount
