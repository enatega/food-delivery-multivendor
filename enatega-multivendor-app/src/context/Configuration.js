import React, { useContext, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { getConfiguration } from '../apollo/queries'
import { useAppMode } from '../mode/AppModeContext'
import { APP_MODES } from '../mode/constants'
import AuthContext from './Auth'

const GETCONFIGURATION = gql`
  ${getConfiguration}
`

const GET_SINGLE_VENDOR_CONFIGURATION = gql`
  query SingleVendorConfiguration {
    configuration {
      _id
      currency
      currencySymbol
      deliveryRate
      twilioEnabled
      appAmplitudeApiKey
      customerAppSentryUrl
      termsAndConditions
      privacyPolicy
      testOtp
      skipMobileVerification
      skipEmailVerification
      costType
      publishableKey
    }
  }
`

// Module-level constant so the fallback keeps a stable reference across renders
// instead of being recreated on every render (PERF-002).
const FALLBACK_CONFIGURATION = {
  currency: '',
  currencySymbol: '',
  deliveryRate: 10,
  costType: 'perKM',
  enableCustomerDemoMode: false,
  customerDemoZoneId: null,
  isConfigurationLoaded: true
}

const ConfigurationContext = React.createContext({})

export const ConfigurationProvider = props => {
  const { mode } = useAppMode()
  const { token } = useContext(AuthContext)
  const isSingleVendor = mode === APP_MODES.SINGLE
  const query = mode === APP_MODES.SINGLE
    ? GET_SINGLE_VENDOR_CONFIGURATION
    : GETCONFIGURATION
  const { loading, data, error } = useQuery(query, {
    skip: isSingleVendor && !token
  })

  const configuration = useMemo(
    () =>
      loading
        ? {
            ...FALLBACK_CONFIGURATION,
            isConfigurationLoaded: false
          }
        : error || !data?.configuration
          ? { ...FALLBACK_CONFIGURATION, appMode: mode }
        : {
            ...data.configuration,
            isConfigurationLoaded: true,
            appMode: mode
          },
    [loading, error, data?.configuration, mode]
  )

  return (
    <ConfigurationContext.Provider value={configuration}>
      {props?.children}
    </ConfigurationContext.Provider>
  )
}
export const ConfigurationConsumer = ConfigurationContext.Consumer
export default ConfigurationContext
