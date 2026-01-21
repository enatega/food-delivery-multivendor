import React from 'react'
import { View, StyleSheet, Platform, Pressable } from 'react-native'
import { scale } from '../../../utils/scaling'
import { useCreateAccount } from '../../../screens/CreateAccount/useCreateAccount'
import GoogleAuthButton from '../../../screens/CreateAccount/useAuthActions/GoogleAuthButton'
import AppleAuthButton from '../../../screens/CreateAccount/useAuthActions/AppleAuthButton'
import EmailAuthButton from '../../../screens/CreateAccount/useAuthActions/EmailAuthButton'
import ContinueWithPhoneButton from '../../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'


const Actions = ({ t }) => {
  const { enableApple, loginButton, loginButtonSetter, loading, themeContext, currentTheme, mutateLogin, navigateToLogin, navigation, signIn } = useCreateAccount()
  const handleContinueWithPhoneButton = () => {
    navigation.navigate('PhoneAuth')
  }


  const continueAsGuestHandler = async () => {
    navigation.navigate('Main')
  }

  return (
    <View style={styles().buttonsContainer}>
      <GoogleAuthButton loading={loading} loginButton={loginButton} loginButtonSetter={loginButtonSetter} signIn={signIn} />
      {Platform.OS === 'ios' && enableApple && <AppleAuthButton loading={loading} loginButton={loginButton} enableApple={enableApple} themeContext={themeContext} currentTheme={currentTheme} mutateLogin={mutateLogin} loginButtonSetter={loginButtonSetter} />}
      <View style={{ borderWidth: 1.5, borderColor: currentTheme.headerMainFontColor, borderRadius: scale(10) }}>
        <EmailAuthButton loading={loading} loginButton={loginButton} loginButtonSetter={loginButtonSetter} navigateToLogin={navigateToLogin} />
      </View>
      {ContinueWithPhoneButton({ title: 'continueWithPhone', onPress: handleContinueWithPhoneButton, isLoading: loading })}
      <Pressable style={styles().button} hitSlop={12} onPress={() => continueAsGuestHandler()}>
        <TextDefault H4 textColor={currentTheme.headerMainFontColor} bold>
          {t('continueAsGuest')}
        </TextDefault>
      </Pressable>
    </View>
  )
}

const styles = () =>
  StyleSheet.create({
    buttonsContainer: {
      gap: scale(10)
    },
    button: {
      textAlign: 'center',
      alignItems: 'center',
      paddingVertical: scale(15)
    }
  })

export default Actions
