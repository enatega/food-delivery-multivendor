/* eslint-disable react/display-name */
import React, { useCallback, useContext, useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Login from '../screens/Login/Login'
import Sidebar from '../components/Sidebar/Sidebar'
import Orders from '../screens/Orders/Orders'
import NewOrders from '../screens/NewOrders/NewOrders'
import OrderDetail from '../screens/OrderDetail/OrderDetail'
import Language from '../screens/Language/Language'
import Help from '../screens/Help/Help'
import HelpBrowser from '../screens/HelpBrowser/HelpBrowser'
import { UserProvider } from '../context/user'
import { screenOptions, tabOptions, tabIcon } from './screenOptions'
import LeftButton from '../components/Header/HeaderIcons/HeaderIcons'
import navigationService from './navigationService'
import LocationPermissions from '../screens/LocationPermissions/LocationPermissions'
import { useLocationContext } from '../context/location'
import Wallet from '../screens/Wallet/Wallet'
import Withdraw from '../screens/Withdraw/Withdraw'
import WalletHistory from '../screens/WalletHistory/WalletHistory'
import AvailableCash from '../screens/AvailableCash/AvailableCash'
import ChatScreen from '../screens/ChatWithCustomer/ChatScreen'
import { AuthContext } from '../context/auth'
import { SoundContextProvider } from '../context/sound'
import { gql, useApolloClient } from '@apollo/client'
import { riderOrders } from '../apollo/queries'
import { useTranslation } from 'react-i18next'
import * as Sentry from '@sentry/react-native'
import ConfigurationContext from '../context/configuration'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator()

function MyTabs() {
  const { t } = useTranslation()
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        ...tabIcon(route),
        ...tabOptions()
      })}>
      <Tab.Screen
        name="Home"
        component={NewOrders}
        options={{ title: t('home') }}
      />
      <Tab.Screen
        name="MyOrders"
        component={Orders}
        options={{ title: t('orders') }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{ title: t('wallet') }}
      />
      {/* {
        Platform.OS === 'ios'? null : <Tab.Screen
        name="Language"
        component={Language}
        options={{ title: t('language') }}
      />
      } */}
      <Tab.Screen
        name="Language"
        component={Language}
        options={{ title: t('language') }}
      />
      <Tab.Screen
        name="Profile"
        component={NoDrawer}
        options={{ title: t('profile') }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault()
            navigation.openDrawer()
          }
        })}
      />
    </Tab.Navigator>
  )
}

function Auth() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  )
}

function LocationStack() {
  return (
    <Stack.Navigator
      initialRouteName="Location"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Location" component={LocationPermissions} />
    </Stack.Navigator>
  )
}

function Main() {
  const { locationPermission } = useLocationContext()
  const client = useApolloClient()
  const lastNotificationResponse = Notifications.useLastNotificationResponse()

  const handleNotification = useCallback(async response => {
    if (
      response &&
      response.notification &&
      response.notification.request &&
      response.notification.request.content &&
      response.notification.request.content.data
    ) {
      const { _id } = response.notification.request.content.data
      const { data } = await client.query({
        query: gql`
          ${riderOrders}
        `,
        fetchPolicy: 'network-only'
      })
      const order = data.riderOrders.find(o => o._id === _id)
      const lastNotificationHandledId = await AsyncStorage.getItem(
        '@lastNotificationHandledId'
      )
      if (lastNotificationHandledId === _id) return
      await AsyncStorage.setItem('@lastNotificationHandledId', _id)
      navigationService.navigate('OrderDetail', {
        itemId: _id,
        order
      })
    }
  }, [])

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotification
    )

    return () => subscription.remove()
  }, [handleNotification])

  useEffect(() => {
    // Register a notification handler that will be called when a notification is received.
    Notifications.setNotificationHandler({
      handleNotification: async notification => {
        return {
          shouldShowAlert: false, // Prevent the app from closing
          shouldPlaySound: false,
          shouldSetBadge: false
        }
      }
    })
  }, [])

  return locationPermission ? (
    <UserProvider>
      <SoundContextProvider>
        <Drawer.Navigator
          drawerType="slide"
          drawerPosition="right"
          drawerContent={props => <Sidebar {...props} />}
          screenOptions={{ headerShown: false }}>
          {/*<Drawer.Screen name="SidebBar" component={Sidebar} />*/}

          <Drawer.Screen name="noDrawer" component={NoDrawer} />
        </Drawer.Navigator>
      </SoundContextProvider>
    </UserProvider>
  ) : (
    <LocationStack />
  )
}

function NoDrawer() {
  return (
    <Stack.Navigator initialRouteName="Orders" screenOptions={screenOptions()}>
      <Stack.Screen
        name="Orders"
        component={MyTabs}
        options={{
          headerLeft: () => <LeftButton />
        }}
      />
      <Stack.Screen name="OrderDetail" component={OrderDetail} />
      <Stack.Screen name="Withdraw" component={Withdraw} />
      <Stack.Screen name="WalletHistory" component={WalletHistory} />
      <Stack.Screen name="AvailableCash" component={AvailableCash} />
      <Stack.Screen name="ChatWithCustomer" component={ChatScreen} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Language" component={Language} />
      <Stack.Screen name="HelpBrowser" component={HelpBrowser} />
    </Stack.Navigator>
  )
}

function AppContainer() {
  const { token } = useContext(AuthContext)
  const configuration = useContext(ConfigurationContext)

  // Register for push notifications.
  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      const {
        status: existingStatus
      } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus === 'granted') {
        Notifications.setNotificationHandler({
          handleNotification: async notification => {
            return {
              shouldShowAlert: false, // Prevent the app from closing
              shouldPlaySound: false,
              shouldSetBadge: false
            }
          }
        })
      }
    }

    registerForPushNotificationsAsync()
  }, [])

  useEffect(() => {
    const dsn = configuration?.riderAppSentryUrl
  
    if (dsn) {
      Sentry.init({
        dsn: dsn,
        environment:"development",
        enableInExpoDevelopment: true,
        debug:  true,
        tracesSampleRate: 1.0 // to be changed to 0.2 in production
      })
    }
  }, [configuration?.riderAppSentryUrl])

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={ref => {
          navigationService.setGlobalRef(ref)
        }}>
        {token ? <Main /> : <Auth />}
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default Sentry.withProfiler(AppContainer)
