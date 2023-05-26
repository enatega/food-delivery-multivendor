/* eslint-disable react/display-name */
import React from 'react'
import {
  RightButton,
  BackButton
} from '../components/Header/HeaderIcons/HeaderIcons'
import { StyleSheet, View } from 'react-native'
import { textStyles } from '../utils/textStyles'
import { scale } from '../utils/scaling'
import { FontAwesome } from '@expo/vector-icons'
const screenOptions = props => {
  return {
    headerTitleAlign: 'center',
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: props.backColor,
      borderBottomColor: props.lineColor,
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    headerTitleStyle: {
      color: props.textColor,
      ...textStyles.Bolder,
      ...textStyles.B700,
      backgroundColor: 'transparent'
    },
    headerTitleContainerStyle: {
      marginHorizontal: scale(35)
    },
    headerBackImage: () =>
      BackButton({ iconColor: props.textColor, icon: 'leftArrow' }),
    headerRight: () => (
      <RightButton icon="cart" iconColor={props.iconColor} menuHeader={false} />
    )
  }
}

const tabIcon = route => ({
  tabBarHideOnKeyboard: true,
  tabBarActiveTintColor: '#6FCF97',
  tabBarInactiveTintColor: '#FFF',
  tabBarItemStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBarLabelStyle: {
    // paddingBottom: 8,
    ...textStyles.Bold,
    // ...textStyles.Center,
    ...textStyles.Small
  },
  tabBarStyle: {
    // position: 'absolute',
    // height: 75,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderColor: 'black',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  tabBarIcon: ({ color, size }) => {
    let iconName
    if (route.name === 'Home') {
      iconName = 'home'
    } else if (route.name === 'My Orders') {
      iconName = 'reorder'
    } else if (route.name === 'Cart') {
      iconName = 'shopping-cart'
    } else if (route.name === 'Profile') {
      iconName = 'user'
    }
    return (
      <View style={{ paddingTop: scale(10), paddingHorizontal: scale(12) }}>
        <FontAwesome name={iconName} size={size} color={color} />
      </View>
    )
  }
})
export { tabIcon }

export default screenOptions
