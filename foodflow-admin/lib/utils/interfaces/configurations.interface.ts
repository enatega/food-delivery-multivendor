import { IDropdownSelectItem, IGlobalComponentProps } from './global.interface';

export interface IConfigCardComponentProps extends IGlobalComponentProps {
  toggleLabel?: string;
  toggleValue?: boolean;
  toggleOnChange?: () => void;
  buttonLoading: boolean;
  cardTitle: string;
}

export interface INodeMailerForm {
  email: string | undefined;
  password: string | undefined;
  emailName: string | undefined;
  enableEmail: boolean | undefined;
}

export interface IStripeForm {
  publishableKey: string | undefined;
  secretKey: string | undefined;
}

export interface IPaypalForm {
  clientId: string | undefined;
  clientSecret: string | undefined;
  sandbox: boolean | undefined;
}

export interface IDeliveryRateForm {
  deliveryRate: number | null;
  costType: string;
}

export interface ITwilioForm {
  twilioAccountSid: string | undefined;
  twilioAuthToken: string | undefined;
  twilioPhoneNumber: number | null;
  twilioEnabled: boolean | undefined;
  twilioWhatsAppNumber: number | null;
}

export interface ISentryForm {
  dashboardSentryUrl: string | undefined;
  webSentryUrl: string | undefined;
  apiSentryUrl: string | undefined;
  customerAppSentryUrl: string | undefined;
  restaurantAppSentryUrl: string | undefined;
  riderAppSentryUrl: string | undefined;
}

export interface IGoogleApiForm {
  googleApiKey: string;
}

export interface ICloudinaryForm {
  cloudinaryUploadUrl: string | undefined;
  cloudinaryApiKey: string | undefined;
}

export interface IAmplitudeForm {
  webAmplitudeApiKey: string;
  appAmplitudeApiKey: string;
}

export interface IGoogleClientForm {
  webClientID: string;
  androidClientID: string;
  iOSClientID: string;
  expoClientID: string;
}

export interface IFirebaseForm {
  firebaseKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  msgSenderId: string;
  appId: string;
  measurementId: string;
  vapidKey: string;
}

export interface IAppConfigForm {
  termsAndConditions: string;
  privacyPolicy: string;
  testOtp: number | null;
}

export interface IVerificationConfigForm {
  skipEmailVerification: boolean;
  skipMobileVerification: boolean;
  skipWhatsAppOTP: boolean;
}

export interface ICurrencyForm {
  currency: IDropdownSelectItem | null;
  currencySymbol: IDropdownSelectItem | null;
}
