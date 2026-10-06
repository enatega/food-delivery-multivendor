import React, { useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { AppState } from 'react-native'
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
const ACTIVE_ORDER_STATUSES = new Set(['PENDING', 'ACCEPTED', 'ASSIGNED', 'PICKED', 'ON_ROUTE'])

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

const mergeOrderUpdates = (orders = [], updates = []) => {
  const byId = new Map(orders.map(order => [String(order?._id), order]))
  updates.forEach(update => {
    if (!update?._id) return
    const id = String(update._id)
    byId.set(id, { ...(byId.get(id) || {}), ...update })
  })
  return [...byId.values()]
}

export const OrdersProvider = ({ children, onOrderDelivered }) => {
  const { profile } = useContext(UserContext)
  const { mode } = useAppMode()
  const isSingleVendor = mode === APP_MODES.SINGLE
  const [activePage, setActivePage] = useState(1)
  const [pastPage, setPastPage] = useState(1)
  const [singleVendorLiveOrders, setSingleVendorLiveOrders] = useState({})
  const activeOrdersRef = useRef([])
  const backgroundOrderIdsRef = useRef(new Set())

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

  const liveOrderUpdates = useMemo(
    () => isSingleVendor ? Object.values(singleVendorLiveOrders) : [],
    [isSingleVendor, singleVendorLiveOrders]
  )
  const activeOrders = useMemo(() => {
    const merged = mergeOrderUpdates(
      dataActive?.getUsersActiveOrders ?? [],
      liveOrderUpdates
    )
    return dedupeById(merged).filter(order => ACTIVE_ORDER_STATUSES.has(order?.orderStatus))
  }, [dataActive, liveOrderUpdates])
  const pastOrders = useMemo(() => {
    const terminalUpdates = liveOrderUpdates.filter(order => !ACTIVE_ORDER_STATUSES.has(order?.orderStatus))
    return dedupeById(mergeOrderUpdates(
      dataPast?.getUsersPastOrders ?? [],
      terminalUpdates
    )).filter(order => !ACTIVE_ORDER_STATUSES.has(order?.orderStatus))
  }, [dataPast, liveOrderUpdates])
  // Combined list kept for backward compatibility: screens that filter by
  // orderStatus (MyOrders, Profile, OrderDetail) keep working unchanged.
  const orders = useMemo(
    () => [...activeOrders, ...pastOrders],
    [activeOrders, pastOrders]
  )

  useEffect(() => {
    activeOrdersRef.current = activeOrders
  }, [activeOrders])

  // A WebSocket status event can be missed while React Native is suspended in
  // the background. Remember the orders that were active when the app left,
  // then reconcile them from the network on foreground and surface the same
  // review prompt the live subscription would have shown.
  useEffect(() => {
    if (isSingleVendor || !profile) return undefined

    let appState = AppState.currentState
    let isMounted = true

    const subscription = AppState.addEventListener('change', async nextState => {
      const wasActive = appState === 'active'
      const isReturningToForeground = appState.match(/inactive|background/) && nextState === 'active'

      if (wasActive && nextState.match(/inactive|background/)) {
        backgroundOrderIdsRef.current = new Set(
          activeOrdersRef.current.map(order => String(order?._id)).filter(Boolean)
        )
      }

      appState = nextState
      if (!isReturningToForeground || backgroundOrderIdsRef.current.size === 0) return

      const previouslyActiveIds = backgroundOrderIdsRef.current
      backgroundOrderIdsRef.current = new Set()

      try {
        const [, pastResult] = await Promise.all([
          refetchActive?.(),
          refetchPast?.()
        ])
        if (!isMounted) return

        const deliveredOrder = pastResult?.data?.getUsersPastOrders?.find(order =>
          previouslyActiveIds.has(String(order?._id)) &&
          ['DELIVERED', 'COMPLETED'].includes(order?.orderStatus) &&
          !order?.review
        )

        if (deliveredOrder) onOrderDelivered?.(deliveredOrder)
      } catch (error) {
        console.log('error reconciling delivered orders on foreground', error?.message)
      }
    })

    return () => {
      isMounted = false
      subscription.remove()
    }
  }, [isSingleVendor, onOrderDelivered, profile, refetchActive, refetchPast])

  useEffect(() => {
    setSingleVendorLiveOrders({})
  }, [mode, profile?._id])

  useEffect(() => {
    orders.forEach(order => {
      recordOrderOrigin(order, mode).catch(() => {})
    })
  }, [mode, orders])

  // Apply single-vendor payloads directly so cards and order history move in
  // the same render as the WebSocket event, without polling or refetching.
  useSubscription(
    isSingleVendor ? SINGLE_SUBSCRIPTION_ORDERS : SUBSCRIPTION_ORDERS,
    {
      variables: { userId: profile?._id },
      skip: !profile,
      onData: ({ data }) => {
        const payload = data?.data?.orderStatusChanged
        const order = isSingleVendor ? payload?.rawOrder : payload?.order
        if (order) recordOrderOrigin(order, mode).catch(() => {})
        if (isSingleVendor && order?._id) {
          setSingleVendorLiveOrders(current => ({
            ...current,
            [String(order._id)]: {
              ...(current[String(order._id)] || {}),
              ...order
            }
          }))
        } else if (order) {
          refetchActive?.()
          refetchPast?.()
        }
        if (['DELIVERED', 'COMPLETED'].includes(order?.orderStatus) && !order?.review) {
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
