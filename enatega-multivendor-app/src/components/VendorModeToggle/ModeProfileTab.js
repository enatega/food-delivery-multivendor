import React, { useContext } from 'react'
import { SafeAreaView, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import OrdersContext from '../../context/Orders'
import UserContext from '../../context/User'
import VendorModeToggle from './VendorModeToggle'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

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
    <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.themeBackground }}>
      <VendorModeToggle
        hasActiveOrder={hasActiveOrder}
        hasCartItems={
          hasCartItemsOverride ??
          (Array.isArray(cart) && cart.length > 0)
        }
      />
      <View style={{ flex: 1 }}>
        <Screen {...screenProps} />
      </View>
    </SafeAreaView>
  )
}

export default ModeProfileTab
