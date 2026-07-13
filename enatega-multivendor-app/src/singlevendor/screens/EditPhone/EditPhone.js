import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native'
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons, Entypo } from '@expo/vector-icons'
import CountryPicker from 'react-native-country-picker-modal'
import UserContext from '../../../context/User'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import PhoneNumberInput from '../../../components/PhoneNumberInput'
import { ScreenHeader } from '../../components/Common'
import Spinner from '../../../components/Spinner/Spinner'

import styles from './styles'

const EditPhone = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { t, i18n } = useTranslation()
  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const initialPhone = route?.params?.phone || profile?.phone || ''

  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  // Set default country - change these values as needed
  const [country, setCountry] = useState({ cca2: 'PK', callingCode: ['92'] }) // Pakistan as default
  const [countryCode, setCountryCode] = useState('PK')
  const [isProcessing, setIsProcessing] = useState(false)

  // Parse initial phone number to extract country code and number
  useEffect(() => {
    if (initialPhone) {
      // Remove + and any spaces
      const cleanPhone = initialPhone.replace(/[\s+]/g, '')
      
      // Try to match common country codes (1-3 digits)
      // Pakistan: 92, US: 1, UK: 44, etc.
      let extractedCountryCode = '92' // default
      let extractedNumber = cleanPhone
      
      // Check for common country codes
      if (cleanPhone.startsWith('92')) {
        extractedCountryCode = '92'
        extractedNumber = cleanPhone.substring(2)
      } else if (cleanPhone.startsWith('1') && cleanPhone.length === 11) {
        extractedCountryCode = '1'
        extractedNumber = cleanPhone.substring(1)
      } else if (cleanPhone.startsWith('44')) {
        extractedCountryCode = '44'
        extractedNumber = cleanPhone.substring(2)
      } else if (cleanPhone.startsWith('91')) {
        extractedCountryCode = '91'
        extractedNumber = cleanPhone.substring(2)
      }
      
      // Set the phone number without country code
      setPhone(extractedNumber)
      
      // Set country based on extracted code
      if (extractedCountryCode === '92') {
        setCountry({ cca2: 'PK', callingCode: ['92'] })
        setCountryCode('PK')
      } else if (extractedCountryCode === '1') {
        setCountry({ cca2: 'US', callingCode: ['1'] })
        setCountryCode('US')
      } else if (extractedCountryCode === '44') {
        setCountry({ cca2: 'GB', callingCode: ['44'] })
        setCountryCode('GB')
      } else if (extractedCountryCode === '91') {
        setCountry({ cca2: 'IN', callingCode: ['91'] })
        setCountryCode('IN')
      }
    }
  }, [initialPhone])

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  const onCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry)
    setCountryCode(selectedCountry.cca2)
  }

  const validatePhone = () => {
    setPhoneError('')

    const trimmedPhone = phone.trim()

    if (!trimmedPhone) {
      setPhoneError(t('Phone number is required'))
      return false
    }

    return true
  }

  const handleUpdate = async () => {
    if (!validatePhone()) {
      return
    }

    setIsProcessing(true)
    const fullPhoneNumber = `+${country.callingCode[0]}${phone.trim()}`
    
    // Navigate directly to OTP verification screen
    navigation.navigate('PhoneOtp', {
      phone: fullPhoneNumber,
      name: profile?.name,
      prevScreen: 'AccountDetails'
    })
    
    setIsProcessing(false)
  }

  const isChanged = phone.trim() !== '' && phone.trim() !== initialPhone

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      {/* Header */}
      <ScreenHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
        title={t('Phone number')}
        subtitle={t('Update your phone number. You will need to verify it after updating.')}
      />

      {/* Content */}
      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles(currentTheme).contentContainer}>
          {/* Phone Number Input */}
          <View style={styles(currentTheme).inputContainer}>
            <TextDefault
              H5
              textColor={currentTheme.fontMainColor}
              style={styles(currentTheme).inputLabel}
              bold
            >
              {t('Phone number')}
            </TextDefault>
            <View
              style={[
                styles(currentTheme).phoneInputContainer,
                phoneError && styles(currentTheme).errorInput
              ]}
            >
              <TouchableOpacity
                style={styles(currentTheme).countryCodeContainer}
                onPress={() => setShowCountryPicker(true)}
                activeOpacity={0.7}
              >
                <View style={styles(currentTheme).countryCodeInner}>
                  <TextDefault
                    H5
                    textColor={currentTheme.fontMainColor}
                    style={styles(currentTheme).countryCodeText}
                  >
                    +{country?.callingCode[0]}
                  </TextDefault>
                  <Entypo
                    name="chevron-small-down"
                    size={22}
                    color={currentTheme.fontSecondColor}
                  />
                </View>
              </TouchableOpacity>
              <PhoneNumberInput
                setError={setPhoneError}
                placeholder={t('Enter phone number')}
                placeholderTextColor={currentTheme.fontSecondColor}
                style={styles(currentTheme).phoneField}
                countryCode={country?.callingCode[0]}
                value={phone}
                onChange={(e) => setPhone(e)}
              />
            </View>
            {phoneError !== '' && (
              <TextDefault
                style={styles(currentTheme).errorText}
                textColor={currentTheme.red600}
              >
                {phoneError}
              </TextDefault>
            )}
          </View>

          {/* Info Message */}
          <View style={styles(currentTheme).infoContainer}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={currentTheme.fontSecondColor}
            />
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              style={styles(currentTheme).infoText}
            >
              {t('verification_code_msg')}
            </TextDefault>
          </View>
        </View>
      </ScrollView>

      {/* Country Picker Modal */}
      <CountryPicker
        visible={showCountryPicker}
        withFilter
        withFlag
        withAlphaFilter
        withCallingCode
        withEmoji
        onClose={() => setShowCountryPicker(false)}
        onSelect={(country) => {
          onCountrySelect(country)
          setShowCountryPicker(false)
        }}
        countryCode={countryCode}
        containerButtonStyle={{ display: 'none' }}
        theme={{
          backgroundColor: currentTheme.themeBackground,
          primaryColor: currentTheme.fontMainColor,
          primaryColorVariant: currentTheme.fontSecondColor,
          onBackgroundTextColor: currentTheme.fontMainColor
        }}
      />

      {/* Update Button */}
      <View style={styles(currentTheme).footer}>
        <TouchableOpacity
          style={[
            styles(currentTheme).updateButton,
            (!isChanged || isProcessing) && styles(currentTheme).updateButtonDisabled
          ]}
          onPress={handleUpdate}
          disabled={!isChanged || isProcessing}
          activeOpacity={0.7}
        >
          {isProcessing ? (
            <Spinner 
              size="small" 
              backColor="transparent" 
              spinnerColor={!isChanged || isProcessing ? currentTheme.fontMainColor : '#FFFFFF'} 
            />
          ) : (
            <TextDefault
              H4
              bolder
              textColor={!isChanged || isProcessing ? currentTheme.fontSecondColor : '#FFFFFF'}
            >
              {t('Update')}
            </TextDefault>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default EditPhone
