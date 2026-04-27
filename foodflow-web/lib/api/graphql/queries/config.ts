import { gql } from "@apollo/client";

export const GET_CONFIG = gql`
  query Configuration {
    configuration {
      _id
      currency
      currencySymbol
      deliveryRate
      twilioEnabled
      webClientID
      googleApiKey
      webAmplitudeApiKey
      googleMapLibraries
      googleColor
      webSentryUrl
      publishableKey
      clientId
      skipEmailVerification
      skipMobileVerification
      costType
      firebaseKey
      authDomain
      projectId
      storageBucket
      msgSenderId
      appId
    }
  }
`;
