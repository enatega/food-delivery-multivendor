import { gql } from '@apollo/client';

export const SAVE_EMAIL_CONFIGURATION = gql`
  mutation SAVE_EMAIL_CONFIGURATION(
    $configurationInput: EmailConfigurationInput!
  ) {
    saveEmailConfiguration(configurationInput: $configurationInput) {
      _id
      email
      emailName
      password
      enableEmail
    }
  }
`;

export const SAVE_FORM_EMAIL_CONFIGURATION = gql`
  mutation SAVE_FORM_EMAIL_CONFIGURATION(
    $configurationInput: FormEmailConfigurationInput!
  ) {
    saveFormEmailConfiguration(configurationInput: $configurationInput) {
      _id
      formEmail
    }
  }
`;

export const SAVE_SENDGRID_API_KEY = gql`
  mutation SAVE_SENDGRID_API_KEY(
    $configurationInput: SendGridConfigurationInput!
  ) {
    saveSendGridConfiguration(configurationInput: $configurationInput) {
      _id
      sendGridApiKey
      sendGridEnabled
      sendGridEmail
      sendGridEmailName
      sendGridPassword
    }
  }
`;

export const SAVE_FIREBASE_CONFIGURATION = gql`
  mutation SAVE_FIREBASE_CONFIGURATION(
    $configurationInput: FirebaseConfigurationInput!
  ) {
    saveFirebaseConfiguration(configurationInput: $configurationInput) {
      _id
      firebaseKey
      authDomain
      projectId
      storageBucket
      msgSenderId
      appId
      measurementId
      vapidKey
    }
  }
`;

export const SAVE_SENTRY_CONFIGURATION = gql`
  mutation SAVE_SENTRY_CONFIGURATION(
    $configurationInput: SentryConfigurationInput!
  ) {
    saveSentryConfiguration(configurationInput: $configurationInput) {
      _id
      dashboardSentryUrl
      webSentryUrl
      apiSentryUrl
      customerAppSentryUrl
      restaurantAppSentryUrl
      riderAppSentryUrl
    }
  }
`;

export const SAVE_GOOGLE_API_KEY_CONFIGURATION = gql`
  mutation SAVE_GOOGLE_API_KEY_CONFIGURATION(
    $configurationInput: GoogleApiKeyConfigurationInput!
  ) {
    saveGoogleApiKeyConfiguration(configurationInput: $configurationInput) {
      _id
      googleApiKey
    }
  }
`;

export const SAVE_CLOUDINARY_CONFIGURATION = gql`
  mutation SAVE_CLOUDINARY_CONFIGURATION(
    $configurationInput: CloudinaryConfigurationInput!
  ) {
    saveCloudinaryConfiguration(configurationInput: $configurationInput) {
      _id
      cloudinaryUploadUrl
      cloudinaryApiKey
    }
  }
`;

export const SAVE_AMPLITUDE_API_KEY_CONFIGURATION = gql`
  mutation SAVE_AMPLITUDE_API_KEY_CONFIGURATION(
    $configurationInput: AmplitudeApiKeyConfigurationInput!
  ) {
    saveAmplitudeApiKeyConfiguration(configurationInput: $configurationInput) {
      _id
      webAmplitudeApiKey
      appAmplitudeApiKey
    }
  }
`;

export const SAVE_GOOGLE_CLIENT_ID_CONFIGURATION = gql`
  mutation SAVE_GOOGLE_CLIENT_ID_CONFIGURATION(
    $configurationInput: GoogleClientIDConfigurationInput!
  ) {
    saveGoogleClientIDConfiguration(configurationInput: $configurationInput) {
      _id
      webClientID
      androidClientID
      iOSClientID
      expoClientID
    }
  }
`;

export const SAVE_WEB_CONFIGURATION = gql`
  mutation SAVE_WEB_CONFIGURATION($configurationInput: WebConfigurationInput!) {
    saveWebConfiguration(configurationInput: $configurationInput) {
      _id
      googleMapLibraries
      googleColor
    }
  }
`;

export const SAVE_APP_CONFIGURATION = gql`
  mutation SAVE_APP_CONFIGURATION(
    $configurationInput: AppConfigurationsInput!
  ) {
    saveAppConfigurations(configurationInput: $configurationInput) {
      _id
      termsAndConditions
      privacyPolicy
      testOtp
    }
  }
`;

export const SAVE_DELIVERY_RATE_CONFIGURATION = gql`
  mutation SAVE_DELIVERY_RATE_CONFIGURATION(
    $configurationInput: DeliveryCostConfigurationInput!
  ) {
    saveDeliveryRateConfiguration(configurationInput: $configurationInput) {
      _id
      deliveryRate
      costType
    }
  }
`;

export const SAVE_PAYPAL_CONFIGURATION = gql`
  mutation SAVE_PAYPAL_CONFIGURATION(
    $configurationInput: PaypalConfigurationInput!
  ) {
    savePaypalConfiguration(configurationInput: $configurationInput) {
      _id
      clientId
      clientSecret
      sandbox
    }
  }
`;

export const SAVE_STRIPE_CONFIGURATION = gql`
  mutation SAVE_STRIPE_CONFIGURATION(
    $configurationInput: StripeConfigurationInput!
  ) {
    saveStripeConfiguration(configurationInput: $configurationInput) {
      _id
      publishableKey
      secretKey
    }
  }
`;

export const SAVE_TWILIO_CONFIGURATION = gql`
  mutation SAVE_TWILIO_CONFIGURATION(
    $configurationInput: TwilioConfigurationInput!
  ) {
    saveTwilioConfiguration(configurationInput: $configurationInput) {
      _id
      twilioAccountSid
      twilioAuthToken
      twilioPhoneNumber
      twilioEnabled
    }
  }
`;

export const SAVE_VERIFICATION_CONFIGURATION = gql`
  mutation SAVE_VERIFICATIONS_TOGGLE(
    $configurationInput: VerificationConfigurationInput!
  ) {
    saveVerificationsToggle(configurationInput: $configurationInput) {
      skipEmailVerification
      skipMobileVerification
    }
  }
`;

export const SAVE_CURRENCY_CONFIGURATION = gql`
  mutation SAVE_CURRENCY_CONFIGURATION(
    $configurationInput: CurrencyConfigurationInput!
  ) {
    saveCurrencyConfiguration(configurationInput: $configurationInput) {
      _id
      currency
      currencySymbol
    }
  }
`;
