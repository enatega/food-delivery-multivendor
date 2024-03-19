import React from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { getConfiguration } from '../apollo/queries'

const GETCONFIGURATION = gql`
  ${getConfiguration}
`

const ConfigurationContext = React.createContext({})

export const ConfigurationProvider = props => {
  const { loading, data, error } = useQuery(GETCONFIGURATION)

  const configuration =
    loading || error || !data.configuration
      ? {
          currency: '',
          currencySymbol: '',
          deliveryRate: 0,
          expoClientID:
            '967541328677-d46sl62t52g5r3o5m0mnl2hpptr242nl.apps.googleusercontent.com',
          androidClientID:
            '967541328677-o7lcengpu35dugcdbnp4otsfnmngoknr.apps.googleusercontent.com',
          iOSClientID:
            '967541328677-gvm85f1ouq92aucsannaduurf5r8mh2r.apps.googleusercontent.com'
        }
      : data.configuration
  return (
    <ConfigurationContext.Provider value={configuration}>
      {props.children}
    </ConfigurationContext.Provider>
  )
}
export const ConfigurationConsumer = ConfigurationContext.Consumer
export default ConfigurationContext
