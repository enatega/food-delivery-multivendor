import React, { useCallback, useContext, useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import navigationService from './navigationService'
import * as Notifications from 'expo-notifications'
import Login from '../screens/Login/Login'
import Register from '../screens/Register/Register'
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword'
import SetYourPassword from '../screens/ForgotPassword/SetYourPassword'
import CreateAccount from '../screens/CreateAccount/CreateAccount'
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
import { DarkBackButton, RightButton } from '../components/Header/HeaderIcons/HeaderIcons'
import EmailOtp from '../screens/Otp/Email/EmailOtp'
import PhoneOtp from '../screens/Otp/Phone/PhoneOtp'
import ForgotPasswordOtp from '../screens/Otp/ForgotPassword/ForgetPasswordOtp'
import PhoneNumber from '../screens/PhoneNumber/PhoneNumber'
import { useApolloClient, gql } from '@apollo/client'
import { myOrders } from '../apollo/queries'
import Checkout from '../screens/Checkout/Checkout'
import Menu from '../screens/Menu/Menu'
import Reviews from '../screens/Reviews'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import BottomTabIcon from '../components/BottomTabIcon/BottomTabIcon'
import { useTranslation } from 'react-i18next'
import Collection from '../screens/Collection/Collection'
import MapSection from '../screens/MapSection'
import Account from '../screens/Account/Account'
import EditName from '../components/Account/EditName/EditName'
import SearchScreen from '../screens/Search/SearchScreen'
import UserContext from '../context/User'
import { Easing, Platform } from 'react-native'
import CategoryPage from '../components/SubCategoryPage/SubCategoryPage'
// import HypCheckout from '../screens/Hyp/HypCheckout'
import NewRestaurantDetailDesign from '../components/NewRestaurantDetailDesign/RestaurantDetailDesign'
import { SLIDE_RIGHT_WITH_CURVE_ANIM, SLIDE_UP_RIGHT_ANIMATION, AIMATE_FROM_CENTER, SLIDE_UP_RIGHT_ANIMATION_FIXED_HEADER } from '../utils/constants'
import * as LocationImport from 'expo-location'

const NavigationStack = createStackNavigator()
const Location = createStackNavigator()
const Tab = createBottomTabNavigator()

function MainNavigator() {
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
        iconColor: currentTheme.iconColorPink,
        headerShown: false
      })}
    >
      <NavigationStack.Screen
        name='Main'
        component={BottomTabNavigator}
        options={{
          headerShown: false,
          gestureDirection: 'vertical-inverted',
          cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid
        }}
      />
      <NavigationStack.Screen name='Menu' component={Menu} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen
        name='NewRestaurantDetailDesign'
        component={NewRestaurantDetailDesign}
        options={{
          header: () => null,
          ...AIMATE_FROM_CENTER
        }}
      />
      <NavigationStack.Screen
        name='CategoryPage'
        component={CategoryPage}
        options={{
          header: () => null,
          ...SLIDE_RIGHT_WITH_CURVE_ANIM
        }}
      />
      <NavigationStack.Screen
        name='Restaurant'
        component={Restaurant}
        options={{
          header: () => null,
          ...AIMATE_FROM_CENTER
        }}
      />
      <NavigationStack.Screen name='ItemDetail' component={ItemDetail} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='Cart' component={Cart} options={SLIDE_UP_RIGHT_ANIMATION_FIXED_HEADER} />
      <NavigationStack.Screen name='Checkout' component={Checkout} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='Profile' component={Profile} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='Addresses' component={Addresses} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='NewAddress' component={NewAddress} />
      <NavigationStack.Screen name='EditAddress' component={EditAddress} />
      <NavigationStack.Screen name='FullMap' component={FullMap} options={SLIDE_UP_RIGHT_ANIMATION} />
      <NavigationStack.Screen name='CartAddress' component={CartAddress} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
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
            }),
          ...SLIDE_RIGHT_WITH_CURVE_ANIM
        }}
      />
      <NavigationStack.Screen name='Settings' component={Settings} />
      <NavigationStack.Screen name='MyOrders' component={MyOrders} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='Reorder' component={Reorder} />
      <NavigationStack.Screen name='Help' component={Help} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='HelpBrowser' component={HelpBrowser} />
      <NavigationStack.Screen name='About' component={About} options={{ header: () => null, ...SLIDE_RIGHT_WITH_CURVE_ANIM }} />
      <NavigationStack.Screen name='Reviews' component={Reviews} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen name='Paypal' component={Paypal} />
      <NavigationStack.Screen name='RateAndReview' component={RateAndReview} />

      <NavigationStack.Screen name='StripeCheckout' component={StripeCheckout} />

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
      {/* <NavigationStack.Screen name='HypCheckout' component={HypCheckout} /> */}
    </NavigationStack.Navigator>
  )
}

function LocationStack() {
  return (
    <Location.Navigator>
      <Location.Screen name='CurrentLocation' component={CurrentLocation} options={{ header: () => null }} />
      <Location.Screen name='SelectLocation' component={SelectLocation} />
      <Location.Screen name='AddNewAddress' component={AddNewAddress} options={SLIDE_RIGHT_WITH_CURVE_ANIM} />
      <NavigationStack.Screen
        name='Main'
        component={BottomTabNavigator}
        options={{
          headerShown: false,
          gestureDirection: 'vertical-inverted',
          cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid
        }}
      />
    </Location.Navigator>
  )
}

function BottomTabNavigator() {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { t } = useTranslation()
  const { profile: userProfile } = useContext(UserContext)
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // synced with BottomTabIcon, make sure to have the same name as icon in BottomTabIcon
          return <BottomTabIcon name={route.name.toLowerCase()} size={focused ? '28' : size} color={color} />
        },
        tabBarStyle: {
          paddingHorizontal: 15,
          paddingVertical: 10,
          paddingBottom: Platform.OS === 'ios' ? 25 : 15,
          height: Platform.OS === 'ios' ? 90 : 70,
          backgroundColor: currentTheme.cardBackground
        },
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: currentTheme.fontNewColor,
        tabBarLabelStyle: { fontSize: 12 },
        headerRight: () => <RightButton icon='cart' iconColor={currentTheme.iconColor} menuHeader={false} t={t} />
      })}
    >
      <Tab.Screen
        name='Discovery'
        component={Main}
        options={{
          tabBarLabel: t('Discovery')
        }}
      />
      <Tab.Screen
        name='Restaurants'
        component={Menu}
        options={{
          tabBarLabel: t('Restaurants')
        }}
        initialParams={{
          selectedType: 'restaurant',
          queryType: 'restaurant'
        }}
      />
      <Tab.Screen
        name='Store'
        component={Menu}
        options={{
          tabBarLabel: t('Store')
        }}
        initialParams={{
          selectedType: 'grocery',
          queryType: 'grocery'
        }}
      />
      <Tab.Screen
        name='Search'
        component={SearchScreen}
        options={{
          tabBarLabel: t('search')
        }}
      />
      <Tab.Screen
        name='Profile'
        component={userProfile ? Profile : CreateAccount}
        options={{
          tabBarLabel: t('titleProfile')
        }}
      />
    </Tab.Navigator>
  )
}

function AppContainer() {
  const client = useApolloClient()
  const { permissionState, setPermissionState, location } = useContext(LocationContext)
  const lastNotificationResponse = Notifications.useLastNotificationResponse()

  const [isLoadingPermission, setIsLoadingPermission] = React.useState(true)

  const handleNotification = useCallback(
    async (response) => {
      const { _id } = response.notification.request.content.data
      const lastNotificationHandledId = await AsyncStorage.getItem('@lastNotificationHandledId')
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

  // Handlers
  const init = async () => {
    try {
      const permission_state = await LocationImport.getForegroundPermissionsAsync()
      console.log({permission_state})

      setPermissionState(permission_state)
      setIsLoadingPermission(false)
    } finally {
      setIsLoadingPermission(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (lastNotificationResponse && lastNotificationResponse.notification.request.content.data?.type === 'order' && lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
      handleNotification(lastNotificationResponse)
    }
  }, [lastNotificationResponse])

  console.log('-------------')
  console.log('-------------')
  console.log({ permissionState, location })

  if (isLoadingPermission) return

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={(ref) => {
          navigationService.setGlobalRef(ref)
        }}
      >
        {!permissionState?.granted || !location ? <LocationStack /> : <MainNavigator />}

        {/* {<LocationStack />}
        <MainNavigator /> */}
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default AppContainer
