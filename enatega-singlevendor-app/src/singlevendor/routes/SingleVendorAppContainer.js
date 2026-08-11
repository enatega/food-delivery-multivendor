import React, { useCallback, useContext, useEffect } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'

import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import SingleVendorBottomTab from './SingleVendorBottomTab'
import Profile from '../../screens/Profile/Profile'
import Addresses from '../../screens/Addresses/Addresses'
import NewAddress from '../../screens/NewAddress/NewAddress'
import EditAddress from '../../screens/EditAddress/EditAddress'
import Help from '../../screens/Help/Help'
import CustomerSupport from '../../screens/CustomerSupport/CustomerSupport'
import CreateAccount from '../../screens/CreateAccount/CreateAccount'
import Login from '../../screens/Login/Login'
import Register from '../../screens/Register/Register'
import PhoneNumber from '../../screens/PhoneNumber/PhoneNumber'
import ForgotPassword from '../../screens/ForgotPassword/ForgotPassword'
import SetYourPassword from '../../screens/ForgotPassword/SetYourPassword'
import EmailOtp from '../../screens/Otp/Email/EmailOtp'
import PhoneOtp from '../../screens/Otp/Phone/PhoneOtp'
import ForgotPasswordOtp from '../../screens/Otp/ForgotPassword/ForgetPasswordOtp'
import SelectLocation from '../../screens/SelectLocation'
import AddNewAddress from '../../screens/SelectLocation/AddNewAddress'
import SaveAddress from '../../screens/SaveAddress/SaveAddress'
import Favourite from '../../screens/Favourite/Favourite'
import ChatScreen from '../../screens/ChatWithRider/ChatScreen'
import Collection from '../../screens/Collection/Collection'
import MapSection from '../../screens/MapSection'
import Account from '../../screens/Account/Account'
import EditName from '../screens/EditName'
import SearchScreen from '../../screens/Search/SearchScreen'

import SingleVendorCheckout from '../../singlevendor/screens/Checkout/Checkout'
import ProductExplorer from '../components/ProductExplorer/ProductExplorer'
import ScheduleDeliveryTime from '../screens/ScheduleDeliveryTime/ScheduleDeliveryTime'
import ProductDetails from '../screens/ProductDetails/ProductDetails'
import ReferAFriend from '../screens/ReferAFriend'
import Membership from '../screens/Membership'
import AddAddress from '../screens/AddAddress/AddAddress'
import ProductList from '../screens/ProductsList.js/ProductList'
import Vouchers from '../screens/Vouchers'
import OrderConfirmation from '../screens/Checkout/OrderConfirmation'
import SecuritySettings from '../screens/SecuritySettings'
import ChangePassword from '../screens/ChangePassword'
import LanguageSelection from '../screens/LanguageSelection'
import AccountDetails from '../screens/AccountDetails'
import EditNameSingleVendor from '../screens/EditName/EditName'
import EditPhoneSingleVendor from '../screens/EditPhone/EditPhone'
import NotificationsScreen from '../screens/Notifications/Notifications'
import WalletScreen from '../screens/Wallet'
import MyFavorites from '../screens/MyFavorites/MyFavorites'
import PaymentMethod from '../screens/PaymentMethod/PaymentMethod'
import AddPaymentMethod from '../screens/PaymentMethod/AddPaymentMethod'
import screenOptions from '../../routes/screenOptions'
import { SLIDE_RIGHT_WITH_CURVE_ANIM, SLIDE_UP_RIGHT_ANIMATION } from '../../utils/constants'
import navigationService from '../../routes/navigationService'
import OrderHistory from '../screens/OrderHistory'
import OrderHistoryDetails from '../screens/OrderHistory/OrderHistoryDetails'
import FeedBack from '../screens/FeedBack'
import { StripeProvider } from '@stripe/stripe-react-native'
import ConfigurationContext from '../../context/Configuration'
import SingleVendorPaymentCheckout from '../screens/Checkout/SingleVendorPaymentCheckout'
import * as Notifications from 'expo-notifications'
import { APP_MODES } from '../../mode/constants'
import {
  consumePendingOrderNavigation,
  inferNotificationMode
} from '../../mode/orderOrigin'
import { getModeItem, setModeItem } from '../../mode/storage'
const NavigationStack = createStackNavigator()

const SingleVendorMembership = props => {
  const configuration = useContext(ConfigurationContext)
  const publishableKey =
    configuration?.publishableKey ||
    process.env.EXPO_PUBLIC_SINGLE_VENDOR_STRIPE_PUBLISHABLE_KEY

  if (!publishableKey) {
    return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text style={{ textAlign: 'center' }}>
          Membership payments are temporarily unavailable.
        </Text>
      </View>
    )
  }

  return (
    <StripeProvider publishableKey={publishableKey}>
      <Membership {...props} />
    </StripeProvider>
  )
}

function MainNavigator() {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <NavigationStack.Navigator
      initialRouteName='SVRoot'
      screenOptions={screenOptions({
        theme: themeContext.ThemeValue,
        headerMenuBackground: currentTheme.headerMenuBackground,
        backColor: currentTheme.headerBackground,
        lineColor: currentTheme.horizontalLine,
        textColor: currentTheme.headerText,
        iconColor: currentTheme.iconColorPink,
        headerShown: false
      })}
    >
      <NavigationStack.Screen
        name='SVRoot'
        component={SingleVendorBottomTab}
        options={{
          headerShown: false,
          gestureDirection: 'vertical-inverted',
          cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid
        }}
      />

      <NavigationStack.Screen name='SVAccountProfile' component={Profile} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='Addresses' component={Addresses} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='NewAddress' component={NewAddress} />
      <NavigationStack.Screen name='EditAddress' component={EditAddress} />

      {/* <NavigationStack.Screen name='Settings' component={Settings} /> */}
      {/* <NavigationStack.Screen name='MyOrders' component={MyOrders} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='OrderHistory' component={OrderHistory} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='OrderHistoryDetails' component={OrderHistoryDetails} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='FeedBack' component={FeedBack} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='Reorder' component={Reorder} />
      <NavigationStack.Screen name='Help' component={Help} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />

      <NavigationStack.Screen name='About' component={About} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='Reviews' component={Reviews} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='Paypal' component={Paypal} />
      <NavigationStack.Screen name='RateAndReview' component={RateAndReview} />

      <NavigationStack.Screen name='StripeCheckout' component={StripeCheckout} /> */}

      {/* Authentication Login */}
      <NavigationStack.Screen name='CreateAccount' component={CreateAccount} />
      <NavigationStack.Screen name='Login' component={Login} />
      <NavigationStack.Screen name='Register' component={Register} />
      <NavigationStack.Screen name='PhoneNumber' component={PhoneNumber} />
      <NavigationStack.Screen name='ForgotPassword' component={ForgotPassword} />
      <NavigationStack.Screen name='SetYourPassword' component={SetYourPassword} />
      <NavigationStack.Screen name='EmailOtp' component={EmailOtp} />
      <NavigationStack.Screen name='PhoneOtp' component={PhoneOtp} />
      <NavigationStack.Screen name='ForgotPasswordOtp' component={ForgotPasswordOtp} />
      <NavigationStack.Screen name='SelectLocation' component={SelectLocation} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='AddNewAddress' component={AddNewAddress} />
      <NavigationStack.Screen name='SaveAddress' component={SaveAddress} />
      <NavigationStack.Screen name='Favourite' component={Favourite} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='ChatWithRider' component={ChatScreen} />
      <NavigationStack.Screen name='Collection' component={Collection} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='MapSection' component={MapSection} options={SLIDE_UP_RIGHT_ANIMATION} />
      <NavigationStack.Screen name='Account' component={Account} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='EditName' component={EditName} />
      <NavigationStack.Screen name='SearchScreen' component={SearchScreen} />
      <NavigationStack.Screen
        name='SVPaymentCheckout'
        component={SingleVendorPaymentCheckout}
        options={{ headerShown: true, title: 'Secure payment' }}
      />
      {/* <NavigationStack.Screen name='HypCheckout' component={HypCheckout} /> */}

      {/* Single Vendor Routes */}
      <NavigationStack.Screen name='ProductExplorer' component={ProductExplorer} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='SingleVendorCheckout' component={SingleVendorCheckout} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='ScheduleDeliveryTime' component={ScheduleDeliveryTime} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='ProductDetails' component={ProductDetails} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='ReferAFriend' component={ReferAFriend} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='Membership' component={SingleVendorMembership} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='AddAddress' component={AddAddress} options={{ ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='ProductsList' component={ProductList} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />

      <NavigationStack.Screen name='Vouchers' component={Vouchers} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='OrderConfirmation' component={OrderConfirmation} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='SecuritySettings' component={SecuritySettings} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='ChangePassword' component={ChangePassword} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='LanguageSelection' component={LanguageSelection} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='AccountDetails' component={AccountDetails} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='EditNameSingleVendor' component={EditNameSingleVendor} options={{ header: () => null }} />
      <NavigationStack.Screen name='EditPhoneSingleVendor' component={EditPhoneSingleVendor} options={{ header: () => null }} />
      <NavigationStack.Screen name='NotificationScreen' component={NotificationsScreen} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='WalletScreen' component={WalletScreen} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='MyFavorites' component={MyFavorites} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='PaymentMethod' component={PaymentMethod} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='AddPaymentMethod' component={AddPaymentMethod} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='CustomerSupport' component={CustomerSupport} options={{ ...SLIDE_RIGHT_WITH_CURVE_ANIM, headerShown: true }} />
      <NavigationStack.Screen name='Help' component={Help} options={{ ...SLIDE_RIGHT_WITH_CURVE_ANIM, headerShown: true }} />
      <NavigationStack.Screen name='OrderHistory' component={OrderHistory} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='OrderHistoryDetails' component={OrderHistoryDetails} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='FeedBack' component={FeedBack} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
    </NavigationStack.Navigator>
  )
}

function SingleVendorAppContainer() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse()
  const handleNotification = useCallback(async response => {
    const data = response.notification.request.content.data
    const notificationMode = await inferNotificationMode(data)
    if (notificationMode && notificationMode !== APP_MODES.SINGLE) return

    const identifier = response.notification.request.identifier
    const lastIdentifier = await getModeItem(
      '@lastNotificationHandledId',
      APP_MODES.SINGLE
    )
    if (lastIdentifier === identifier) return
    await setModeItem(
      '@lastNotificationHandledId',
      identifier,
      APP_MODES.SINGLE
    )
    navigationService.navigate('OrderConfirmation', {
      orderId: data?._id || data?.orderId
    })
  }, [])

  useEffect(() => {
    if (
      lastNotificationResponse?.notification?.request?.content?.data?.type === 'order' &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      handleNotification(lastNotificationResponse).catch(() => {})
    }
  }, [handleNotification, lastNotificationResponse])

  useEffect(() => {
    consumePendingOrderNavigation(APP_MODES.SINGLE).then(pendingOrderId => {
      if (!pendingOrderId) return
      navigationService.navigate('OrderConfirmation', {
        orderId: pendingOrderId
      })
    })
  }, [])

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={(ref) => {
          navigationService.setGlobalRef(ref)
        }}
      >
        {<MainNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default SingleVendorAppContainer
