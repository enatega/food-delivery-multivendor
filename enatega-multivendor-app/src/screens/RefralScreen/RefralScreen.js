import React, { useState, useContext, useLayoutEffect } from 'react'
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, ScrollView, Image, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { alignment } from '../../utils/alignment'
import { useRoute } from '@react-navigation/native'
import styles from './style'

const { height } = Dimensions.get('window')

const RefralScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const [referralCode, setReferralCode] = useState('')
  const route = useRoute()
  const { onContinue, onSkip, userData, phoneAuthData, emailAuthData } = route.params || {}

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
      console.log('✅ Continuing with referral code:', trimmedCode)
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
  }

  const isContinueDisabled = !referralCode.trim()

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
                  onChangeText={setReferralCode}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
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
              {t('continue') || 'Continue'}
            </TextDefault>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default RefralScreen
