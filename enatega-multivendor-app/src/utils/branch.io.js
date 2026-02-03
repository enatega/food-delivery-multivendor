import branch from 'react-native-branch'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const REFERRAL_CODE_STORAGE_KEY = 'pendingReferralCode'

let isBranchReady = false
let branchSessionData = null

export const initializeBranch = () => {
  return new Promise((resolve, reject) => {
    try {
      console.log('🌿 [BRANCH DEBUG] Initializing Branch...')
      const unsubscribe = branch.subscribe(({ error, params, uri }) => {
        console.log('🌿 [BRANCH DEBUG] Branch session data received:')
        console.log('🌿 [BRANCH DEBUG] Error:', error)
        console.log('🌿 [BRANCH DEBUG] Params:', params)
        console.log('🌿 [BRANCH DEBUG] URI:', uri)

        branchSessionData = { params, uri, error }

        if (!isBranchReady) {
          isBranchReady = true
          console.log('🌿 [BRANCH DEBUG] Branch is now ready')
        }

        if (
          !error &&
          params &&
          (params.referralCode || params.ref || params.code)
        ) {
          const referralCode = params.referralCode || params.ref || params.code
          console.log('🌿 [BRANCH DEBUG] Found referral code in params:', referralCode)

          if (referralCode) {
            console.log('🌿 [BRANCH DEBUG] Storing referral code:', referralCode)
            storeReferralCode(referralCode, 'branch_link')
          }
        } else {
          console.log('🌿 [BRANCH DEBUG] No referral code found in Branch params')
        }
      })

      setTimeout(() => {
        if (!isBranchReady) {
          console.log('🌿 [BRANCH DEBUG] Branch timeout - marking as ready')
          isBranchReady = true
        }
      }, 3000)

      resolve(unsubscribe)
    } catch (error) {
      console.error('🌿 [BRANCH DEBUG] Error initializing Branch:', error)
      isBranchReady = true
      resolve(() => { })
    }
  })
}

export const isBranchSessionReady = () => {
  return isBranchReady
}

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

export const storeReferralCode = async (code, source = 'branch_link') => {
  try {
    console.log('💾 [STORAGE DEBUG] Attempting to store referral code:', code, 'from source:', source)
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
      console.log('💾 [STORAGE DEBUG] Successfully stored referral data:', referralData)
      return true
    } else {
      console.log('💾 [STORAGE DEBUG] Referral code too short or invalid:', code)
      return false
    }
  } catch (error) {
    console.error('💾 [STORAGE DEBUG] Error storing referral code:', error)
    return false
  }
}

export const getStoredReferralCode = async () => {
  try {
    console.log('🔍 [RETRIEVAL DEBUG] Checking for stored referral code...')
    const storedData = await AsyncStorage.getItem(REFERRAL_CODE_STORAGE_KEY)
    console.log('🔍 [RETRIEVAL DEBUG] Raw stored data:', storedData)

    if (storedData) {
      try {
        const referralData = JSON.parse(storedData)
        console.log('🔍 [RETRIEVAL DEBUG] Parsed referral data:', referralData)
        return referralData
      } catch (parseError) {
        console.error('🔍 [RETRIEVAL DEBUG] Error parsing stored data:', parseError)
        await AsyncStorage.removeItem(REFERRAL_CODE_STORAGE_KEY)
        return null
      }
    } else {
      console.log('🔍 [RETRIEVAL DEBUG] No stored referral data found')
      return null
    }
  } catch (error) {
    console.error('🔍 [RETRIEVAL DEBUG] Error retrieving referral code:', error)
    return null
  }
}

export const clearStoredReferralCode = async () => {
  try {
    await AsyncStorage.removeItem(REFERRAL_CODE_STORAGE_KEY)
    return true
  } catch (error) {
    return false
  }
}

export const createReferralLink = async (referralCode, userInfo = {}) => {
  try {
    const isReady = await waitForBranchReady(4000)

    if (!isReady || (branchSessionData && branchSessionData.error)) {
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
        $fallback_url: `https://apps.apple.com/app/enatega-multivendor/id1526488093`,
        $desktop_url: `https://multivendor.enatega.com/?ref=${referralCode}`,
        $ios_url: `https://apps.apple.com/app/enatega-multivendor/id1526488093`,
        $android_url: `https://play.google.com/store/apps/details?id=com.enatega.multivendor`,
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
        contentImageUrl: 'https://cdn-inech.nitrocdn.com/jdKghPovkzWfRohbpgAZaZYRcFhYiZiI/assets/images/optimized/rev-2fba21a/enatega.com/wp-content/uploads/2025/11/Enatega-logo-250-Purple-135x.webp',
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

    return { url: url, shareText: shareText, success: true }
  } catch (error) {
    return createFallbackLink(referralCode, userInfo)
  }
}

const createFallbackLink = (referralCode, userInfo = {}) => {
  const fallbackUrl = `https://390ag.app.link/?referralCode=${referralCode}&ref=${referralCode}`
  const fallbackText = `Hey! Join Enatega - the easiest and cheapest way to shop for your African foods and groceries with convenient doorstep delivery in the UK. Use my referral code ${referralCode} to get credits for every order! For the first order you complete, I get 100 Enatega credits! Download:${fallbackUrl}`

  return {
    url: fallbackUrl,
    shareText: fallbackText,
    success: false,
    error: 'Using fallback URL'
  }
}

export const getLatestReferringParams = async () => {
  try {
    const latestParams = await branch.getLatestReferringParams()
    return latestParams
  } catch (error) {
    return null
  }
}

export const getFirstReferringParams = async () => {
  try {
    const firstParams = await branch.getFirstReferringParams()
    return firstParams
  } catch (error) {
    return null
  }
}