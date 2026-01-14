import React, { useState, useLayoutEffect, useContext } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '@react-navigation/elements'
import { useMutation } from '@apollo/client'
import { APPLY_REFERRAL_CODE } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import navigationService from '../../routes/navigationService'
import { scale } from '../../utils/scaling'

function ReferralCodeEntry(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [referralCode, setReferralCode] = useState('')
  const [loading, setLoading] = useState(false)

  const [applyReferralCode] = useMutation(APPLY_REFERRAL_CODE)

  const handleApplyCode = async () => {
    if (!referralCode.trim()) {
      Alert.alert('Error', 'Please enter a referral code')
      return
    }

    setLoading(true)
    try {
      const { data } = await applyReferralCode({
        variables: { referralCode: referralCode.trim() }
      })

      if (data?.applyReferralCode?.success) {
        Alert.alert(
          'Success!',
          'Referral code applied successfully. You\'ll earn points when you complete your first order!',
          [{ text: 'OK', onPress: () => navigationService.goBack() }]
        )
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Invalid referral code')
    } finally {
      setLoading(false)
    }
  }

  useLayoutEffect(() => {
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
  }, [props?.navigation, currentTheme])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.themeBackground }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name='card-giftcard' size={64} color={currentTheme.main} />
        </View>
        
        <Text style={[styles.title, { color: currentTheme.fontMainColor }]}>
          Have a Referral Code?
        </Text>
        
        <Text style={[styles.subtitle, { color: currentTheme.fontSecondColor }]}>
          Enter your friend's referral code to earn bonus points on your first order
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: currentTheme.white,
              borderColor: currentTheme.borderColor,
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

        <TouchableOpacity
          style={[styles.applyButton, { 
            backgroundColor: referralCode.trim() ? currentTheme.main : currentTheme.fontSecondColor,
            opacity: loading ? 0.7 : 1
          }]}
          onPress={handleApplyCode}
          disabled={!referralCode.trim() || loading}
        >
          <Text style={styles.applyButtonText}>
            {loading ? 'Applying...' : 'Apply Code'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigationService.goBack()}
        >
          <Text style={[styles.skipButtonText, { color: currentTheme.fontSecondColor }]}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    marginLeft: 10,
    alignItems: 'center'
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center'
  },
  iconContainer: {
    marginBottom: 32
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
    marginBottom: 40,
    lineHeight: 22
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24
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
  applyButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  skipButton: {
    paddingVertical: 12
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500'
  }
})

export default ReferralCodeEntry