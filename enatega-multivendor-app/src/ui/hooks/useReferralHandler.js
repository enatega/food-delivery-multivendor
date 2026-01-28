import { useEffect, useState, useContext } from 'react'
import { getStoredReferralCode, clearStoredReferralCode } from '../../utils/branch.io'
import AuthContext from '../../context/Auth'
import UserContext from '../../context/User'
import navigationService from '../../routes/navigationService'

export const useReferralHandler = () => {
  const [pendingReferralCode, setPendingReferralCode] = useState(null)
  const [shouldShowReferralEntry, setShouldShowReferralEntry] = useState(false)
  const { isLoggedIn } = useContext(AuthContext)
  const { profile } = useContext(UserContext)

  const checkPendingReferralCode = async () => {
    try {
      const storedReferral = await getStoredReferralCode()
      
      if (storedReferral && storedReferral.code) {
        // Clear any leftover stored referral codes
        await clearStoredReferralCode()
      }
      // Don't show referral entry screen - handled directly in signup flows
    } catch (error) {
      // Silent error handling
    }
  }

  const showReferralEntryScreen = () => {
    navigationService.navigate('ReferralCodeEntry', {
      isNewUser: true,
      prefilledCode: pendingReferralCode?.code,
      onComplete: () => {
        setShouldShowReferralEntry(false)
        setPendingReferralCode(null)
        clearStoredReferralCode()
      }
    })
  }

  const clearPendingReferral = async () => {
    setPendingReferralCode(null)
    setShouldShowReferralEntry(false)
    await clearStoredReferralCode()
  }

  useEffect(() => {
    checkPendingReferralCode()
  }, [isLoggedIn, profile])

  useEffect(() => {
    if (shouldShowReferralEntry && pendingReferralCode) {
      setTimeout(() => {
        showReferralEntryScreen()
      }, 1000)
    }
  }, [shouldShowReferralEntry, pendingReferralCode])

  return {
    pendingReferralCode,
    shouldShowReferralEntry,
    checkPendingReferralCode,
    showReferralEntryScreen,
    clearPendingReferral
  }
}