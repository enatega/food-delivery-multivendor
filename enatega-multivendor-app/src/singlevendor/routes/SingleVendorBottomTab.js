import { View, Text, Platform } from 'react-native'
import React, { useContext } from 'react'

import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { RightButton } from '../../components/Header/HeaderIcons/HeaderIcons'
import { useTranslation } from 'react-i18next'

import CreateAccount from '../../screens/CreateAccount/CreateAccount'
import Profile from '../screens/Profile/Profile'
import Home from '../screens/Home/Home'
import Deals from '../screens/Deals/Deals'
import Cart from '../screens/Cart/Cart'
import Browse from '../screens/Browse/Browse'
import SelectedLocation from '../../components/Main/Location/Location'
import { alignment } from '../../utils/alignment'
import { useNavigation } from '@react-navigation/native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import UserContext from '../../context/User'
import BottomTabIcon from '../../components/BottomTabIcon/BottomTabIcon'

const Tab = createBottomTabNavigator()

const SingleVendorBottomTab = () => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const { profile: userProfile } = useContext(UserContext)
  const navigation = useNavigation()

  const handleLocationModal = () => {
    navigation.navigate('SelectLocation')
  }

  



  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name === 'Discovery',
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
      <Tab.Screen name='Discovery' component={Home} />
      <Tab.Screen
        name='Deals'
        component={Deals}
        options={{
          tabBarLabel: 'Deals'
        }}
        initialParams={{
          selectedType: 'restaurant',
          queryType: 'restaurant'
        }}
      />
      <Tab.Screen
        name='cart'
        component={Cart}
        options={{
          tabBarLabel: 'Cart'
        }}
        initialParams={{
          selectedType: 'grocery',
          queryType: 'grocery'
        }}
      />
      <Tab.Screen
        name='Search'
        component={Browse}
        options={{
          tabBarLabel: 'Browse'
        }}
      />
      <Tab.Screen
        name='Profile'
        component={userProfile ? Profile : CreateAccount}
        options={{
          tabBarLabel: t('Profile')
        }}
      />
    </Tab.Navigator>
  )
}

export default SingleVendorBottomTab
