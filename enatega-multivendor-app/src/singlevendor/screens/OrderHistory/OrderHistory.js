import React, { useContext, useMemo, useEffect } from 'react'
import { SafeAreaView, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import ConfigurationContext from '../../../context/Configuration'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import EmptyAccountSectionArea from '../../components/EmptyAccountSectionArea'
import { myOrders } from '../../../apollo/queries'
import { buildOrderHistoryList } from '../../utils/orderHistoryHelpers'

import styles from './styles'
import OrderHistoryItem from '../../components/OrderHistory/OrderHistoryItem'
import OrderHistorySkeleton from './OrderHistorySkeleton'
import { pathToArray } from 'graphql/jsutils/Path'

const ORDERS_LIST_QUERY = gql`
  ${myOrders}
`

const OrderHistory = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const configuration = useContext(ConfigurationContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const { data, loading, error } = useQuery(ORDERS_LIST_QUERY, {
    fetchPolicy: 'network-only'
  })

  useEffect(() => {
    console.log('Orders API Data:', JSON.stringify(data, null, 2))
    console.log('Orders Loading:', loading)
    console.log('Orders Error:', error)
    if (data?.orders?.length) {
      console.log('Orders Array:', data.orders)
      console.log('Orders Count:', data.orders.length)
    }
  }, [data, loading, error])

  const orderListData = useMemo(() => {
    const currencySymbol = configuration?.currencySymbol || ''
    return buildOrderHistoryList({
      orders: data?.orders,
      currencySymbol,
      t
    })
  }, [configuration?.currencySymbol, data?.orders, t])

  if (loading) {
    return (
      <SafeAreaView style={styles(currentTheme).container}>
        <AccountSectionHeader currentTheme={currentTheme} onBack={() => navigation.goBack()} headerText={t('My Orders') || 'My Orders'} />
        <OrderHistorySkeleton currentTheme={currentTheme} />
      </SafeAreaView>
    )
  }

  const renderItem = ({ item }) => <OrderHistoryItem orders={item} currentTheme={currentTheme} onOrderPress={handleOrderPress} />

  const keyExtractor = (item) => item.id

  const handleOrderPress = (orderItem) => {
    console.log('orderItem', JSON.stringify(orderItem, null, 2))
    console.log("order Confirmation:",orderItem)
    navigation.navigate('OrderConfirmation', { orderId: orderItem?.id })
  }

  const handleStartShopping = () => {
    navigation.navigate('Main')
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader currentTheme={currentTheme} onBack={() => navigation.goBack()} headerText={t('My Orders') || 'My Orders'} />

      <FlashList
        data={orderListData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={80}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles(currentTheme).listContent}
        ListEmptyComponent={
          <View style={styles(currentTheme).emptyContainer}>
            <EmptyAccountSectionArea currentTheme={currentTheme} imageSource={require('../../assets/images/empty_OrderHistory.png')} title={t('No orders yet') || 'No orders yet'} description={t("You haven't made any order. It will show here when you made one.") || "You haven't made any order. It will show here when you made one."} buttonTitle={t('Start shopping') || 'Start shopping'} onButtonPress={handleStartShopping} />
          </View>
        }
      />
    </SafeAreaView>
  )
}

export default OrderHistory
