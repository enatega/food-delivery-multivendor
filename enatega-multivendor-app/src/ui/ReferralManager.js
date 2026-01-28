import React from 'react'
import { useReferralHandler } from './hooks/useReferralHandler'

const ReferralManager = () => {
  const { 
    pendingReferralCode, 
    shouldShowReferralEntry,
    checkPendingReferralCode 
  } = useReferralHandler()

  return null
}

export default ReferralManager