// useCreateAccount.ios.js

import { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { StatusBar, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import useEnvVars from '../../../environment'; // Adjust path if necessary
import gql from 'graphql-tag';
import { login } from '../../apollo/mutations'; // Adjust path if necessary
import ThemeContext from '../../ui/ThemeContext/ThemeContext'; // Adjust path if necessary
import { theme } from '../../utils/themeColors'; // Adjust path if necessary
import { useMutation } from '@apollo/client';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'; // Adjust path if necessary
import analytics from '../../utils/analytics'; // Adjust path if necessary
import AuthContext from '../../context/Auth'; // Adjust path if necessary
import { useTranslation } from 'react-i18next';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'; // iOS-specific Google import
import useNotifications from '../../utils/useNotifications';
WebBrowser.maybeCompleteAuthSession(); // Important for Expo Auth Session


const LOGIN = gql`
  ${login}
`;

export const useCreateAccount = () => {
  const Analytics = analytics();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [mutate] = useMutation(LOGIN, { onCompleted, onError });
  const [enableApple, setEnableApple] = useState(false);
  const [loginButton, loginButtonSetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setTokenAsync } = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);
  const [googleUser, setGoogleUser] = useState(null);
  const [pendingGoogleUserData, setPendingGoogleUserData] = useState(null);
  const pendingGoogleUserDataRef = useRef(null);
  const [pendingAppleUserData, setPendingAppleUserData] = useState(null);
  const pendingAppleUserDataRef = useRef(null);
  const referralCallbacksRef = useRef({ onContinue: null, onSkip: null });
  const appleReferralCallbacksRef = useRef({ onContinue: null, onSkip: null });
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] };
  const { registerForPushNotificationsAsync }  = useNotifications()

  const {
    IOS_CLIENT_ID_GOOGLE,
    ANDROID_CLIENT_ID_GOOGLE,
    EXPO_CLIENT_ID,
    TERMS_AND_CONDITIONS,
    PRIVACY_POLICY
  } = useEnvVars();


  // Google Auth Request for iOS (using expo-auth-session)
  // Hardcoded client IDs as per your provided iOS code block
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "756039622157-tfukdfcu22keu8vcen8atkbvptvd0jdp.apps.googleusercontent.com", // Web client ID for Expo
    androidClientId: "756039622157-uvii3hb3tr8eleopl448dj8hrikrnv2i.apps.googleusercontent.com", // Android client ID
    iosClientId: "756039622157-n6rqegdvm03s1m85rne57akl3rkr5dv8.apps.googleusercontent.com", // iOS client ID
    scopes: ['profile', 'email', 'openid'],
  });

  // Effect to handle the Google authentication response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchUserInfo(authentication.accessToken);
    } else if (response?.type === 'error') {
      console.error('Authentication error:', response.error);
      FlashMessage({ message: `Google sign-in failed: ${response.error.message || 'Unknown error'}` });
      setLoading(false);
      loginButtonSetter(null);
    } else if (response?.type === 'cancel') {
        FlashMessage({ message: 'Google sign-in cancelled.' });
        setLoading(false);
        loginButtonSetter(null);
    }
  }, [response]);

  // Fetches user information from Google API after successful token acquisition
  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const user = await response.json();

      const userData = {
        phone: '',
        email: user.email,
        password: '',
        name: user.name,
        picture: user.photo || '',
        type: 'google'
      };

      setGoogleUser(userData.name);
      setPendingGoogleUserData(userData);
      pendingGoogleUserDataRef.current = userData;
      setLoading(false);
      
      // Navigate to RefralScreen with user data and callbacks
      console.log('📱 Navigating to RefralScreen...');
      navigation.navigate('RefralScreen', { 
        userData: userData,
        onContinue: referralCallbacksRef.current.onContinue,
        onSkip: referralCallbacksRef.current.onSkip
      });

    } catch (error) {
      console.error('❌ Google fetch user info error:', error);
      FlashMessage({ message: 'Failed to retrieve Google user info.' });
      setLoading(false);
      loginButtonSetter(null);
    }
  };

  // Google Sign-In Function for iOS
  const signIn = async () => {
    try {
      loginButtonSetter('Google');
      setLoading(true);

      if (!request) {
        console.error("Google authentication request is not ready.");
        FlashMessage({ message: 'Google sign-in is not ready. Please try again.' });
        setLoading(false);
        loginButtonSetter(null);
        return;
      }

      await promptAsync({
        useProxy: false, // Recommended for standalone apps
        windowFeatures: 'popup', // Not strictly needed for mobile but harmless
      });
    } catch (e) {
      console.error('Error during sign-in prompt: ' + e.message, e);
      FlashMessage({ message: 'Google sign-in failed unexpectedly.' });
      setLoading(false);
      loginButtonSetter(null);
    }
  };

  // Handle referral continue with code
  const handleReferralContinue = useCallback(async (referralCode) => {
    const userData = pendingGoogleUserDataRef.current;
    if (!userData) {
      console.error('❌ No pending Google user data');
      return;
    }

    setLoading(true);
    loginButtonSetter('Google');
    console.log('🔐 Logging in user with referral code:', referralCode);
    const response = await mutateLogin({ ...userData, referralCode });
    // Clear pending data after use
    pendingGoogleUserDataRef.current = null;
    setPendingGoogleUserData(null);
  }, []);

  // Handle referral skip
  const handleReferralSkip = useCallback(async () => {
    const userData = pendingGoogleUserDataRef.current;
    if (!userData) {
      console.error('❌ No pending Google user data');
      return;
    }

    setLoading(true);
    loginButtonSetter('Google');
    console.log('🔐 Logging in user without referral code');
    await mutateLogin(userData);
    // Clear pending data after use
    pendingGoogleUserDataRef.current = null;
    setPendingGoogleUserData(null);
  }, []);

  // Handle Apple referral continue with code
  const handleAppleReferralContinue = useCallback(async (referralCode) => {
    const userData = pendingAppleUserDataRef.current;
    if (!userData) {
      console.error('❌ No pending Apple user data');
      return;
    }

    setLoading(true);
    loginButtonSetter('Apple');
    console.log('🍎 [Apple Debug] Logging in user with referral code:', referralCode);
    await mutateLogin({ ...userData, referralCode });
    // Clear pending data after use
    pendingAppleUserDataRef.current = null;
    setPendingAppleUserData(null);
  }, []);

  // Handle Apple referral skip
  const handleAppleReferralSkip = useCallback(async () => {
    const userData = pendingAppleUserDataRef.current;
    if (!userData) {
      console.error('❌ No pending Apple user data');
      return;
    }

    setLoading(true);
    loginButtonSetter('Apple');
    console.log('🍎 [Apple Debug] Logging in user without referral code');
    await mutateLogin(userData);
    // Clear pending data after use
    pendingAppleUserDataRef.current = null;
    setPendingAppleUserData(null);
  }, []);

  // Store callbacks in ref for navigation params
  useEffect(() => {
    referralCallbacksRef.current = {
      onContinue: handleReferralContinue,
      onSkip: handleReferralSkip
    };
    appleReferralCallbacksRef.current = {
      onContinue: handleAppleReferralContinue,
      onSkip: handleAppleReferralSkip
    };
  }, [handleReferralContinue, handleReferralSkip, handleAppleReferralContinue, handleAppleReferralSkip]);

  // Navigation listener to handle fallback case when callbacks don't work
  useFocusEffect(
    useCallback(() => {
      const params = navigation.getState()?.routes?.find(r => r.name === 'CreateAccount')?.params;
      if (params) {
        const { referralCode, referralSkipped } = params;
        const googleUserData = pendingGoogleUserDataRef.current;
        const appleUserData = pendingAppleUserDataRef.current;
        
        // Handle Google user data
        if (googleUserData) {
          if (referralCode) {
            console.log('🔐 Handling referral code from navigation params:', referralCode);
            handleReferralContinue(referralCode);
            // Clear params
            navigation.setParams({ referralCode: undefined });
          } else if (referralSkipped) {
            console.log('🔐 Handling referral skip from navigation params');
            handleReferralSkip();
            // Clear params
            navigation.setParams({ referralSkipped: undefined });
          }
        }
        
        // Handle Apple user data
        if (appleUserData) {
          if (referralCode) {
            console.log('🍎 [Apple Debug] Handling referral code from navigation params:', referralCode);
            handleAppleReferralContinue(referralCode);
            // Clear params
            navigation.setParams({ referralCode: undefined });
          } else if (referralSkipped) {
            console.log('🍎 [Apple Debug] Handling referral skip from navigation params');
            handleAppleReferralSkip();
            // Clear params
            navigation.setParams({ referralSkipped: undefined });
          }
        }
      }
    }, [navigation, handleReferralContinue, handleReferralSkip, handleAppleReferralContinue, handleAppleReferralSkip])
  );

  // --- Common Navigation Functions ---
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToPhone = () => {
    // Use Google user name if available, otherwise try to get from Apple user data
    const userName = googleUser || pendingAppleUserDataRef.current?.name || '';
    navigation.navigate('PhoneNumber', {
      name: userName,
      phone: ''
    });
  };

  const navigateToMain = () => {
    navigation.navigate({
      name: 'Main',
      merge: true
    });
  };

  // --- Common Login Mutation Function ---
  async function mutateLogin(user) {
    try {
      console.log('🔐 [Login Debug] Starting login mutation for:', user.email);
      console.log('🔐 [Login Debug] User type:', user.type);
      console.log('🔐 [Login Debug] Referral code:', user.referralCode || 'none');
      console.log('🔐 [Login Debug] Full user object:', user);

      let token = null;
      token = await registerForPushNotificationsAsync()


      // Extract referralCode from user object if present
      const { referralCode, ...userWithoutReferral } = user;
      const mutationVariables = {
        ...userWithoutReferral,
        notificationToken: token,
        referralCode: referralCode || null
      };

      console.log('🔐 [Login Debug] About to call GraphQL mutation with variables:', {
        ...mutationVariables,
        notificationToken: token ? 'token_present' : 'no_token'
      });

      mutate({
        variables: mutationVariables
      });
    } catch (error) {
      console.error('🔐 [Login Debug] ❌ Error in mutateLogin:', error);
      setLoading(false);
      loginButtonSetter(null);
    }
  }

  // --- Common Apple Authentication Check (will only be true on iOS devices) ---
  useEffect(() => {
    checkIfSupportsAppleAuthentication();
  }, []);

  async function checkIfSupportsAppleAuthentication() {
    try {


      const isAvailable = await AppleAuthentication.isAvailableAsync();
 
      setEnableApple(isAvailable);
    } catch (error) {
      console.error('🍎 [Apple Debug] ❌ Error checking Apple Authentication:', error);
      setEnableApple(false);
    }
  }

  // --- Common Login Success Handler ---
  async function onCompleted(data) {
    console.log('✅ [Login Debug] Login mutation completed successfully');
    console.log('✅ [Login Debug] Response data:', data);
    console.log('✅ [Login Debug] User email:', data.login.email);
    console.log('✅ [Login Debug] User active status:', data.login.isActive);
    console.log('✅ [Login Debug] User phone:', data.login.phone);

    if (data.login.isActive === false) {
      console.log('❌ [Login Debug] Account is deactivated');
      FlashMessage({ message: t('accountDeactivated') });
      setLoading(false);
      loginButtonSetter(null);
      return;
    }

    try {
      console.log('✅ [Login Debug] Setting auth token...');
      setTokenAsync(data.login.token);
      FlashMessage({ message: 'Successfully logged in' });

      if (data?.login?.phone === '') {
        console.log('✅ [Login Debug] No phone number - navigating to phone screen');
        navigateToPhone();
      } else {
        console.log('✅ [Login Debug] Phone number exists - navigating to main app');
        navigateToMain();
      }

    } catch (error) {
      console.error('❌ [Login Debug] Error in onCompleted:', error);
    } finally {
      console.log('✅ [Login Debug] Resetting loading states');
      setLoading(false);
      loginButtonSetter(null);
    }
  }

  // --- Common Login Error Handler ---
  function onError(error) {
    console.error('❌ [Login Debug] Login mutation error occurred');
    console.error('❌ [Login Debug] Error message:', error.message);
    console.error('❌ [Login Debug] Full error object:', error);
    console.error('❌ [Login Debug] GraphQL errors:', error.graphQLErrors);
    console.error('❌ [Login Debug] Network error:', error.networkError);

    FlashMessage({
      message: error.message || 'Login failed. Please try again.'
    });

    setLoading(false);
    loginButtonSetter(null);
  }

  // --- Common Focus Effect for Status Bar ---
  useFocusEffect(() => {
    // StatusBar.setBackgroundColor is typically Android only
    // On iOS, you control the style
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    );
  });

  // --- Common Link Handlers ---
  const openTerms = () => {
    Linking.openURL(TERMS_AND_CONDITIONS);
  };

  const openPrivacyPolicy = () => {
    Linking.openURL(PRIVACY_POLICY);
  };

  // Function to handle Apple login and navigate to referral screen
  const handleAppleLogin = useCallback((userData) => {
    console.log('🍎 [Apple Debug] Storing Apple user data and navigating to RefralScreen');
    setPendingAppleUserData(userData);
    pendingAppleUserDataRef.current = userData;
    setLoading(false);
    
    // Navigate to RefralScreen with user data and callbacks
    navigation.navigate('RefralScreen', { 
      userData: userData,
      onContinue: appleReferralCallbacksRef.current.onContinue,
      onSkip: appleReferralCallbacksRef.current.onSkip
    });
  }, [navigation]);

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
    signIn, // iOS-specific signIn function
    handleReferralContinue,
    handleReferralSkip,
    handleAppleLogin, // Function to handle Apple login with referral flow
  };
};