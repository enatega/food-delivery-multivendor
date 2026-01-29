import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type ActivityDetails = {
  __typename?: 'ActivityDetails';
  _id: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  referralsByLevel: ActivityReferralsByLevel;
  totalEarnings: Scalars['Float']['output'];
  totalReferrals: Scalars['Int']['output'];
};

export type ActivityReferralsByLevel = {
  __typename?: 'ActivityReferralsByLevel';
  level1: ReferralLevelDetails;
  level2: ReferralLevelDetails;
  level3: ReferralLevelDetails;
};

export type Addon = {
  __typename?: 'Addon';
  _id: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  isOutOfStock?: Maybe<Scalars['Boolean']['output']>;
  options?: Maybe<Array<Scalars['String']['output']>>;
  quantityMaximum: Scalars['Int']['output'];
  quantityMinimum: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type AddonInput = {
  addons: Array<CreateAddonInput>;
  restaurant: Scalars['String']['input'];
};

export type AddonsInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Address = {
  __typename?: 'Address';
  _id: Scalars['ID']['output'];
  deliveryAddress: Scalars['String']['output'];
  details?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  location?: Maybe<Point>;
  selected?: Maybe<Scalars['Boolean']['output']>;
};

export type AddressInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  deliveryAddress: Scalars['String']['input'];
  details?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  latitude?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['String']['input']>;
};

export type Admin = {
  __typename?: 'Admin';
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  token: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type AllShopTypeResponse = {
  __typename?: 'AllShopTypeResponse';
  _id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
};

export type AllShopTypes = {
  __typename?: 'AllShopTypes';
  data?: Maybe<Array<Maybe<AllShopTypeResponse>>>;
};

export type AmplitudeApiKeyConfigurationInput = {
  appAmplitudeApiKey: Scalars['String']['input'];
  webAmplitudeApiKey: Scalars['String']['input'];
};

export type AppConfigurationsInput = {
  privacyPolicy: Scalars['String']['input'];
  termsAndConditions: Scalars['String']['input'];
  testOtp: Scalars['String']['input'];
};

export type AppType = {
  __typename?: 'AppType';
  android?: Maybe<Scalars['String']['output']>;
  ios?: Maybe<Scalars['String']['output']>;
};

export type AppTypeInput = {
  android?: InputMaybe<Scalars['String']['input']>;
  ios?: InputMaybe<Scalars['String']['input']>;
};

export type ApplyReferralCodeResponse = {
  __typename?: 'ApplyReferralCodeResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type AuditLog = {
  __typename?: 'AuditLog';
  _id: Scalars['ID']['output'];
  action: Scalars['String']['output'];
  admin: Owner;
  changes?: Maybe<Scalars['JSON']['output']>;
  targetId?: Maybe<Scalars['ID']['output']>;
  targetType?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['Date']['output'];
};

export type AuditLogPagination = {
  __typename?: 'AuditLogPagination';
  auditLogs: Array<AuditLog>;
  currentPage: Scalars['Int']['output'];
  nextPage?: Maybe<Scalars['Int']['output']>;
  prevPage?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type AuthData = {
  __typename?: 'AuthData';
  addresses?: Maybe<Location>;
  email?: Maybe<Scalars['String']['output']>;
  emailIsVerified?: Maybe<Scalars['Boolean']['output']>;
  isActive: Scalars['Boolean']['output'];
  isNewUser?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  phoneIsVerified?: Maybe<Scalars['Boolean']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
  referralCode?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  riderRequestStatus?: Maybe<Scalars['String']['output']>;
  token: Scalars['String']['output'];
  tokenExpiration: Scalars['Int']['output'];
  userId: Scalars['ID']['output'];
  userTypeId?: Maybe<Scalars['String']['output']>;
};

export type BankDetails = {
  __typename?: 'BankDetails';
  accountCode: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  accountNumber: Scalars['String']['output'];
  bankName: Scalars['String']['output'];
};

export type Banner = {
  __typename?: 'Banner';
  _id: Scalars['String']['output'];
  action?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  file?: Maybe<Scalars['String']['output']>;
  parameters?: Maybe<Scalars['String']['output']>;
  screen?: Maybe<Scalars['String']['output']>;
  shopType?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type BannerInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  action?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  file?: InputMaybe<Scalars['String']['input']>;
  parameters?: InputMaybe<Scalars['String']['input']>;
  screen?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type BussinessDetails = {
  __typename?: 'BussinessDetails';
  accountCode?: Maybe<Scalars['String']['output']>;
  accountName?: Maybe<Scalars['String']['output']>;
  accountNumber?: Maybe<Scalars['Float']['output']>;
  bankName?: Maybe<Scalars['String']['output']>;
  bussinessRegNo?: Maybe<Scalars['Float']['output']>;
  companyRegNo?: Maybe<Scalars['Float']['output']>;
  taxRate?: Maybe<Scalars['Float']['output']>;
};

export type BussinessDetailsInput = {
  accountCode?: InputMaybe<Scalars['String']['input']>;
  accountName?: InputMaybe<Scalars['String']['input']>;
  accountNumber?: InputMaybe<Scalars['Float']['input']>;
  bankName?: InputMaybe<Scalars['String']['input']>;
  bussinessRegNo?: InputMaybe<Scalars['Float']['input']>;
  companyRegNo?: InputMaybe<Scalars['Float']['input']>;
  taxRate?: InputMaybe<Scalars['Float']['input']>;
};

export type CartAddon = {
  __typename?: 'CartAddon';
  _id: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<Option>>;
  quantityMaximum: Scalars['Int']['output'];
  quantityMinimum: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type CartAddonInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CartFood = {
  __typename?: 'CartFood';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  image: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  variation: CartVariation;
};

export type CartFoodInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  variation: CartVariationInput;
};

export type CartVariation = {
  __typename?: 'CartVariation';
  _id: Scalars['ID']['output'];
  addons?: Maybe<Array<CartAddon>>;
  discounted?: Maybe<Scalars['Float']['output']>;
  price: Scalars['Float']['output'];
  title: Scalars['String']['output'];
};

export type CartVariationInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  addons?: InputMaybe<Array<CartAddonInput>>;
};

export type Category = {
  __typename?: 'Category';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  foods?: Maybe<Array<Food>>;
  image?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CategoryDetailsResponse = {
  __typename?: 'CategoryDetailsResponse';
  id?: Maybe<Scalars['String']['output']>;
  items?: Maybe<Array<CategoryDetailsResponse>>;
  label?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type CategoryDetailsResponseForMobile = {
  __typename?: 'CategoryDetailsResponseForMobile';
  category_name?: Maybe<Scalars['String']['output']>;
  food_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type CategoryInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  restaurant: Scalars['String']['input'];
  subCategories: Array<InputMaybe<SubCategoryInput>>;
  title: Scalars['String']['input'];
};

export type CategoryItems = {
  __typename?: 'CategoryItems';
  category_id: Scalars['ID']['output'];
  category_name: Scalars['String']['output'];
  children: Array<SubCategoryItems>;
  products: Array<Food>;
};

export type Chat = {
  __typename?: 'Chat';
  images?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type ChatMessageInput = {
  message: Scalars['String']['input'];
  user: ChatUserInput;
};

export type ChatMessageOutput = {
  __typename?: 'ChatMessageOutput';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  user: ChatUserOutput;
};

export type ChatMessageResponse = {
  __typename?: 'ChatMessageResponse';
  data?: Maybe<ChatMessageOutput>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ChatUserInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type ChatUserOutput = {
  __typename?: 'ChatUserOutput';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CircleBoundsInput = {
  radius?: InputMaybe<Scalars['Float']['input']>;
};

export type CircleBoundsResponse = {
  __typename?: 'CircleBoundsResponse';
  radius?: Maybe<Scalars['Float']['output']>;
};

export type City = {
  __typename?: 'City';
  id?: Maybe<Scalars['Int']['output']>;
  latitude?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type CloudinaryConfigurationInput = {
  cloudinaryApiKey: Scalars['String']['input'];
  cloudinaryUploadUrl: Scalars['String']['input'];
};

export type Configuration = {
  __typename?: 'Configuration';
  _id: Scalars['String']['output'];
  androidClientID?: Maybe<Scalars['String']['output']>;
  apiSentryUrl?: Maybe<Scalars['String']['output']>;
  appAmplitudeApiKey?: Maybe<Scalars['String']['output']>;
  appId?: Maybe<Scalars['String']['output']>;
  authDomain?: Maybe<Scalars['String']['output']>;
  clientId?: Maybe<Scalars['String']['output']>;
  clientSecret?: Maybe<Scalars['String']['output']>;
  cloudinaryApiKey?: Maybe<Scalars['String']['output']>;
  cloudinaryUploadUrl?: Maybe<Scalars['String']['output']>;
  costType?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  currencySymbol?: Maybe<Scalars['String']['output']>;
  customerAppSentryUrl?: Maybe<Scalars['String']['output']>;
  dashboardSentryUrl?: Maybe<Scalars['String']['output']>;
  deliveryRate?: Maybe<Scalars['Float']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailName?: Maybe<Scalars['String']['output']>;
  enableAdminDemo?: Maybe<Scalars['Boolean']['output']>;
  enableEmail?: Maybe<Scalars['Boolean']['output']>;
  enableRestaurantDemo?: Maybe<Scalars['Boolean']['output']>;
  enableRiderDemo?: Maybe<Scalars['Boolean']['output']>;
  expoClientID?: Maybe<Scalars['String']['output']>;
  firebaseKey?: Maybe<Scalars['String']['output']>;
  formEmail?: Maybe<Scalars['String']['output']>;
  googleApiKey?: Maybe<Scalars['String']['output']>;
  googleColor?: Maybe<Scalars['String']['output']>;
  googleMapLibraries?: Maybe<Scalars['String']['output']>;
  iOSClientID?: Maybe<Scalars['String']['output']>;
  isPaidVersion?: Maybe<Scalars['Boolean']['output']>;
  measurementId?: Maybe<Scalars['String']['output']>;
  msgSenderId?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  privacyPolicy?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  publishableKey?: Maybe<Scalars['String']['output']>;
  pushToken?: Maybe<Scalars['String']['output']>;
  restaurantAppSentryUrl?: Maybe<Scalars['String']['output']>;
  riderAppSentryUrl?: Maybe<Scalars['String']['output']>;
  sandbox?: Maybe<Scalars['Boolean']['output']>;
  secretKey?: Maybe<Scalars['String']['output']>;
  sendGridApiKey?: Maybe<Scalars['String']['output']>;
  sendGridEmail?: Maybe<Scalars['String']['output']>;
  sendGridEmailName?: Maybe<Scalars['String']['output']>;
  sendGridEnabled?: Maybe<Scalars['Boolean']['output']>;
  sendGridPassword?: Maybe<Scalars['String']['output']>;
  skipEmailVerification?: Maybe<Scalars['Boolean']['output']>;
  skipMobileVerification?: Maybe<Scalars['Boolean']['output']>;
  skipWhatsAppOTP?: Maybe<Scalars['Boolean']['output']>;
  storageBucket?: Maybe<Scalars['String']['output']>;
  termsAndConditions?: Maybe<Scalars['String']['output']>;
  testOtp?: Maybe<Scalars['String']['output']>;
  twilioAccountSid?: Maybe<Scalars['String']['output']>;
  twilioAuthToken?: Maybe<Scalars['String']['output']>;
  twilioEnabled?: Maybe<Scalars['Boolean']['output']>;
  twilioPhoneNumber?: Maybe<Scalars['String']['output']>;
  twilioWhatsAppNumber?: Maybe<Scalars['String']['output']>;
  vapidKey?: Maybe<Scalars['String']['output']>;
  webAmplitudeApiKey?: Maybe<Scalars['String']['output']>;
  webClientID?: Maybe<Scalars['String']['output']>;
  webSentryUrl?: Maybe<Scalars['String']['output']>;
};

export type ConvertPointsInput = {
  points: Scalars['Int']['input'];
};

export type CoordinatesInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type CoordinatesResponse = {
  __typename?: 'CoordinatesResponse';
  coordinates?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type Country = {
  __typename?: 'Country';
  _id?: Maybe<Scalars['ID']['output']>;
  cities?: Maybe<Array<Maybe<City>>>;
  flag?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  latitude?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type CountryDropdownResponse = {
  __typename?: 'CountryDropdownResponse';
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Coupon = {
  __typename?: 'Coupon';
  _id: Scalars['String']['output'];
  discount: Scalars['Float']['output'];
  enabled: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type CouponInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  discount: Scalars['Float']['input'];
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  title: Scalars['String']['input'];
};

export type CouponResponse = {
  __typename?: 'CouponResponse';
  coupon?: Maybe<ResponseCouponDetails>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CreateOptionInput = {
  options: Array<OptionInput>;
  restaurant?: InputMaybe<Scalars['String']['input']>;
};

export type CreateShopTypeInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type Cuisine = {
  __typename?: 'Cuisine';
  _id: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  shopType?: Maybe<Scalars['String']['output']>;
};

export type CuisineFilterInput = {
  keyword?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  paginate?: InputMaybe<Scalars['Boolean']['input']>;
  shopType?: InputMaybe<Scalars['String']['input']>;
};

export type CuisineInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  shopType?: InputMaybe<Scalars['String']['input']>;
};

export type CurrencyConfigurationInput = {
  currency: Scalars['String']['input'];
  currencySymbol: Scalars['String']['input'];
};

export type DashboardCounts = {
  __typename?: 'DashboardCounts';
  percentageChange?: Maybe<PercentageChange>;
  restaurantsCount?: Maybe<Array<Scalars['Int']['output']>>;
  ridersCount?: Maybe<Array<Scalars['Int']['output']>>;
  usersCount?: Maybe<Array<Scalars['Int']['output']>>;
  vendorsCount?: Maybe<Array<Scalars['Int']['output']>>;
};

export type DashboardData = {
  __typename?: 'DashboardData';
  totalOrders: Scalars['Int']['output'];
  totalSales: Scalars['Float']['output'];
};

export type DashboardOrderSalesDetailsByPaymentMethodResponse = {
  __typename?: 'DashboardOrderSalesDetailsByPaymentMethodResponse';
  all: Array<DashboardOrderSalesDetailsResponse>;
  card: Array<DashboardOrderSalesDetailsResponse>;
  cod: Array<DashboardOrderSalesDetailsResponse>;
};

export type DashboardOrderSalesDetailsResponse = {
  __typename?: 'DashboardOrderSalesDetailsResponse';
  _type: Scalars['String']['output'];
  data: DashboardSalesOrderDetails;
};

export type DashboardOrders = {
  __typename?: 'DashboardOrders';
  orders?: Maybe<Array<OrdersValues>>;
};

export type DashboardOrdersByType = {
  __typename?: 'DashboardOrdersByType';
  label: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type DashboardSales = {
  __typename?: 'DashboardSales';
  orders?: Maybe<Array<SalesValues>>;
};

export type DashboardSalesByType = {
  __typename?: 'DashboardSalesByType';
  label: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type DashboardSalesOrderCountDetails = {
  __typename?: 'DashboardSalesOrderCountDetails';
  ordersCount: Array<Scalars['Int']['output']>;
  salesAmount: Array<Scalars['Float']['output']>;
};

export type DashboardSalesOrderDetails = {
  __typename?: 'DashboardSalesOrderDetails';
  total_delivery_fee: Scalars['Float']['output'];
  total_orders: Scalars['Int']['output'];
  total_sales: Scalars['Float']['output'];
  total_sales_without_delivery: Scalars['Float']['output'];
};

export type DashboardUsers = {
  __typename?: 'DashboardUsers';
  restaurantsCount: Scalars['Int']['output'];
  ridersCount: Scalars['Int']['output'];
  usersCount: Scalars['Int']['output'];
  vendorsCount: Scalars['Int']['output'];
};

export type DateFilter = {
  ending_date?: InputMaybe<Scalars['String']['input']>;
  starting_date?: InputMaybe<Scalars['String']['input']>;
};

export type DaySchedule = {
  __typename?: 'DaySchedule';
  day: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  slots: Array<TimeSlot>;
};

export type DayScheduleInput = {
  day: Scalars['String']['input'];
  enabled: Scalars['Boolean']['input'];
  slots: Array<TimeSlotInput>;
};

export type DeleteResult = {
  __typename?: 'DeleteResult';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export enum DeleteTypeEnum {
  Hard = 'HARD',
  Soft = 'SOFT'
}

export type DeliveryBoundsResponse = {
  __typename?: 'DeliveryBoundsResponse';
  coordinates?: Maybe<Array<Maybe<Array<Maybe<Array<Scalars['Float']['output']>>>>>>;
};

export type DeliveryCostConfigurationInput = {
  costType?: InputMaybe<Scalars['String']['input']>;
  deliveryRate: Scalars['Float']['input'];
};

export type DeliveryInfo = {
  __typename?: 'DeliveryInfo';
  deliveryDistance?: Maybe<Scalars['Float']['output']>;
  deliveryFee?: Maybe<Scalars['Float']['output']>;
  minDeliveryFee?: Maybe<Scalars['Float']['output']>;
};

export type DemoConfigurationInput = {
  enableAdminDemo: Scalars['Boolean']['input'];
  enableRestaurantDemo: Scalars['Boolean']['input'];
  enableRiderDemo: Scalars['Boolean']['input'];
};

export type DemoCredentails = {
  __typename?: 'DemoCredentails';
  restaurantPassword?: Maybe<Scalars['String']['output']>;
  restaurantUsername?: Maybe<Scalars['String']['output']>;
  riderPassword?: Maybe<Scalars['String']['output']>;
  riderUsername?: Maybe<Scalars['String']['output']>;
};

export type Earnings = {
  __typename?: 'Earnings';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  orderId: Scalars['String']['output'];
  orderType: Scalars['String']['output'];
  paymentMethod: Scalars['String']['output'];
  platformEarnings: PlatformEarnings;
  riderEarnings?: Maybe<RiderEarnings>;
  storeEarnings?: Maybe<StoreEarnings>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type EarningsByLevel = {
  __typename?: 'EarningsByLevel';
  totalEarnings: Scalars['Float']['output'];
  totalReferrals: Scalars['Int']['output'];
};

export type EarningsData = {
  __typename?: 'EarningsData';
  earnings?: Maybe<Array<Earnings>>;
  grandTotalEarnings?: Maybe<GrandTotalEarnings>;
};

export type EarningsInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  deliveryFee: Scalars['Float']['input'];
  deliveryTime: Scalars['String']['input'];
  orderId: Scalars['String']['input'];
  orderStatus: Scalars['String']['input'];
  paymentMethod: Scalars['String']['input'];
  rider: Scalars['String']['input'];
};

export type EarningsResponse = {
  __typename?: 'EarningsResponse';
  data?: Maybe<EarningsData>;
  message?: Maybe<Scalars['String']['output']>;
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type EmailConfigurationInput = {
  email: Scalars['String']['input'];
  emailName: Scalars['String']['input'];
  enableEmail: Scalars['Boolean']['input'];
  password: Scalars['String']['input'];
};

export type FetchLoyaltyReferralHistoryFilterInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchShopTypeFilter = {
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type FetchUniqueShopTypeInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type FiltersInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<SupportTicketStatus>;
};

export type FirebaseConfigurationInput = {
  appId: Scalars['String']['input'];
  authDomain: Scalars['String']['input'];
  firebaseKey: Scalars['String']['input'];
  measurementId: Scalars['String']['input'];
  msgSenderId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  storageBucket: Scalars['String']['input'];
  vapidKey?: InputMaybe<Scalars['String']['input']>;
};

export type Food = {
  __typename?: 'Food';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isOutOfStock?: Maybe<Scalars['Boolean']['output']>;
  subCategory?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  variations: Array<Variation>;
};

export type FoodInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  category: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isOutOfStock?: InputMaybe<Scalars['Boolean']['input']>;
  restaurant: Scalars['String']['input'];
  subCategory?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  variations: Array<VariationInput>;
};

export type ForgotPassword = {
  __typename?: 'ForgotPassword';
  result: Scalars['Boolean']['output'];
};

export type FormEmailConfigurationInput = {
  formEmail: Scalars['String']['input'];
};

export type FormSubmissionInput = {
  email: Scalars['String']['input'];
  message: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type FormSubmissionResponse = {
  __typename?: 'FormSubmissionResponse';
  message: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type GetAllCuisinesResponse = {
  __typename?: 'GetAllCuisinesResponse';
  cuisines: Array<Cuisine>;
  currentPage: Scalars['Int']['output'];
  docsCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type GoogleApiKeyConfigurationInput = {
  googleApiKey: Scalars['String']['input'];
};

export type GoogleClientIdConfigurationInput = {
  androidClientID: Scalars['String']['input'];
  expoClientID: Scalars['String']['input'];
  iOSClientID: Scalars['String']['input'];
  webClientID: Scalars['String']['input'];
};

export type GrandTotalEarnings = {
  __typename?: 'GrandTotalEarnings';
  platformTotal?: Maybe<Scalars['Float']['output']>;
  riderTotal?: Maybe<Scalars['Float']['output']>;
  storeTotal?: Maybe<Scalars['Float']['output']>;
};

export type Item = {
  __typename?: 'Item';
  _id: Scalars['ID']['output'];
  addons?: Maybe<Array<ItemAddon>>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  food: Scalars['String']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  quantity: Scalars['Int']['output'];
  specialInstructions?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  variation: ItemVariation;
};

export type ItemAddon = {
  __typename?: 'ItemAddon';
  _id: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<ItemOption>>;
  quantityMaximum: Scalars['Int']['output'];
  quantityMinimum: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type ItemOption = {
  __typename?: 'ItemOption';
  _id: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  title: Scalars['String']['output'];
};

export type ItemVariation = {
  __typename?: 'ItemVariation';
  _id: Scalars['ID']['output'];
  discounted: Scalars['Float']['output'];
  id?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  title: Scalars['String']['output'];
};

export type LicenseDetails = {
  __typename?: 'LicenseDetails';
  expiryDate?: Maybe<Scalars['Date']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
};

export type LicenseDetailsInput = {
  expiryDate?: InputMaybe<Scalars['Date']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
};

export type LiveActivityResponse = {
  __typename?: 'LiveActivityResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Location = {
  __typename?: 'Location';
  deliveryAddress?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Point>;
};

export type LocationInput = {
  deliveryAddress?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<PointInput>;
};

export type LoyaltyBreakdown = {
  __typename?: 'LoyaltyBreakdown';
  _id: Scalars['String']['output'];
  bronze: Scalars['Float']['output'];
  gold: Scalars['Float']['output'];
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
  platinum: Scalars['Float']['output'];
  silver: Scalars['Float']['output'];
};

export type LoyaltyBreakdownInput = {
  bronze: Scalars['Float']['input'];
  gold: Scalars['Float']['input'];
  max: Scalars['Float']['input'];
  min: Scalars['Float']['input'];
  platinum: Scalars['Float']['input'];
  silver: Scalars['Float']['input'];
};

export type LoyaltyConfiguration = {
  __typename?: 'LoyaltyConfiguration';
  _id: Scalars['String']['output'];
  pointsPerDollar: Scalars['Int']['output'];
};

export type LoyaltyConfigurationInput = {
  pointsPerDollar: Scalars['Int']['input'];
};

export type LoyaltyLevel = {
  __typename?: 'LoyaltyLevel';
  _id: Scalars['String']['output'];
  amount?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  points?: Maybe<Scalars['Float']['output']>;
};

export type LoyaltyLevelInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  points?: InputMaybe<Scalars['Float']['input']>;
  userType: Scalars['String']['input'];
};

export type LoyaltyReferralAnalytics = {
  __typename?: 'LoyaltyReferralAnalytics';
  totalPointsDistributed?: Maybe<Scalars['Int']['output']>;
  totalReferralCashDistributed?: Maybe<Scalars['Float']['output']>;
  totalReferrals?: Maybe<Scalars['Int']['output']>;
};

export type LoyaltyReferralHistoryResponse = {
  __typename?: 'LoyaltyReferralHistoryResponse';
  currentPage: Scalars['Int']['output'];
  data: Array<Maybe<LoyalyReferralHistory>>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPrevPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type LoyaltyTier = {
  __typename?: 'LoyaltyTier';
  _id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  points: Scalars['Float']['output'];
};

export type LoyaltyTierInput = {
  name: Scalars['String']['input'];
  points?: InputMaybe<Scalars['Float']['input']>;
};

export type LoyalyReferralHistory = {
  __typename?: 'LoyalyReferralHistory';
  _id: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  level: Scalars['Int']['output'];
  source: Scalars['String']['output'];
  triggeredBy: Scalars['String']['output'];
  type: Scalars['String']['output'];
  user_name: Scalars['String']['output'];
  user_rank: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type Message = {
  __typename?: 'Message';
  _id: Scalars['ID']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  senderType: Scalars['String']['output'];
  ticket: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
};

export type MessageInput = {
  content: Scalars['String']['input'];
  ticket: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  Deactivate: User;
  abortOrder?: Maybe<Order>;
  acceptOrder: Order;
  acceptRiderRequest?: Maybe<Rider>;
  addFavourite: User;
  addOrUpdateLiveActivityToken: LiveActivityResponse;
  addRestaurantToOffer?: Maybe<Offer>;
  adminLogin: Admin;
  applyReferralCode: ApplyReferralCodeResponse;
  assignOrder?: Maybe<Order>;
  assignRider: Order;
  banner: Banner;
  cancelOrder: Order;
  changePassword: Scalars['Boolean']['output'];
  convertPointsToWallet: Scalars['Boolean']['output'];
  coupon: CouponResponse;
  createAddons: Restaurant;
  createAddress: User;
  createBanner: Banner;
  createCategory: Restaurant;
  createCoupon: Coupon;
  createCuisine: Cuisine;
  createEarning: Earnings;
  createFood: Restaurant;
  createLoyaltyBreakdown?: Maybe<LoyaltyBreakdown>;
  createLoyaltyLevel?: Maybe<LoyaltyLevel>;
  createLoyaltyTier?: Maybe<LoyaltyTier>;
  createMessage: Message;
  createOffer: Offer;
  createOptions: Restaurant;
  createRestaurant: Restaurant;
  createRestaurantCoupon: Coupon;
  createReview: Restaurant;
  createRider: Rider;
  createSection: Section;
  createShopType?: Maybe<ShopType>;
  createStaff: Staff;
  createSubCategories: Scalars['String']['output'];
  createSubCategory: Scalars['String']['output'];
  createSupportTicket: SupportTicket;
  createTaxation: Taxation;
  createTipping: Tipping;
  createUser: AuthData;
  createVendor: OwnerData;
  createWithdrawRequest?: Maybe<WithdrawRequest>;
  createZone: Zone;
  cuisine: Cuisine;
  deleteAddon: Restaurant;
  deleteAddress: User;
  deleteBanner: Scalars['String']['output'];
  deleteBulkAddresses: User;
  deleteCategory: Restaurant;
  deleteCoupon: Scalars['String']['output'];
  deleteCuisine: Scalars['String']['output'];
  deleteFood: Restaurant;
  deleteImageFromS3?: Maybe<DeleteResult>;
  deleteLoyaltyBreakdown?: Maybe<LoyaltyBreakdown>;
  deleteLoyaltyLevel?: Maybe<LoyaltyLevel>;
  deleteLoyaltyTier?: Maybe<LoyaltyTier>;
  deleteOffer?: Maybe<Scalars['Boolean']['output']>;
  deleteOption: Restaurant;
  deleteRestaurant: Restaurant;
  deleteRestaurantCoupon: Scalars['String']['output'];
  deleteRider: Rider;
  deleteSection?: Maybe<Scalars['Boolean']['output']>;
  deleteShopType?: Maybe<ShopType>;
  deleteStaff: Staff;
  deleteSubCategories: Scalars['String']['output'];
  deleteSubCategory: Scalars['String']['output'];
  deleteUser?: Maybe<User>;
  deleteVendor?: Maybe<Scalars['Boolean']['output']>;
  deleteZone: Zone;
  duplicateRestaurant: Restaurant;
  editAddon: Restaurant;
  editAddress: User;
  editBanner: Banner;
  editCategory: Restaurant;
  editCoupon: Coupon;
  editCuisine: Cuisine;
  editFood: Restaurant;
  editOffer: Offer;
  editOption: Restaurant;
  editOrder: Order;
  editRestaurant: Restaurant;
  editRestaurantCoupon: Coupon;
  editRider: Rider;
  editSection: Section;
  editStaff: Staff;
  editSubCategory: SubCategory;
  editTaxation: Taxation;
  editTipping: Tipping;
  editVendor: OwnerData;
  editZone: Zone;
  emailExist?: Maybe<User>;
  forgotPassword: ForgotPassword;
  hardDeleteRestaurant?: Maybe<Scalars['Boolean']['output']>;
  likeFood: Food;
  login: AuthData;
  loginPasswordless: AuthData;
  loginWithSocial?: Maybe<AuthData>;
  markWebNotificationsAsRead?: Maybe<Array<Maybe<WebNotification>>>;
  muteRing: Scalars['Boolean']['output'];
  notifyRiders: Scalars['Boolean']['output'];
  orderCreatedAndPaid: Scalars['Boolean']['output'];
  orderPickedUp: Order;
  ownerLogin: OwnerAuthData;
  phoneExist?: Maybe<User>;
  placeOrder: Order;
  pushToken: User;
  reapplyRider: Rider;
  redeemWalletForOrder: Scalars['Boolean']['output'];
  rejectRiderRequest: Rider;
  resetPassword: ForgotPassword;
  resetUserSession?: Maybe<User>;
  restaurantLogin: RestaurantAuth;
  reviewOrder: Order;
  riderLogin: AuthData;
  saveAmplitudeApiKeyConfiguration: Configuration;
  saveAppConfigurations: Configuration;
  saveCloudinaryConfiguration: Configuration;
  saveCurrencyConfiguration: Configuration;
  saveDeliveryRateConfiguration?: Maybe<Configuration>;
  saveDemoConfiguration: Configuration;
  saveEmailConfiguration: Configuration;
  saveFirebaseConfiguration: Configuration;
  saveFormEmailConfiguration: Configuration;
  saveGoogleApiKeyConfiguration: Configuration;
  saveGoogleClientIDConfiguration: Configuration;
  saveNotificationTokenWeb: SaveNotificationTokenWebResponse;
  savePaypalConfiguration: Configuration;
  saveRestaurantToken: Restaurant;
  saveSendGridConfiguration: Configuration;
  saveSentryConfiguration: Configuration;
  saveStripeConfiguration: Configuration;
  saveTwilioConfiguration: Configuration;
  saveVerificationsToggle: Configuration;
  saveWebConfiguration: Configuration;
  selectAddress: User;
  sendChatMessage: ChatMessageResponse;
  sendFormSubmission: FormSubmissionResponse;
  sendNotificationUser: Scalars['String']['output'];
  sendOtpToEmail: Otp;
  sendOtpToPhoneNumber: Otp;
  setLoyaltyConfiguration?: Maybe<LoyaltyConfiguration>;
  setVersions?: Maybe<Scalars['Boolean']['output']>;
  toggleAvailability: Restaurant;
  toggleAvailablity: Rider;
  toggleMenuFood: Food;
  toggleStoreAvailability: Restaurant;
  transferReferralBalance?: Maybe<Rider>;
  updateCommission: Restaurant;
  updateDeliveryBoundsAndLocation: RestaurantResponse;
  updateFoodOutOfStock: Scalars['Boolean']['output'];
  updateLoyaltyBreakdown?: Maybe<LoyaltyBreakdown>;
  updateLoyaltyLevel?: Maybe<LoyaltyLevel>;
  updateLoyaltyTier?: Maybe<LoyaltyTier>;
  updateNotificationStatus: User;
  updateOrderStatus: Order;
  updateOrderStatusRider: Order;
  updatePaymentStatus: Order;
  updateRestaurantBussinessDetails?: Maybe<RestaurantResponse>;
  updateRestaurantDelivery?: Maybe<RestaurantResponse>;
  updateRiderBussinessDetails: Rider;
  updateRiderLicenseDetails: Rider;
  updateRiderLocation: Rider;
  updateRiderVehicleDetails: Rider;
  updateShopType?: Maybe<ShopType>;
  updateStatus: Order;
  updateSupportTicketStatus: SupportTicket;
  updateTimings: Restaurant;
  updateUser: User;
  updateUserNotes?: Maybe<User>;
  updateUserStatus?: Maybe<User>;
  updateWithdrawReqStatus: UpdateWithdrawResponse;
  updateWorkSchedule?: Maybe<Rider>;
  uploadImageToS3?: Maybe<UploadResult>;
  uploadToken: OwnerData;
  vendorResetPassword: Scalars['Boolean']['output'];
  verifyOtp?: Maybe<VerifyOtpResponse>;
};


export type MutationDeactivateArgs = {
  email: Scalars['String']['input'];
  isActive: Scalars['Boolean']['input'];
};


export type MutationAbortOrderArgs = {
  id: Scalars['String']['input'];
};


export type MutationAcceptOrderArgs = {
  _id: Scalars['String']['input'];
  time: InputMaybe<Scalars['String']['input']>;
};


export type MutationAcceptRiderRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAddFavouriteArgs = {
  id: Scalars['String']['input'];
};


export type MutationAddOrUpdateLiveActivityTokenArgs = {
  activityId: Scalars['String']['input'];
  orderId: Scalars['ID']['input'];
  token: Scalars['String']['input'];
};


export type MutationAddRestaurantToOfferArgs = {
  id: Scalars['String']['input'];
  restaurant: Scalars['String']['input'];
};


export type MutationAdminLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationApplyReferralCodeArgs = {
  referralCode: Scalars['String']['input'];
};


export type MutationAssignOrderArgs = {
  id: InputMaybe<Scalars['String']['input']>;
};


export type MutationAssignRiderArgs = {
  id: Scalars['String']['input'];
  riderId: Scalars['String']['input'];
};


export type MutationBannerArgs = {
  banner: Scalars['String']['input'];
};


export type MutationCancelOrderArgs = {
  _id: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationConvertPointsToWalletArgs = {
  input: ConvertPointsInput;
};


export type MutationCouponArgs = {
  coupon: Scalars['String']['input'];
  restaurantId: Scalars['ID']['input'];
};


export type MutationCreateAddonsArgs = {
  addonInput: InputMaybe<AddonInput>;
};


export type MutationCreateAddressArgs = {
  addressInput: AddressInput;
};


export type MutationCreateBannerArgs = {
  bannerInput: BannerInput;
};


export type MutationCreateCategoryArgs = {
  category: InputMaybe<CategoryInput>;
};


export type MutationCreateCouponArgs = {
  couponInput: CouponInput;
};


export type MutationCreateCuisineArgs = {
  cuisineInput: CuisineInput;
};


export type MutationCreateEarningArgs = {
  earningsInput: InputMaybe<EarningsInput>;
};


export type MutationCreateFoodArgs = {
  foodInput: InputMaybe<FoodInput>;
};


export type MutationCreateLoyaltyBreakdownArgs = {
  input: LoyaltyBreakdownInput;
};


export type MutationCreateLoyaltyLevelArgs = {
  input: LoyaltyLevelInput;
};


export type MutationCreateLoyaltyTierArgs = {
  input: LoyaltyTierInput;
};


export type MutationCreateMessageArgs = {
  messageInput: MessageInput;
};


export type MutationCreateOfferArgs = {
  offer: OfferInput;
};


export type MutationCreateOptionsArgs = {
  optionInput: InputMaybe<CreateOptionInput>;
};


export type MutationCreateRestaurantArgs = {
  owner: Scalars['ID']['input'];
  restaurant: RestaurantInput;
};


export type MutationCreateRestaurantCouponArgs = {
  couponInput: CouponInput;
  restaurantId: Scalars['ID']['input'];
};


export type MutationCreateReviewArgs = {
  review: ReviewInput;
};


export type MutationCreateRiderArgs = {
  riderInput: InputMaybe<RiderInput>;
};


export type MutationCreateSectionArgs = {
  section: SectionInput;
};


export type MutationCreateShopTypeArgs = {
  dto: InputMaybe<CreateShopTypeInput>;
};


export type MutationCreateStaffArgs = {
  staffInput: InputMaybe<StaffInput>;
};


export type MutationCreateSubCategoriesArgs = {
  subCategories: InputMaybe<Array<InputMaybe<SubCategoryInput>>>;
};


export type MutationCreateSubCategoryArgs = {
  subCategory: InputMaybe<SubCategoryInput>;
};


export type MutationCreateSupportTicketArgs = {
  ticketInput: SupportTicketInput;
};


export type MutationCreateTaxationArgs = {
  taxationInput: TaxationInput;
};


export type MutationCreateTippingArgs = {
  tippingInput: TippingInput;
};


export type MutationCreateUserArgs = {
  userInput: InputMaybe<UserInput>;
};


export type MutationCreateVendorArgs = {
  vendorInput: InputMaybe<VendorInput>;
};


export type MutationCreateWithdrawRequestArgs = {
  requestAmount: Scalars['Float']['input'];
  userId: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateZoneArgs = {
  zone: ZoneInput;
};


export type MutationCuisineArgs = {
  cuisine: Scalars['String']['input'];
};


export type MutationDeleteAddonArgs = {
  id: Scalars['String']['input'];
  restaurant: Scalars['String']['input'];
};


export type MutationDeleteAddressArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBannerArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteBulkAddressesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['String']['input'];
  restaurant: Scalars['String']['input'];
};


export type MutationDeleteCouponArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCuisineArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteFoodArgs = {
  categoryId: Scalars['String']['input'];
  id: Scalars['String']['input'];
  restaurant: Scalars['String']['input'];
};


export type MutationDeleteImageFromS3Args = {
  imageUrl: Scalars['String']['input'];
};


export type MutationDeleteLoyaltyBreakdownArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteLoyaltyLevelArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteLoyaltyTierArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteOfferArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteOptionArgs = {
  id: Scalars['String']['input'];
  restaurant: Scalars['String']['input'];
};


export type MutationDeleteRestaurantArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteRestaurantCouponArgs = {
  couponId: Scalars['ID']['input'];
  restaurantId: Scalars['ID']['input'];
};


export type MutationDeleteRiderArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteSectionArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteShopTypeArgs = {
  id: Scalars['String']['input'];
  type: InputMaybe<DeleteTypeEnum>;
};


export type MutationDeleteStaffArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteSubCategoriesArgs = {
  ids: Array<Scalars['String']['input']>;
};


export type MutationDeleteSubCategoryArgs = {
  _id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteZoneArgs = {
  id: Scalars['String']['input'];
};


export type MutationDuplicateRestaurantArgs = {
  id: Scalars['String']['input'];
  owner: Scalars['String']['input'];
};


export type MutationEditAddonArgs = {
  addonInput: InputMaybe<EditAddonInput>;
};


export type MutationEditAddressArgs = {
  addressInput: AddressInput;
};


export type MutationEditBannerArgs = {
  bannerInput: BannerInput;
};


export type MutationEditCategoryArgs = {
  category: InputMaybe<CategoryInput>;
};


export type MutationEditCouponArgs = {
  couponInput: CouponInput;
};


export type MutationEditCuisineArgs = {
  cuisineInput: CuisineInput;
};


export type MutationEditFoodArgs = {
  foodInput: InputMaybe<FoodInput>;
};


export type MutationEditOfferArgs = {
  offer: OfferInput;
};


export type MutationEditOptionArgs = {
  optionInput: InputMaybe<EditOptionInput>;
};


export type MutationEditOrderArgs = {
  _id: Scalars['String']['input'];
  orderInput: Array<OrderInput>;
};


export type MutationEditRestaurantArgs = {
  restaurant: RestaurantProfileInput;
};


export type MutationEditRestaurantCouponArgs = {
  couponInput: CouponInput;
  restaurantId: Scalars['ID']['input'];
};


export type MutationEditRiderArgs = {
  riderInput: InputMaybe<RiderInput>;
};


export type MutationEditSectionArgs = {
  section: SectionInput;
};


export type MutationEditStaffArgs = {
  staffInput: InputMaybe<StaffInput>;
};


export type MutationEditSubCategoryArgs = {
  subCategoryInput: InputMaybe<SubCategoryInput>;
};


export type MutationEditTaxationArgs = {
  taxationInput: TaxationInput;
};


export type MutationEditTippingArgs = {
  tippingInput: TippingInput;
};


export type MutationEditVendorArgs = {
  vendorInput: InputMaybe<VendorInput>;
};


export type MutationEditZoneArgs = {
  zone: ZoneInput;
};


export type MutationEmailExistArgs = {
  email: Scalars['String']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationHardDeleteRestaurantArgs = {
  id: Scalars['String']['input'];
};


export type MutationLikeFoodArgs = {
  foodId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  appleId: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  isActive: InputMaybe<Scalars['Boolean']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  notificationToken: InputMaybe<Scalars['String']['input']>;
  password: InputMaybe<Scalars['String']['input']>;
  referralCode: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};


export type MutationLoginPasswordlessArgs = {
  email: Scalars['String']['input'];
  notificationToken: InputMaybe<Scalars['String']['input']>;
  otp: Scalars['String']['input'];
};


export type MutationLoginWithSocialArgs = {
  idToken: Scalars['String']['input'];
  notificationToken: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};


export type MutationMuteRingArgs = {
  orderId: InputMaybe<Scalars['String']['input']>;
};


export type MutationNotifyRidersArgs = {
  id: Scalars['String']['input'];
};


export type MutationOrderCreatedAndPaidArgs = {
  orderId: Scalars['String']['input'];
  orderInput: Array<OrderInput>;
  restaurant: Scalars['String']['input'];
};


export type MutationOrderPickedUpArgs = {
  _id: Scalars['String']['input'];
};


export type MutationOwnerLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationPhoneExistArgs = {
  phone: Scalars['String']['input'];
};


export type MutationPlaceOrderArgs = {
  address: AddressInput;
  couponCode: InputMaybe<Scalars['String']['input']>;
  deliveryCharges: Scalars['Float']['input'];
  instructions: InputMaybe<Scalars['String']['input']>;
  isPickedUp: Scalars['Boolean']['input'];
  orderDate: Scalars['String']['input'];
  orderInput: Array<OrderInput>;
  paymentMethod: Scalars['String']['input'];
  restaurant: Scalars['String']['input'];
  taxationAmount: Scalars['Float']['input'];
  tipping: Scalars['Float']['input'];
  walletAmount: InputMaybe<Scalars['Float']['input']>;
};


export type MutationPushTokenArgs = {
  token: InputMaybe<Scalars['String']['input']>;
};


export type MutationReapplyRiderArgs = {
  email: Scalars['String']['input'];
};


export type MutationRedeemWalletForOrderArgs = {
  input: RedeemWalletInput;
};


export type MutationRejectRiderRequestArgs = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationResetUserSessionArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationRestaurantLoginArgs = {
  notificationToken: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationReviewOrderArgs = {
  reviewInput: ReviewInput;
};


export type MutationRiderLoginArgs = {
  notificationToken: InputMaybe<Scalars['String']['input']>;
  password: InputMaybe<Scalars['String']['input']>;
  timeZone: InputMaybe<Scalars['String']['input']>;
  username: InputMaybe<Scalars['String']['input']>;
};


export type MutationSaveAmplitudeApiKeyConfigurationArgs = {
  configurationInput: AmplitudeApiKeyConfigurationInput;
};


export type MutationSaveAppConfigurationsArgs = {
  configurationInput: AppConfigurationsInput;
};


export type MutationSaveCloudinaryConfigurationArgs = {
  configurationInput: CloudinaryConfigurationInput;
};


export type MutationSaveCurrencyConfigurationArgs = {
  configurationInput: CurrencyConfigurationInput;
};


export type MutationSaveDeliveryRateConfigurationArgs = {
  configurationInput: InputMaybe<DeliveryCostConfigurationInput>;
};


export type MutationSaveDemoConfigurationArgs = {
  configurationInput: DemoConfigurationInput;
};


export type MutationSaveEmailConfigurationArgs = {
  configurationInput: EmailConfigurationInput;
};


export type MutationSaveFirebaseConfigurationArgs = {
  configurationInput: FirebaseConfigurationInput;
};


export type MutationSaveFormEmailConfigurationArgs = {
  configurationInput: FormEmailConfigurationInput;
};


export type MutationSaveGoogleApiKeyConfigurationArgs = {
  configurationInput: GoogleApiKeyConfigurationInput;
};


export type MutationSaveGoogleClientIdConfigurationArgs = {
  configurationInput: GoogleClientIdConfigurationInput;
};


export type MutationSaveNotificationTokenWebArgs = {
  token: Scalars['String']['input'];
};


export type MutationSavePaypalConfigurationArgs = {
  configurationInput: PaypalConfigurationInput;
};


export type MutationSaveRestaurantTokenArgs = {
  isEnabled: InputMaybe<Scalars['Boolean']['input']>;
  token: InputMaybe<Scalars['String']['input']>;
};


export type MutationSaveSendGridConfigurationArgs = {
  configurationInput: SendGridConfigurationInput;
};


export type MutationSaveSentryConfigurationArgs = {
  configurationInput: SentryConfigurationInput;
};


export type MutationSaveStripeConfigurationArgs = {
  configurationInput: StripeConfigurationInput;
};


export type MutationSaveTwilioConfigurationArgs = {
  configurationInput: TwilioConfigurationInput;
};


export type MutationSaveVerificationsToggleArgs = {
  configurationInput: VerificationConfigurationInput;
};


export type MutationSaveWebConfigurationArgs = {
  configurationInput: WebConfigurationInput;
};


export type MutationSelectAddressArgs = {
  id: Scalars['String']['input'];
};


export type MutationSendChatMessageArgs = {
  message: ChatMessageInput;
  orderId: Scalars['ID']['input'];
};


export type MutationSendFormSubmissionArgs = {
  formSubmissionInput: FormSubmissionInput;
};


export type MutationSendNotificationUserArgs = {
  notificationBody: Scalars['String']['input'];
  notificationTitle: InputMaybe<Scalars['String']['input']>;
};


export type MutationSendOtpToEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationSendOtpToPhoneNumberArgs = {
  phone: Scalars['String']['input'];
};


export type MutationSetLoyaltyConfigurationArgs = {
  input: InputMaybe<LoyaltyConfigurationInput>;
};


export type MutationSetVersionsArgs = {
  customerAppVersion: InputMaybe<AppTypeInput>;
  restaurantAppVersion: InputMaybe<AppTypeInput>;
  riderAppVersion: InputMaybe<AppTypeInput>;
};


export type MutationToggleAvailabilityArgs = {
  restaurantId: InputMaybe<Scalars['String']['input']>;
};


export type MutationToggleAvailablityArgs = {
  id: Scalars['String']['input'];
};


export type MutationToggleMenuFoodArgs = {
  categoryId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  restaurant: Scalars['ID']['input'];
};


export type MutationToggleStoreAvailabilityArgs = {
  restaurantId: Scalars['String']['input'];
};


export type MutationTransferReferralBalanceArgs = {
  amount: Scalars['Float']['input'];
};


export type MutationUpdateCommissionArgs = {
  commissionRate: Scalars['Float']['input'];
  id: Scalars['String']['input'];
};


export type MutationUpdateDeliveryBoundsAndLocationArgs = {
  address: InputMaybe<Scalars['String']['input']>;
  boundType: Scalars['String']['input'];
  bounds: InputMaybe<Array<InputMaybe<Array<InputMaybe<Array<Scalars['Float']['input']>>>>>>;
  circleBounds: InputMaybe<CircleBoundsInput>;
  city: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  location: CoordinatesInput;
  postCode: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateFoodOutOfStockArgs = {
  categoryId: Scalars['String']['input'];
  id: Scalars['String']['input'];
  restaurant: Scalars['String']['input'];
};


export type MutationUpdateLoyaltyBreakdownArgs = {
  id: Scalars['String']['input'];
  input: UpdateLoyaltyBreakdownInput;
};


export type MutationUpdateLoyaltyLevelArgs = {
  id: Scalars['String']['input'];
  input: UpdateLoyaltyLevelInput;
};


export type MutationUpdateLoyaltyTierArgs = {
  id: Scalars['String']['input'];
  input: UpdateLoyaltyTierInput;
};


export type MutationUpdateNotificationStatusArgs = {
  offerNotification: Scalars['Boolean']['input'];
  orderNotification: Scalars['Boolean']['input'];
};


export type MutationUpdateOrderStatusArgs = {
  id: Scalars['String']['input'];
  reason: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
};


export type MutationUpdateOrderStatusRiderArgs = {
  id: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdatePaymentStatusArgs = {
  id: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateRestaurantBussinessDetailsArgs = {
  bussinessDetails: InputMaybe<BussinessDetailsInput>;
  id: Scalars['String']['input'];
};


export type MutationUpdateRestaurantDeliveryArgs = {
  deliveryDistance: InputMaybe<Scalars['Float']['input']>;
  deliveryFee: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  minDeliveryFee: InputMaybe<Scalars['Float']['input']>;
};


export type MutationUpdateRiderBussinessDetailsArgs = {
  bussinessDetails: InputMaybe<BussinessDetailsInput>;
  id: Scalars['String']['input'];
};


export type MutationUpdateRiderLicenseDetailsArgs = {
  id: Scalars['String']['input'];
  licenseDetails: InputMaybe<LicenseDetailsInput>;
};


export type MutationUpdateRiderLocationArgs = {
  latitude: Scalars['String']['input'];
  longitude: Scalars['String']['input'];
};


export type MutationUpdateRiderVehicleDetailsArgs = {
  id: Scalars['String']['input'];
  vehicleDetails: InputMaybe<VehicleDetailsInput>;
};


export type MutationUpdateShopTypeArgs = {
  dto: InputMaybe<UpdateShopTypeInput>;
};


export type MutationUpdateStatusArgs = {
  id: InputMaybe<Scalars['String']['input']>;
  orderStatus: Scalars['String']['input'];
};


export type MutationUpdateSupportTicketStatusArgs = {
  input: UpdateSupportTicketInput;
};


export type MutationUpdateTimingsArgs = {
  id: Scalars['String']['input'];
  openingTimes: InputMaybe<Array<InputMaybe<TimingsInput>>>;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUser;
};


export type MutationUpdateUserNotesArgs = {
  id: Scalars['ID']['input'];
  notes: Scalars['String']['input'];
};


export type MutationUpdateUserStatusArgs = {
  id: Scalars['ID']['input'];
  reason: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
};


export type MutationUpdateWithdrawReqStatusArgs = {
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateWorkScheduleArgs = {
  riderId: Scalars['String']['input'];
  timeZone: Scalars['String']['input'];
  workSchedule: Array<DayScheduleInput>;
};


export type MutationUploadImageToS3Args = {
  image: Scalars['String']['input'];
};


export type MutationUploadTokenArgs = {
  id: Scalars['String']['input'];
  pushToken: Scalars['String']['input'];
};


export type MutationVendorResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationVerifyOtpArgs = {
  email: InputMaybe<Scalars['String']['input']>;
  otp: Scalars['String']['input'];
  phone: InputMaybe<Scalars['String']['input']>;
};

export type MyOrders = {
  __typename?: 'MyOrders';
  orders?: Maybe<Array<Order>>;
  userId: Scalars['String']['output'];
};

export type NearByData = {
  __typename?: 'NearByData';
  offers?: Maybe<Array<OfferInfo>>;
  restaurants?: Maybe<Array<Restaurant>>;
  sections?: Maybe<Array<SectionInfo>>;
};

export type NearByDataPreview = {
  __typename?: 'NearByDataPreview';
  offers?: Maybe<Array<OfferInfo>>;
  restaurants?: Maybe<Array<RestaurantPreview>>;
  sections?: Maybe<Array<SectionInfo>>;
};

export type Nm = {
  __typename?: 'Nm';
  name?: Maybe<Scalars['String']['output']>;
};

export type Notification = {
  __typename?: 'Notification';
  _id: Scalars['String']['output'];
  body?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type OtpData = {
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export enum OtpTypeEnum {
  Email = 'EMAIL',
  Phone = 'PHONE'
}

export type Offer = {
  __typename?: 'Offer';
  _id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  restaurants?: Maybe<Array<Maybe<OfferRestaurant>>>;
  tag: Scalars['String']['output'];
};

export type OfferInfo = {
  __typename?: 'OfferInfo';
  _id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  restaurants?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tag: Scalars['String']['output'];
};

export type OfferInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  restaurants?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tag: Scalars['String']['input'];
};

export type OfferRestaurant = {
  __typename?: 'OfferRestaurant';
  _id: Scalars['String']['output'];
  address: Scalars['String']['output'];
  categories?: Maybe<Array<Maybe<Category>>>;
  image: Scalars['String']['output'];
  location?: Maybe<Point>;
  name: Scalars['String']['output'];
};

export type OpeningTimes = {
  __typename?: 'OpeningTimes';
  day: Scalars['String']['output'];
  times?: Maybe<Array<Maybe<Timings>>>;
};

export type Option = {
  __typename?: 'Option';
  _id: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  isOutOfStock?: Maybe<Scalars['Boolean']['output']>;
  price: Scalars['Float']['output'];
  title: Scalars['String']['output'];
};

export type OptionInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
  title: Scalars['String']['input'];
};

export type Order = {
  __typename?: 'Order';
  _id: Scalars['ID']['output'];
  acceptedAt?: Maybe<Scalars['String']['output']>;
  assignedAt?: Maybe<Scalars['String']['output']>;
  cancelledAt?: Maybe<Scalars['String']['output']>;
  chat?: Maybe<Chat>;
  completionTime?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  deliveredAt?: Maybe<Scalars['String']['output']>;
  deliveryAddress: OrderAddress;
  deliveryCharges?: Maybe<Scalars['Float']['output']>;
  discountAmount?: Maybe<Scalars['Float']['output']>;
  expectedTime?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  instructions?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isPickedUp: Scalars['Boolean']['output'];
  isRiderRinged: Scalars['Boolean']['output'];
  isRinged: Scalars['Boolean']['output'];
  items: Array<Item>;
  orderAmount?: Maybe<Scalars['Float']['output']>;
  orderDate: Scalars['String']['output'];
  orderId: Scalars['String']['output'];
  orderStatus?: Maybe<Scalars['String']['output']>;
  paidAmount?: Maybe<Scalars['Float']['output']>;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  paymentStatus: Scalars['String']['output'];
  pickedAt?: Maybe<Scalars['String']['output']>;
  preparationTime?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  restaurant: RestaurantDetail;
  review?: Maybe<Review>;
  rider?: Maybe<Rider>;
  selectedPrepTime?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
  taxationAmount: Scalars['Float']['output'];
  tipping: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  user?: Maybe<User>;
  zone: Zone;
};

export type OrderAddress = {
  __typename?: 'OrderAddress';
  deliveryAddress: Scalars['String']['output'];
  details?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  location?: Maybe<Point>;
};

export type OrderInput = {
  addons?: InputMaybe<Array<AddonsInput>>;
  food: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
  variation: Scalars['String']['input'];
};

export type OrderPagination = {
  __typename?: 'OrderPagination';
  currentPage: Scalars['Int']['output'];
  nextPage?: Maybe<Scalars['Int']['output']>;
  orders: Array<Order>;
  prevPage?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type OrderStatus = {
  __typename?: 'OrderStatus';
  cancelled?: Maybe<Scalars['String']['output']>;
  cancelledbyrest?: Maybe<Scalars['String']['output']>;
  delivered?: Maybe<Scalars['String']['output']>;
  pending: Scalars['String']['output'];
  picked?: Maybe<Scalars['String']['output']>;
  preparing?: Maybe<Scalars['String']['output']>;
};

export enum OrderTypeEnum {
  Delivery = 'DELIVERY',
  Pickup = 'PICKUP'
}

export type OrdersValues = {
  __typename?: 'OrdersValues';
  count: Scalars['Int']['output'];
  day: Scalars['String']['output'];
};

export type OrdersWithCashOnDeliveryInfo = {
  __typename?: 'OrdersWithCashOnDeliveryInfo';
  countCashOnDeliveryOrders: Scalars['Int']['output'];
  orders: Array<Order>;
  totalAmountCashOnDelivery: Scalars['Float']['output'];
};

export type Otp = {
  __typename?: 'Otp';
  result: Scalars['Boolean']['output'];
};

export type Owner = {
  __typename?: 'Owner';
  _id?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
};

export type OwnerAuthData = {
  __typename?: 'OwnerAuthData';
  email: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  permissions: Array<Scalars['String']['output']>;
  pushToken?: Maybe<Scalars['String']['output']>;
  restaurants: Array<Maybe<Restaurant>>;
  token: Scalars['String']['output'];
  tokenExpiration: Scalars['Int']['output'];
  userId: Scalars['ID']['output'];
  userType: Scalars['String']['output'];
  userTypeId?: Maybe<Scalars['String']['output']>;
};

export type OwnerData = {
  __typename?: 'OwnerData';
  _id: Scalars['ID']['output'];
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  plainPassword?: Maybe<Scalars['String']['output']>;
  pushToken?: Maybe<Scalars['String']['output']>;
  restaurants: Array<Maybe<Restaurant>>;
  unique_id?: Maybe<Scalars['String']['output']>;
  userType: Scalars['String']['output'];
};

export type OwnerInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type PaginatedSupportTickets = {
  __typename?: 'PaginatedSupportTickets';
  currentPage: Scalars['Int']['output'];
  docsCount: Scalars['Int']['output'];
  tickets: Array<SupportTicket>;
  totalPages: Scalars['Int']['output'];
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  currentPage: Scalars['Int']['output'];
  docsCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
  users: Array<User>;
};

export type PaginatedUsersWithLatestTicket = {
  __typename?: 'PaginatedUsersWithLatestTicket';
  currentPage: Scalars['Int']['output'];
  docsCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
  users: Array<UserWithLatestTicket>;
};

export type Pagination = {
  __typename?: 'Pagination';
  total?: Maybe<Scalars['Int']['output']>;
};

export type PaginationInput = {
  pageNo: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};

export enum PaymentMethodEnum {
  Cod = 'COD',
  Paypal = 'PAYPAL',
  Stripe = 'STRIPE'
}

export type PaypalConfigurationInput = {
  clientId: Scalars['String']['input'];
  clientSecret: Scalars['String']['input'];
  sandbox: Scalars['Boolean']['input'];
};

export type PercentageChange = {
  __typename?: 'PercentageChange';
  restaurantsPercent?: Maybe<Scalars['Float']['output']>;
  ridersPercent?: Maybe<Scalars['Float']['output']>;
  usersPercent?: Maybe<Scalars['Float']['output']>;
  vendorsPercent?: Maybe<Scalars['Float']['output']>;
};

export type PlatformEarnings = {
  __typename?: 'PlatformEarnings';
  deliveryCommission: Scalars['Float']['output'];
  marketplaceCommission: Scalars['Float']['output'];
  platformFee: Scalars['Float']['output'];
  tax: Scalars['Float']['output'];
  totalEarnings: Scalars['Float']['output'];
};

export type Point = {
  __typename?: 'Point';
  _id: Scalars['ID']['output'];
  coordinates?: Maybe<Array<Scalars['String']['output']>>;
  createdAt: Scalars['Date']['output'];
  orderId?: Maybe<Scalars['String']['output']>;
  points: Scalars['Int']['output'];
  referredUser?: Maybe<User>;
  type: Scalars['String']['output'];
  user: Scalars['ID']['output'];
};

export type PointInput = {
  coordinates?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Polygon = {
  __typename?: 'Polygon';
  coordinates?: Maybe<Array<Maybe<Array<Maybe<Array<Scalars['Float']['output']>>>>>>;
};

export type PopularItemsResponse = {
  __typename?: 'PopularItemsResponse';
  count: Scalars['Int']['output'];
  id: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  addons?: Maybe<Array<Addon>>;
  allOrders: Array<Order>;
  allOrdersPaginated: OrderPagination;
  allOrdersWithoutPagination: Array<Order>;
  assignedOrders?: Maybe<Array<Order>>;
  auditLogs: AuditLogPagination;
  availableRiders?: Maybe<Array<Maybe<Rider>>>;
  bannerActions: Array<Scalars['String']['output']>;
  banners: Array<Banner>;
  categories: Array<Category>;
  chat?: Maybe<Array<ChatMessageOutput>>;
  configuration: Configuration;
  coupons: Array<Coupon>;
  cuisines: Array<Cuisine>;
  deliveredOrders: Array<Order>;
  earnings?: Maybe<EarningsResponse>;
  fetchAllShopTypes?: Maybe<AllShopTypes>;
  fetchCategoryDetailsByStoreId?: Maybe<Array<Maybe<CategoryDetailsResponse>>>;
  fetchCategoryDetailsByStoreIdForMobile?: Maybe<Array<Maybe<CategoryDetailsResponseForMobile>>>;
  fetchLoyaltyBreakdownById?: Maybe<LoyaltyBreakdown>;
  fetchLoyaltyBreakdowns?: Maybe<Array<Maybe<LoyaltyBreakdown>>>;
  fetchLoyaltyConfiguration?: Maybe<LoyaltyConfiguration>;
  fetchLoyaltyLevelById?: Maybe<LoyaltyLevel>;
  fetchLoyaltyLevelsByUserType?: Maybe<Array<Maybe<LoyaltyLevel>>>;
  fetchLoyaltyReferralAnalytics?: Maybe<LoyaltyReferralAnalytics>;
  fetchLoyaltyTierById?: Maybe<LoyaltyTier>;
  fetchLoyaltyTiers?: Maybe<Array<Maybe<LoyaltyTier>>>;
  fetchReferralLoyaltyHistory?: Maybe<LoyaltyReferralHistoryResponse>;
  fetchRiderActivityDetails?: Maybe<ActivityDetails>;
  fetchRiderRecentActivity?: Maybe<RiderRecentActivityResponse>;
  fetchRiderReferralRewards?: Maybe<RiderReferralRewards>;
  fetchRiderRequests?: Maybe<Array<Maybe<Rider>>>;
  fetchShopTypeByUnique?: Maybe<ShopType>;
  fetchShopTypes?: Maybe<ShopTypePagination>;
  fetchUserLoyaltyData?: Maybe<UserLoyaltyData>;
  fetchWalletBalance: Scalars['Float']['output'];
  fetchWalletTransactions: Array<WalletTransaction>;
  foodByCategory: Array<Food>;
  foodByIds?: Maybe<Array<CartFood>>;
  foods: Array<Food>;
  getActiveOrders: OrderPagination;
  getAllCuisines: GetAllCuisinesResponse;
  getAllSupportTickets: PaginatedSupportTickets;
  getAllWithdrawRequests: WithdrawRequestReponse;
  getCitiesByCountry?: Maybe<Country>;
  getClonedRestaurants?: Maybe<Array<Restaurant>>;
  getClonedRestaurantsPaginated: RestaurantsPaginatedResponse;
  getCountries?: Maybe<Array<Maybe<Country>>>;
  getCountriesDropdown?: Maybe<Array<Maybe<CountryDropdownResponse>>>;
  getCountryByIso?: Maybe<Country>;
  getDashboardOrderSalesDetailsByPaymentMethod: DashboardOrderSalesDetailsByPaymentMethodResponse;
  getDashboardOrders: DashboardOrders;
  getDashboardOrdersByType: Array<DashboardOrdersByType>;
  getDashboardSales: DashboardSales;
  getDashboardSalesByType: Array<DashboardSalesByType>;
  getDashboardTotal: DashboardData;
  getDashboardUsers: DashboardUsers;
  getDashboardUsersByYear: DashboardCounts;
  getLiveMonitorData?: Maybe<VendorLiveMonitorData>;
  getOrderStatuses?: Maybe<Array<Scalars['String']['output']>>;
  getOrdersByDateRange: OrdersWithCashOnDeliveryInfo;
  getPaymentStatuses?: Maybe<Array<Scalars['String']['output']>>;
  getReferralActivities: Array<Point>;
  getRestaurantDashboardOrdersSalesStats: RestaurantDashboardOrders;
  getRestaurantDashboardSalesOrderCountDetailsByYear: DashboardSalesOrderCountDetails;
  getRestaurantDeliveryZoneInfo?: Maybe<RestaurantDeliveryZoneInfoResponse>;
  getRestaurantMenuItems: Array<CategoryItems>;
  getSingleSupportTicket: SupportTicket;
  getSingleUserSupportTickets: PaginatedSupportTickets;
  getStoreDetailsByVendorId?: Maybe<Array<VendorStoreDetailsResponse>>;
  getTicketMessages: TicketMessageResponse;
  getTicketUsers: PaginatedUsers;
  getTicketUsersWithLatest: PaginatedUsersWithLatestTicket;
  getVendor?: Maybe<OwnerData>;
  getVendorDashboardGrowthDetailsByYear: VendorDashboardGrowthResponse;
  getVendorDashboardStatsCardDetails: VendorDashboardStatsCardResponse;
  getVersions?: Maybe<Versions>;
  lastOrderCreds?: Maybe<DemoCredentails>;
  likedFood: Array<Food>;
  mostOrderedRestaurants?: Maybe<Array<Restaurant>>;
  mostOrderedRestaurantsPreview?: Maybe<Array<RestaurantPreview>>;
  nearByRestaurants: NearByData;
  nearByRestaurantsCuisines: Array<Cuisine>;
  nearByRestaurantsPreview: NearByDataPreview;
  notifications?: Maybe<Array<Notification>>;
  offers?: Maybe<Array<Maybe<Offer>>>;
  options?: Maybe<Array<Option>>;
  order: Order;
  orderCount?: Maybe<Scalars['Int']['output']>;
  orderDetails: Order;
  orderPaypal: Order;
  orderStripe: Order;
  orders: Array<Order>;
  ordersByRestId: OrderPagination;
  ordersByRestIdWithoutPagination?: Maybe<Array<Order>>;
  ordersByUser: OrderPagination;
  pageCount?: Maybe<Scalars['Int']['output']>;
  popularItems: Array<PopularItemsResponse>;
  profile?: Maybe<User>;
  recentOrderRestaurants?: Maybe<Array<Restaurant>>;
  recentOrderRestaurantsPreview?: Maybe<Array<RestaurantPreview>>;
  relatedItems: Array<Scalars['String']['output']>;
  restaurant: Restaurant;
  restaurantByOwner: OwnerData;
  restaurantCoupons: Array<Coupon>;
  restaurantList?: Maybe<Array<Restaurant>>;
  restaurantListPreview?: Maybe<Array<RestaurantPreview>>;
  restaurantOrders: Array<Order>;
  restaurantPreview: RestaurantPreview;
  restaurants?: Maybe<Array<Restaurant>>;
  restaurantsPaginated: RestaurantsPaginatedResponse;
  restaurantsPreview?: Maybe<Array<RestaurantPreview>>;
  reviews: Array<Review>;
  reviewsByRestaurant: ReviewResult;
  rider: Rider;
  riderByEmail?: Maybe<Rider>;
  riderCompletedOrders?: Maybe<Array<Order>>;
  riderCurrentWithdrawRequest?: Maybe<WithdrawRequest>;
  riderEarnings?: Maybe<Array<Earnings>>;
  riderEarningsGraph: RiderEarningsGraphResponse;
  riderOrders?: Maybe<Array<Order>>;
  riderWithdrawRequests?: Maybe<Array<WithdrawRequest>>;
  riderWithdrawRequestsHistory: RiderWithdrawRequestHistoryReponse;
  riders?: Maybe<Array<Rider>>;
  ridersByZone?: Maybe<Array<Rider>>;
  sections?: Maybe<Array<Maybe<Section>>>;
  staff?: Maybe<Staff>;
  staffs?: Maybe<Array<Staff>>;
  storeCurrentWithdrawRequest?: Maybe<WithdrawRequest>;
  storeEarningsGraph: StoreEarningsGraphResponse;
  subCategories: Array<Maybe<SubCategory>>;
  subCategoriesByParentId: Array<Maybe<SubCategory>>;
  subCategory: SubCategory;
  taxes: Taxation;
  tips: Tipping;
  topRatedVendors?: Maybe<Array<Restaurant>>;
  topRatedVendorsPreview?: Maybe<Array<RestaurantPreview>>;
  transactionHistory: TransactionHistoryResponse;
  unassignedOrdersByZone?: Maybe<Array<Order>>;
  undeliveredOrders: Array<Order>;
  updateCountryFlags?: Maybe<Nm>;
  user?: Maybe<User>;
  userFavourite?: Maybe<Array<Maybe<Restaurant>>>;
  users?: Maybe<Array<User>>;
  vendors?: Maybe<Array<Maybe<OwnerData>>>;
  webNotifications?: Maybe<Array<Maybe<WebNotification>>>;
  withdrawRequests: WithdrawRequestReponse;
  zone: Zone;
  zones?: Maybe<Array<Zone>>;
};


export type QueryAllOrdersArgs = {
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllOrdersPaginatedArgs = {
  dateKeyword: InputMaybe<Scalars['String']['input']>;
  ending_date: InputMaybe<Scalars['String']['input']>;
  orderStatus: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page: InputMaybe<Scalars['Int']['input']>;
  rows: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  starting_date: InputMaybe<Scalars['String']['input']>;
};


export type QueryAllOrdersWithoutPaginationArgs = {
  dateKeyword: InputMaybe<Scalars['String']['input']>;
  ending_date: InputMaybe<Scalars['String']['input']>;
  starting_date: InputMaybe<Scalars['String']['input']>;
};


export type QueryAssignedOrdersArgs = {
  id: InputMaybe<Scalars['String']['input']>;
};


export type QueryAuditLogsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryChatArgs = {
  order: Scalars['ID']['input'];
};


export type QueryDeliveredOrdersArgs = {
  offset: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEarningsArgs = {
  dateFilter: InputMaybe<DateFilter>;
  orderType: InputMaybe<OrderTypeEnum>;
  pagination: InputMaybe<PaginationInput>;
  paymentMethod: InputMaybe<PaymentMethodEnum>;
  search: InputMaybe<Scalars['String']['input']>;
  userId: InputMaybe<Scalars['String']['input']>;
  userType: InputMaybe<UserTypeEnum>;
};


export type QueryFetchCategoryDetailsByStoreIdArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryFetchCategoryDetailsByStoreIdForMobileArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryFetchLoyaltyBreakdownByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFetchLoyaltyLevelByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFetchLoyaltyLevelsByUserTypeArgs = {
  userType: Scalars['String']['input'];
};


export type QueryFetchLoyaltyTierByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFetchReferralLoyaltyHistoryArgs = {
  filter: InputMaybe<FetchLoyaltyReferralHistoryFilterInput>;
};


export type QueryFetchRiderActivityDetailsArgs = {
  activityId: Scalars['String']['input'];
};


export type QueryFetchRiderRecentActivityArgs = {
  filter: InputMaybe<RiderActivityFilterInput>;
};


export type QueryFetchRiderReferralRewardsArgs = {
  level: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFetchRiderRequestsArgs = {
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryFetchShopTypeByUniqueArgs = {
  dto: InputMaybe<FetchUniqueShopTypeInput>;
};


export type QueryFetchShopTypesArgs = {
  filter: InputMaybe<FetchShopTypeFilter>;
  pagination: InputMaybe<PaginationInput>;
};


export type QueryFoodByCategoryArgs = {
  category: Scalars['String']['input'];
  inStock: InputMaybe<Scalars['Boolean']['input']>;
  max: InputMaybe<Scalars['Float']['input']>;
  min: InputMaybe<Scalars['Float']['input']>;
  onSale: InputMaybe<Scalars['Boolean']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueryFoodByIdsArgs = {
  foodIds: Array<CartFoodInput>;
};


export type QueryGetActiveOrdersArgs = {
  actions: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page: InputMaybe<Scalars['Int']['input']>;
  restaurantId: InputMaybe<Scalars['ID']['input']>;
  rowsPerPage: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAllCuisinesArgs = {
  input: InputMaybe<CuisineFilterInput>;
};


export type QueryGetAllSupportTicketsArgs = {
  input: InputMaybe<FiltersInput>;
};


export type QueryGetAllWithdrawRequestsArgs = {
  offset: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetCitiesByCountryArgs = {
  id: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetClonedRestaurantsPaginatedArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetCountryByIsoArgs = {
  iso: Scalars['String']['input'];
};


export type QueryGetDashboardOrderSalesDetailsByPaymentMethodArgs = {
  ending_date: InputMaybe<Scalars['String']['input']>;
  restaurant: Scalars['String']['input'];
  starting_date: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDashboardOrdersArgs = {
  ending_date: InputMaybe<Scalars['String']['input']>;
  restaurant: Scalars['String']['input'];
  starting_date: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDashboardSalesArgs = {
  ending_date: InputMaybe<Scalars['String']['input']>;
  restaurant: Scalars['String']['input'];
  starting_date: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDashboardTotalArgs = {
  ending_date: InputMaybe<Scalars['String']['input']>;
  restaurant: Scalars['String']['input'];
  starting_date: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDashboardUsersByYearArgs = {
  year: Scalars['Int']['input'];
};


export type QueryGetLiveMonitorDataArgs = {
  dateKeyword: InputMaybe<Scalars['String']['input']>;
  ending_date: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  starting_date: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetOrdersByDateRangeArgs = {
  endingDate: Scalars['String']['input'];
  restaurant: Scalars['String']['input'];
  startingDate: Scalars['String']['input'];
};


export type QueryGetRestaurantDashboardOrdersSalesStatsArgs = {
  dateKeyword: InputMaybe<Scalars['String']['input']>;
  ending_date: InputMaybe<Scalars['String']['input']>;
  restaurant: Scalars['String']['input'];
  starting_date: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetRestaurantDashboardSalesOrderCountDetailsByYearArgs = {
  restaurant: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};


export type QueryGetRestaurantDeliveryZoneInfoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetRestaurantMenuItemsArgs = {
  restaurantId: Scalars['String']['input'];
};


export type QueryGetSingleSupportTicketArgs = {
  ticketId: Scalars['ID']['input'];
};


export type QueryGetSingleUserSupportTicketsArgs = {
  input: InputMaybe<SingleUserSupportTicketsInput>;
};


export type QueryGetStoreDetailsByVendorIdArgs = {
  dateKeyword: InputMaybe<Scalars['String']['input']>;
  ending_date: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  starting_date: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetTicketMessagesArgs = {
  input: TicketMessagesInput;
};


export type QueryGetTicketUsersArgs = {
  input: InputMaybe<FiltersInput>;
};


export type QueryGetTicketUsersWithLatestArgs = {
  input: InputMaybe<FiltersInput>;
};


export type QueryGetVendorArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetVendorDashboardGrowthDetailsByYearArgs = {
  vendorId: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};


export type QueryGetVendorDashboardStatsCardDetailsArgs = {
  dateKeyword: InputMaybe<Scalars['String']['input']>;
  ending_date: InputMaybe<Scalars['String']['input']>;
  starting_date: InputMaybe<Scalars['String']['input']>;
  vendorId: Scalars['String']['input'];
};


export type QueryMostOrderedRestaurantsArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};


export type QueryMostOrderedRestaurantsPreviewArgs = {
  latitude: Scalars['Float']['input'];
  limit: InputMaybe<Scalars['Int']['input']>;
  longitude: Scalars['Float']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  shopType: InputMaybe<Scalars['String']['input']>;
};


export type QueryNearByRestaurantsArgs = {
  latitude: InputMaybe<Scalars['Float']['input']>;
  longitude: InputMaybe<Scalars['Float']['input']>;
  shopType: InputMaybe<Scalars['String']['input']>;
};


export type QueryNearByRestaurantsCuisinesArgs = {
  latitude: InputMaybe<Scalars['Float']['input']>;
  longitude: InputMaybe<Scalars['Float']['input']>;
  shopType: InputMaybe<Scalars['String']['input']>;
};


export type QueryNearByRestaurantsPreviewArgs = {
  latitude: InputMaybe<Scalars['Float']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  longitude: InputMaybe<Scalars['Float']['input']>;
  page: InputMaybe<Scalars['Int']['input']>;
  shopType: InputMaybe<Scalars['String']['input']>;
};


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrderCountArgs = {
  restaurant: Scalars['String']['input'];
};


export type QueryOrderDetailsArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrderPaypalArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrderStripeArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrdersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOrdersByRestIdArgs = {
  page: InputMaybe<Scalars['Int']['input']>;
  restaurant: Scalars['String']['input'];
  rows: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueryOrdersByRestIdWithoutPaginationArgs = {
  restaurant: Scalars['String']['input'];
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueryOrdersByUserArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  page: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryPageCountArgs = {
  restaurant: Scalars['String']['input'];
};


export type QueryPopularItemsArgs = {
  restaurantId: Scalars['String']['input'];
};


export type QueryRecentOrderRestaurantsArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};


export type QueryRecentOrderRestaurantsPreviewArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};


export type QueryRelatedItemsArgs = {
  itemId: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
};


export type QueryRestaurantArgs = {
  id: InputMaybe<Scalars['String']['input']>;
  slug: InputMaybe<Scalars['String']['input']>;
};


export type QueryRestaurantByOwnerArgs = {
  id: InputMaybe<Scalars['String']['input']>;
};


export type QueryRestaurantCouponsArgs = {
  restaurantId: Scalars['String']['input'];
};


export type QueryRestaurantPreviewArgs = {
  id: InputMaybe<Scalars['String']['input']>;
  slug: InputMaybe<Scalars['String']['input']>;
};


export type QueryRestaurantsPaginatedArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueryReviewsArgs = {
  offset: InputMaybe<Scalars['Int']['input']>;
  restaurant: Scalars['String']['input'];
};


export type QueryReviewsByRestaurantArgs = {
  restaurant: Scalars['String']['input'];
};


export type QueryRiderArgs = {
  id: Scalars['String']['input'];
};


export type QueryRiderByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryRiderCurrentWithdrawRequestArgs = {
  riderId: InputMaybe<Scalars['String']['input']>;
};


export type QueryRiderEarningsArgs = {
  id: InputMaybe<Scalars['String']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRiderEarningsGraphArgs = {
  endDate: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  page: InputMaybe<Scalars['Int']['input']>;
  riderId: Scalars['ID']['input'];
  startDate: InputMaybe<Scalars['String']['input']>;
};


export type QueryRiderWithdrawRequestsArgs = {
  id: InputMaybe<Scalars['String']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRiderWithdrawRequestsHistoryArgs = {
  pagination: InputMaybe<PaginationInput>;
  userId: Scalars['String']['input'];
};


export type QueryRidersByZoneArgs = {
  id: Scalars['String']['input'];
};


export type QueryStaffArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStoreCurrentWithdrawRequestArgs = {
  storeId: InputMaybe<Scalars['String']['input']>;
};


export type QueryStoreEarningsGraphArgs = {
  endDate: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  page: InputMaybe<Scalars['Int']['input']>;
  startDate: InputMaybe<Scalars['String']['input']>;
  storeId: Scalars['ID']['input'];
};


export type QuerySubCategoriesByParentIdArgs = {
  parentCategoryId: Scalars['String']['input'];
};


export type QuerySubCategoryArgs = {
  _id: InputMaybe<Scalars['String']['input']>;
};


export type QueryTopRatedVendorsArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};


export type QueryTopRatedVendorsPreviewArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};


export type QueryTransactionHistoryArgs = {
  dateFilter: InputMaybe<DateFilter>;
  pagination: InputMaybe<PaginationInput>;
  search: InputMaybe<Scalars['String']['input']>;
  userId: InputMaybe<Scalars['String']['input']>;
  userType: InputMaybe<UserTypeEnum>;
};


export type QueryUndeliveredOrdersArgs = {
  offset: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserFavouriteArgs = {
  latitude: InputMaybe<Scalars['Float']['input']>;
  longitude: InputMaybe<Scalars['Float']['input']>;
};


export type QueryWithdrawRequestsArgs = {
  pagination: InputMaybe<PaginationInput>;
  search: InputMaybe<Scalars['String']['input']>;
  userId: InputMaybe<Scalars['String']['input']>;
  userType: InputMaybe<UserTypeEnum>;
};


export type QueryZoneArgs = {
  id: Scalars['String']['input'];
};

export type RedeemWalletInput = {
  amount: Scalars['Float']['input'];
  orderId: Scalars['String']['input'];
};

export type ReferralDetail = {
  __typename?: 'ReferralDetail';
  earnedAmount: Scalars['Float']['output'];
  joinedAt: Scalars['String']['output'];
  level: Scalars['Int']['output'];
  riderId: Scalars['String']['output'];
  riderName: Scalars['String']['output'];
  riderPhone?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type ReferralLevelDetails = {
  __typename?: 'ReferralLevelDetails';
  count: Scalars['Int']['output'];
  earnings: Scalars['Float']['output'];
  riders: Array<Maybe<RiderDetailInfo>>;
};

export type ReferralRewardsEarningsByLevel = {
  __typename?: 'ReferralRewardsEarningsByLevel';
  level1: EarningsByLevel;
  level2: EarningsByLevel;
  level3: EarningsByLevel;
};

export type ResponseCouponDetails = {
  __typename?: 'ResponseCouponDetails';
  _id?: Maybe<Scalars['String']['output']>;
  discount?: Maybe<Scalars['Float']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Restaurant = {
  __typename?: 'Restaurant';
  _id?: Maybe<Scalars['ID']['output']>;
  addons?: Maybe<Array<Addon>>;
  address?: Maybe<Scalars['String']['output']>;
  bussinessDetails?: Maybe<BussinessDetails>;
  categories?: Maybe<Array<Category>>;
  city?: Maybe<Scalars['String']['output']>;
  commissionRate?: Maybe<Scalars['Float']['output']>;
  cuisines?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  currentWalletAmount?: Maybe<Scalars['Float']['output']>;
  deliveryBounds?: Maybe<Polygon>;
  deliveryInfo?: Maybe<DeliveryInfo>;
  deliveryTime?: Maybe<Scalars['Int']['output']>;
  enableNotification?: Maybe<Scalars['Boolean']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isAvailable?: Maybe<Scalars['Boolean']['output']>;
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  location?: Maybe<Point>;
  logo?: Maybe<Scalars['String']['output']>;
  minimumOrder?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  notificationToken?: Maybe<Scalars['String']['output']>;
  openingTimes?: Maybe<Array<Maybe<OpeningTimes>>>;
  options?: Maybe<Array<Option>>;
  orderId?: Maybe<Scalars['Int']['output']>;
  orderPrefix?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<Owner>;
  password?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  postCode?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['Float']['output']>;
  restaurantUrl?: Maybe<Scalars['String']['output']>;
  reviewAverage?: Maybe<Scalars['Float']['output']>;
  reviewCount?: Maybe<Scalars['Int']['output']>;
  reviewData?: Maybe<ReviewData>;
  sections?: Maybe<Array<Scalars['String']['output']>>;
  shopType?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  stripeDetailsSubmitted?: Maybe<Scalars['Boolean']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tax?: Maybe<Scalars['Float']['output']>;
  totalWalletAmount?: Maybe<Scalars['Float']['output']>;
  unique_restaurant_id?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  withdrawnWalletAmount?: Maybe<Scalars['Float']['output']>;
  zone?: Maybe<Zone>;
};

export type RestaurantAuth = {
  __typename?: 'RestaurantAuth';
  restaurantId: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type RestaurantDashboardOrders = {
  __typename?: 'RestaurantDashboardOrders';
  totalCODOrders: Scalars['Int']['output'];
  totalCardOrders: Scalars['Int']['output'];
  totalOrders: Scalars['Int']['output'];
  totalSales: Scalars['Float']['output'];
};

export type RestaurantDeliveryZoneInfoResponse = {
  __typename?: 'RestaurantDeliveryZoneInfoResponse';
  address?: Maybe<Scalars['String']['output']>;
  boundType: Scalars['String']['output'];
  circleBounds?: Maybe<CircleBoundsResponse>;
  city?: Maybe<Scalars['String']['output']>;
  deliveryBounds?: Maybe<DeliveryBoundsResponse>;
  location: CoordinatesResponse;
  postCode?: Maybe<Scalars['String']['output']>;
};

export type RestaurantDetail = {
  __typename?: 'RestaurantDetail';
  _id: Scalars['ID']['output'];
  address: Scalars['String']['output'];
  image: Scalars['String']['output'];
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  location?: Maybe<Point>;
  name: Scalars['String']['output'];
  reviewAverage?: Maybe<Scalars['Float']['output']>;
  reviewCount?: Maybe<Scalars['Int']['output']>;
  shopType?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type RestaurantInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  bussinessDetails?: InputMaybe<BussinessDetailsInput>;
  categories?: InputMaybe<Array<CategoryInput>>;
  cuisines?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  deliveryTime?: InputMaybe<Scalars['Int']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  minimumOrder?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  restaurantUrl?: InputMaybe<Scalars['String']['input']>;
  reviews?: InputMaybe<Array<ReviewInput>>;
  salesTax?: InputMaybe<Scalars['Float']['input']>;
  shopType?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type RestaurantPreview = {
  __typename?: 'RestaurantPreview';
  _id: Scalars['ID']['output'];
  address?: Maybe<Scalars['String']['output']>;
  commissionRate?: Maybe<Scalars['Float']['output']>;
  cuisines?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  deliveryBounds?: Maybe<Polygon>;
  deliveryInfo?: Maybe<DeliveryInfo>;
  deliveryTime?: Maybe<Scalars['Int']['output']>;
  enableNotification?: Maybe<Scalars['Boolean']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isAvailable: Scalars['Boolean']['output'];
  isCloned?: Maybe<Scalars['Boolean']['output']>;
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  location?: Maybe<Point>;
  logo?: Maybe<Scalars['String']['output']>;
  minimumOrder?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  notificationToken?: Maybe<Scalars['String']['output']>;
  openingTimes?: Maybe<Array<Maybe<OpeningTimes>>>;
  orderId?: Maybe<Scalars['Int']['output']>;
  orderPrefix?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<Owner>;
  password?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['Float']['output']>;
  restaurantUrl?: Maybe<Scalars['String']['output']>;
  reviewAverage?: Maybe<Scalars['Float']['output']>;
  reviewCount?: Maybe<Scalars['Int']['output']>;
  sections?: Maybe<Array<Scalars['String']['output']>>;
  shopType?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  stripeDetailsSubmitted?: Maybe<Scalars['Boolean']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tax?: Maybe<Scalars['Float']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  zone?: Maybe<Zone>;
};

export type RestaurantProfileInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  bussinessDetails?: InputMaybe<BussinessDetailsInput>;
  cuisines?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  deliveryTime?: InputMaybe<Scalars['Int']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  minimumOrder?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  orderPrefix?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  restaurantUrl?: InputMaybe<Scalars['String']['input']>;
  salesTax?: InputMaybe<Scalars['Float']['input']>;
  shopType?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type RestaurantResponse = {
  __typename?: 'RestaurantResponse';
  data?: Maybe<Restaurant>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type RestaurantsPaginatedResponse = {
  __typename?: 'RestaurantsPaginatedResponse';
  currentPage: Scalars['Int']['output'];
  data: Array<Restaurant>;
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type RestaurantsPreviewPaginatedResponse = {
  __typename?: 'RestaurantsPreviewPaginatedResponse';
  currentPage: Scalars['Int']['output'];
  data: Array<RestaurantPreview>;
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Review = {
  __typename?: 'Review';
  _id: Scalars['ID']['output'];
  comments?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  order: Order;
  rating: Scalars['Int']['output'];
  restaurant: Restaurant;
  updatedAt: Scalars['String']['output'];
};

export type ReviewData = {
  __typename?: 'ReviewData';
  ratings?: Maybe<Scalars['Float']['output']>;
  reviews?: Maybe<Array<Maybe<Review>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type ReviewInput = {
  comments?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
};

export type ReviewOutput = {
  __typename?: 'ReviewOutput';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  order: Scalars['String']['output'];
  restaurant: Scalars['String']['output'];
  review: Review;
  updatedAt: Scalars['String']['output'];
};

export type ReviewResult = {
  __typename?: 'ReviewResult';
  ratings: Scalars['Float']['output'];
  reviews: Array<Review>;
  total: Scalars['Int']['output'];
};

export type Rider = {
  __typename?: 'Rider';
  _id: Scalars['ID']['output'];
  accountNumber?: Maybe<Scalars['String']['output']>;
  applyCount?: Maybe<Scalars['Int']['output']>;
  assigned?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  available: Scalars['Boolean']['output'];
  bussinessDetails?: Maybe<BussinessDetails>;
  createdAt: Scalars['String']['output'];
  currentWalletAmount?: Maybe<Scalars['Float']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  licenseDetails?: Maybe<LicenseDetails>;
  location?: Maybe<Point>;
  madeBy?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  referralCashBalance?: Maybe<Scalars['Float']['output']>;
  referralCode?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  riderRequestStatus?: Maybe<Scalars['String']['output']>;
  timeZone?: Maybe<Scalars['String']['output']>;
  totalWalletAmount?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
  vehicleDetails?: Maybe<VehicleDetails>;
  vehicleType?: Maybe<Scalars['String']['output']>;
  withdrawnWalletAmount?: Maybe<Scalars['Float']['output']>;
  workSchedule?: Maybe<Array<DaySchedule>>;
  zone: Zone;
};

export type RiderActivityFilterInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type RiderActivitySummary = {
  __typename?: 'RiderActivitySummary';
  periodEnd?: Maybe<Scalars['String']['output']>;
  periodStart?: Maybe<Scalars['String']['output']>;
  totalEarnings: Scalars['Float']['output'];
  totalReferrals: Scalars['Int']['output'];
};

export type RiderAndWithdrawRequest = {
  __typename?: 'RiderAndWithdrawRequest';
  _id?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  requestAmount: Scalars['Float']['output'];
  requestId: Scalars['String']['output'];
  requestTime: Scalars['String']['output'];
  rider?: Maybe<Rider>;
  status: Scalars['String']['output'];
  store?: Maybe<Restaurant>;
};

export type RiderDetailInfo = {
  __typename?: 'RiderDetailInfo';
  _id: Scalars['String']['output'];
  earnedAmount: Scalars['Float']['output'];
  joinedAt: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
};

export type RiderEarnings = {
  __typename?: 'RiderEarnings';
  deliveryFee: Scalars['Float']['output'];
  riderId?: Maybe<StackholderEarningsDetails>;
  tip: Scalars['Float']['output'];
  totalEarnings: Scalars['Float']['output'];
};

export type RiderEarningsGraph = {
  __typename?: 'RiderEarningsGraph';
  _id?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  earningsArray: Array<Maybe<RiderEarningsGroup>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
  totalDeliveries?: Maybe<Scalars['Int']['output']>;
  totalEarningsSum?: Maybe<Scalars['Float']['output']>;
  totalHours?: Maybe<Scalars['Float']['output']>;
  totalTipsSum?: Maybe<Scalars['Float']['output']>;
};

export type RiderEarningsGraphResponse = {
  __typename?: 'RiderEarningsGraphResponse';
  earnings?: Maybe<Array<Maybe<RiderEarningsGraph>>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type RiderEarningsGroup = {
  __typename?: 'RiderEarningsGroup';
  date?: Maybe<Scalars['String']['output']>;
  deliveryFee: Scalars['Float']['output'];
  orderDetails: RiderEarningsOrderDetails;
  tip: Scalars['Float']['output'];
  totalEarnings: Scalars['Float']['output'];
};

export type RiderEarningsOrderDetails = {
  __typename?: 'RiderEarningsOrderDetails';
  orderId: Scalars['String']['output'];
  orderType: Scalars['String']['output'];
  paymentMethod: Scalars['String']['output'];
};

export type RiderInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  available: Scalars['Boolean']['input'];
  bussinessDetails?: InputMaybe<BussinessDetailsInput>;
  email?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  licenseDetails?: InputMaybe<LicenseDetailsInput>;
  madeBy?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  referralCode?: InputMaybe<Scalars['String']['input']>;
  riderRequestStatus?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
  vehicleDetails?: InputMaybe<VehicleDetailsInput>;
  vehicleType?: InputMaybe<Scalars['String']['input']>;
  zone: Scalars['String']['input'];
};

export type RiderOrders = {
  __typename?: 'RiderOrders';
  orders?: Maybe<Array<Order>>;
  riderId: Scalars['String']['output'];
};

export type RiderRecentActivityResponse = {
  __typename?: 'RiderRecentActivityResponse';
  activities: Array<Maybe<LoyalyReferralHistory>>;
  hasMore: Scalars['Boolean']['output'];
  summary: RiderActivitySummary;
  total: Scalars['Int']['output'];
};

export type RiderReferralRewards = {
  __typename?: 'RiderReferralRewards';
  currentBalance: Scalars['Float']['output'];
  earningsByLevel: ReferralRewardsEarningsByLevel;
  referralDetails: Array<Maybe<ReferralDetail>>;
  totalEarnings: Scalars['Float']['output'];
  totalWithdrawn: Scalars['Float']['output'];
};

export type RiderWithdrawRequestHistory = {
  __typename?: 'RiderWithdrawRequestHistory';
  _id?: Maybe<Scalars['String']['output']>;
  amountTransferred: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type RiderWithdrawRequestHistoryReponse = {
  __typename?: 'RiderWithdrawRequestHistoryReponse';
  data?: Maybe<Array<RiderWithdrawRequestHistory>>;
  message?: Maybe<Scalars['String']['output']>;
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type SalesValues = {
  __typename?: 'SalesValues';
  amount: Scalars['Float']['output'];
  day: Scalars['String']['output'];
};

export type SaveNotificationTokenWebResponse = {
  __typename?: 'SaveNotificationTokenWebResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Section = {
  __typename?: 'Section';
  _id: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  restaurants?: Maybe<Array<Maybe<SectionRestaurant>>>;
};

export type SectionInfo = {
  __typename?: 'SectionInfo';
  _id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  restaurants?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type SectionInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  enabled: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  restaurants?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type SectionRestaurant = {
  __typename?: 'SectionRestaurant';
  _id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type SendGridConfigurationInput = {
  sendGridApiKey: Scalars['String']['input'];
  sendGridEmail: Scalars['String']['input'];
  sendGridEmailName: Scalars['String']['input'];
  sendGridEnabled: Scalars['Boolean']['input'];
  sendGridPassword: Scalars['String']['input'];
};

export type SentryConfigurationInput = {
  apiSentryUrl: Scalars['String']['input'];
  customerAppSentryUrl: Scalars['String']['input'];
  dashboardSentryUrl: Scalars['String']['input'];
  restaurantAppSentryUrl: Scalars['String']['input'];
  riderAppSentryUrl: Scalars['String']['input'];
  webSentryUrl: Scalars['String']['input'];
};

export type ShopType = {
  __typename?: 'ShopType';
  _id: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ShopTypePagination = {
  __typename?: 'ShopTypePagination';
  data?: Maybe<Array<Maybe<ShopType>>>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  hasPrevPage?: Maybe<Scalars['Boolean']['output']>;
  page?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type SingleUserSupportTicketsInput = {
  filters?: InputMaybe<FiltersInput>;
  userId: Scalars['ID']['input'];
};

export type StackholderEarningsDetails = {
  __typename?: 'StackholderEarningsDetails';
  _id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type Staff = {
  __typename?: 'Staff';
  _id: Scalars['ID']['output'];
  email?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  phone?: Maybe<Scalars['String']['output']>;
  plainPassword?: Maybe<Scalars['String']['output']>;
  userType?: Maybe<Scalars['String']['output']>;
};

export type StaffInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
  phone?: InputMaybe<Scalars['String']['input']>;
  userType?: InputMaybe<Scalars['String']['input']>;
};

export type StoreEarnings = {
  __typename?: 'StoreEarnings';
  orderAmount: Scalars['Float']['output'];
  storeId?: Maybe<StackholderEarningsDetails>;
  totalEarnings: Scalars['Float']['output'];
};

export type StoreEarningsGraph = {
  __typename?: 'StoreEarningsGraph';
  _id?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  earningsArray: Array<Maybe<StoreEarningsGroup>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
  totalEarningsSum?: Maybe<Scalars['Float']['output']>;
};

export type StoreEarningsGraphResponse = {
  __typename?: 'StoreEarningsGraphResponse';
  earnings?: Maybe<Array<Maybe<StoreEarningsGraph>>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type StoreEarningsGroup = {
  __typename?: 'StoreEarningsGroup';
  date?: Maybe<Scalars['String']['output']>;
  orderDetails: RiderEarningsOrderDetails;
  totalEarnings?: Maybe<Scalars['Float']['output']>;
  totalOrderAmount?: Maybe<Scalars['Float']['output']>;
};

export type StripeConfigurationInput = {
  publishableKey: Scalars['String']['input'];
  secretKey: Scalars['String']['input'];
};

export type SubCategory = {
  __typename?: 'SubCategory';
  _id: Scalars['ID']['output'];
  parentCategoryId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type SubCategoryInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  parentCategoryId: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type SubCategoryItems = {
  __typename?: 'SubCategoryItems';
  category_id: Scalars['ID']['output'];
  category_name: Scalars['String']['output'];
  products: Array<Food>;
};

export type Subscription = {
  __typename?: 'Subscription';
  orderStatusChanged: SubscriptionOrders;
  riderUpdated: Rider;
  subscribePlaceOrder: SubscriptionOrders;
  subscriptionAssignRider: SubscriptionOrders;
  subscriptionDispatcher: Order;
  subscriptionNewMessage: ChatMessageOutput;
  subscriptionOrder: Order;
  subscriptionRiderLocation: Rider;
  subscriptionZoneOrders: Subscription_Zone_Orders;
};


export type SubscriptionOrderStatusChangedArgs = {
  userId: Scalars['String']['input'];
};


export type SubscriptionSubscribePlaceOrderArgs = {
  restaurant: Scalars['String']['input'];
};


export type SubscriptionSubscriptionAssignRiderArgs = {
  riderId: Scalars['String']['input'];
};


export type SubscriptionSubscriptionNewMessageArgs = {
  order: Scalars['ID']['input'];
};


export type SubscriptionSubscriptionOrderArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionSubscriptionRiderLocationArgs = {
  riderId: Scalars['String']['input'];
};


export type SubscriptionSubscriptionZoneOrdersArgs = {
  zoneId: Scalars['String']['input'];
};

export type SubscriptionOrders = {
  __typename?: 'SubscriptionOrders';
  order: Order;
  origin: Scalars['String']['output'];
  restaurantId?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type Subscription_Zone_Orders = {
  __typename?: 'Subscription_Zone_Orders';
  order: Order;
  origin: Scalars['String']['output'];
  zoneId?: Maybe<Scalars['String']['output']>;
};

export type SupportTicket = {
  __typename?: 'SupportTicket';
  _id: Scalars['ID']['output'];
  category: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  orderId?: Maybe<Scalars['String']['output']>;
  otherDetails?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  user?: Maybe<User>;
  userType?: Maybe<Scalars['String']['output']>;
};

export type SupportTicketInput = {
  category: Scalars['String']['input'];
  description: Scalars['String']['input'];
  orderId?: InputMaybe<Scalars['String']['input']>;
  otherDetails?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  userType: Scalars['String']['input'];
};

export enum SupportTicketStatus {
  Closed = 'closed',
  InProgress = 'inProgress',
  Open = 'open'
}

export type Taxation = {
  __typename?: 'Taxation';
  _id: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  taxationCharges?: Maybe<Scalars['Float']['output']>;
};

export type TaxationInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  taxationCharges?: InputMaybe<Scalars['Float']['input']>;
};

export type TicketMessageResponse = {
  __typename?: 'TicketMessageResponse';
  docsCount: Scalars['Int']['output'];
  messages: Array<Message>;
  page: Scalars['Int']['output'];
  ticket: SupportTicket;
  totalPages: Scalars['Int']['output'];
};

export type TicketMessagesInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  ticket: Scalars['ID']['input'];
};

export type TimeSlot = {
  __typename?: 'TimeSlot';
  endTime: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type TimeSlotInput = {
  endTime: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
};

export type TimesInput = {
  endTime?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startTime?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Timings = {
  __typename?: 'Timings';
  endTime?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  startTime?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type TimingsInput = {
  day: Scalars['String']['input'];
  times?: InputMaybe<Array<InputMaybe<TimesInput>>>;
};

export type Tipping = {
  __typename?: 'Tipping';
  _id: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  tipVariations?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type TippingInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  tipVariations?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type TodayYesterdayStats = {
  __typename?: 'TodayYesterdayStats';
  restaurants?: Maybe<Scalars['Int']['output']>;
  riders?: Maybe<Scalars['Int']['output']>;
  users?: Maybe<Scalars['Int']['output']>;
  vendors?: Maybe<Scalars['Int']['output']>;
};

export type TransactionHistory = {
  __typename?: 'TransactionHistory';
  _id: Scalars['String']['output'];
  amountCurrency: Scalars['String']['output'];
  amountTransferred: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  rider?: Maybe<Rider>;
  status: Scalars['String']['output'];
  store?: Maybe<Restaurant>;
  toBank: BankDetails;
  transactionId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  userType: Scalars['String']['output'];
};

export type TransactionHistoryResponse = {
  __typename?: 'TransactionHistoryResponse';
  data?: Maybe<Array<TransactionHistory>>;
  message?: Maybe<Scalars['String']['output']>;
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type TwilioConfigurationInput = {
  twilioAccountSid: Scalars['String']['input'];
  twilioAuthToken: Scalars['String']['input'];
  twilioEnabled: Scalars['Boolean']['input'];
  twilioPhoneNumber: Scalars['String']['input'];
  twilioWhatsAppNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLoyaltyBreakdownInput = {
  bronze?: InputMaybe<Scalars['Float']['input']>;
  gold?: InputMaybe<Scalars['Float']['input']>;
  max?: InputMaybe<Scalars['Float']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
  platinum?: InputMaybe<Scalars['Float']['input']>;
  silver?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateLoyaltyLevelInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateLoyaltyTierInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateShopTypeInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSupportTicketInput = {
  status: SupportTicketStatus;
  ticketId: Scalars['ID']['input'];
};

export type UpdateUser = {
  emailIsVerified?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  phoneIsVerified?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateWithdrawResponse = {
  __typename?: 'UpdateWithdrawResponse';
  data?: Maybe<RiderAndWithdrawRequest>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UploadResult = {
  __typename?: 'UploadResult';
  imageUrl: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  addresses?: Maybe<Array<Address>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailIsVerified?: Maybe<Scalars['Boolean']['output']>;
  favourite?: Maybe<Array<Scalars['String']['output']>>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isOfferNotification?: Maybe<Scalars['Boolean']['output']>;
  isOrderNotification?: Maybe<Scalars['Boolean']['output']>;
  lastLogin?: Maybe<Scalars['Date']['output']>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  notificationToken?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  phoneIsVerified?: Maybe<Scalars['Boolean']['output']>;
  pointsBalance?: Maybe<Scalars['Float']['output']>;
  referralCode?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  statusReason?: Maybe<Scalars['String']['output']>;
  tier?: Maybe<UserTier>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  userType?: Maybe<Scalars['String']['output']>;
  walletBalance?: Maybe<Scalars['Float']['output']>;
};

export type UserInput = {
  appleId?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailIsVerified?: InputMaybe<Scalars['Boolean']['input']>;
  isPhoneExists?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationToken?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  phoneIsVerified?: InputMaybe<Scalars['Boolean']['input']>;
  referralCode?: InputMaybe<Scalars['String']['input']>;
};

export type UserLoyaltyData = {
  __typename?: 'UserLoyaltyData';
  loyaltyPoints?: Maybe<Scalars['Int']['output']>;
  pointsBalance?: Maybe<Scalars['Int']['output']>;
  referralPoints?: Maybe<Scalars['Int']['output']>;
  tier?: Maybe<LoyaltyTier>;
  totalEarnedPoints?: Maybe<Scalars['Int']['output']>;
};

export type UserTier = {
  __typename?: 'UserTier';
  _id?: Maybe<Scalars['String']['output']>;
  current_earned_points?: Maybe<Scalars['Int']['output']>;
  current_tier_name?: Maybe<Scalars['String']['output']>;
  next_tier_name?: Maybe<Scalars['String']['output']>;
  next_tier_points?: Maybe<Scalars['Int']['output']>;
};

export enum UserTypeEnum {
  Rider = 'RIDER',
  Store = 'STORE'
}

export type UserWithLatestTicket = {
  __typename?: 'UserWithLatestTicket';
  _id: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  latestTicket?: Maybe<SupportTicket>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  userType?: Maybe<Scalars['String']['output']>;
};

export type Variation = {
  __typename?: 'Variation';
  _id: Scalars['ID']['output'];
  addons?: Maybe<Array<Scalars['String']['output']>>;
  discounted?: Maybe<Scalars['Float']['output']>;
  isOutOfStock?: Maybe<Scalars['Boolean']['output']>;
  price: Scalars['Float']['output'];
  title: Scalars['String']['output'];
};

export type VariationInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  addons?: InputMaybe<Array<Scalars['String']['input']>>;
  discounted?: InputMaybe<Scalars['Float']['input']>;
  isOutOfStock?: InputMaybe<Scalars['Boolean']['input']>;
  price: Scalars['Float']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type VehicleDetails = {
  __typename?: 'VehicleDetails';
  image?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
};

export type VehicleDetailsInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
};

export type VendorDashboardGrowthResponse = {
  __typename?: 'VendorDashboardGrowthResponse';
  totalOrders: Array<Scalars['Int']['output']>;
  totalRestaurants: Array<Scalars['Int']['output']>;
  totalSales: Array<Scalars['Float']['output']>;
};

export type VendorDashboardStatsCardResponse = {
  __typename?: 'VendorDashboardStatsCardResponse';
  totalDeliveries?: Maybe<Scalars['Int']['output']>;
  totalOrders: Scalars['Int']['output'];
  totalRestaurants: Scalars['Int']['output'];
  totalSales: Scalars['Float']['output'];
};

export type VendorInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type VendorLiveMonitorData = {
  __typename?: 'VendorLiveMonitorData';
  cancelled_orders?: Maybe<Scalars['Int']['output']>;
  delayed_orders?: Maybe<Scalars['Int']['output']>;
  online_stores?: Maybe<Scalars['Int']['output']>;
  ratings?: Maybe<Scalars['Int']['output']>;
};

export type VendorStoreDetailsResponse = {
  __typename?: 'VendorStoreDetailsResponse';
  _id?: Maybe<Scalars['String']['output']>;
  deliveryCount?: Maybe<Scalars['Int']['output']>;
  pickUpCount?: Maybe<Scalars['Int']['output']>;
  restaurantName?: Maybe<Scalars['String']['output']>;
  totalOrders?: Maybe<Scalars['Int']['output']>;
  totalSales?: Maybe<Scalars['Float']['output']>;
};

export type VerificationConfigurationInput = {
  skipEmailVerification: Scalars['Boolean']['input'];
  skipMobileVerification: Scalars['Boolean']['input'];
  skipWhatsAppOTP: Scalars['Boolean']['input'];
};

export type VerifyOtpResponse = {
  __typename?: 'VerifyOtpResponse';
  result: Scalars['Boolean']['output'];
};

export type Versions = {
  __typename?: 'Versions';
  customerAppVersion?: Maybe<AppType>;
  restaurantAppVersion?: Maybe<AppType>;
  riderAppVersion?: Maybe<AppType>;
};

export type WalletTransaction = {
  __typename?: 'WalletTransaction';
  _id: Scalars['ID']['output'];
  amount: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  pointsUsed?: Maybe<Scalars['Int']['output']>;
  type: Scalars['String']['output'];
  user: User;
};

export type WebConfigurationInput = {
  googleColor: Scalars['String']['input'];
  googleMapLibraries: Scalars['String']['input'];
};

export type WebNotification = {
  __typename?: 'WebNotification';
  _id?: Maybe<Scalars['ID']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  navigateTo?: Maybe<Scalars['String']['output']>;
  read?: Maybe<Scalars['Boolean']['output']>;
};

export type WithdrawRequest = {
  __typename?: 'WithdrawRequest';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  requestAmount: Scalars['Float']['output'];
  requestId: Scalars['String']['output'];
  requestTime: Scalars['String']['output'];
  rider?: Maybe<Rider>;
  status: Scalars['String']['output'];
  store?: Maybe<Restaurant>;
};

export type WithdrawRequestReponse = {
  __typename?: 'WithdrawRequestReponse';
  data?: Maybe<Array<WithdrawRequest>>;
  message?: Maybe<Scalars['String']['output']>;
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type Zone = {
  __typename?: 'Zone';
  _id: Scalars['String']['output'];
  description: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  location?: Maybe<Polygon>;
  tax?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
};

export type ZoneInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  coordinates?: InputMaybe<Array<InputMaybe<Array<InputMaybe<Array<Scalars['Float']['input']>>>>>>;
  description: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateAddonInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  quantityMaximum: Scalars['Int']['input'];
  quantityMinimum: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type EditAddonInput = {
  addons: CreateAddonInput;
  restaurant: Scalars['String']['input'];
};

export type EditOptionInput = {
  options?: InputMaybe<OptionInput>;
  restaurant: Scalars['String']['input'];
};

export type FetchLoyaltyConfiguraionQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchLoyaltyConfiguraionQuery = { __typename?: 'Query', fetchLoyaltyConfiguration?: { __typename?: 'LoyaltyConfiguration', _id: string, pointsPerDollar: number } | null | undefined };

export type SetLoyaltyConfigurationMutationVariables = Exact<{
  input: InputMaybe<LoyaltyConfigurationInput>;
}>;


export type SetLoyaltyConfigurationMutation = { __typename?: 'Mutation', setLoyaltyConfiguration?: { __typename?: 'LoyaltyConfiguration', _id: string, pointsPerDollar: number } | null | undefined };

export type FetchLoyaltyLevelByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type FetchLoyaltyLevelByIdQuery = { __typename?: 'Query', fetchLoyaltyLevelById?: { __typename?: 'LoyaltyLevel', _id: string, name: string, amount?: number | null | undefined, points?: number | null | undefined } | null | undefined };

export type FetchLoyaltyLevelsByUserTypeQueryVariables = Exact<{
  userType: Scalars['String']['input'];
}>;


export type FetchLoyaltyLevelsByUserTypeQuery = { __typename?: 'Query', fetchLoyaltyLevelsByUserType?: Array<{ __typename?: 'LoyaltyLevel', _id: string, name: string, amount?: number | null | undefined, points?: number | null | undefined } | null | undefined> | null | undefined };

export type CreateLoyaltyLevelMutationVariables = Exact<{
  input: LoyaltyLevelInput;
}>;


export type CreateLoyaltyLevelMutation = { __typename?: 'Mutation', createLoyaltyLevel?: { __typename?: 'LoyaltyLevel', _id: string, name: string, amount?: number | null | undefined, points?: number | null | undefined } | null | undefined };

export type EditLoyaltyLevelMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateLoyaltyLevelInput;
}>;


export type EditLoyaltyLevelMutation = { __typename?: 'Mutation', updateLoyaltyLevel?: { __typename?: 'LoyaltyLevel', _id: string, name: string, amount?: number | null | undefined, points?: number | null | undefined } | null | undefined };

export type DeleteLoyaltyLevelMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteLoyaltyLevelMutation = { __typename?: 'Mutation', deleteLoyaltyLevel?: { __typename?: 'LoyaltyLevel', _id: string, name: string, amount?: number | null | undefined, points?: number | null | undefined } | null | undefined };

export type FetchLoyaltyTierByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type FetchLoyaltyTierByIdQuery = { __typename?: 'Query', fetchLoyaltyTierById?: { __typename?: 'LoyaltyTier', _id: string, name: string, points: number } | null | undefined };

export type FetchLoyaltyTiersQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchLoyaltyTiersQuery = { __typename?: 'Query', fetchLoyaltyTiers?: Array<{ __typename?: 'LoyaltyTier', _id: string, name: string, points: number } | null | undefined> | null | undefined };

export type CreateLoyaltyTierMutationVariables = Exact<{
  input: LoyaltyTierInput;
}>;


export type CreateLoyaltyTierMutation = { __typename?: 'Mutation', createLoyaltyTier?: { __typename?: 'LoyaltyTier', _id: string, name: string, points: number } | null | undefined };

export type EditLoyaltyTierMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateLoyaltyTierInput;
}>;


export type EditLoyaltyTierMutation = { __typename?: 'Mutation', updateLoyaltyTier?: { __typename?: 'LoyaltyTier', _id: string, name: string, points: number } | null | undefined };

export type DeleteLoyaltyTierMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteLoyaltyTierMutation = { __typename?: 'Mutation', deleteLoyaltyTier?: { __typename?: 'LoyaltyTier', _id: string, name: string, points: number } | null | undefined };

export type FetchLoyaltyBreakdownByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type FetchLoyaltyBreakdownByIdQuery = { __typename?: 'Query', fetchLoyaltyBreakdownById?: { __typename?: 'LoyaltyBreakdown', _id: string, min: number, max: number, bronze: number, silver: number, gold: number, platinum: number } | null | undefined };

export type FetchLoyaltyBreakdownsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchLoyaltyBreakdownsQuery = { __typename?: 'Query', fetchLoyaltyBreakdowns?: Array<{ __typename?: 'LoyaltyBreakdown', _id: string, min: number, max: number, bronze: number, silver: number, gold: number, platinum: number } | null | undefined> | null | undefined };

export type CreateLoyaltyBreakdownMutationVariables = Exact<{
  input: LoyaltyBreakdownInput;
}>;


export type CreateLoyaltyBreakdownMutation = { __typename?: 'Mutation', createLoyaltyBreakdown?: { __typename?: 'LoyaltyBreakdown', _id: string, min: number, max: number, bronze: number, silver: number, gold: number, platinum: number } | null | undefined };

export type EditLoyaltyBreakdownMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateLoyaltyBreakdownInput;
}>;


export type EditLoyaltyBreakdownMutation = { __typename?: 'Mutation', updateLoyaltyBreakdown?: { __typename?: 'LoyaltyBreakdown', _id: string, min: number, max: number, bronze: number, silver: number, gold: number, platinum: number } | null | undefined };

export type DeleteLoyaltyBreakdownMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteLoyaltyBreakdownMutation = { __typename?: 'Mutation', deleteLoyaltyBreakdown?: { __typename?: 'LoyaltyBreakdown', _id: string, min: number, max: number, bronze: number, silver: number, gold: number, platinum: number } | null | undefined };

export type FetchReferralLoyaltyHistoryQueryVariables = Exact<{
  filter: InputMaybe<FetchLoyaltyReferralHistoryFilterInput>;
}>;


export type FetchReferralLoyaltyHistoryQuery = { __typename?: 'Query', fetchReferralLoyaltyHistory?: { __typename?: 'LoyaltyReferralHistoryResponse', totalCount: number, totalPages: number, currentPage: number, hasNextPage: boolean, hasPrevPage: boolean, data: Array<{ __typename?: 'LoyalyReferralHistory', _id: string, user_name: string, user_rank: string, type: string, level: number, value: number, createdAt: string } | null | undefined> } | null | undefined };


export const FetchLoyaltyConfiguraionDocument = gql`
    query FetchLoyaltyConfiguraion {
  fetchLoyaltyConfiguration {
    _id
    pointsPerDollar
  }
}
    `;

/**
 * __useFetchLoyaltyConfiguraionQuery__
 *
 * To run a query within a React component, call `useFetchLoyaltyConfiguraionQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchLoyaltyConfiguraionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchLoyaltyConfiguraionQuery({
 *   variables: {
 *   },
 * });
 */
export function useFetchLoyaltyConfiguraionQuery(baseOptions?: Apollo.QueryHookOptions<FetchLoyaltyConfiguraionQuery, FetchLoyaltyConfiguraionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchLoyaltyConfiguraionQuery, FetchLoyaltyConfiguraionQueryVariables>(FetchLoyaltyConfiguraionDocument, options);
      }
export function useFetchLoyaltyConfiguraionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchLoyaltyConfiguraionQuery, FetchLoyaltyConfiguraionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchLoyaltyConfiguraionQuery, FetchLoyaltyConfiguraionQueryVariables>(FetchLoyaltyConfiguraionDocument, options);
        }
export function useFetchLoyaltyConfiguraionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FetchLoyaltyConfiguraionQuery, FetchLoyaltyConfiguraionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FetchLoyaltyConfiguraionQuery, FetchLoyaltyConfiguraionQueryVariables>(FetchLoyaltyConfiguraionDocument, options);
        }
export type FetchLoyaltyConfiguraionQueryHookResult = ReturnType<typeof useFetchLoyaltyConfiguraionQuery>;
export type FetchLoyaltyConfiguraionLazyQueryHookResult = ReturnType<typeof useFetchLoyaltyConfiguraionLazyQuery>;
export type FetchLoyaltyConfiguraionSuspenseQueryHookResult = ReturnType<typeof useFetchLoyaltyConfiguraionSuspenseQuery>;
export type FetchLoyaltyConfiguraionQueryResult = Apollo.QueryResult<FetchLoyaltyConfiguraionQuery, FetchLoyaltyConfiguraionQueryVariables>;
export const SetLoyaltyConfigurationDocument = gql`
    mutation SetLoyaltyConfiguration($input: LoyaltyConfigurationInput) {
  setLoyaltyConfiguration(input: $input) {
    _id
    pointsPerDollar
  }
}
    `;
export type SetLoyaltyConfigurationMutationFn = Apollo.MutationFunction<SetLoyaltyConfigurationMutation, SetLoyaltyConfigurationMutationVariables>;

/**
 * __useSetLoyaltyConfigurationMutation__
 *
 * To run a mutation, you first call `useSetLoyaltyConfigurationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetLoyaltyConfigurationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setLoyaltyConfigurationMutation, { data, loading, error }] = useSetLoyaltyConfigurationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetLoyaltyConfigurationMutation(baseOptions?: Apollo.MutationHookOptions<SetLoyaltyConfigurationMutation, SetLoyaltyConfigurationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetLoyaltyConfigurationMutation, SetLoyaltyConfigurationMutationVariables>(SetLoyaltyConfigurationDocument, options);
      }
export type SetLoyaltyConfigurationMutationHookResult = ReturnType<typeof useSetLoyaltyConfigurationMutation>;
export type SetLoyaltyConfigurationMutationResult = Apollo.MutationResult<SetLoyaltyConfigurationMutation>;
export type SetLoyaltyConfigurationMutationOptions = Apollo.BaseMutationOptions<SetLoyaltyConfigurationMutation, SetLoyaltyConfigurationMutationVariables>;
export const FetchLoyaltyLevelByIdDocument = gql`
    query FetchLoyaltyLevelById($id: String!) {
  fetchLoyaltyLevelById(id: $id) {
    _id
    name
    amount
    points
  }
}
    `;

/**
 * __useFetchLoyaltyLevelByIdQuery__
 *
 * To run a query within a React component, call `useFetchLoyaltyLevelByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchLoyaltyLevelByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchLoyaltyLevelByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchLoyaltyLevelByIdQuery(baseOptions: Apollo.QueryHookOptions<FetchLoyaltyLevelByIdQuery, FetchLoyaltyLevelByIdQueryVariables> & ({ variables: FetchLoyaltyLevelByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchLoyaltyLevelByIdQuery, FetchLoyaltyLevelByIdQueryVariables>(FetchLoyaltyLevelByIdDocument, options);
      }
export function useFetchLoyaltyLevelByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchLoyaltyLevelByIdQuery, FetchLoyaltyLevelByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchLoyaltyLevelByIdQuery, FetchLoyaltyLevelByIdQueryVariables>(FetchLoyaltyLevelByIdDocument, options);
        }
export function useFetchLoyaltyLevelByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FetchLoyaltyLevelByIdQuery, FetchLoyaltyLevelByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FetchLoyaltyLevelByIdQuery, FetchLoyaltyLevelByIdQueryVariables>(FetchLoyaltyLevelByIdDocument, options);
        }
export type FetchLoyaltyLevelByIdQueryHookResult = ReturnType<typeof useFetchLoyaltyLevelByIdQuery>;
export type FetchLoyaltyLevelByIdLazyQueryHookResult = ReturnType<typeof useFetchLoyaltyLevelByIdLazyQuery>;
export type FetchLoyaltyLevelByIdSuspenseQueryHookResult = ReturnType<typeof useFetchLoyaltyLevelByIdSuspenseQuery>;
export type FetchLoyaltyLevelByIdQueryResult = Apollo.QueryResult<FetchLoyaltyLevelByIdQuery, FetchLoyaltyLevelByIdQueryVariables>;
export const FetchLoyaltyLevelsByUserTypeDocument = gql`
    query FetchLoyaltyLevelsByUserType($userType: String!) {
  fetchLoyaltyLevelsByUserType(userType: $userType) {
    _id
    name
    amount
    points
  }
}
    `;

/**
 * __useFetchLoyaltyLevelsByUserTypeQuery__
 *
 * To run a query within a React component, call `useFetchLoyaltyLevelsByUserTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchLoyaltyLevelsByUserTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchLoyaltyLevelsByUserTypeQuery({
 *   variables: {
 *      userType: // value for 'userType'
 *   },
 * });
 */
export function useFetchLoyaltyLevelsByUserTypeQuery(baseOptions: Apollo.QueryHookOptions<FetchLoyaltyLevelsByUserTypeQuery, FetchLoyaltyLevelsByUserTypeQueryVariables> & ({ variables: FetchLoyaltyLevelsByUserTypeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchLoyaltyLevelsByUserTypeQuery, FetchLoyaltyLevelsByUserTypeQueryVariables>(FetchLoyaltyLevelsByUserTypeDocument, options);
      }
export function useFetchLoyaltyLevelsByUserTypeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchLoyaltyLevelsByUserTypeQuery, FetchLoyaltyLevelsByUserTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchLoyaltyLevelsByUserTypeQuery, FetchLoyaltyLevelsByUserTypeQueryVariables>(FetchLoyaltyLevelsByUserTypeDocument, options);
        }
export function useFetchLoyaltyLevelsByUserTypeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FetchLoyaltyLevelsByUserTypeQuery, FetchLoyaltyLevelsByUserTypeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FetchLoyaltyLevelsByUserTypeQuery, FetchLoyaltyLevelsByUserTypeQueryVariables>(FetchLoyaltyLevelsByUserTypeDocument, options);
        }
export type FetchLoyaltyLevelsByUserTypeQueryHookResult = ReturnType<typeof useFetchLoyaltyLevelsByUserTypeQuery>;
export type FetchLoyaltyLevelsByUserTypeLazyQueryHookResult = ReturnType<typeof useFetchLoyaltyLevelsByUserTypeLazyQuery>;
export type FetchLoyaltyLevelsByUserTypeSuspenseQueryHookResult = ReturnType<typeof useFetchLoyaltyLevelsByUserTypeSuspenseQuery>;
export type FetchLoyaltyLevelsByUserTypeQueryResult = Apollo.QueryResult<FetchLoyaltyLevelsByUserTypeQuery, FetchLoyaltyLevelsByUserTypeQueryVariables>;
export const CreateLoyaltyLevelDocument = gql`
    mutation CreateLoyaltyLevel($input: LoyaltyLevelInput!) {
  createLoyaltyLevel(input: $input) {
    _id
    name
    amount
    points
  }
}
    `;
export type CreateLoyaltyLevelMutationFn = Apollo.MutationFunction<CreateLoyaltyLevelMutation, CreateLoyaltyLevelMutationVariables>;

/**
 * __useCreateLoyaltyLevelMutation__
 *
 * To run a mutation, you first call `useCreateLoyaltyLevelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLoyaltyLevelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLoyaltyLevelMutation, { data, loading, error }] = useCreateLoyaltyLevelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLoyaltyLevelMutation(baseOptions?: Apollo.MutationHookOptions<CreateLoyaltyLevelMutation, CreateLoyaltyLevelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLoyaltyLevelMutation, CreateLoyaltyLevelMutationVariables>(CreateLoyaltyLevelDocument, options);
      }
export type CreateLoyaltyLevelMutationHookResult = ReturnType<typeof useCreateLoyaltyLevelMutation>;
export type CreateLoyaltyLevelMutationResult = Apollo.MutationResult<CreateLoyaltyLevelMutation>;
export type CreateLoyaltyLevelMutationOptions = Apollo.BaseMutationOptions<CreateLoyaltyLevelMutation, CreateLoyaltyLevelMutationVariables>;
export const EditLoyaltyLevelDocument = gql`
    mutation EditLoyaltyLevel($id: String!, $input: UpdateLoyaltyLevelInput!) {
  updateLoyaltyLevel(id: $id, input: $input) {
    _id
    name
    amount
    points
  }
}
    `;
export type EditLoyaltyLevelMutationFn = Apollo.MutationFunction<EditLoyaltyLevelMutation, EditLoyaltyLevelMutationVariables>;

/**
 * __useEditLoyaltyLevelMutation__
 *
 * To run a mutation, you first call `useEditLoyaltyLevelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditLoyaltyLevelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editLoyaltyLevelMutation, { data, loading, error }] = useEditLoyaltyLevelMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditLoyaltyLevelMutation(baseOptions?: Apollo.MutationHookOptions<EditLoyaltyLevelMutation, EditLoyaltyLevelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditLoyaltyLevelMutation, EditLoyaltyLevelMutationVariables>(EditLoyaltyLevelDocument, options);
      }
export type EditLoyaltyLevelMutationHookResult = ReturnType<typeof useEditLoyaltyLevelMutation>;
export type EditLoyaltyLevelMutationResult = Apollo.MutationResult<EditLoyaltyLevelMutation>;
export type EditLoyaltyLevelMutationOptions = Apollo.BaseMutationOptions<EditLoyaltyLevelMutation, EditLoyaltyLevelMutationVariables>;
export const DeleteLoyaltyLevelDocument = gql`
    mutation DeleteLoyaltyLevel($id: String!) {
  deleteLoyaltyLevel(id: $id) {
    _id
    name
    amount
    points
  }
}
    `;
export type DeleteLoyaltyLevelMutationFn = Apollo.MutationFunction<DeleteLoyaltyLevelMutation, DeleteLoyaltyLevelMutationVariables>;

/**
 * __useDeleteLoyaltyLevelMutation__
 *
 * To run a mutation, you first call `useDeleteLoyaltyLevelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLoyaltyLevelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLoyaltyLevelMutation, { data, loading, error }] = useDeleteLoyaltyLevelMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLoyaltyLevelMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLoyaltyLevelMutation, DeleteLoyaltyLevelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLoyaltyLevelMutation, DeleteLoyaltyLevelMutationVariables>(DeleteLoyaltyLevelDocument, options);
      }
export type DeleteLoyaltyLevelMutationHookResult = ReturnType<typeof useDeleteLoyaltyLevelMutation>;
export type DeleteLoyaltyLevelMutationResult = Apollo.MutationResult<DeleteLoyaltyLevelMutation>;
export type DeleteLoyaltyLevelMutationOptions = Apollo.BaseMutationOptions<DeleteLoyaltyLevelMutation, DeleteLoyaltyLevelMutationVariables>;
export const FetchLoyaltyTierByIdDocument = gql`
    query FetchLoyaltyTierById($id: String!) {
  fetchLoyaltyTierById(id: $id) {
    _id
    name
    points
  }
}
    `;

/**
 * __useFetchLoyaltyTierByIdQuery__
 *
 * To run a query within a React component, call `useFetchLoyaltyTierByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchLoyaltyTierByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchLoyaltyTierByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchLoyaltyTierByIdQuery(baseOptions: Apollo.QueryHookOptions<FetchLoyaltyTierByIdQuery, FetchLoyaltyTierByIdQueryVariables> & ({ variables: FetchLoyaltyTierByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchLoyaltyTierByIdQuery, FetchLoyaltyTierByIdQueryVariables>(FetchLoyaltyTierByIdDocument, options);
      }
export function useFetchLoyaltyTierByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchLoyaltyTierByIdQuery, FetchLoyaltyTierByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchLoyaltyTierByIdQuery, FetchLoyaltyTierByIdQueryVariables>(FetchLoyaltyTierByIdDocument, options);
        }
export function useFetchLoyaltyTierByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FetchLoyaltyTierByIdQuery, FetchLoyaltyTierByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FetchLoyaltyTierByIdQuery, FetchLoyaltyTierByIdQueryVariables>(FetchLoyaltyTierByIdDocument, options);
        }
export type FetchLoyaltyTierByIdQueryHookResult = ReturnType<typeof useFetchLoyaltyTierByIdQuery>;
export type FetchLoyaltyTierByIdLazyQueryHookResult = ReturnType<typeof useFetchLoyaltyTierByIdLazyQuery>;
export type FetchLoyaltyTierByIdSuspenseQueryHookResult = ReturnType<typeof useFetchLoyaltyTierByIdSuspenseQuery>;
export type FetchLoyaltyTierByIdQueryResult = Apollo.QueryResult<FetchLoyaltyTierByIdQuery, FetchLoyaltyTierByIdQueryVariables>;
export const FetchLoyaltyTiersDocument = gql`
    query FetchLoyaltyTiers {
  fetchLoyaltyTiers {
    _id
    name
    points
  }
}
    `;

/**
 * __useFetchLoyaltyTiersQuery__
 *
 * To run a query within a React component, call `useFetchLoyaltyTiersQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchLoyaltyTiersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchLoyaltyTiersQuery({
 *   variables: {
 *   },
 * });
 */
export function useFetchLoyaltyTiersQuery(baseOptions?: Apollo.QueryHookOptions<FetchLoyaltyTiersQuery, FetchLoyaltyTiersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchLoyaltyTiersQuery, FetchLoyaltyTiersQueryVariables>(FetchLoyaltyTiersDocument, options);
      }
export function useFetchLoyaltyTiersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchLoyaltyTiersQuery, FetchLoyaltyTiersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchLoyaltyTiersQuery, FetchLoyaltyTiersQueryVariables>(FetchLoyaltyTiersDocument, options);
        }
export function useFetchLoyaltyTiersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FetchLoyaltyTiersQuery, FetchLoyaltyTiersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FetchLoyaltyTiersQuery, FetchLoyaltyTiersQueryVariables>(FetchLoyaltyTiersDocument, options);
        }
export type FetchLoyaltyTiersQueryHookResult = ReturnType<typeof useFetchLoyaltyTiersQuery>;
export type FetchLoyaltyTiersLazyQueryHookResult = ReturnType<typeof useFetchLoyaltyTiersLazyQuery>;
export type FetchLoyaltyTiersSuspenseQueryHookResult = ReturnType<typeof useFetchLoyaltyTiersSuspenseQuery>;
export type FetchLoyaltyTiersQueryResult = Apollo.QueryResult<FetchLoyaltyTiersQuery, FetchLoyaltyTiersQueryVariables>;
export const CreateLoyaltyTierDocument = gql`
    mutation CreateLoyaltyTier($input: LoyaltyTierInput!) {
  createLoyaltyTier(input: $input) {
    _id
    name
    points
  }
}
    `;
export type CreateLoyaltyTierMutationFn = Apollo.MutationFunction<CreateLoyaltyTierMutation, CreateLoyaltyTierMutationVariables>;

/**
 * __useCreateLoyaltyTierMutation__
 *
 * To run a mutation, you first call `useCreateLoyaltyTierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLoyaltyTierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLoyaltyTierMutation, { data, loading, error }] = useCreateLoyaltyTierMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLoyaltyTierMutation(baseOptions?: Apollo.MutationHookOptions<CreateLoyaltyTierMutation, CreateLoyaltyTierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLoyaltyTierMutation, CreateLoyaltyTierMutationVariables>(CreateLoyaltyTierDocument, options);
      }
export type CreateLoyaltyTierMutationHookResult = ReturnType<typeof useCreateLoyaltyTierMutation>;
export type CreateLoyaltyTierMutationResult = Apollo.MutationResult<CreateLoyaltyTierMutation>;
export type CreateLoyaltyTierMutationOptions = Apollo.BaseMutationOptions<CreateLoyaltyTierMutation, CreateLoyaltyTierMutationVariables>;
export const EditLoyaltyTierDocument = gql`
    mutation EditLoyaltyTier($id: String!, $input: UpdateLoyaltyTierInput!) {
  updateLoyaltyTier(id: $id, input: $input) {
    _id
    name
    points
  }
}
    `;
export type EditLoyaltyTierMutationFn = Apollo.MutationFunction<EditLoyaltyTierMutation, EditLoyaltyTierMutationVariables>;

/**
 * __useEditLoyaltyTierMutation__
 *
 * To run a mutation, you first call `useEditLoyaltyTierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditLoyaltyTierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editLoyaltyTierMutation, { data, loading, error }] = useEditLoyaltyTierMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditLoyaltyTierMutation(baseOptions?: Apollo.MutationHookOptions<EditLoyaltyTierMutation, EditLoyaltyTierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditLoyaltyTierMutation, EditLoyaltyTierMutationVariables>(EditLoyaltyTierDocument, options);
      }
export type EditLoyaltyTierMutationHookResult = ReturnType<typeof useEditLoyaltyTierMutation>;
export type EditLoyaltyTierMutationResult = Apollo.MutationResult<EditLoyaltyTierMutation>;
export type EditLoyaltyTierMutationOptions = Apollo.BaseMutationOptions<EditLoyaltyTierMutation, EditLoyaltyTierMutationVariables>;
export const DeleteLoyaltyTierDocument = gql`
    mutation DeleteLoyaltyTier($id: String!) {
  deleteLoyaltyTier(id: $id) {
    _id
    name
    points
  }
}
    `;
export type DeleteLoyaltyTierMutationFn = Apollo.MutationFunction<DeleteLoyaltyTierMutation, DeleteLoyaltyTierMutationVariables>;

/**
 * __useDeleteLoyaltyTierMutation__
 *
 * To run a mutation, you first call `useDeleteLoyaltyTierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLoyaltyTierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLoyaltyTierMutation, { data, loading, error }] = useDeleteLoyaltyTierMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLoyaltyTierMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLoyaltyTierMutation, DeleteLoyaltyTierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLoyaltyTierMutation, DeleteLoyaltyTierMutationVariables>(DeleteLoyaltyTierDocument, options);
      }
export type DeleteLoyaltyTierMutationHookResult = ReturnType<typeof useDeleteLoyaltyTierMutation>;
export type DeleteLoyaltyTierMutationResult = Apollo.MutationResult<DeleteLoyaltyTierMutation>;
export type DeleteLoyaltyTierMutationOptions = Apollo.BaseMutationOptions<DeleteLoyaltyTierMutation, DeleteLoyaltyTierMutationVariables>;
export const FetchLoyaltyBreakdownByIdDocument = gql`
    query FetchLoyaltyBreakdownById($id: String!) {
  fetchLoyaltyBreakdownById(id: $id) {
    _id
    min
    max
    bronze
    silver
    gold
    platinum
  }
}
    `;

/**
 * __useFetchLoyaltyBreakdownByIdQuery__
 *
 * To run a query within a React component, call `useFetchLoyaltyBreakdownByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchLoyaltyBreakdownByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchLoyaltyBreakdownByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchLoyaltyBreakdownByIdQuery(baseOptions: Apollo.QueryHookOptions<FetchLoyaltyBreakdownByIdQuery, FetchLoyaltyBreakdownByIdQueryVariables> & ({ variables: FetchLoyaltyBreakdownByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchLoyaltyBreakdownByIdQuery, FetchLoyaltyBreakdownByIdQueryVariables>(FetchLoyaltyBreakdownByIdDocument, options);
      }
export function useFetchLoyaltyBreakdownByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchLoyaltyBreakdownByIdQuery, FetchLoyaltyBreakdownByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchLoyaltyBreakdownByIdQuery, FetchLoyaltyBreakdownByIdQueryVariables>(FetchLoyaltyBreakdownByIdDocument, options);
        }
export function useFetchLoyaltyBreakdownByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FetchLoyaltyBreakdownByIdQuery, FetchLoyaltyBreakdownByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FetchLoyaltyBreakdownByIdQuery, FetchLoyaltyBreakdownByIdQueryVariables>(FetchLoyaltyBreakdownByIdDocument, options);
        }
export type FetchLoyaltyBreakdownByIdQueryHookResult = ReturnType<typeof useFetchLoyaltyBreakdownByIdQuery>;
export type FetchLoyaltyBreakdownByIdLazyQueryHookResult = ReturnType<typeof useFetchLoyaltyBreakdownByIdLazyQuery>;
export type FetchLoyaltyBreakdownByIdSuspenseQueryHookResult = ReturnType<typeof useFetchLoyaltyBreakdownByIdSuspenseQuery>;
export type FetchLoyaltyBreakdownByIdQueryResult = Apollo.QueryResult<FetchLoyaltyBreakdownByIdQuery, FetchLoyaltyBreakdownByIdQueryVariables>;
export const FetchLoyaltyBreakdownsDocument = gql`
    query FetchLoyaltyBreakdowns {
  fetchLoyaltyBreakdowns {
    _id
    min
    max
    bronze
    silver
    gold
    platinum
  }
}
    `;

/**
 * __useFetchLoyaltyBreakdownsQuery__
 *
 * To run a query within a React component, call `useFetchLoyaltyBreakdownsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchLoyaltyBreakdownsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchLoyaltyBreakdownsQuery({
 *   variables: {
 *   },
 * });
 */
export function useFetchLoyaltyBreakdownsQuery(baseOptions?: Apollo.QueryHookOptions<FetchLoyaltyBreakdownsQuery, FetchLoyaltyBreakdownsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchLoyaltyBreakdownsQuery, FetchLoyaltyBreakdownsQueryVariables>(FetchLoyaltyBreakdownsDocument, options);
      }
export function useFetchLoyaltyBreakdownsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchLoyaltyBreakdownsQuery, FetchLoyaltyBreakdownsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchLoyaltyBreakdownsQuery, FetchLoyaltyBreakdownsQueryVariables>(FetchLoyaltyBreakdownsDocument, options);
        }
export function useFetchLoyaltyBreakdownsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FetchLoyaltyBreakdownsQuery, FetchLoyaltyBreakdownsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FetchLoyaltyBreakdownsQuery, FetchLoyaltyBreakdownsQueryVariables>(FetchLoyaltyBreakdownsDocument, options);
        }
export type FetchLoyaltyBreakdownsQueryHookResult = ReturnType<typeof useFetchLoyaltyBreakdownsQuery>;
export type FetchLoyaltyBreakdownsLazyQueryHookResult = ReturnType<typeof useFetchLoyaltyBreakdownsLazyQuery>;
export type FetchLoyaltyBreakdownsSuspenseQueryHookResult = ReturnType<typeof useFetchLoyaltyBreakdownsSuspenseQuery>;
export type FetchLoyaltyBreakdownsQueryResult = Apollo.QueryResult<FetchLoyaltyBreakdownsQuery, FetchLoyaltyBreakdownsQueryVariables>;
export const CreateLoyaltyBreakdownDocument = gql`
    mutation CreateLoyaltyBreakdown($input: LoyaltyBreakdownInput!) {
  createLoyaltyBreakdown(input: $input) {
    _id
    min
    max
    bronze
    silver
    gold
    platinum
  }
}
    `;
export type CreateLoyaltyBreakdownMutationFn = Apollo.MutationFunction<CreateLoyaltyBreakdownMutation, CreateLoyaltyBreakdownMutationVariables>;

/**
 * __useCreateLoyaltyBreakdownMutation__
 *
 * To run a mutation, you first call `useCreateLoyaltyBreakdownMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLoyaltyBreakdownMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLoyaltyBreakdownMutation, { data, loading, error }] = useCreateLoyaltyBreakdownMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLoyaltyBreakdownMutation(baseOptions?: Apollo.MutationHookOptions<CreateLoyaltyBreakdownMutation, CreateLoyaltyBreakdownMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLoyaltyBreakdownMutation, CreateLoyaltyBreakdownMutationVariables>(CreateLoyaltyBreakdownDocument, options);
      }
export type CreateLoyaltyBreakdownMutationHookResult = ReturnType<typeof useCreateLoyaltyBreakdownMutation>;
export type CreateLoyaltyBreakdownMutationResult = Apollo.MutationResult<CreateLoyaltyBreakdownMutation>;
export type CreateLoyaltyBreakdownMutationOptions = Apollo.BaseMutationOptions<CreateLoyaltyBreakdownMutation, CreateLoyaltyBreakdownMutationVariables>;
export const EditLoyaltyBreakdownDocument = gql`
    mutation EditLoyaltyBreakdown($id: String!, $input: UpdateLoyaltyBreakdownInput!) {
  updateLoyaltyBreakdown(id: $id, input: $input) {
    _id
    min
    max
    bronze
    silver
    gold
    platinum
  }
}
    `;
export type EditLoyaltyBreakdownMutationFn = Apollo.MutationFunction<EditLoyaltyBreakdownMutation, EditLoyaltyBreakdownMutationVariables>;

/**
 * __useEditLoyaltyBreakdownMutation__
 *
 * To run a mutation, you first call `useEditLoyaltyBreakdownMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditLoyaltyBreakdownMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editLoyaltyBreakdownMutation, { data, loading, error }] = useEditLoyaltyBreakdownMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditLoyaltyBreakdownMutation(baseOptions?: Apollo.MutationHookOptions<EditLoyaltyBreakdownMutation, EditLoyaltyBreakdownMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditLoyaltyBreakdownMutation, EditLoyaltyBreakdownMutationVariables>(EditLoyaltyBreakdownDocument, options);
      }
export type EditLoyaltyBreakdownMutationHookResult = ReturnType<typeof useEditLoyaltyBreakdownMutation>;
export type EditLoyaltyBreakdownMutationResult = Apollo.MutationResult<EditLoyaltyBreakdownMutation>;
export type EditLoyaltyBreakdownMutationOptions = Apollo.BaseMutationOptions<EditLoyaltyBreakdownMutation, EditLoyaltyBreakdownMutationVariables>;
export const DeleteLoyaltyBreakdownDocument = gql`
    mutation DeleteLoyaltyBreakdown($id: String!) {
  deleteLoyaltyBreakdown(id: $id) {
    _id
    min
    max
    bronze
    silver
    gold
    platinum
  }
}
    `;
export type DeleteLoyaltyBreakdownMutationFn = Apollo.MutationFunction<DeleteLoyaltyBreakdownMutation, DeleteLoyaltyBreakdownMutationVariables>;

/**
 * __useDeleteLoyaltyBreakdownMutation__
 *
 * To run a mutation, you first call `useDeleteLoyaltyBreakdownMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLoyaltyBreakdownMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLoyaltyBreakdownMutation, { data, loading, error }] = useDeleteLoyaltyBreakdownMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLoyaltyBreakdownMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLoyaltyBreakdownMutation, DeleteLoyaltyBreakdownMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLoyaltyBreakdownMutation, DeleteLoyaltyBreakdownMutationVariables>(DeleteLoyaltyBreakdownDocument, options);
      }
export type DeleteLoyaltyBreakdownMutationHookResult = ReturnType<typeof useDeleteLoyaltyBreakdownMutation>;
export type DeleteLoyaltyBreakdownMutationResult = Apollo.MutationResult<DeleteLoyaltyBreakdownMutation>;
export type DeleteLoyaltyBreakdownMutationOptions = Apollo.BaseMutationOptions<DeleteLoyaltyBreakdownMutation, DeleteLoyaltyBreakdownMutationVariables>;
export const FetchReferralLoyaltyHistoryDocument = gql`
    query FetchReferralLoyaltyHistory($filter: FetchLoyaltyReferralHistoryFilterInput) {
  fetchReferralLoyaltyHistory(filter: $filter) {
    data {
      _id
      user_name
      user_rank
      type
      level
      value
      createdAt
    }
    totalCount
    totalPages
    currentPage
    hasNextPage
    hasPrevPage
  }
}
    `;

/**
 * __useFetchReferralLoyaltyHistoryQuery__
 *
 * To run a query within a React component, call `useFetchReferralLoyaltyHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchReferralLoyaltyHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchReferralLoyaltyHistoryQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useFetchReferralLoyaltyHistoryQuery(baseOptions?: Apollo.QueryHookOptions<FetchReferralLoyaltyHistoryQuery, FetchReferralLoyaltyHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchReferralLoyaltyHistoryQuery, FetchReferralLoyaltyHistoryQueryVariables>(FetchReferralLoyaltyHistoryDocument, options);
      }
export function useFetchReferralLoyaltyHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchReferralLoyaltyHistoryQuery, FetchReferralLoyaltyHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchReferralLoyaltyHistoryQuery, FetchReferralLoyaltyHistoryQueryVariables>(FetchReferralLoyaltyHistoryDocument, options);
        }
export function useFetchReferralLoyaltyHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FetchReferralLoyaltyHistoryQuery, FetchReferralLoyaltyHistoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FetchReferralLoyaltyHistoryQuery, FetchReferralLoyaltyHistoryQueryVariables>(FetchReferralLoyaltyHistoryDocument, options);
        }
export type FetchReferralLoyaltyHistoryQueryHookResult = ReturnType<typeof useFetchReferralLoyaltyHistoryQuery>;
export type FetchReferralLoyaltyHistoryLazyQueryHookResult = ReturnType<typeof useFetchReferralLoyaltyHistoryLazyQuery>;
export type FetchReferralLoyaltyHistorySuspenseQueryHookResult = ReturnType<typeof useFetchReferralLoyaltyHistorySuspenseQuery>;
export type FetchReferralLoyaltyHistoryQueryResult = Apollo.QueryResult<FetchReferralLoyaltyHistoryQuery, FetchReferralLoyaltyHistoryQueryVariables>;