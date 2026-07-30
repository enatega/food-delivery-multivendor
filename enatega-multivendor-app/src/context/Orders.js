import React, { useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { useQuery, useSubscription } from '@apollo/client'
import gql from 'graphql-tag'
import { getUsersActiveOrders, getUsersPastOrders } from '../apollo/queries'
import { orderStatusChanged } from '../apollo/subscriptions'
import UserContext from './User'
import {
  GET_USERS_ACTIVE_ORDERS,
  GET_USERS_PAST_ORDERS
} from '../singlevendor/apollo/queries'
import { orderStatusChanged as singleOrderStatusChanged } from '../singlevendor/apollo/subscriptions'
import { useAppMode } from '../mode/AppModeContext'
import { APP_MODES } from '../mode/constants'
import { recordOrderOrigin } from '../mode/orderOrigin'

const ACTIVE_ORDERS = gql`
  ${getUsersActiveOrders}
`
const PAST_ORDERS = gql`
  ${getUsersPastOrders}
`
const SUBSCRIPTION_ORDERS = gql`
  ${orderStatusChanged}
`
const SINGLE_SUBSCRIPTION_ORDERS = gql`
  ${singleOrderStatusChanged}
`

// Page-based pagination, matching the customer web app (offset stays 0, page
// increments, `limit` items per page).
const PAGE_LIMIT = 10

const OrdersContext = React.createContext()

const dedupeById = (list = []) => {
  const seen = new Set()
  return list.filter((order) => {
    const id = order?._id
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

export const OrdersProvider = ({ children, onOrderDelivered }) => {
  const { profile } = useContext(UserContext)
  const { mode } = useAppMode()
  const isSingleVendor = mode === APP_MODES.SINGLE
  const [activePage, setActivePage] = useState(1)
  const [pastPage, setPastPage] = useState(1)

  function onError(error) {
    console.log('error context orders', error?.message)
  }

  const {
    loading: loadingActive,
    error: errorActive,
    data: dataActive,
    networkStatus: networkStatusActive,
    fetchMore: fetchMoreActive,
    refetch: refetchActive
  } = useQuery(isSingleVendor ? GET_USERS_ACTIVE_ORDERS : ACTIVE_ORDERS, {
    variables: { page: 1, limit: PAGE_LIMIT, offset: 0 },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip: !profile,
    onError
  })

  const {
    loading: loadingPast,
    error: errorPast,
    data: dataPast,
    networkStatus: networkStatusPast,
    fetchMore: fetchMorePast,
    refetch: refetchPast
  } = useQuery(isSingleVendor ? GET_USERS_PAST_ORDERS : PAST_ORDERS, {
    variables: { page: 1, limit: PAGE_LIMIT, offset: 0 },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip: !profile,
    onError
  })

  const activeOrders = useMemo(
    () => dedupeById(dataActive?.getUsersActiveOrders ?? []),
    [dataActive]
  )
  const pastOrders = useMemo(
    () => dedupeById(dataPast?.getUsersPastOrders ?? []),
    [dataPast]
  )
  // Combined list kept for backward compatibility: screens that filter by
  // orderStatus (MyOrders, Profile, OrderDetail) keep working unchanged.
  const orders = useMemo(
    () => [...activeOrders, ...pastOrders],
    [activeOrders, pastOrders]
  )

  useEffect(() => {
    orders.forEach(order => {
      recordOrderOrigin(order, mode).catch(() => {})
    })
  }, [mode, orders])

  // Keep real-time updates: whenever an order changes status, refetch both
  // lists so orders move between the active and past tabs live. Using refetch
  // (instead of manual cache surgery) keeps the two server-split lists correct.
  useSubscription(
    isSingleVendor ? SINGLE_SUBSCRIPTION_ORDERS : SUBSCRIPTION_ORDERS,
    {
      variables: { userId: profile?._id },
      skip: !profile,
      onSubscriptionData: ({ subscriptionData }) => {
        refetchActive?.()
        refetchPast?.()

        const payload = subscriptionData?.data?.orderStatusChanged
        const order = isSingleVendor ? payload?.rawOrder : payload?.order
        if (order) recordOrderOrigin(order, mode).catch(() => {})
        if (order?.orderStatus === 'DELIVERED' && !order?.review) {
          onOrderDelivered?.(order)
        }
      }
    }
  )

  const reFetchOrders = useCallback(() => {
    setActivePage(1)
    setPastPage(1)
    return Promise.all([refetchActive?.(), refetchPast?.()]).catch(() => [])
  }, [refetchActive, refetchPast])

  // Load more past orders (the long list). onEndReached in PastOrders calls
  // this; guard against firing while a fetch is in-flight.
  const fetchMoreOrdersFunc = useCallback(() => {
    if (loadingPast || networkStatusPast === 3) return
    // Stop paging once the server returns a short page.
    if ((dataPast?.getUsersPastOrders?.length ?? 0) < pastPage * PAGE_LIMIT) return

    const nextPage = pastPage + 1
    setPastPage(nextPage)
    fetchMorePast({
      variables: { page: nextPage, limit: PAGE_LIMIT, offset: 0 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getUsersPastOrders?.length) return prev
        return {
          getUsersPastOrders: dedupeById([
            ...(prev?.getUsersPastOrders ?? []),
            ...fetchMoreResult.getUsersPastOrders
          ])
        }
      }
    })
  }, [loadingPast, networkStatusPast, dataPast, pastPage, fetchMorePast])

  const fetchMoreActiveOrdersFunc = useCallback(() => {
    if (loadingActive || networkStatusActive === 3) return
    if ((dataActive?.getUsersActiveOrders?.length ?? 0) < activePage * PAGE_LIMIT) return

    const nextPage = activePage + 1
    setActivePage(nextPage)
    fetchMoreActive({
      variables: { page: nextPage, limit: PAGE_LIMIT, offset: 0 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getUsersActiveOrders?.length) return prev
        return {
          getUsersActiveOrders: dedupeById([
            ...(prev?.getUsersActiveOrders ?? []),
            ...fetchMoreResult.getUsersActiveOrders
          ])
        }
      }
    })
  }, [loadingActive, networkStatusActive, dataActive, activePage, fetchMoreActive])

  const calledOrders = !!profile
  const value = useMemo(() => ({
    loadingOrders: (loadingActive || loadingPast) && calledOrders,
    errorOrders: errorActive || errorPast,
    orders,
    reFetchOrders,
    fetchMoreOrdersFunc,
    networkStatusOrders: networkStatusPast,
    activeOrders,
    pastOrders,
    loadingActiveOrders: loadingActive,
    loadingPastOrders: loadingPast,
    errorActiveOrders: errorActive,
    errorPastOrders: errorPast,
    fetchMoreActiveOrdersFunc,
    networkStatusActiveOrders: networkStatusActive
  }), [activeOrders, calledOrders, errorActive, errorPast, fetchMoreActiveOrdersFunc, fetchMoreOrdersFunc, loadingActive, loadingPast, networkStatusActive, networkStatusPast, orders, pastOrders, reFetchOrders])

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  )
}

export const OrdersConsumer = OrdersContext.Consumer
export default OrdersContext
