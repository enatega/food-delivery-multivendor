import React, { useContext } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import OrdersContext from '../../context/Orders'
import UserContext from '../../context/User'
import VendorModeToggle from './VendorModeToggle'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { scale } from '../../utils/scaling'

const ModeProfileTab = ({
  AuthenticatedComponent,
  GuestComponent,
  hasCartItemsOverride,
  ...screenProps
}) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const { cart, isLoggedIn } = useContext(UserContext)
  const { orders = [] } = useContext(OrdersContext) || {}
  const activeStatuses = new Set(['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED'])
  const hasActiveOrder = orders.some(order =>
    activeStatuses.has(order?.orderStatus)
  )
  const Screen = isLoggedIn ? AuthenticatedComponent : GuestComponent

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: currentTheme.themeBackground }]}>
      <View style={[styles.toggleRegion, { borderBottomColor: currentTheme.newBorderColor2 || currentTheme.colorBorder }] }>
        <VendorModeToggle
          hasActiveOrder={hasActiveOrder}
          hasCartItems={
            hasCartItemsOverride ??
            (Array.isArray(cart) && cart.length > 0)
          }
        />
      </View>
      <View style={{ flex: 1 }}>
        <Screen {...screenProps} embeddedInModeProfileTab />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  toggleRegion: {
    paddingTop: Platform.OS === 'android' ? scale(2) : 0,
    borderBottomWidth: StyleSheet.hairlineWidth
  }
})

export default ModeProfileTab
