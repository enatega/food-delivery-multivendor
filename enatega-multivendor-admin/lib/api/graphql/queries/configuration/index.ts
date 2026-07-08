import { gql } from '@apollo/client';

export const GET_CONFIGURATION = gql`
  query getConfiguration {
    configuration {
      _id
      email
      emailName
      enableEmail
      clientId
      sandbox
      publishableKey
      currency
      currencySymbol
      deliveryRate
      twilioAccountSid
      twilioPhoneNumber
      twilioEnabled
      skipWhatsAppOTP
      twilioWhatsAppNumber
      formEmail
      sendGridEnabled
      sendGridEmail
      sendGridEmailName
      dashboardSentryUrl
      webSentryUrl
      apiSentryUrl
      customerAppSentryUrl
      restaurantAppSentryUrl
      riderAppSentryUrl
      googleApiKey: googleMapsApiKey
      cloudinaryUploadUrl
      cloudinaryApiKey
      webAmplitudeApiKey
      appAmplitudeApiKey
      webClientID
      androidClientID
      iOSClientID
      expoClientID
      googleMapLibraries
      googleColor
      termsAndConditions
      privacyPolicy
      testOtp
      firebaseKey
      authDomain
      projectId
      storageBucket
      msgSenderId
      appId
      measurementId
      isPaidVersion
      skipEmailVerification
      skipMobileVerification
      costType
      vapidKey
    }
  }
`;
