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
    loading || error || !data?.configuration
      ? {
          currency: '',
          currencySymbol: '',
        deliveryRate: 10,
          costType: 'perKM',
          expoClientID:
            '139790486043-9jp4uj64spndf1aqh5fcjt6mc2dj8luu.apps.googleusercontent.com',
          androidClientID:
            '139790486043-1uis4uui8j0i999pj2efke5ckts1sqic.apps.googleusercontent.com',
          iOSClientID:
            '139790486043-60c2ah0hd8v5cecnq8gqdtokhm2q35m1.apps.googleusercontent.com'
        }
      : data?.configuration
  
  return (
    <ConfigurationContext.Provider value={configuration}>
      {props?.children}
    </ConfigurationContext.Provider>
  )
}
export const ConfigurationConsumer = ConfigurationContext.Consumer
export default ConfigurationContext
