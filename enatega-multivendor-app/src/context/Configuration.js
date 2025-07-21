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

  console.log("Data from GETCONFIGURATION query:", JSON.stringify(data, null, 2));

  const WEB_CLIENT_ID = '650001300965-9ochl634tuvv6iguei6dl57jkmfto6r9.apps.googleusercontent.com';
  const ANDROID_CLIENT_ID = '650001300965-ii3nafver2uiu4qat9gbde9rkmhmvj0j.apps.googleusercontent.com';
  const IOS_CLIENT_ID = '650001300965-dkji7jutv8gc5m4n7cdg3nft87sauhn7.apps.googleusercontent.com';


  const configuration =
    loading || error || !data?.configuration
      ? {
          currency: '',
          currencySymbol: '',
          deliveryRate: 10,
          costType: 'perKM',
          expoClientID: WEB_CLIENT_ID,
          androidClientID:ANDROID_CLIENT_ID,
          iOSClientID:IOS_CLIENT_ID
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
