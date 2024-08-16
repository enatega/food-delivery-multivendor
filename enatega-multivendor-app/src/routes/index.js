import React, { useCallback, useContext, useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import navigationService from './navigationService'
import * as Notifications from 'expo-notifications'
// import Login from '../screens/Login/Login'
import Login from '../screens/Login/Login'
import Register from '../screens/Register/Register'
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword'
import SetYourPassword from '../screens/ForgotPassword/SetYourPassword'
// import CreateAccount from '../screens/CreateAccount/CreateAccount'
import CreateAccount from '../screens/CreateAccount/CreateAccount'
import SideBar from '../components/Sidebar/Sidebar'
import ItemDetail from '../screens/ItemDetail/ItemDetail'
import MyOrders from '../screens/MyOrders/MyOrders'
import Cart from '../screens/Cart/Cart'
import SaveAddress from '../screens/SaveAddress/SaveAddress'
import RateAndReview from '../screens/RateAndReview/RateAndReview'
import Payment from '../screens/Payment/Payment'
import Help from '../screens/Help/Help'
import Paypal from '../screens/Paypal/Paypal'
import StripeCheckout from '../screens/Stripe/StripeCheckout'
import Profile from '../screens/Profile/Profile'
import Addresses from '../screens/Addresses/Addresses'
import NewAddress from '../screens/NewAddress/NewAddress'
import EditAddress from '../screens/EditAddress/EditAddress'
import CartAddress from '../screens/CartAddress/CartAddress'
import FullMap from '../screens/FullMap/FullMap'
import OrderDetail from '../screens/OrderDetail/OrderDetail'
import Settings from '../screens/Settings/Settings'
import HelpBrowser from '../screens/HelpBrowser/HelpBrowser'
import Main from '../screens/Main/Main'
import Restaurant from '../screens/Restaurant/Restaurant'
import About from '../screens/About'
import SelectLocation from '../screens/SelectLocation'
import AddNewAddress from '../screens/SelectLocation/AddNewAddress'
import CurrentLocation from '../screens/CurrentLocation'
import ThemeContext from '../ui/ThemeContext/ThemeContext'
import { theme } from '../utils/themeColors'
import screenOptions from './screenOptions'
import { LocationContext } from '../context/Location'
import Reorder from '../screens/Reorder/Reorder'
import Favourite from '../screens/Favourite/Favourite'
import ChatScreen from '../screens/ChatWithRider/ChatScreen'
import { DarkBackButton } from '../components/Header/HeaderIcons/HeaderIcons'
import EmailOtp from '../screens/Otp/Email/EmailOtp'
import PhoneOtp from '../screens/Otp/Phone/PhoneOtp'
import ForgotPasswordOtp from '../screens/Otp/ForgotPassword/ForgetPasswordOtp'
import PhoneNumber from '../screens/PhoneNumber/PhoneNumber'
import { useApolloClient, gql } from '@apollo/client'
import { myOrders } from '../apollo/queries'
import Checkout from '../screens/Checkout/Checkout'
import Menu from '../screens/Menu/Menu'
import Reviews from '../screens/Reviews'
import useEnvVars from '../../environment'
import * as Sentry from '@sentry/react-native'

const NavigationStack = createStackNavigator()
const MainStack = createStackNavigator()
const SideDrawer = createDrawerNavigator()
const Location = createStackNavigator()

function Drawer() {

 
  return (
    <SideDrawer.Navigator drawerContent={(props) => <SideBar {...props} />}>
      <SideDrawer.Screen
        options={{ headerShown: false }}
        name='NoDrawer'
        component={NoDrawer}
      />
    </SideDrawer.Navigator>
  )
}
function NoDrawer() {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <NavigationStack.Navigator
      screenOptions={screenOptions({
        theme: themeContext.ThemeValue,
        headerMenuBackground: currentTheme.headerMenuBackground,
        backColor: currentTheme.headerBackground,
        lineColor: currentTheme.horizontalLine,
        textColor: currentTheme.headerText,
        iconColor: currentTheme.iconColorPink
      })}
    >
      <NavigationStack.Screen name='Main' component={Main} />
      <NavigationStack.Screen name='Menu' component={Menu} />
      <NavigationStack.Screen
        name='Restaurant'
        component={Restaurant}
        options={{ header: () => null }}
      />
      {<NavigationStack.Screen name='ItemDetail' component={ItemDetail} />}
      <NavigationStack.Screen name='Cart' component={Cart} />
      <NavigationStack.Screen name='Checkout' component={Checkout} />
      <NavigationStack.Screen name='Profile' component={Profile} />
      <NavigationStack.Screen name='Addresses' component={Addresses} />
      <NavigationStack.Screen name='NewAddress' component={NewAddress} />
      <NavigationStack.Screen name='EditAddress' component={EditAddress} />
      <NavigationStack.Screen name='FullMap' component={FullMap} />
      <NavigationStack.Screen name='CartAddress' component={CartAddress} />
      <NavigationStack.Screen name='Payment' component={Payment} />
      <NavigationStack.Screen
        name='OrderDetail'
        component={OrderDetail}
        options={{
          // headerTransparent: true,
          // headerRight: null,
          // title: '',
          headerBackImage: () =>
            DarkBackButton({
              iconColor: currentTheme.backIcon,
              iconBackground: currentTheme.backIconBackground
            })
        }}
      />
      <NavigationStack.Screen name='Settings' component={Settings} />
      <NavigationStack.Screen name='MyOrders' component={MyOrders} />
      <NavigationStack.Screen name='Reorder' component={Reorder} />
      <NavigationStack.Screen name='Help' component={Help} />
      <NavigationStack.Screen name='HelpBrowser' component={HelpBrowser} />
      <NavigationStack.Screen
        name='About'
        component={About}
        options={{ header: () => null }}
      />
      <NavigationStack.Screen name='Reviews' component={Reviews} />
      <NavigationStack.Screen name='Paypal' component={Paypal} />
      <NavigationStack.Screen name='RateAndReview' component={RateAndReview} />

      <NavigationStack.Screen
        name='StripeCheckout'
        component={StripeCheckout}
      />

      {/* Authentication Login */}
      <NavigationStack.Screen name='CreateAccount' component={CreateAccount} />
      <NavigationStack.Screen name='Login' component={Login} />
      <NavigationStack.Screen name='Register' component={Register} />
      <NavigationStack.Screen name='PhoneNumber' component={PhoneNumber} />
      <NavigationStack.Screen
        name='ForgotPassword'
        component={ForgotPassword}
      />
      <NavigationStack.Screen
        name='SetYourPassword'
        component={SetYourPassword}
      />
      <NavigationStack.Screen name='EmailOtp' component={EmailOtp} />
      <NavigationStack.Screen name='PhoneOtp' component={PhoneOtp} />
      <NavigationStack.Screen
        name='ForgotPasswordOtp'
        component={ForgotPasswordOtp}
      />
      <NavigationStack.Screen
        name='SelectLocation'
        component={SelectLocation}
      />
      <NavigationStack.Screen name='AddNewAddress' component={AddNewAddress} />
      <NavigationStack.Screen name='SaveAddress' component={SaveAddress} />
      <NavigationStack.Screen name='Favourite' component={Favourite} />
      <NavigationStack.Screen name='ChatWithRider' component={ChatScreen} />
    </NavigationStack.Navigator>
  )
}

function LocationStack() {
  return (
    <Location.Navigator>
      <Location.Screen
        name='CurrentLocation'
        component={CurrentLocation}
        options={{ header: () => null }}
      />
      <Location.Screen name='SelectLocation' component={SelectLocation} />
      <Location.Screen name='AddNewAddress' component={AddNewAddress} />
      <Location.Screen name='Main' component={Main} />
    </Location.Navigator>
  )
}

function AppContainer() {
  const client = useApolloClient()
  const { location } = useContext(LocationContext)
  const { SENTRY_DSN } = useEnvVars()
  const lastNotificationResponse = Notifications.useLastNotificationResponse()
  const handleNotification = useCallback(
    async (response) => {
      const { _id } = response.notification.request.content.data
      const lastNotificationHandledId = await AsyncStorage.getItem(
        '@lastNotificationHandledId'
      )
      await client.query({
        query: gql`
          ${myOrders}
        `,
        fetchPolicy: 'network-only'
      })
      const identifier = response.notification.request.identifier
      if (lastNotificationHandledId === identifier) return
      await AsyncStorage.setItem('@lastNotificationHandledId', identifier)
      navigationService.navigate('OrderDetail', {
        _id
      })
    },
    [lastNotificationResponse]
  )
  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data?.type ===
        'order' &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      handleNotification(lastNotificationResponse)
    }

  }, [lastNotificationResponse])

  useEffect(() => {

    if (SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN,
        environment:"development",
        enableInExpoDevelopment: true,
        debug:  true,
        tracesSampleRate: 1.0 // to be changed to 0.2 in production
      })
    }
  }, [SENTRY_DSN])

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={(ref) => {
          navigationService.setGlobalRef(ref)
        }}
      >
        {!location ? (
          <LocationStack />
        ) : (
          <MainStack.Navigator initialRouteName='Drawer'>
            <MainStack.Screen
              options={{ headerShown: false }}
              name='Drawer'
              component={Drawer}
            />
          </MainStack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default Sentry.withProfiler(AppContainer)
