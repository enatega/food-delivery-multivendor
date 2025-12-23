import React, { useLayoutEffect } from 'react'
import { View, Image, TouchableOpacity, Dimensions, StatusBar, Platform, KeyboardAvoidingView } from 'react-native'
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
import { SafeAreaView } from 'react-native-safe-area-context'
import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'
import { decodeJwtToken } from '../../utils/decode-jwt'
import ContinueWithPhoneButton from '../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'

const { height } = Dimensions.get('window')

const CreateAccount = (props) => {
  const { enableApple, loginButton, loginButtonSetter, loading, themeContext, currentTheme, mutateLogin, navigateToLogin, navigation, signIn } = useCreateAccount()

  const { t } = useTranslation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation])

  const renderAppleAction = () => {
    if (loading && loginButton === 'Apple') {
      return (
        <View style={styles().loadingContainer}>
          <View style={styles(currentTheme).buttonBackground}>
            <Spinner backColor='transparent' spinnerColor={currentTheme.main} />
          </View>
        </View>
      )
    }

    // Hide Apple login on Android if not enabled
    if (Platform.OS === 'android' && !enableApple) {
      return null
    }

    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={themeContext.ThemeValue === 'Dark' ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={scale(8)}
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
            if (e.code !== 'ERR_CANCELED') {
              console.error('Apple Sign In Error:', e)
            }
            loginButtonSetter(null)
          }
        }}
      />
    )
  }

  const renderGoogleAction = () => <FdGoogleBtn loadingIcon={loading && loginButton === 'Google'} onPressIn={() => loginButtonSetter('Google')} disabled={loading && loginButton === 'Google'} onPress={signIn} />

  const renderEmailAction = () => (
    <FdEmailBtn
      loadingIcon={loading && loginButton === 'Email'}
      onPress={() => {
        loginButtonSetter('Email')
        navigateToLogin()
      }}
    />
  )

  const { isConnected: connect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[]} />

  const handleContinueWithPhoneButton = () => {
    navigation.navigate('PhoneAuth')
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles(currentTheme).safeAreaViewStyles}>
      <StatusBar backgroundColor='transparent' translucent barStyle={themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'} />

      <View style={styles().mainContainer}>
        {/* GIF Section */}
        <View style={styles().gifContainer}>
          <Image source={require('../../assets/images/CreateAccountImage.png')} style={styles().gifImage} resizeMode='contain' />
          <Image source={require('../../assets/images/Fast.png')} style={{ width: 120, height: 40, marginTop: alignment.MTsmall }} resizeMode='contain' />
        </View>

        {/* Content Section */}
        <View>
          {/* Welcome Text */}
          <View style={styles().welcomeSection}>
            <TextDefault H2 bolder center textColor={currentTheme.newFontcolor} style={styles(currentTheme).mainTitle}>
              {t('welcomeText')}
            </TextDefault>
            <TextDefault center H5 textColor={currentTheme.newFontcolor} style={styles().subTitle}>
              {t('createAccountDesc')}
            </TextDefault>
          </View>

          {/* Login Buttons */}
          <View style={styles().buttonsContainer}>
            {renderGoogleAction()}
            {Platform.OS === 'ios' && enableApple && renderAppleAction()}
            {renderEmailAction()}
            {ContinueWithPhoneButton({ title: 'continueWithPhone', onPress: handleContinueWithPhoneButton, isLoading: props?.loadingIcon })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default CreateAccount
