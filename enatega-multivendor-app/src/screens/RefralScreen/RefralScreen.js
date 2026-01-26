import React, { useState, useContext, useLayoutEffect } from 'react'
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, ScrollView, Image, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { alignment } from '../../utils/alignment'
import { useRoute } from '@react-navigation/native'
import { useMutation } from '@apollo/client'
import { CHECK_REFERRAL_CODE_EXISTS } from '../../singlevendor/apollo/mutations'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import styles from './style'

const { height } = Dimensions.get('window')

const RefralScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const [referralCode, setReferralCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const route = useRoute()
  const { onContinue, onSkip, userData, phoneAuthData, emailAuthData } = route.params || {}

  const proceedWithReferralCode = () => {
    const trimmedCode = referralCode.trim()
    console.log('✅ Continuing with referral code:', trimmedCode)
    setErrorMessage('') // Clear any previous errors
    if (onContinue) {
      console.log('✅ Calling onContinue callback with code:', trimmedCode)
      onContinue(trimmedCode)
    } else {
      // Fallback: navigate back with referral code
      // Check if it's Google login, Phone auth, or Email auth
      if (userData) {
        navigation.navigate({
          name: 'CreateAccount',
          params: { referralCode: trimmedCode },
          merge: true
        })
      } else if (phoneAuthData) {
        navigation.navigate({
          name: 'VerifyPhoneNumber',
          params: { referralCode: trimmedCode },
          merge: true
        })
      } else if (emailAuthData) {
        if (emailAuthData.isLogin) {
          navigation.navigate({
            name: 'Login',
            params: { referralCode: trimmedCode },
            merge: true
          })
        } else {
          navigation.navigate({
            name: 'Register',
            params: { email: emailAuthData.email, referralCode: trimmedCode },
            merge: true
          })
        }
      }
    }
  }

  const [checkReferralCode, { loading: checkingCode }] = useMutation(CHECK_REFERRAL_CODE_EXISTS, {
    onCompleted: (data) => {
      if (data?.checkReferralCodeExists) {
        // Code exists, continue with existing flow
        proceedWithReferralCode()
      } else {
        // Code doesn't exist, show error
        setErrorMessage(t('Given Referral code doesn\'t exist') || 'Given Referral code doesn\'t exist')
        FlashMessage({
          message: t('Given Referral code doesn\'t exist') || 'Given Referral code doesn\'t exist'
        })
      }
    },
    onError: (error) => {
      const errorMsg = error?.graphQLErrors?.[0]?.message || error?.networkError?.result?.errors?.[0]?.message || t('Something went wrong, please try again!') || 'Something went wrong, please try again!'
      setErrorMessage(errorMsg)
      FlashMessage({
        message: errorMsg
      })
    }
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation])

  const handleSkip = () => {
    console.log('⏭️ Skipping referral code')
    if (onSkip) {
      console.log('✅ Calling onSkip callback')
      onSkip()
    } else {
      // Fallback: navigate back with skip flag
      // Check if it's Google login, Phone auth, or Email auth
      if (userData) {
        navigation.navigate({
          name: 'CreateAccount',
          params: { referralSkipped: true },
          merge: true
        })
      } else if (phoneAuthData) {
        navigation.navigate({
          name: 'VerifyPhoneNumber',
          params: { referralSkipped: true },
          merge: true
        })
      } else if (emailAuthData) {
        if (emailAuthData.isLogin) {
          navigation.navigate({
            name: 'Login',
            params: { referralSkipped: true },
            merge: true
          })
        } else {
          navigation.navigate({
            name: 'Register',
            params: { email: emailAuthData.email, referralSkipped: true },
            merge: true
          })
        }
      }
    }
  }

  const handleContinue = () => {
    const trimmedCode = referralCode.trim()
    if (trimmedCode) {
      setErrorMessage('') // Clear previous errors
      // Call API to check if referral code exists
      checkReferralCode({
        variables: {
          referralCode: trimmedCode
        }
      })
    }
  }

  const isContinueDisabled = !referralCode.trim() || checkingCode

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles(currentTheme).safeAreaViewStyles}>
      <StatusBar 
        backgroundColor='transparent' 
        translucent 
        barStyle={themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'} 
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles(currentTheme).keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles(currentTheme).scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles(currentTheme).container}>
            {/* GIF Section */}
            <View style={styles(currentTheme).gifContainer}>
              <Image 
                source={require('../../assets/images/CreateAccountImage.png')} 
                style={styles(currentTheme).gifImage} 
                resizeMode='contain' 
              />
              <Image 
                source={require('../../assets/images/Fast.png')} 
                style={styles(currentTheme).fastImage} 
                resizeMode='contain' 
              />
            </View>

            <View style={styles(currentTheme).headerSection}>
              <TextDefault 
                H2 
                bolder 
                textColor={currentTheme.newFontcolor} 
                style={styles(currentTheme).title}
                isRTL={currentTheme.isRTL}
              >
                {t('Enter Referral Code')}
              </TextDefault>
              <TextDefault 
                H5 
                bold 
                textColor={currentTheme.fontSecondColor} 
                style={styles(currentTheme).description}
                isRTL={currentTheme.isRTL}
              >
                {t('Have a referral code? Enter it below to get started.') }
              </TextDefault>
            </View>

            <View style={styles(currentTheme).inputSection}>
              <View style={styles(currentTheme).inputContainer}>
                <TextInput
                  placeholder={t('Enter Referral Code') }
                  placeholderTextColor={currentTheme.fontSecondColor}
                  style={styles(currentTheme).textInput}
                  value={referralCode}
                  onChangeText={(text) => {
                    setReferralCode(text)
                    setErrorMessage('') // Clear error when user types
                  }}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
              {errorMessage ? (
                <TextDefault 
                  H5 
                  textColor={currentTheme.errorColor || '#FF0000'} 
                  style={{ marginTop: 8, marginLeft: 16 }}
                  isRTL={currentTheme.isRTL}
                >
                  {errorMessage}
                </TextDefault>
              ) : null}
            </View>
          </View>
        </ScrollView>

        <View style={styles(currentTheme).buttonContainer}>
        <TouchableOpacity
            style={styles(currentTheme).skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <TextDefault textColor={currentTheme.white} H4 bold>
              {t('skip') || 'Skip'}
            </TextDefault>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles(currentTheme).continueButton,
              isContinueDisabled && styles(currentTheme).disabledButton
            ]}
            onPress={handleContinue}
            disabled={isContinueDisabled}
            activeOpacity={0.7}
          >
            <TextDefault textColor={currentTheme.white} H4 bold>
              {checkingCode ? (t('Checking...') || 'Checking...') : (t('continue') || 'Continue')}
            </TextDefault>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default RefralScreen
