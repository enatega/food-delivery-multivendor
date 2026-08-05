import { Platform, StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'

import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'

import CreateAccount from '../../screens/CreateAccount/CreateAccount'
import Profile from '../screens/Profile/Profile'
import Home from '../screens/Home/Home'
import Deals from '../screens/Deals/Deals'
import Cart from '../screens/Cart/Cart'
import Browse from '../screens/Browse/Browse'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import BottomTabIcon from '../../components/BottomTabIcon/BottomTabIcon'
import RestaurantScheduleTime from '../components/RestaurantScheduleTime/RestaurantScheduleTime'
import ModeProfileTab from '../../components/VendorModeToggle/ModeProfileTab'
import useCartStore from '../stores/useCartStore'
import { scale } from '../../utils/scaling'

const Tab = createBottomTabNavigator()
const tabIconNames = {
  SVDiscovery: 'discovery',
  SVDeals: 'restaurants',
  Cart: 'store',
  SVBrowse: 'search',
  SVProfile: 'profile'
}
const SingleVendorProfileTab = props => {
  const items = useCartStore(state => state.items)
  return (
    <ModeProfileTab
      {...props}
      AuthenticatedComponent={Profile}
      GuestComponent={CreateAccount}
      hasCartItemsOverride={items.length > 0}
    />
  )
}

const SingleVendorBottomTab = () => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name === 'SVDiscovery' && Platform.OS === 'ios',
        tabBarIcon: ({ focused, color, size }) => {
          // synced with BottomTabIcon, make sure to have the same name as icon in BottomTabIcon
          return <BottomTabIcon name={tabIconNames[route.name]} size={focused ? '28' : size} color={color} />
        },
        tabBarStyle: {
          paddingHorizontal: 15,
          paddingVertical: 10,
          paddingBottom: Platform.OS === 'ios' ? 25 : 15,
          height: Platform.OS === 'ios' ? 90 : 70,
          backgroundColor: currentTheme.cardBackground,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor:
            currentTheme.newBorderColor2 ||
            currentTheme.colorBorder ||
            currentTheme.horizontalLine ||
            'rgba(148, 163, 184, 0.28)'
        },
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: currentTheme.fontNewColor,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarLabelPosition: 'below-icon'
      })}
    >
      <Tab.Screen
        name='SVDiscovery'
        component={Home}
        options={{
          tabBarLabel: t('Discovery'),
          headerRight: Platform.OS === 'ios'
            ? () => (
              <View>
                <RestaurantScheduleTime />
              </View>
              )
            : undefined,
          headerRightContainerStyle: {
            right: 0,
            width: scale(108),
            height: '100%',
            justifyContent: 'center',
            paddingRight: 0,
            overflow: 'visible',
            transform: [{ translateY: scale(Platform.OS === 'android' ? 8 : 13) }],
            zIndex: 10
          }
        }}
      />
      <Tab.Screen
        name='SVDeals'
        component={Deals}
        options={{
          tabBarLabel: t('Deals')
        }}
        initialParams={{
          selectedType: 'restaurant',
          queryType: 'restaurant'
        }}
      />
      <Tab.Screen
        name='Cart'
        component={Cart}
        options={{
          tabBarLabel: t('Cart')
        }}
        initialParams={{
          selectedType: 'grocery',
          queryType: 'grocery'
        }}
      />
      <Tab.Screen
        name='SVBrowse'
        component={Browse}
        options={{
          tabBarLabel: t('Browse')
        }}
      />
      <Tab.Screen
        name='SVProfile'
        component={SingleVendorProfileTab}
        options={{
          tabBarLabel: t('titleProfile')
        }}
      />
    </Tab.Navigator>
  )
}

export default SingleVendorBottomTab
