import React, { useLayoutEffect } from 'react'
import { View, Image, TouchableOpacity, Dimensions, StatusBar, Platform, KeyboardAvoidingView } from 'react-native'
import styles from './styles'
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
import AppleAuthButton from './useAuthActions/AppleAuthButton'
import GoogleAuthButton from './useAuthActions/GoogleAuthButton'
import EmailAuthButton from './useAuthActions/EmailAuthButton'

const { height } = Dimensions.get('window')

const CreateAccount = (props) => {
  const { enableApple, loginButton, loginButtonSetter, loading, setLoading, themeContext, currentTheme, mutateLogin, navigateToLogin, navigation, signIn, handleAppleLogin } = useCreateAccount()

  const { t } = useTranslation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation])

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
            <GoogleAuthButton
              loading={loading}
              loginButton={loginButton}
              loginButtonSetter={loginButtonSetter}
              signIn={signIn} />
            {Platform.OS === 'ios' && enableApple && (
                <AppleAuthButton
                  loading={loading}
                  loginButton={loginButton}
                  enableApple={enableApple}
                  themeContext={themeContext}
                  currentTheme={currentTheme}
                  mutateLogin={mutateLogin}
                loginButtonSetter={loginButtonSetter}
                setLoading={setLoading}
                handleAppleLogin={handleAppleLogin}
                />
            )}
            <EmailAuthButton
                loading={loading}
                loginButton={loginButton}
                loginButtonSetter={loginButtonSetter}
                navigateToLogin={navigateToLogin}
            />
            {ContinueWithPhoneButton({ title: 'continueWithPhone', onPress: handleContinueWithPhoneButton, isLoading: props?.loadingIcon })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default CreateAccount
