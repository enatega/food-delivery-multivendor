import React from 'react'
import { Dimensions, View, Platform, Text } from 'react-native'
import { textStyles, scale, colors } from '../utilities'
import { Icon } from 'react-native-elements'
import {useTranslation} from 'react-i18next'
import { color } from 'react-native-elements/dist/helpers'

const { height } = Dimensions.get('window')
const screenOptions = props => ({
  headerShown: false
})
const tabIcon = (route, drawerStatus) => ({
  headerShown: false,
  keyboardHidesTabBar: true,
  tabBarActiveTintColor: colors.green,
  tabBarInactiveTintColor: colors.white,
  tabBarItemStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBarLabel: ({ focused, color }) => {
    // Dynamically set the label color based on drawerStatus and route name
    const labelColor = (drawerStatus === 'open' && (route.name === "Profile"))
      ? colors.green
      : focused
      ? colors.green
      : colors.white;

    return (
      <Text style={{ color: labelColor, fontSize: 12, paddingBottom: Platform.OS === 'android' ? 8 : 8,
        ...textStyles.Bold,
        ...textStyles.Center,
        ...textStyles.Small,}}>
        {route.name}
      </Text>
    );
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
    borderTopRightRadius: 15,
  },
  tabBarIcon: ({ color, size, focused}) => {
    let iconName

    const {t} = useTranslation()
    if (route.name === t('titleHome')) {
      iconName = 'home'
      // make the home icon white when the profile drawer is open or it's not in focus
      color = (drawerStatus == 'open' || !focused) ? colors.white : colors.green; 
    } else if (route.name === t('titleProfile')) {
      iconName = 'user'
      // make the profile icon green when the profile drawer is open, otherwise white
      color = drawerStatus === 'open' ? colors.green : colors.white;
    }
    else if (route.name === 'Language') {
      iconName = 'language'
      // make the language icon white when the profile drawer is open or it's not in focus
      color = (drawerStatus == 'open' || !focused) ? colors.white : colors.green;
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
