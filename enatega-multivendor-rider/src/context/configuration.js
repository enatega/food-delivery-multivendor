import React from 'react'
import { useQuery, gql } from '@apollo/client'

import { configuration } from '../apollo/queries'

const GETCONFIGURATION = gql`
  ${configuration}
`

const ConfigurationContext = React.createContext({})

export const ConfigurationProvider = props => {
  const { loading, data, error } = useQuery(GETCONFIGURATION)
  const configuration =
    loading || error || !data.configuration ? {} : data.configuration
  return (
    <ConfigurationContext.Provider value={configuration}>
      {props.children}
    </ConfigurationContext.Provider>
  )
}
export const ConfigurationConsumer = ConfigurationContext.Consumer
export default ConfigurationContext
