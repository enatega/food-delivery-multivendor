import React, { useContext, useState, useCallback, useMemo } from 'react'
import { useQuery, useSubscription } from '@apollo/client'
import gql from 'graphql-tag'
import { getUsersActiveOrders, getUsersPastOrders } from '../apollo/queries'
import { orderStatusChanged } from '../apollo/subscriptions'
import UserContext from './User'

const ACTIVE_ORDERS = gql`
  ${getUsersActiveOrders}
`
const PAST_ORDERS = gql`
  ${getUsersPastOrders}
`
const SUBSCRIPTION_ORDERS = gql`
  ${orderStatusChanged}
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

export const OrdersProvider = ({ children }) => {
  const { profile } = useContext(UserContext)
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
  } = useQuery(ACTIVE_ORDERS, {
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
  } = useQuery(PAST_ORDERS, {
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

  // Keep real-time updates: whenever an order changes status, refetch both
  // lists so orders move between the active and past tabs live. Using refetch
  // (instead of manual cache surgery) keeps the two server-split lists correct.
  useSubscription(SUBSCRIPTION_ORDERS, {
    variables: { userId: profile?._id },
    skip: !profile,
    onSubscriptionData: () => {
      refetchActive?.()
      refetchPast?.()
    }
  })

  const reFetchOrders = useCallback(() => {
    setActivePage(1)
    setPastPage(1)
    refetchActive?.()
    refetchPast?.()
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

  return (
    <OrdersContext.Provider
      value={{
        // Combined (backward compatible)
        loadingOrders: (loadingActive || loadingPast) && calledOrders,
        errorOrders: errorActive || errorPast,
        orders,
        reFetchOrders,
        fetchMoreOrdersFunc,
        // networkStatus of the past-orders query drives PastOrders' pull-to-refresh
        networkStatusOrders: networkStatusPast,
        // Split lists (server-side, matching the web app)
        activeOrders,
        pastOrders,
        loadingActiveOrders: loadingActive,
        loadingPastOrders: loadingPast,
        errorActiveOrders: errorActive,
        errorPastOrders: errorPast,
        fetchMoreActiveOrdersFunc,
        networkStatusActiveOrders: networkStatusActive
      }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const OrdersConsumer = OrdersContext.Consumer
export default OrdersContext
