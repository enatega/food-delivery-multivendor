/* eslint-disable react/display-name */
import React from 'react'
import { View } from 'react-native'
import { textStyles } from '../utilities/textStyles'
import { scale } from '../utilities/scaling'
import colors from '../utilities/colors'
import { Ionicons } from '@expo/vector-icons'
import {
  getFocusedRouteNameFromRoute,
  useRoute
} from '@react-navigation/native'

const screenOptions = props => {
  const route = useRoute()
  const routeName = getFocusedRouteNameFromRoute(route)
  return {
    headerShown: routeName === 'ChatWithCustomer'
  }
}
const tabIcon = route => ({
  tabBarIcon: ({ color, size }) => {
    let iconName
    if (route.name === 'Home') {
      iconName = 'home'
    } else if (route.name === 'MyOrders') {
      iconName = 'time'
    } else if (route.name === 'Wallet') {
      iconName = 'wallet'
    } else if (route.name === 'Profile') {
      iconName = 'person'
    } else if (route.name === 'Language') {
      iconName = 'language'
    }
    return (
      <View style={{ paddingTop: scale(10), paddingHorizontal: scale(12) }}>
        <Ionicons name={iconName} size={size} color={color} />
      </View>
    )
  }
})

const tabOptions = () => ({
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarActiveTintColor: colors.iconPink,
  tabBarInactiveTintColor: colors.white,
  tabBarItemStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBarLabelStyle: {
    ...textStyles.Bold,
    ...textStyles.Center,
    ...textStyles.Small
  },
  tabBarStyle: {
    backgroundColor: '#2c2c2c',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  }
})

export { screenOptions, tabOptions, tabIcon }
