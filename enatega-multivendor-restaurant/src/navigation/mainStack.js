import React, { useCallback } from 'react'
import * as Notifications from 'expo-notifications'
import { Restaurant, SoundContextProvider } from '../ui/context'
import { OrderDetailScreen } from '../screens/OrderDetail'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { OrdersScreen } from '../screens/Orders'
import SideBar from '../components/SideBar/SideBar'
import { screenOptions, tabIcon } from './screenOptions'
import { colors } from '../utilities/colors'
import { gql, useApolloClient } from '@apollo/client'
import { orders } from '../apollo'
import { useNavigation } from '@react-navigation/native'
import { SelectLanguage } from '../screens/Setting'
import moment from 'moment'
import {useTranslation} from 'react-i18next'
import { MAX_TIME } from '../utilities'
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
})
const Drawer = createDrawerNavigator()
const Tabs = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

export default function MainStack() {
  const {t} = useTranslation()
  const client = useApolloClient()
  const navigation = useNavigation()
  const lastNotificationResponse = Notifications.useLastNotificationResponse()
  const handleNotification = useCallback(
    async response => {
      const { _id } = response.notification.request.content.data
      const { data } = await client.query({
        query: gql`
          ${orders}
        `,
        fetchPolicy: 'network-only'
      })
      const order = data.restaurantOrders.find(o => o._id === _id)
      const acceptanceTime = moment(new Date(order.orderDate)).diff(
        new Date(),
        'seconds'
      )
      var remainingTime = moment(new Date(order.createdAt))
        .add(MAX_TIME, 'seconds')
        .diff(new Date(), 'seconds')

      const lastNotificationHandledId = await AsyncStorage.getItem(
        '@lastNotificationHandledId'
      )
      if (lastNotificationHandledId === _id) return
      await AsyncStorage.setItem('@lastNotificationHandledId', _id)
      navigation.navigate('OrderDetail', {
        activeBar: 0,
        orderData: order,
        remainingTime,
        createdAt: order.createdAt,
        acceptanceTime,
        preparationTime: order.preparationTime
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

  return (
    <Restaurant.Provider>
      <SoundContextProvider>
        <DrawerNavigator />
      </SoundContextProvider>
    </Restaurant.Provider>
  )
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="ProfileDrawer"
      screenOptions={{
        headerShown: false,
        overlayColor: 'transparent',
        drawerType: 'slide',
        drawerStyle: {
          width: '60%'
        }
      }}
      drawerContent={props => <SideBar {...props} />}>
      <Drawer.Screen name="ProfileDrawer" component={TabNavigator} />
    </Drawer.Navigator>
  )
}
function TabNavigator() {
  const {t} = useTranslation()
  return (
    <Tabs.Navigator
      initialRouteName={t('titleHome')}
      screenOptions={({ route }) => tabIcon(route)}
      tabBarLabelStyle={{
        color: colors.green 
      }}>
      <Tabs.Screen
        name={t('titleProfile')}
        component={SideBar}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault()

            navigation.openDrawer()
          }
        })}
      />
      <Tabs.Screen name={t('titleHome')} component={StackNavigator} />
      {/* {Platform.OS === 'ios' ? null :  */}
      <Tabs.Screen name='Language' options={{
          tabBarLabel: t('language')
        }} component={SelectLanguage} />
        {/* } */}
    </Tabs.Navigator>
  )
}
function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Orders" screenOptions={screenOptions()}>
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  )
}
