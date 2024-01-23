import React from 'react'
import { Dimensions, View, Platform } from 'react-native'
import { textStyles, scale, colors } from '../utilities'
import { Icon } from 'react-native-elements'
import {useTranslation} from 'react-i18next'

const { height } = Dimensions.get('window')
const screenOptions = props => ({
  headerShown: false
})
const tabIcon = route => ({
  headerShown: false,
  keyboardHidesTabBar: true,
  tabBarActiveTintColor: colors.green,
  tabBarInactiveTintColor: colors.white,
  tabBarItemStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBarLabelStyle: {
    paddingBottom: Platform.OS === 'android' ? 8 : 8,
    ...textStyles.Bold,
    ...textStyles.Center,
    ...textStyles.Small
  },
  tabBarStyle: {
    position: 'absolute',
    height: Platform.OS === 'android' ? 70 : height * 0.12,
    backgroundColor: '#2c2c2c',
    borderColor: 'black',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  tabBarIcon: ({ color, size }) => {
    let iconName
    const {t} = useTranslation()
    if (route.name === t('titleHome')) {
      iconName = 'home'
    } else if (route.name === t('titleProfile')) {
      iconName = 'user'
    }
    else if (route.name === 'Language') {
      iconName = 'language'
    }
    return (
      <View style={{ paddingTop: scale(10), paddingHorizontal: scale(12) }}>
        <Icon type="font-awesome" color={color} name={iconName} size={30} />
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
    paddingBottom: Platform.OS === 'android' ? 10 : 10,
    ...textStyles.Bold,
    ...textStyles.Center,
    ...textStyles.Small
  },
  style: {
    position: 'absolute',
    height: Platform.OS === 'android' ? 70 : height * 0.12,
    backgroundColor: '#2c2c2c',
    borderColor: 'black',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  }
})
export { screenOptions, tabOptions, tabIcon }
