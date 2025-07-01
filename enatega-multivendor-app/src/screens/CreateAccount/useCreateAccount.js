// import { useEffect, useState, useContext } from 'react'
// import { StatusBar, Platform } from 'react-native'
// import * as Notifications from 'expo-notifications'
// import * as Device from 'expo-device'
// import Constants from 'expo-constants'
// import useEnvVars from '../../../environment'
// import gql from 'graphql-tag'
// import { login } from '../../apollo/mutations'
// import ThemeContext from '../../ui/ThemeContext/ThemeContext'
// import { theme } from '../../utils/themeColors'
// import { useMutation } from '@apollo/client'
// import * as AppleAuthentication from 'expo-apple-authentication'
// import { useFocusEffect, useNavigation } from '@react-navigation/native'
// import * as Linking from 'expo-linking'
// import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
// import analytics from '../../utils/analytics'
// import AuthContext from '../../context/Auth'
// import { useTranslation } from 'react-i18next'
// // import { GoogleSignin } from '@react-native-google-signin/google-signin'
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import { makeRedirectUri } from 'expo-auth-session'
// WebBrowser.maybeCompleteAuthSession();


// const LOGIN = gql`
//   ${login}
// `

// export const useCreateAccount = () => {
//   const Analytics = analytics()
//   const navigation = useNavigation()
//   const { t, i18n } = useTranslation()
//   const [mutate] = useMutation(LOGIN, { onCompleted, onError })
//   const [enableApple, setEnableApple] = useState(false)
//   const [loginButton, loginButtonSetter] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const { setTokenAsync } = useContext(AuthContext)
//   const themeContext = useContext(ThemeContext)
//   const [googleUser, setGoogleUser] = useState(null)
//   const currentTheme = {isRTL : i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue]}
  
//   const {
//     IOS_CLIENT_ID_GOOGLE,
//     ANDROID_CLIENT_ID_GOOGLE,
//     EXPO_CLIENT_ID,
//     TERMS_AND_CONDITIONS,
//     PRIVACY_POLICY
//   } = useEnvVars()



//   console.log("andorid client id: ", ANDROID_CLIENT_ID_GOOGLE);
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     // clientId: EXPO_CLIENT_ID,
//     androidClientId: ANDROID_CLIENT_ID_GOOGLE,
//     iosClientId: IOS_CLIENT_ID_GOOGLE,
//     // redirectUri: makeRedirectUri({
//     //     native: 'enategamultivendor://redirect',
//     //     useProxy: false
//     //   }),  
//     scopes: ['profile', 'email', 'openid'],
//   });


//   useEffect(() => {
//     if (response?.type === 'success') {

//       console.log({response});

//       const { authentication } = response;
//       fetchUserInfo(authentication.accessToken);

//     } else if (response?.type === 'error') {
//       console.error('Authentication error:', response.error);
//     }
//   }, [response]);


//   const fetchUserInfo = async (accessToken) => {
//     try {
//       const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       const user = await response.json();

//       console.log({user});

//       const userData = {
//         phone: '',
//         email: user.email,
//         password: '',
//         name: user.name,
//         picture: user.photo || '',
//         type: 'google'
//       }

//       console.log("User data: ", userData);

//       setGoogleUser(userData.name)
//       console.log('🔐 Logging in user...')
//       await mutateLogin(userData)



//     } catch (error) {
//       console.error('❌ Google sign-in error:', error)
      
//       if (error.code === 'SIGN_IN_CANCELLED') {
//         console.log('❌ User cancelled')
//       } else if (error.code === 'IN_PROGRESS') {
//         console.log('⏳ Sign in already in progress')
//       } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
//         console.log('❌ Google Play Services not available')
//         FlashMessage({ message: 'Google Play Services not available' })
//       } else {
//         FlashMessage({ message: 'Google sign in failed' })
//       }
      
//       setLoading(false)
//       loginButtonSetter(null)
//     }
//   };

//   // Configure Google Sign-In ONCE
//   // useEffect(() => {
//   //   console.log('🔧 Configuring Google Sign-In...')
    
//   //   GoogleSignin.configure({
//   //     webClientId: EXPO_CLIENT_ID,
//   //     iosClientId: IOS_CLIENT_ID_GOOGLE,
//   //     androidClientId: ANDROID_CLIENT_ID_GOOGLE,
//   //     offlineAccess: true,
//   //     hostedDomain: '',
//   //     forceCodeForRefreshToken: true,
//   //   })
    
//   //   console.log('✅ Google Sign-In configured')
//   // }, [])


//   // Google Sign-In Function
//   const signIn = async () => {
//     try {
//       console.log("LOGIN BUTTON CLICKED");
//       loginButtonSetter('Google')
//       setLoading(true)
//       // Check if the request object is ready
//       if (!request) {
//         console.error("Google authentication request is not ready.");
//         return;
//       }
      
//       // Prompt the user for sign-in
//       await promptAsync();
//     } catch (e) {
//       console.error('Error during sign-in prompt: ' + e.message);
//       console.error('Error during sign-in prompt:', e);
//     }finally{
//       setLoading(false)
//       loginButtonSetter(null)
//     }
//   };
//   // // Google Sign-In Function
//   // const signIn = async () => {
//   //   try {
//   //     console.log('🚀 Starting Google sign in...')
//   //     loginButtonSetter('Google')
//   //     setLoading(true)

//   //     if (Platform.OS === 'android') {
//   //       await GoogleSignin.hasPlayServices()
//   //       console.log('✅ Google Play Services available')
//   //     }

//   //     const userInfo = await GoogleSignin.signIn()
//   //     console.log('✅ Google sign-in successful!')
//   //     console.log('👤 User:', userInfo.user.email)

//   //     const userData = {
//   //       phone: '',
//   //       email: userInfo.user.email,
//   //       password: '',
//   //       name: userInfo.user.name,
//   //       picture: userInfo.user.photo || '',
//   //       type: 'google'
//   //     }

//   //     setGoogleUser(userInfo.user.name)
//   //     console.log('🔐 Logging in user...')
//   //     await mutateLogin(userData)

//   //   } catch (error) {
//   //     console.error('❌ Google sign-in error:', error)
      
//   //     if (error.code === 'SIGN_IN_CANCELLED') {
//   //       console.log('❌ User cancelled')
//   //     } else if (error.code === 'IN_PROGRESS') {
//   //       console.log('⏳ Sign in already in progress')
//   //     } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
//   //       console.log('❌ Google Play Services not available')
//   //       FlashMessage({ message: 'Google Play Services not available' })
//   //     } else {
//   //       FlashMessage({ message: 'Google sign in failed' })
//   //     }
      
//   //     setLoading(false)
//   //     loginButtonSetter(null)
//   //   }
//   // }

//   // Navigation functions
//   const navigateToLogin = () => {
//     navigation.navigate('Login')
//   }
  
//   const navigateToRegister = () => {
//     navigation.navigate('Register')
//   }
  
//   const navigateToPhone = () => {
//     navigation.navigate('PhoneNumber', {
//       name: googleUser,
//       phone: ''
//     })
//   }
  
//   const navigateToMain = () => {
//     navigation.navigate({
//       name: 'Main',
//       merge: true
//     })
//   }

//   // Enhanced login mutation function with Apple debugging
//   async function mutateLogin(user) {
//     try {
//       console.log('🔐 [Login Debug] Starting login mutation for:', user.email)
//       console.log('🔐 [Login Debug] User type:', user.type)
//       console.log('🔐 [Login Debug] Full user object:', user)
      
//       let notificationToken = null
      
//       if (Device.isDevice) {
//         try {
//           const { status: existingStatus } = await Notifications.getPermissionsAsync()
//           console.log('🔐 [Login Debug] Notification permission status:', existingStatus)
          
//           if (existingStatus === 'granted') {
//             try {
//               const tokenData = await Notifications.getExpoPushTokenAsync({
//                 projectId: Constants.expoConfig?.extra?.eas?.projectId
//               })
//               notificationToken = tokenData.data
//               console.log('🔐 [Login Debug] ✅ Got notification token')
//             } catch (tokenError) {
//               console.warn('🔐 [Login Debug] ⚠️ Could not get push token (this is OK):', tokenError.message)
//               notificationToken = null
//             }
//           } else {
//             console.log('🔐 [Login Debug] ℹ️ Notification permission not granted, skipping token')
//           }
//         } catch (permissionError) {
//           console.warn('🔐 [Login Debug] ⚠️ Could not check notification permissions:', permissionError.message)
//           notificationToken = null
//         }
//       } else {
//         console.log('🔐 [Login Debug] ℹ️ Not a physical device, skipping notification token')
//       }

//       console.log('🔐 [Login Debug] About to call GraphQL mutation with variables:', {
//         ...user,
//         notificationToken: notificationToken ? 'token_present' : 'no_token'
//       })

//       mutate({
//         variables: {
//           ...user,
//           notificationToken: notificationToken
//         }
//       })
//     } catch (error) {
//       console.error('🔐 [Login Debug] ❌ Error in mutateLogin:', error)
//       setLoading(false)
//       loginButtonSetter(null)
//     }
//   }

//   // Enhanced Apple authentication check with debugging
//   useEffect(() => {
//     checkIfSupportsAppleAuthentication()
//   }, [])

//   async function checkIfSupportsAppleAuthentication() {
//     try {
//       console.log('🍎 [Apple Debug] Checking Apple Authentication support...')
//       console.log('🍎 [Apple Debug] Platform:', Platform.OS)
//       console.log('🍎 [Apple Debug] Device type:', Device.deviceType)
      
//       const isAvailable = await AppleAuthentication.isAvailableAsync()
//       console.log('🍎 [Apple Debug] Apple Authentication available:', isAvailable)
      
//       if (Platform.OS === 'ios') {
//         console.log('🍎 [Apple Debug] Running on iOS - Apple should be available')
//       } else {
//         console.log('🍎 [Apple Debug] Not running on iOS - Apple will not be available')
//       }
      
//       setEnableApple(isAvailable)
//     } catch (error) {
//       console.error('🍎 [Apple Debug] ❌ Error checking Apple Authentication:', error)
//       setEnableApple(false)
//     }
//   }

//   // Enhanced login success handler with debugging
//   async function onCompleted(data) {
//     console.log('✅ [Login Debug] Login mutation completed successfully')
//     console.log('✅ [Login Debug] Response data:', data)
//     console.log('✅ [Login Debug] User email:', data.login.email)
//     console.log('✅ [Login Debug] User active status:', data.login.isActive)
//     console.log('✅ [Login Debug] User phone:', data.login.phone)
    
//     if (data.login.isActive === false) {
//       console.log('❌ [Login Debug] Account is deactivated')
//       FlashMessage({ message: t('accountDeactivated') })
//       setLoading(false)
//       loginButtonSetter(null)
//       return
//     }

//     try {
//       console.log('✅ [Login Debug] Setting auth token...')
//       setTokenAsync(data.login.token)
//       FlashMessage({ message: 'Successfully logged in' })
      
//       // Navigate based on phone number
//       if (data?.login?.phone === '') {
//         console.log('✅ [Login Debug] No phone number - navigating to phone screen')
//         navigateToPhone()
//       } else {
//         console.log('✅ [Login Debug] Phone number exists - navigating to main app')
//         navigateToMain()
//       }
      
//     } catch (error) {
//       console.error('❌ [Login Debug] Error in onCompleted:', error)
//     } finally {
//       console.log('✅ [Login Debug] Resetting loading states')
//       setLoading(false)
//       loginButtonSetter(null)
//     }
//   }

//   // Enhanced login error handler with debugging
//   function onError(error) {
//     console.error('❌ [Login Debug] Login mutation error occurred')
//     console.error('❌ [Login Debug] Error message:', error.message)
//     console.error('❌ [Login Debug] Error code:', error.code)
//     console.error('❌ [Login Debug] Full error object:', error)
//     console.error('❌ [Login Debug] GraphQL errors:', error.graphQLErrors)
//     console.error('❌ [Login Debug] Network error:', error.networkError)
    
//     FlashMessage({
//       message: error.message || 'Login failed. Please try again.'
//     })
    
//     setLoading(false)
//     loginButtonSetter(null)
//   }

//   // Focus effect for status bar
//   useFocusEffect(() => {
//     if (Platform.OS === 'android') {
//       StatusBar.setBackgroundColor(currentTheme.main)
//     }
//     StatusBar.setBarStyle(
//       themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
//     )
//   })

//   // Link handlers
//   const openTerms = () => {
//     Linking.openURL(TERMS_AND_CONDITIONS)
//   }
  
//   const openPrivacyPolicy = () => {
//     Linking.openURL(PRIVACY_POLICY)
//   }

//   return {
//     enableApple,
//     loginButton,
//     loginButtonSetter,
//     loading,
//     setLoading,
//     themeContext,
//     mutateLogin,
//     currentTheme,
//     navigateToLogin,
//     navigateToRegister,
//     openTerms,
//     openPrivacyPolicy,
//     navigateToMain,
//     navigation,
//     signIn,
//   }
// }



import { useEffect, useState, useContext } from 'react'
import { StatusBar, Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import useEnvVars from '../../../environment'
import gql from 'graphql-tag'
import { login } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useMutation } from '@apollo/client'
import * as AppleAuthentication from 'expo-apple-authentication'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import analytics from '../../utils/analytics'
import AuthContext from '../../context/Auth'
import { useTranslation } from 'react-i18next'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const LOGIN = gql`
  ${login}
`

export const useCreateAccount = () => {
  const Analytics = analytics()
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const [mutate] = useMutation(LOGIN, { onCompleted, onError })
  const [enableApple, setEnableApple] = useState(false)
  const [loginButton, loginButtonSetter] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setTokenAsync } = useContext(AuthContext)
  const themeContext = useContext(ThemeContext)
  const [googleUser, setGoogleUser] = useState(null)
  const currentTheme = {isRTL : i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue]}
  
  const {
    IOS_CLIENT_ID_GOOGLE,
    ANDROID_CLIENT_ID_GOOGLE,
    EXPO_CLIENT_ID,
    TERMS_AND_CONDITIONS,
    PRIVACY_POLICY
  } = useEnvVars()

  // Configure Google Sign-In ONCE
  useEffect(() => {
    console.log('🔧 Configuring Google Sign-In...')
    
    GoogleSignin.configure({
      webClientId: EXPO_CLIENT_ID,
      iosClientId: IOS_CLIENT_ID_GOOGLE,
      androidClientId: ANDROID_CLIENT_ID_GOOGLE,
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
    })
    
    console.log('✅ Google Sign-In configured')
  }, [])

  // Google Sign-In Function
  const signIn = async () => {
    try {
      console.log('🚀 Starting Google sign in...')
      loginButtonSetter('Google')
      setLoading(true)

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices()
        console.log('✅ Google Play Services available')
      }

      const userInfo = await GoogleSignin.signIn()
      console.log('✅ Google sign-in successful!')
      console.log('👤 User:', userInfo.user.email)

      const userData = {
        phone: '',
        email: userInfo.user.email,
        password: '',
        name: userInfo.user.name,
        picture: userInfo.user.photo || '',
        type: 'google'
      }

      setGoogleUser(userInfo.user.name)
      console.log('🔐 Logging in user...')
      await mutateLogin(userData)

    } catch (error) {
      console.error('❌ Google sign-in error:', error)
      
      if (error.code === 'SIGN_IN_CANCELLED') {
        console.log('❌ User cancelled')
      } else if (error.code === 'IN_PROGRESS') {
        console.log('⏳ Sign in already in progress')
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        console.log('❌ Google Play Services not available')
        FlashMessage({ message: 'Google Play Services not available' })
      } else {
        FlashMessage({ message: 'Google sign in failed' })
      }
      
      setLoading(false)
      loginButtonSetter(null)
    }
  }

  // Navigation functions
  const navigateToLogin = () => {
    navigation.navigate('Login')
  }
  
  const navigateToRegister = () => {
    navigation.navigate('Register')
  }
  
  const navigateToPhone = () => {
    navigation.navigate('PhoneNumber', {
      name: googleUser,
      phone: ''
    })
  }
  
  const navigateToMain = () => {
    navigation.navigate({
      name: 'Main',
      merge: true
    })
  }

  // Enhanced login mutation function with Apple debugging
  async function mutateLogin(user) {
    try {
      console.log('🔐 [Login Debug] Starting login mutation for:', user.email)
      console.log('🔐 [Login Debug] User type:', user.type)
      console.log('🔐 [Login Debug] Full user object:', user)
      
      let notificationToken = null
      
      if (Device.isDevice) {
        try {
          const { status: existingStatus } = await Notifications.getPermissionsAsync()
          console.log('🔐 [Login Debug] Notification permission status:', existingStatus)
          
          if (existingStatus === 'granted') {
            try {
              const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId
              })
              notificationToken = tokenData.data
              console.log('🔐 [Login Debug] ✅ Got notification token')
            } catch (tokenError) {
              console.warn('🔐 [Login Debug] ⚠️ Could not get push token (this is OK):', tokenError.message)
              notificationToken = null
            }
          } else {
            console.log('🔐 [Login Debug] ℹ️ Notification permission not granted, skipping token')
          }
        } catch (permissionError) {
          console.warn('🔐 [Login Debug] ⚠️ Could not check notification permissions:', permissionError.message)
          notificationToken = null
        }
      } else {
        console.log('🔐 [Login Debug] ℹ️ Not a physical device, skipping notification token')
      }

      console.log('🔐 [Login Debug] About to call GraphQL mutation with variables:', {
        ...user,
        notificationToken: notificationToken ? 'token_present' : 'no_token'
      })

      mutate({
        variables: {
          ...user,
          notificationToken: notificationToken
        }
      })
    } catch (error) {
      console.error('🔐 [Login Debug] ❌ Error in mutateLogin:', error)
      setLoading(false)
      loginButtonSetter(null)
    }
  }

  // Enhanced Apple authentication check with debugging
  useEffect(() => {
    checkIfSupportsAppleAuthentication()
  }, [])

  async function checkIfSupportsAppleAuthentication() {
    try {
      console.log('🍎 [Apple Debug] Checking Apple Authentication support...')
      console.log('🍎 [Apple Debug] Platform:', Platform.OS)
      console.log('🍎 [Apple Debug] Device type:', Device.deviceType)
      
      const isAvailable = await AppleAuthentication.isAvailableAsync()
      console.log('🍎 [Apple Debug] Apple Authentication available:', isAvailable)
      
      if (Platform.OS === 'ios') {
        console.log('🍎 [Apple Debug] Running on iOS - Apple should be available')
      } else {
        console.log('🍎 [Apple Debug] Not running on iOS - Apple will not be available')
      }
      
      setEnableApple(isAvailable)
    } catch (error) {
      console.error('🍎 [Apple Debug] ❌ Error checking Apple Authentication:', error)
      setEnableApple(false)
    }
  }

  // Enhanced login success handler with debugging
  async function onCompleted(data) {
    console.log('✅ [Login Debug] Login mutation completed successfully')
    console.log('✅ [Login Debug] Response data:', data)
    console.log('✅ [Login Debug] User email:', data.login.email)
    console.log('✅ [Login Debug] User active status:', data.login.isActive)
    console.log('✅ [Login Debug] User phone:', data.login.phone)
    
    if (data.login.isActive === false) {
      console.log('❌ [Login Debug] Account is deactivated')
      FlashMessage({ message: t('accountDeactivated') })
      setLoading(false)
      loginButtonSetter(null)
      return
    }

    try {
      console.log('✅ [Login Debug] Setting auth token...')
      setTokenAsync(data.login.token)
      FlashMessage({ message: 'Successfully logged in' })
      
      // Navigate based on phone number
      if (data?.login?.phone === '') {
        console.log('✅ [Login Debug] No phone number - navigating to phone screen')
        navigateToPhone()
      } else {
        console.log('✅ [Login Debug] Phone number exists - navigating to main app')
        navigateToMain()
      }
      
    } catch (error) {
      console.error('❌ [Login Debug] Error in onCompleted:', error)
    } finally {
      console.log('✅ [Login Debug] Resetting loading states')
      setLoading(false)
      loginButtonSetter(null)
    }
  }

  // Enhanced login error handler with debugging
  function onError(error) {
    console.error('❌ [Login Debug] Login mutation error occurred')
    console.error('❌ [Login Debug] Error message:', error.message)
    console.error('❌ [Login Debug] Error code:', error.code)
    console.error('❌ [Login Debug] Full error object:', error)
    console.error('❌ [Login Debug] GraphQL errors:', error.graphQLErrors)
    console.error('❌ [Login Debug] Network error:', error.networkError)
    
    FlashMessage({
      message: error.message || 'Login failed. Please try again.'
    })
    
    setLoading(false)
    loginButtonSetter(null)
  }

  // Focus effect for status bar
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.main)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  // Link handlers
  const openTerms = () => {
    Linking.openURL(TERMS_AND_CONDITIONS)
  }
  
  const openPrivacyPolicy = () => {
    Linking.openURL(PRIVACY_POLICY)
  }

  return {
    enableApple,
    loginButton,
    loginButtonSetter,
    loading,
    setLoading,
    themeContext,
    mutateLogin,
    currentTheme,
    navigateToLogin,
    navigateToRegister,
    openTerms,
    openPrivacyPolicy,
    navigateToMain,
    navigation,
    signIn,
  }
}