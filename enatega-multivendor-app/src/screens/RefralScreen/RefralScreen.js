import React, { useState, useContext, useLayoutEffect } from 'react'
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, ScrollView, Image, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { alignment } from '../../utils/alignment'
import styles from './style'

const { height } = Dimensions.get('window')

const RefralScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const [referralCode, setReferralCode] = useState('')

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation])

  const handleSkip = () => {
    // Handle skip action
    navigation.goBack()
  }

  const handleContinue = () => {
    if (referralCode.trim()) {
      console.log('Referral code:', referralCode)
      navigation.goBack()
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
