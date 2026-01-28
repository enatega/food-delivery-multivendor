import React, { useState, useLayoutEffect, useContext } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '@react-navigation/elements'
import { useMutation } from '@apollo/client'
import { APPLY_REFERRAL_CODE, createUser } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import navigationService from '../../routes/navigationService'
import { scale } from '../../utils/scaling'
import CodeEntryIllustration from '../../assets/SVG/referralCodeEntry'
import gql from 'graphql-tag'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import analytics from '../../utils/analytics'
import AuthContext from '../../context/Auth'
import { useTranslation } from 'react-i18next'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { storeReferralCode } from '../../utils/referralStorage'

const CREATEUSER = gql`
  ${createUser}
`

function ReferralCodeEntry({ onSkip, onProceed, route, ...props }) {
  const { t } = useTranslation()
  const Analytics = analytics()
  const { setTokenAsync } = useContext(AuthContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [referralCode, setReferralCode] = useState(route?.params?.prefilledCode || '')
  const [loading, setLoading] = useState(false)
  
  const isNewUser = route?.params?.isNewUser
  const onComplete = route?.params?.onComplete
  const prefilledCode = route?.params?.prefilledCode
  const isEmailSignup = route?.params?.isEmailSignup
  const userData = route?.params?.userData

  const [applyReferralCode] = useMutation(APPLY_REFERRAL_CODE)
  const [createUserMutation] = useMutation(CREATEUSER)

  const handleApplyCode = async () => {
    const codeToApply = referralCode.trim()
    
    if (!codeToApply) {
      Alert.alert('Error', 'Please enter a referral code')
      return
    }

    setLoading(true)
    try {
      if (isEmailSignup && userData) {
        // For email signup, create user with referral code
        await createUserWithReferral(codeToApply)
      } else {
        // For existing users (Google/Apple), apply referral code
        const { data } = await applyReferralCode({
          variables: { referralCode: codeToApply }
        })

        if (data?.applyReferralCode?.success) {
          Alert.alert(
            'Success!',
            'Referral code applied successfully. You\'ll earn points when you complete your first order!',
            [{ text: 'OK', onPress: () => handleComplete() }]
          )
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Invalid referral code')
    } finally {
      setLoading(false)
    }
  }

  const createUserWithReferral = async (referralCode) => {
    try {
      let notificationToken = null
      if (Device.isDevice) {
        try {
          const { status } = await Notifications.requestPermissionsAsync()
          if (status === 'granted') {
            notificationToken = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId })).data
          }
        } catch (error) {
          console.log('Error getting notification token:', error)
        }
      }

      const { data } = await createUserMutation({
        variables: {
          phone: userData.phone,
          email: userData.email,
          password: userData.password,
          name: userData.name,
          picture: '',
          notificationToken: notificationToken,
          emailIsVerified: true,
          isPhoneExists: userData.isPhoneExists,
          referralCode: referralCode
        }
      })

      if (data?.createUser) {
        FlashMessage({ message: t('accountCreated') })
        
        await Analytics.identify(
          { userId: data.createUser.userId },
          data.createUser.userId
        )
        await Analytics.track(Analytics.events.USER_CREATED_ACCOUNT, {
          userId: data.createUser.userId,
          name: data.createUser.name,
          email: data.createUser.email,
          type: 'email'
        })
        
        await setTokenAsync(data.createUser.token)
        
        Alert.alert(
          'Success!',
          'Account created and referral code applied successfully!',
          [{ 
            text: 'OK', 
            onPress: () => {
              props.navigation.navigate('PhoneOtp', {
                name: data.createUser.name,
                phone: data.createUser.phone
              })
            }
          }]
        )
      }
    } catch (error) {
      throw error
    }
  }

  const handleSkip = async () => {
    if (isEmailSignup && userData) {
      // For email signup, create user without referral code
      setLoading(true)
      try {
        await createUserWithoutReferral()
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to create account')
        setLoading(false)
      }
    } else if (isNewUser && onComplete) {
      onComplete()
    } else if (onSkip) {
      onSkip()
    } else {
      navigationService.goBack()
    }
  }

  const createUserWithoutReferral = async () => {
    try {
      let notificationToken = null
      if (Device.isDevice) {
        try {
          const { status } = await Notifications.requestPermissionsAsync()
          if (status === 'granted') {
            notificationToken = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId })).data
          }
        } catch (error) {
          console.log('Error getting notification token:', error)
        }
      }

      const { data } = await createUserMutation({
        variables: {
          phone: userData.phone,
          email: userData.email,
          password: userData.password,
          name: userData.name,
          picture: '',
          notificationToken: notificationToken,
          emailIsVerified: true,
          isPhoneExists: userData.isPhoneExists
        }
      })

      if (data?.createUser) {
        FlashMessage({ message: t('accountCreated') })
        
        await Analytics.identify(
          { userId: data.createUser.userId },
          data.createUser.userId
        )
        await Analytics.track(Analytics.events.USER_CREATED_ACCOUNT, {
          userId: data.createUser.userId,
          name: data.createUser.name,
          email: data.createUser.email,
          type: 'email'
        })
        
        await setTokenAsync(data.createUser.token)
        
        props.navigation.navigate('PhoneOtp', {
          name: data.createUser.name,
          phone: data.createUser.phone
        })
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    if (isNewUser && onComplete) {
      onComplete()
    } else if (onProceed) {
      onProceed()
    } else {
      navigationService.goBack()
    }
  }

  useLayoutEffect(() => {
    if (!props?.navigation || isNewUser) return
    
    props?.navigation.setOptions({
      headerTitle: 'Enter Referral Code',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.fontMainColor,
        fontSize: 16
      },
      headerStyle: {
        backgroundColor: currentTheme.themeBackground
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={styles.backButton}>
              <MaterialIcons name='arrow-back' size={30} color='black' />
            </View>
          )}
          onPress={() => navigationService.goBack()}
        />
      )
    })
  }, [props?.navigation, currentTheme, isNewUser])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.themeBackground }]}>
      <KeyboardAvoidingView 
        style={styles.flex} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Image Section */}
          <View style={styles.imageContainer}>
            <CodeEntryIllustration width={300} height={200} style={{ marginTop: 20 }} />
          </View>

          {/* Middle Content Section */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: currentTheme.fontMainColor }]}>
              Have a Referral Code?
            </Text>
            
            <Text style={[styles.subtitle, { color: currentTheme.fontSecondColor }]}>
              Enter your friend's referral code to earn bonus points on your first order
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: themeContext.ThemeValue === 'Dark' ? '#1F2937' : currentTheme.white,
                  borderColor: themeContext.ThemeValue === 'Dark' ? '#374151' : currentTheme.borderColor,
                  color: currentTheme.fontMainColor
                }]}
                placeholder="Enter referral code"
                placeholderTextColor={currentTheme.fontSecondColor}
                value={referralCode}
                onChangeText={setReferralCode}
                autoCapitalize="characters"
                maxLength={10}
              />
            </View>
          </View>

          {/* Bottom Buttons Section */}
          <View style={styles.spacer} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.skipButton, { 
                borderColor: currentTheme.primary,
                backgroundColor: 'transparent'
              }]}
              onPress={handleSkip}
            >
              <Text style={[styles.skipButtonText, { color: currentTheme.primary }]}>
                Skip for now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.proceedButton, { 
                backgroundColor: currentTheme.primary,
                opacity: loading ? 0.7 : 1
              }]}
              onPress={handleApplyCode}
              disabled={loading}
            >
              <Text style={styles.proceedButtonText}>
                {loading ? 'Processing...' : 'Proceed'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flex: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  spacer: {
    flex: 1,
    minHeight: 50
  },
  backButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    marginLeft: 10,
    alignItems: 'center'
  },
  imageContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40
  },

  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22
  },
  inputContainer: {
    width: '100%'
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 40,
    gap: 16
  },
  skipButton: {
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  proceedButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default ReferralCodeEntry