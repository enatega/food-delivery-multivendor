import React, { useEffect, useLayoutEffect } from 'react'
import { View, Image, TouchableOpacity, StatusBar, Platform } from 'react-native'
import styles from './styles'
import FdGoogleBtn from '../../ui/FdSocialBtn/FdGoogleBtn/FdGoogleBtn'
import FdEmailBtn from '../../ui/FdSocialBtn/FdEmailBtn/FdEmailBtn'
import Spinner from '../../components/Spinner/Spinner'
import * as AppleAuthentication from 'expo-apple-authentication'
import * as Crypto from 'expo-crypto'
import * as SecureStore from 'expo-secure-store'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { useCreateAccount } from './useCreateAccount'
import { useTranslation } from 'react-i18next'
import { scale } from '../../utils/scaling'
import { SafeAreaView } from 'react-native-safe-area-context'
import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'
import { decodeJwtToken } from '../../utils/decode-jwt'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { dismissSessionExpiredModal } from '../../utils/session'
import { gql, useApolloClient } from '@apollo/client'
import { useAppMode } from '../../mode/AppModeContext'
import { APP_MODES } from '../../mode/constants'

const APPLE_AUTH_NONCE = gql`
  query AppleAuthNonce {
    appleAuthNonce
  }
`

const CreateAccount = (props) => {
  const { enableApple, loginButton, loginButtonSetter, loading, setLoading, themeContext, currentTheme, statusBarBackgroundColor, mutateLogin, navigateToLogin, navigation, signIn } = useCreateAccount()
  const apolloClient = useApolloClient()
  const { mode } = useAppMode()

  const { t } = useTranslation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation])

  useEffect(() => {
    dismissSessionExpiredModal()
  }, [])

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
        cornerRadius={scale(28)}
        style={styles().appleBtn}
        onPress={async() => {
          try {
            loginButtonSetter('Apple')
            setLoading(true)
            const state = Crypto.randomUUID()
            const appleNonce = mode === APP_MODES.MULTI
              ? (await apolloClient.query({
                  query: APPLE_AUTH_NONCE,
                  fetchPolicy: 'no-cache'
                }))?.data?.appleAuthNonce
              : Crypto.randomUUID()
            if (!appleNonce) {
              throw new Error('Apple authentication session could not be initialized.')
            }
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
              state,
              nonce: appleNonce
            })
            if (credential.state !== state) {
              throw new Error('Apple login response could not be verified.')
            }
            const idToken = credential?.identityToken
            if (!idToken) {
              FlashMessage({
                message: 'Your social sign-in did not return a valid token. Please try again.'
              })
              setLoading(false)
              loginButtonSetter(null)
              return
            }
            const userDetails = decodeJwtToken(idToken)

            if (!userDetails) {
              throw new Error('Apple login token is invalid.')
            }

            const credentialName = credential.fullName
              ? AppleAuthentication.formatFullName(
                credential.fullName,
                'medium'
              ).trim()
              : ''
            const appleId = credential.user ?? userDetails?.sub
            const email = credential?.email ?? userDetails?.email
            const appleNameStorageKey = appleId
              ? `apple_name_${await Crypto.digestStringAsync(
                  Crypto.CryptoDigestAlgorithm.SHA256,
                  appleId
                )}`
              : null
            let name = credentialName

            if (appleNameStorageKey) {
              try {
                if (credentialName) {
                  // Apple only supplies the name during the first authorization.
                  // Persist it before any network request can fail.
                  await SecureStore.setItemAsync(appleNameStorageKey, credentialName)
                } else {
                  name = (await SecureStore.getItemAsync(appleNameStorageKey)) || ''
                }
              } catch (_storageError) {
                // Authentication can continue; the backend/onboarding repairs a
                // missing display name when Keychain access is unavailable.
              }
            }

            const user = {
              appleId,
              appleNonce,
              phone: '',
              email,
              idToken,
              password: '',
              name,
              picture: '',
              type: 'apple'
            }

            await mutateLogin(user)
          } catch (e) {
            if (e.code !== 'ERR_REQUEST_CANCELED') {
              if (process.env.NODE_ENV === 'development') console.error('Apple Sign In Error:', e)
              FlashMessage({
                message: e?.message?.toLowerCase()?.includes('token')
                  ? 'Your social sign-in token is invalid or expired. Please sign in again.'
                  : 'Social login is not configured right now. Please use email and password.'
              })
            }
            setLoading(false)
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

  const renderGuestButton = () => (
    <TouchableOpacity activeOpacity={0.7} style={styles(currentTheme).guestButton} onPress={() => navigation.navigate('Discovery')} disabled={props.loadingIcon}>
      {props.loadingIcon
        ? (
          <Spinner backColor='rgba(0,0,0,0.1)' spinnerColor={currentTheme.main} />
          )
        : (
          <TextDefault H4 textColor={currentTheme.primary} center bold>
            {t('continueAsGuest')}
          </TextDefault>
          )}
    </TouchableOpacity>
  )

  const { isConnected: connect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[]} />

  return (
    <SafeAreaView
      edges={props.embeddedInModeProfileTab ? ['left', 'right'] : ['top', 'left', 'right']}
      style={styles(currentTheme).safeAreaViewStyles}
    >
      <StatusBar backgroundColor={statusBarBackgroundColor} translucent={false} barStyle={themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'} />

      <View style={styles().mainContainer}>
        {/* GIF Section */}
        <View style={styles().gifContainer}>
          <Image source={require('../../assets/gifs/login.gif')} style={styles().gifImage} resizeMode='cover' />
        </View>

        {/* Content Section */}
        <View styl>
          {/* Welcome Text */}
          <View style={styles().welcomeSection}>
            <TextDefault H1 bolder center textColor={currentTheme.newFontcolor} style={styles(currentTheme).mainTitle}>
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
            {renderGuestButton()}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default CreateAccount
