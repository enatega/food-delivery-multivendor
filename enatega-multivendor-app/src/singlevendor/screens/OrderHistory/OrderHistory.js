import React, { useContext, useEffect, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

import styles from './styles'
import ActiveOrdersList from '../../components/OrderHistory/ActiveOrdersList'
import PastOrdersList from '../../components/OrderHistory/PastOrdersList'
import ScheduledOrdersList from '../../components/OrderHistory/ScheduledOrdersList'
import EmptyOrderHistory from './EmptyOrderHistory'
import useOrderHistoryStore from '../../stores/orderHistoryStore'

const TABS = [
  { key: 'active', label: 'Active' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'past', label: 'Past' }
]

const OrderHistory = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const scheduledOrders = useOrderHistoryStore((state) => state.scheduledOrders)
  const activeOrders = useOrderHistoryStore((state) => state.activeOrders)
  const pastOrders = useOrderHistoryStore((state) => state.pastOrders)
  const hasLoadedScheduledOrders = useOrderHistoryStore((state) => state.hasLoadedScheduledOrders)
  const hasLoadedActiveOrders = useOrderHistoryStore((state) => state.hasLoadedActiveOrders)
  const hasLoadedPastOrders = useOrderHistoryStore((state) => state.hasLoadedPastOrders)
  const [activeTab, setActiveTab] = useState('active')
  const [isReversed, setIsReversed] = useState(false)

  useEffect(() => {
    console.log('orderHistoryStoreData', {
      scheduledOrders,
      activeOrders,
      pastOrders
    })
  }, [scheduledOrders, activeOrders, pastOrders])

  const handleOrderPress = (orderItem) => {
    console.log('orderItem', JSON.stringify(orderItem, null, 2))
    console.log("order Confirmation:", orderItem)
    // navigation.navigate('OrderConfirmation', { orderId: orderItem?.id })
    navigation.navigate('OrderHistoryDetails', { orderId: orderItem?.name })
  }

  const handleStartShopping = () => {
    navigation.navigate('Main')
  }

  const isAllOrdersLoaded =
    hasLoadedScheduledOrders &&
    hasLoadedActiveOrders &&
    hasLoadedPastOrders

  const isAllOrdersEmpty =
    scheduledOrders.length === 0 &&
    activeOrders.length === 0 &&
    pastOrders.length === 0

  const shouldShowEmptyOrderHistory = isAllOrdersLoaded && isAllOrdersEmpty

  return (
    <>
    <AccountSectionHeader currentTheme={currentTheme} onBack={() => navigation.goBack()} headerText={t('My Orders') || 'My Orders'} />
     {shouldShowEmptyOrderHistory ? (
      <EmptyOrderHistory
        currentTheme={currentTheme}
        onStartShopping={handleStartShopping}
      />
    ) : (
      <View style={styles(currentTheme).container}>
        <View style={styles(currentTheme).tabsWrapper}>
          <View style={styles(currentTheme).tabsRow}>
            <View style={styles(currentTheme).tabsPill}>
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key
                return (
                  <View key={tab.key} style={styles(currentTheme).tabsItemWrapper}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => setActiveTab(tab.key)}
                      style={[
                        styles(currentTheme).tabsItem,
                        isActive ? styles(currentTheme).tabsItemActive : null
                      ]}
                    >
                      <TextDefault
                        textColor={currentTheme?.fontMainColor}
                        style={styles(currentTheme).tabsItemText}
                        bold
                      >
                        {t(tab.label) || tab.label}
                      </TextDefault>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setIsReversed((prev) => !prev)}
              style={[
                styles(currentTheme).sortButton,
                isReversed ? styles(currentTheme).sortButtonActive : null
              ]}
            >
              <Ionicons
                name={isReversed ? 'swap-vertical' : 'swap-vertical-outline'}
                size={18}
                color={currentTheme?.fontMainColor}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles(currentTheme).tabContent}>
          {activeTab === 'active' && (
            <ActiveOrdersList
              onOrderPress={handleOrderPress}
              currentTheme={currentTheme}
              sortOrder={isReversed ? 'oldest' : 'latest'}
            />
          )}
          {activeTab === 'scheduled' && (
            <ScheduledOrdersList
              onOrderPress={handleOrderPress}
              currentTheme={currentTheme}
              sortOrder={isReversed ? 'oldest' : 'latest'}
            />
          )}
          {activeTab === 'past' && (
            <PastOrdersList
              onOrderPress={handleOrderPress}
              currentTheme={currentTheme}
              sortOrder={isReversed ? 'oldest' : 'latest'}
            />
          )}
        </View>
      </View>
    )}
    </>
  )
}

export default OrderHistory
