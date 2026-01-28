import AsyncStorage from '@react-native-async-storage/async-storage'

const REFERRAL_CODE_KEY = '@referral_code'

export const storeReferralCode = async (code) => {
  try {
    await AsyncStorage.setItem(REFERRAL_CODE_KEY, code)
  } catch (error) {
    console.error('Error storing referral code:', error)
  }
}

export const getReferralCode = async () => {
  try {
    return await AsyncStorage.getItem(REFERRAL_CODE_KEY)
  } catch (error) {
    console.error('Error getting referral code:', error)
    return null
  }
}

export const clearReferralCode = async () => {
  try {
    await AsyncStorage.removeItem(REFERRAL_CODE_KEY)
  } catch (error) {
    console.error('Error clearing referral code:', error)
  }
}