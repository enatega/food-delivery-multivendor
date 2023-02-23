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
      iconName = 'md-home'
    } else if (route.name === 'MyOrders') {
      iconName = 'md-time'
    } else if (route.name === 'Wallet') {
      iconName = 'wallet'
    } else if (route.name === 'Profile') {
      iconName = 'person'
    }
    return (
      <View style={{ paddingTop: scale(10), paddingHorizontal: scale(12) }}>
        <Ionicons name={iconName} size={size} color={color} />
      </View>
    )
  }
})

const tabOptions = () => ({
  keyboardHidesTabBar: true,
  activeTintColor: colors.iconPink,
  inactiveTintColor: colors.white,
  tabStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelStyle: {
    ...textStyles.Bold,
    ...textStyles.Center,
    ...textStyles.Small
  },
  style: {
    backgroundColor: '#2c2c2c',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  }
})

export { screenOptions, tabOptions, tabIcon }
