import { useContext } from "react"
import { theme } from '../utils/themeColors'
import ThemeContext from "../ui/ThemeContext/ThemeContext"
import { useTranslation } from "react-i18next"
import UserContext from "../context/User"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import BottomTabIcon from "../components/BottomTabIcon/BottomTabIcon"
import { Platform } from "react-native"
import { RightButton } from "../components/Header/HeaderIcons/HeaderIcons"
import Main from '../screens/Main/Main'
import Menu from '../screens/Menu/Menu'
import SearchScreen from '../screens/Search/SearchScreen'
import Profile from '../screens/Profile/Profile'
import CreateAccount from '../screens/CreateAccount/CreateAccount'
import useVendorModeStore from "../singlevendor/stores/useVendorModeStore"
import { isSingleVendor } from "../singlevendor/utils/helper"
import SingleVendorBottomTab from "../singlevendor/components/SingleVendorBottomTab.js/SingleVendorBottomTab"
const Tab = createBottomTabNavigator()
const BottomTabNavigator=()=> {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { t } = useTranslation()
  const { profile: userProfile } = useContext(UserContext)
  const { vendorMode, setVendorMode } = useVendorModeStore();
  
  


  return (
isSingleVendor()?
    <SingleVendorBottomTab></SingleVendorBottomTab>

:

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
          tabBarLabel: t('Discovery')
        }}
      />
      <Tab.Screen
        name='Restaurants'
        component={Menu}
        options={{
          tabBarLabel: t('Restaurants')
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
          tabBarLabel: t('Store')
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
          tabBarLabel: t('search')
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

export default BottomTabNavigator