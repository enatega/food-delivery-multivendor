import { View, Text, Platform } from 'react-native'
import React, { useContext } from 'react'
import BottomTabIcon from '../../../components/BottomTabIcon/BottomTabIcon'
import { theme } from '../../../utils/themeColors'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { RightButton } from '../../../components/Header/HeaderIcons/HeaderIcons'
import { useTranslation } from 'react-i18next'
import Main from '../../../screens/Main/Main'
import Menu from '../../../screens/Menu/Menu'
import SearchScreen from '../../../screens/Search/SearchScreen'
import CreateAccount from '../../../screens/CreateAccount/CreateAccount'
import Profile from '../../../screens/Profile/Profile'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import UserContext from '../../../context/User'

const Tab = createBottomTabNavigator()

const SingleVendorBottomTab = () => {
      const { t } = useTranslation()
      const themeContext = useContext(ThemeContext)
    const currentTheme = theme[themeContext.ThemeValue]
    const { profile: userProfile } = useContext(UserContext)
  return (
   <Tab.Navigator
      screenOptions={({ route }) => ({
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
      <Tab.Screen
        name='Discovery'
        component={Main}
        options={{
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen
        name='Restaurants'
        component={Menu}
        options={{
          tabBarLabel: 'Deals'
        }}
        initialParams={{
          selectedType: 'restaurant',
          queryType: 'restaurant'
        }}
      />
      <Tab.Screen
        name='Store'
        component={Menu}
        options={{
          tabBarLabel:'Cart'
        }}
        initialParams={{
          selectedType: 'grocery',
          queryType: 'grocery'
        }}
      />
      <Tab.Screen
        name='Search'
        component={SearchScreen}
        options={{
          tabBarLabel: 'Blah Blah'
        }}
      />
      <Tab.Screen
        name='Profile'
        component={userProfile ? Profile : CreateAccount}
        options={{
          tabBarLabel: t('titleProfile')
        }}
      />
    </Tab.Navigator>
  )
}

export default SingleVendorBottomTab