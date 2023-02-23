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
import { LeftButton } from '../components/Header/HeaderIcons/HeaderIcons'
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
const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator()

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => tabIcon(route)}
      tabBarOptions={tabOptions()}>
      <Tab.Screen
        name="Home"
        component={NewOrders}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="MyOrders"
        component={Orders}
        options={{ title: 'My Orders' }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{ title: 'Wallet' }}
      />
      <Tab.Screen
        name="Profile"
        component={NoDrawer}
        options={{ title: 'Profile' }}
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
    <Stack.Navigator headerMode="none">
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
  const handleNotification = useCallback(
    async response => {
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
    },
    [lastNotificationResponse]
  )
  React.useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.type ===
        'order' &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      handleNotification(lastNotificationResponse)
    }
  }, [lastNotificationResponse])

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async() => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
      })
    })
    const subscription = Notifications.addNotificationResponseReceivedListener()
    return () => subscription.remove()
  }, [])
  return locationPermission ? (
    <UserProvider>
      <SoundContextProvider>
        <Drawer.Navigator
          drawerType="slide"
          drawerPosition="right"
          drawerContent={props => <Sidebar {...props} />}>
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
export default AppContainer
