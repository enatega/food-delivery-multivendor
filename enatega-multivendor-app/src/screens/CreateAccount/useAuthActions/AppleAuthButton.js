import React from 'react'
import { View, Platform } from 'react-native'
import * as AppleAuthentication from 'expo-apple-authentication'
import Spinner from '../../../components/Spinner/Spinner'
import { decodeJwtToken } from '../../../utils/decode-jwt'
import styles from '../styles'
import { scale } from '../../../utils/scaling'

const AppleAuthButton = ({ loading, loginButton, enableApple, themeContext, currentTheme, mutateLogin, loginButtonSetter, setLoading, handleAppleLogin }) => {
  if (Platform.OS === 'android' && !enableApple) return null

  if (loading && loginButton === 'Apple') {
    return (
      <View style={styles().loadingContainer}>
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
      cornerRadius={scale(8)}
      style={styles().appleBtn}

      onPress={async () => {
          try {
            loginButtonSetter('Apple')
            setLoading(true)
            
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

            // Navigate to referral screen instead of directly calling mutateLogin
            handleAppleLogin(user)
          } catch (e) {
            if (e.code !== 'ERR_CANCELED') {
              console.error('Apple Sign In Error:', e)
            }
            loginButtonSetter(null)
            setLoading(false)
          }
      }}
      
      // onPress={async () => {
      //   try {
      //     loginButtonSetter('Apple')

      //     const credential = await AppleAuthentication.signInAsync({
      //       requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL]
      //     })

      //     const access_token = credential?.identityToken
      //     const user_details = decodeJwtToken(access_token)
      //     if (!user_details) throw new Error('Apple login failed')

      //     const { givenName, familyName } = credential.fullName || {}
      //     const name = `${givenName ?? ''} ${familyName ?? ''}`.trim()

      //     mutateLogin({
      //       appleId: credential.user ?? user_details.sub,
      //       email: credential.email ?? user_details.email,
      //       name,
      //       phone: '',
      //       password: '',
      //       picture: '',
      //       type: 'apple'
      //     })
      //   } catch (e) {
      //     if (e.code !== 'ERR_CANCELED') console.error(e)
      //     loginButtonSetter(null)
      //   }
      // }}
    />
  )
}

export default AppleAuthButton
