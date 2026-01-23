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
import { buildOrderHistoryList, buildScheduledOrderList } from '../../utils/orderHistoryHelpers'

import styles from './styles'
import OrderHistoryItem from '../../components/OrderHistory/OrderHistoryItem'
import OrderHistorySkeleton from './OrderHistorySkeleton'
import { pathToArray } from 'graphql/jsutils/Path'
import { GET_SCHEDULED_ORDERS } from '../../apollo/queries'
import OrdersList from './OrdersList'
import { ScrollView } from 'react-native-gesture-handler'

const ORDERS_LIST_QUERY = gql`
  ${myOrders}
`
const SCHEDULED_ORDERS_LIST_QUERY = gql`
  ${GET_SCHEDULED_ORDERS}
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
  const { data: scheduledOrdersData, loading: scheduledOrdersLoading, error: scheduledOrdersError } = useQuery(SCHEDULED_ORDERS_LIST_QUERY, {
    fetchPolicy: 'network-only'
  })
  const SCHEDULED_ORDERS = scheduledOrdersData?.scheduledOrders
  const orders = data?.orders
  useEffect(() => {
    console.log('Orders API Data:', JSON.stringify(data, null, 2))
    console.log('Orders Loading:', loading)
    console.log('Orders Error:', error)
    if (orders?.length) {
      console.log('Orders Array:', orders)
      console.log('Orders Count:', orders.length)
    }
  }, [data, loading, error])

  const orderListData = useMemo(() => {
    const currencySymbol = configuration?.currencySymbol || ''
    return buildOrderHistoryList({
      orders: orders,
      currencySymbol,
      t
    })
  }, [configuration?.currencySymbol, orders, t])

  // console.log('orderListData____', JSON.stringify(orderListData, null, 2))

  const scheduledOrderListData = useMemo(() => {
    const currencySymbol = configuration?.currencySymbol || ''
    return buildScheduledOrderList({
      orders: SCHEDULED_ORDERS,
      currencySymbol,
      t
    })
  }, [configuration?.currencySymbol, SCHEDULED_ORDERS, t])

  console.log('scheduledOrderListData', JSON.stringify(scheduledOrderListData, null, 2))

  const combinedOrderListData = useMemo(() => {
    // Combine scheduled orders first, then regular orders
    return [...scheduledOrderListData, ...orderListData]
  }, [scheduledOrderListData, orderListData])

  console.log('combinedOrderListData', JSON.stringify(combinedOrderListData, null, 2))
  

  if (loading || scheduledOrdersLoading) {
    return (
      <SafeAreaView style={styles(currentTheme).container}>
        <AccountSectionHeader currentTheme={currentTheme} onBack={() => navigation.goBack()} headerText={t('My Orders') || 'My Orders'} />
        <OrderHistorySkeleton currentTheme={currentTheme} />
      </SafeAreaView>
    )
  }

  const renderItem = ({ item }) => <OrderHistoryItem ordersData={item} currentTheme={currentTheme} onOrderPress={handleOrderPress} />

  const keyExtractor = (item, index) => {
    // Use section prefix to ensure unique keys, especially for duplicate order IDs
    if (item.type === 'header') {
      return item.id
    }
    return `${item.section || 'item'}-${item.id || index}`
  }

  const handleOrderPress = (orderItem) => {
    console.log('orderItem', JSON.stringify(orderItem, null, 2))
    console.log("order Confirmation:",orderItem)
    navigation.navigate('OrderConfirmation', { orderId: orderItem?.id })
  }

  const handleStartShopping = () => {
    navigation.navigate('Main')
  }

  return (
    // <SafeAreaView style={styles(currentTheme).container}>
    <>
    <AccountSectionHeader currentTheme={currentTheme} onBack={() => navigation.goBack()} headerText={t('My Orders') || 'My Orders'} />
    <ScrollView style={styles(currentTheme).container} showsVerticalScrollIndicator={false}>
      <OrdersList/>

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
    {/* </SafeAreaView> */}
    </ScrollView>
    </>
  )
}

export default OrderHistory
