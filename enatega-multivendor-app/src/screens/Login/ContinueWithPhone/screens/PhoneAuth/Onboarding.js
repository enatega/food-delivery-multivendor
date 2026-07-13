import { useLayoutEffect, useState, useRef } from 'react'
import { View, KeyboardAvoidingView, ScrollView, Platform, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import screenOptions from './screenOptions'
import { useTranslation } from 'react-i18next'
import { useHeaderHeight } from '@react-navigation/elements'

import useNetworkStatus from '../../../../../utils/useNetworkStatus'
import ErrorView from '../../../../../components/ErrorView/ErrorView'
import { usePhoneAuth } from './usePhoneAuth'
import Auth from '../../../../../assets/SVG/imageComponents/Auth'
import AuthImageWithDescription from '../../components/AuthImageWithDescription/AuthImageWithDescription'
import ContinueWithPhoneButton from '../../../../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'
import { TextInput } from 'react-native-gesture-handler'

function OnBoarding(props) {
  const otpInputRef = useRef(null)
  const { currentTheme, themeContext, name, setName, onBoardingCompleteHandler, onBoardingCompleteLoading } = usePhoneAuth()

  const { t } = useTranslation()
  const headerHeight = useHeaderHeight()
  useLayoutEffect(() => {
    props?.navigation.setOptions(
      screenOptions({
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.newFontcolor,
        iconColor: currentTheme.newIconColor,
        navigation: props?.navigation,
        headerRight: null
      })
    )
  }, [props?.navigation])

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView />

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles(currentTheme).safeAreaViewStyles}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles().flex} keyboardVerticalOffset={headerHeight}>
        <StatusBar backgroundColor={currentTheme.themeBackground} barStyle={themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'} />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
          <View style={styles(currentTheme).mainContainer}>
            <AuthImageWithDescription title='Tell us your name.' description='Add your name to complete the setup.' image={<Auth fillColor={currentTheme.svgFill} strokeColor={currentTheme.newIconColor} />} currentTheme={currentTheme} />

            <View style={styles().form}>
              <TextInput placeholder={t('Your name')} style={styles(currentTheme).textField} placeholderTextColor={currentTheme.fontSecondColor} defaultValue='' onChangeText={(e) => setName(e)} />
            </View>

            <View style={styles().btnContainer}>
              <ContinueWithPhoneButton title='continueBtn' onPress={() => onBoardingCompleteHandler(name)} isLoading={onBoardingCompleteLoading} isDisabled={name.length == 0} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default OnBoarding
