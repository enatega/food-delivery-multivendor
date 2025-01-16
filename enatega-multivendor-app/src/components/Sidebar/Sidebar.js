import React, { useContext, useState } from 'react'
import { View, StatusBar, Platform } from 'react-native'
import SideDrawerItems from '../Drawer/Items/DrawerItems'
import SideDrawerProfile from '../Drawer/Profile/DrawerProfile'
import { theme } from '../../utils/themeColors'
import { useFocusEffect } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import UserContext from '../../context/User'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import styles from './styles'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import LogoutModal from './LogoutModal/LogoutModal'

import analytics from '../../utils/analytics'

import { useTranslation } from 'react-i18next'

const datas = [
  {
    title: 'titleProfile',
    icon: 'user',
    navigateTo: 'Profile',
    isAuth: true
  },
  {
    title: 'myAddresses',
    icon: 'location-pin',
    navigateTo: 'Addresses',
    isAuth: true
  },
  {
    title: 'Favourite',
    icon: 'heart',
    navigateTo: 'Favourite',
    isAuth: true
  },
  {
    title: 'titleOrders',
    icon: 'layers',
    navigateTo: 'MyOrders',
    isAuth: true
  },
  // {
  //   title: 'titleChat',
  //   icon: 'bubble',
  //   navigateTo: 'Chat',
  //   isAuth: false
  // },
  {
    title: 'titleSettings',
    icon: 'settings',
    navigateTo: 'Settings',
    isAuth: true
  },
  {
    title: 'titleHelp',
    icon: 'question',
    navigateTo: 'Help',
    isAuth: true
  }
]

function SidebBar(props) {
  const Analytics = analytics()

  const { t } = useTranslation()

  const inset = useSafeAreaInsets()
  const { isLoggedIn, logout } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [modalVisible, setModalVisible] = useState(false)

  const handleCancel = () => {
    setModalVisible(false)
  }
  const handleLogout = async () => {
    setModalVisible(false)
    await Analytics.track(Analytics.events.USER_LOGGED_OUT)
    await Analytics.identify(null, null)
    await logout()
    props.navigation.closeDrawer()
    FlashMessage({ message: t('logoutMessage') })
  }
  const logoutClick = () => {
    setModalVisible(true)
  }

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  return (
    <View
      style={[
        styles().flex,
        {
          justifyContent: 'space-between',
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }
      ]}>
      <View style={{ flexGrow: 1 }}>
        <View style={styles(currentTheme).topContainer}>
          <SideDrawerProfile navigation={props.navigation} />
        </View>
        <View style={styles(currentTheme).botContainer}>
          {datas.map((dataItem, ind) => (
            <View key={ind} style={styles().item}>
              <SideDrawerItems
                style={styles(currentTheme).iconContainer}
                onPress={async () => {
                  if (dataItem.isAuth && !isLoggedIn) {
                    props.navigation.navigate('CreateAccount')
                  } else {
                    props.navigation.navigate(dataItem.navigateTo)
                  }
                }}
                icon={dataItem.icon}
                title={t(dataItem.title)}
              />
            </View>
          ))}
          {isLoggedIn && (
            <View style={styles().item}>
              <SideDrawerItems
                onPress={logoutClick}
                icon={'logout'}
                title={t('titleLogout')}
              />
            </View>
          )}
        </View>
      </View>

      <LogoutModal
        visible={modalVisible}
        onCancel={handleCancel}
        onLogout={handleLogout}
      />
    </View>
  )
}
export default SidebBar
