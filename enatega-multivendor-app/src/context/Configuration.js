import React from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { getConfiguration } from '../apollo/queries'

const GETCONFIGURATION = gql`
  ${getConfiguration}
`

const ConfigurationContext = React.createContext({})

const initialConfig = {
  _id: '',
  email: '',
  password: '',
  emailName: '',
  enableEmail: true,
  clientId: '',
  clientSecret: '',
  sandbox: false,
  publishableKey: '',
  secretKey: '',
  currency: '',
  currencySymbol: '',
  deliveryRate: 5,
  twilioAccountSid: '',
  twilioAuthToken: '',
  twilioPhoneNumber: '',
  twilioEnabled: false,
  formEmail: '',
  sendGridApiKey: '',
  sendGridEnabled: false,
  sendGridEmail: '',
  sendGridEmailName: '',
  sendGridPassword: '',
  dashboardSentryUrl: '',
  webSentryUrl: '',
  apiSentryUrl: '',
  customerAppSentryUrl: '',
  restaurantAppSentryUrl: '',
  riderAppSentryUrl: '',
  googleApiKey: '',
  cloudinaryUploadUrl: '',
  cloudinaryApiKey: '',
  webClientID: '',
  androidClientID: '',
  iOSClientID: '',
  expoClientID: '',
  googleMapLibraries: '',
  googleColor: '',
  termsAndConditions: '',
  privacyPolicy: '',
  testOtp: '',
  firebaseKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  msgSenderId: '',
  appId: '',
  measurementId: '',
  isPaidVersion: false,
  skipMobileVerification: false,
  skipEmailVerification: false,
  costType: '',
  vapidKey: ''
}
export const ConfigurationProvider = (props) => {
  const { loading, data, error } = useQuery(GETCONFIGURATION)

  const configuration =
    loading || error || !data.configuration
      ? {
         ...initialConfig,
          expoClientID:
            '967541328677-d46sl62t52g5r3o5m0mnl2hpptr242nl.apps.googleusercontent.com',
          androidClientID:
            '967541328677-7264tf7tkdtoufk844rck9mimrve135c.apps.googleusercontent.com',
          iOSClientID:
            '967541328677-nf8h4ou7rhmq9fahs87p057rggo95eah.apps.googleusercontent.com'
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
