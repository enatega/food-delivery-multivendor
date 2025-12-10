// src/utils/branchUtils.js - UPDATED WITH PROPER SELF-REFERRAL CHECK
import branch from 'react-native-branch'
import AsyncStorage from '@react-native-async-storage/async-storage'


// Storage key for referral codes
export const REFERRAL_CODE_STORAGE_KEY = 'pendingReferralCode'

// Flag to track if Branch is ready
let isBranchReady = false
let branchSessionData = null

// Initialize Branch.io
export const initializeBranch = () => {
  return new Promise((resolve, reject) => {
    try {
      console.log('🌿 Setting up Branch.io subscription...')

      // Subscribe to incoming Branch links
      const unsubscribe = branch.subscribe(({ error, params, uri }) => {
        if (error) {
          console.error('❌ Branch Error:', error)
        }

        console.log('🌿 Branch link received:', { params, uri, error })

        // Store session data
        branchSessionData = { params, uri, error }

        // Mark Branch as ready after first callback
        if (!isBranchReady) {
          isBranchReady = true
          console.log('✅ Branch session is now ready!')
        }

        // ✅ FIXED (both warm and cold starts)
        if (
          !error &&
          params &&
          (params.referralCode || params.ref || params.code)
        ) {
          // Extract referral code from custom data
          const referralCode = params.referralCode || params.ref || params.code

          // ✅ NEW CODE:
          if (referralCode) {
            console.log('🎯 Referral code detected from Branch:', referralCode)

            // ✅ FIXED: Store immediately without validation first
            // Validation will happen later in the useReferral hook
            storeReferralCode(referralCode, 'branch_link')
              .then((success) => {
                if (success) {
                  console.log(
                    '✅ Referral code stored successfully in AsyncStorage'
                  )

                  // ✅ IMPORTANT: Verify it was stored immediately
                  setTimeout(async () => {
                    const verification = await getStoredReferralCode()
                    console.log(
                      '🔍 IMMEDIATE VERIFICATION - AsyncStorage contains:',
                      verification
                    )
                  }, 100)
                } else {
                  console.log('❌ Failed to store referral code')
                }
              })
              .catch((error) => {
                console.error('❌ Error storing referral code:', error)
              })
          }
        }
      })

      // Give Branch time to initialize, then mark as ready regardless
      setTimeout(() => {
        if (!isBranchReady) {
          isBranchReady = true
          console.log(
            '✅ Branch session marked ready after timeout (fallback mode)'
          )
        }
      }, 3000)

      resolve(unsubscribe)
    } catch (error) {
      console.error('❌ Branch initialization error:', error)
      isBranchReady = true
      resolve(() => {})
    }
  })
}

// 🚫 UPDATED: Handle referral code with self-referral validation
export const handleReferralCodeWithValidation = async (
  code,
  source = 'branch_link'
) => {
  try {
    console.log('🔍 VALIDATING REFERRAL CODE:', code, 'from source:', source)

    // Get current user's referral code to check for self-referral
    const currentUserCode = await getCurrentUserReferralCode()
    console.log('👤 Current user referral code:', currentUserCode)

    if (
      currentUserCode &&
      currentUserCode.toUpperCase() === code.toUpperCase()
    ) {
      console.log(
        '❌ SELF-REFERRAL BLOCKED: User tried to use their own referral code'
      )
      console.log('  ├─ User code:', currentUserCode)
      console.log('  └─ Attempted code:', code)

      return false // Don't store the code
    }

    // Valid referral code - proceed with storage
    console.log('✅ Valid referral code - storing:', code)
    return await storeReferralCode(code, source)
  } catch (error) {
    console.error('❌ Error validating referral code:', error)
    return false
  }
}

// 🔍 UPDATED: Get current user's referral code for validation
export const getCurrentUserReferralCode = async () => {
  try {
    console.log('🔍 Getting current user referral code...')

    // First try the global callback (set by App.js)
    if (global.__getUserReferralCode) {
      console.log('🔗 Using global callback to get user referral code')
      const codeFromCallback = await global.__getUserReferralCode()
      if (codeFromCallback) {
        console.log('✅ Found referral code via callback:', codeFromCallback)
        return codeFromCallback
      }
    } else {
      console.log('⚠️ Global callback not available yet')
    }

    // Fallback: Try to get from AsyncStorage directly
    console.log('🔍 Fallback: Checking AsyncStorage for user profile...')
    const userProfileData = await AsyncStorage.getItem('userProfile')
    if (userProfileData) {
      const profile = JSON.parse(userProfileData)
      if (profile.referralCode) {
        console.log(
          '✅ Found referral code in AsyncStorage:',
          profile.referralCode
        )
        return profile.referralCode
      }
    }

    console.log('ℹ️ No user referral code found')
    return null
  } catch (error) {
    console.error('❌ Error getting current user referral code:', error.message)
    return null
  }
}

// Check if Branch is ready
export const isBranchSessionReady = () => {
  return isBranchReady
}

// Wait for Branch to be ready
export const waitForBranchReady = (timeout = 5000) => {
  return new Promise((resolve) => {
    if (isBranchReady) {
      resolve(true)
      return
    }

    const startTime = Date.now()
    const checkInterval = setInterval(() => {
      if (isBranchReady || Date.now() - startTime > timeout) {
        clearInterval(checkInterval)
        resolve(isBranchReady)
      }
    }, 100)
  })
}

// Store referral code in AsyncStorage (ONLY after validation)
export const storeReferralCode = async (code, source = 'branch_link') => {
  try {
    if (code && code.length >= 5) {
      const referralData = {
        code: code,
        source: source,
        timestamp: new Date().toISOString()
      }

      await AsyncStorage.setItem(
        REFERRAL_CODE_STORAGE_KEY,
        JSON.stringify(referralData)
      )
      console.log('✅ Stored referral code:', referralData)
      return true
    } else {
      console.log('❌ Invalid referral code format:', code)
      return false
    }
  } catch (error) {
    console.error('❌ Error storing referral code:', error)
    return false
  }
}

// Get stored referral code
export const getStoredReferralCode = async () => {
  try {
    console.log('🔍 === GETTING STORED REFERRAL CODE ===')
    console.log('🔍 Using storage key:', REFERRAL_CODE_STORAGE_KEY)
    console.log('🔍 Storage key value: "pendingReferralCode"')

    const storedData = await AsyncStorage.getItem(REFERRAL_CODE_STORAGE_KEY)
    console.log('🔍 Raw AsyncStorage data:', storedData)
    console.log('🔍 Data type:', typeof storedData)
    console.log('🔍 Data length:', storedData ? storedData.length : 'null')

    if (storedData) {
      try {
        const referralData = JSON.parse(storedData)
        console.log('✅ Successfully parsed referral data:', referralData)
        console.log('✅ Referral code extracted:', referralData.code)
        return referralData
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError)
        console.error('❌ Corrupted data:', storedData)

        // Clear corrupted data
        await AsyncStorage.removeItem(REFERRAL_CODE_STORAGE_KEY)
        console.log('🧹 Cleared corrupted referral data')
        return null
      }
    } else {
      console.log(
        'ℹ️ No data found in AsyncStorage for key:',
        REFERRAL_CODE_STORAGE_KEY
      )
      return null
    }
  } catch (error) {
    console.error('❌ Error accessing AsyncStorage:', error)
    console.error('❌ Error details:', error.message)
    return null
  }
}

// Clear stored referral code
export const clearStoredReferralCode = async () => {
  try {
    await AsyncStorage.removeItem(REFERRAL_CODE_STORAGE_KEY)
    console.log('✅ Cleared stored referral code')
    return true
  } catch (error) {
    console.error('❌ Error clearing referral code:', error)
    return false
  }
}

// Create Branch link for sharing (existing function - unchanged)
export const createReferralLink = async (referralCode, userInfo = {}) => {
  try {
    console.log('🔗 Creating Branch referral link for code:', referralCode)

    const isReady = await waitForBranchReady(4000)

    if (!isReady || (branchSessionData && branchSessionData.error)) {
      console.log('⚠️ Branch session not ready, using fallback URL')
      return createFallbackLink(referralCode, userInfo)
    }

    const linkData = {
      feature: 'referral',
      channel: 'share',
      campaign: 'referral_program',
      tags: ['referral', 'invite'],
      data: {
        referralCode: referralCode,
        ref: referralCode,
        code: referralCode,
        inviterName: userInfo.name || 'Your friend',
        $fallback_url: `https://borku.co.uk/download?ref=${referralCode}`,
        $desktop_url: `https://borku.co.uk/download?ref=${referralCode}`,
        $ios_url: `https://apps.apple.com/app/borku/id6642702509`,
        $android_url: `https://play.google.com/store/apps/details?id=com.borku.multivendor`
      }
    }

    const linkProperties = {
      feature: linkData.feature,
      channel: linkData.channel,
      campaign: linkData.campaign,
      tags: linkData.tags
    }

    const branchUniversalObject = await branch.createBranchUniversalObject(
      'referral_link',
      {
        locallyIndex: true,
        title: 'Join Enatega and get credits!',
        contentDescription: `Use my referral code ${referralCode} to get credits on your first order!`,
        contentImageUrl: 'https://borku.co.uk/assets/logo.png',
        contentMetadata: {
          customMetadata: {
            referralCode: referralCode,
            ref: referralCode,
            inviterName: userInfo.name || 'Your friend'
          }
        }
      }
    )

    const { url } = await branchUniversalObject.generateShortUrl(
      linkProperties,
      linkData.data
    )

    const shareText = `Hey! Join Enatega - the easiest and cheapest way to shop for your African foods and groceries with convenient doorstep delivery in the UK. Use my referral code ${referralCode} to get credits for every order! For the first order you complete, I get 100 Borku credits! Download:${url}`

    console.log('✅ Created Branch referral link:', url)
    return { url: url, shareText: shareText, success: true }
  } catch (error) {
    console.error('❌ Error creating Branch link:', error)
    return createFallbackLink(referralCode, userInfo)
  }
}

// Create fallback link when Branch fails
const createFallbackLink = (referralCode, userInfo = {}) => {
  console.log('🔄 Creating fallback link for:', referralCode)

  const fallbackUrl = `https://390ag.app.link/?referralCode=${referralCode}&ref=${referralCode}&$fallback_url=https://borku.co.uk/download?ref=${referralCode}`
  const fallbackText = `Hey! Join Enatega - the easiest and cheapest way to shop for your African foods and groceries with convenient doorstep delivery in the UK. Use my referral code ${referralCode} to get credits for every order! For the first order you complete, I get 100 Enatega credits! Download:${fallbackUrl}`

  return {
    url: fallbackUrl,
    shareText: fallbackText,
    success: false,
    error: 'Using fallback URL'
  }
}

// Get Branch link data (existing function - unchanged)
export const getLatestReferringParams = async () => {
  try {
    const latestParams = await branch.getLatestReferringParams()
    console.log('📋 Latest referring params:', latestParams)
    return latestParams
  } catch (error) {
    console.error('❌ Error getting latest params:', error)
    return null
  }
}

// Get first install referring params (existing function - unchanged)
export const getFirstReferringParams = async () => {
  try {
    const firstParams = await branch.getFirstReferringParams()
    console.log('📋 First referring params:', firstParams)
    return firstParams
  } catch (error) {
    console.error('❌ Error getting first params:', error)
    return null
  }
}