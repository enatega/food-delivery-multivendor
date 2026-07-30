import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { getConfiguration } from '../apollo/queries'

const GETCONFIGURATION = gql`
  ${getConfiguration}
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
  const { loading, data, error } = useQuery(GETCONFIGURATION)

  const configuration = useMemo(
    () =>
      loading
        ? {
            ...FALLBACK_CONFIGURATION,
            isConfigurationLoaded: false
          }
        : error || !data?.configuration
          ? FALLBACK_CONFIGURATION
        : {
            ...data.configuration,
            isConfigurationLoaded: true
          },
    [loading, error, data?.configuration]
  )

  return (
    <ConfigurationContext.Provider value={configuration}>
      {props?.children}
    </ConfigurationContext.Provider>
  )
}
export const ConfigurationConsumer = ConfigurationContext.Consumer
export default ConfigurationContext
