import { ReactNode } from 'react';
import { IGlobalProps } from './global.interface';

export interface IConfigurationContextProps extends IGlobalProps {}

export interface IConfiguration {
  _id: string;
  pushToken?: string;
  webClientID?: string;
  publishableKey?: string;
  clientId?: string;
  googleApiKey?: string;
  webAmplitudeApiKey?: string;
  appAmplitudeApiKey?: string;
  googleColor?: string;
  webSentryUrl?: string;
  apiSentryUrl?: string;
  customerAppSentryUrl?: string;
  restaurantAppSentryUrl?: string;
  riderAppSentryUrl?: string;
  skipEmailVerification?: boolean;
  skipMobileVerification?: boolean;
  currency?: string;
  currencySymbol?: string;
  deliveryRate: number;
  googleMapLibraries: string;
  twilioEnabled: boolean;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioPhoneNumber?: string;
  firebaseKey?: string;
  appId?: string;
  authDomain?: string;
  storageBucket?: string;
  msgSenderId?: string;
  measurementId?: string;
  projectId?: string;
  dashboardSentryUrl?: string;
  cloudinaryUploadUrl?: string;
  cloudinaryApiKey?: string;
  vapidKey?: string;
  isPaidVersion?: boolean;
  email?: string;
  emailName?: string;
  password?: string;
  enableEmail?: boolean;
  clientSecret?: string;
  sandbox?: boolean;
  secretKey?: string;
  formEmail?: string;
  sendGridApiKey?: string;
  sendGridEnabled?: boolean;
  sendGridEmail?: string;
  sendGridEmailName?: string;
  sendGridPassword?: string;
  androidClientID?: string;
  iOSClientID?: string;
  expoClientID?: string;
  termsAndConditions?: string;
  privacyPolicy?: string;
  testOtp?: string;
  enableRiderDemo?: boolean;
  enableRestaurantDemo?: boolean;
  enableAdminDemo?: boolean;
  costType?: string;
}

export interface IConfigurationUnresolved {
  currency: string;
  currencySymbol: string;
  deliveryRate: number;
}

export interface IConfigurationProviderProps {
  children: ReactNode;
}

export interface IFirebaseConfig {
  FIREBASE_AUTH_DOMAIN: string | undefined;
  FIREBASE_KEY: string | undefined;
  FIREBASE_PROJECT_ID: string | undefined;
  FIREBASE_STORAGE_BUCKET: string | undefined;
  FIREBASE_MSG_SENDER_ID: string | undefined;
  FIREBASE_APP_ID: string | undefined;
  FIREBASE_MEASUREMENT_ID: string | undefined;
}
