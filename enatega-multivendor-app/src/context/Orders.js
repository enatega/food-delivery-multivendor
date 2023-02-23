import React, { useEffect, useContext } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { myOrders } from '../apollo/queries'
import { orderStatusChanged } from '../apollo/subscriptions'
import UserContext from './User'

const ORDERS = gql`
  ${myOrders}
`
const SUBSCRIPTION_ORDERS = gql`
  ${orderStatusChanged}
`

const OrdersContext = React.createContext()

export const OrdersProvider = ({ children }) => {
  const client = useApolloClient()
  const { profile } = useContext(UserContext)
  const {
    called: calledOrders,
    loading: loadingOrders,
    error: errorOrders,
    data: dataOrders,
    networkStatus: networkStatusOrders,
    fetchMore: fetchMoreOrders,
    refetch: reFetchOrders,
    subscribeToMore: subscribeToMoreOrders
  } = useQuery(ORDERS, {
    fetchPolicy: 'network-only',
    onError,
    skip: !profile
  })

  function onError(error) {
    console.log('error context orders', error.message)
  }

  useEffect(() => {
    if (!profile) return
    subscribeOrders()
  }, [profile])

  const subscribeOrders = () => {
    try {
      const unsubscribeOrders = subscribeToMoreOrders({
        document: SUBSCRIPTION_ORDERS,
        variables: { userId: profile._id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const { _id } = subscriptionData.data.orderStatusChanged.order
          if (subscriptionData.data.orderStatusChanged.origin === 'new') {
            if (prev.orders.findIndex(o => o._id === _id) > -1) return prev
            return {
              orders: [
                subscriptionData.data.orderStatusChanged.order,
                ...prev.orders
              ]
            }
          }
          return prev
        }
      })
      client.onResetStore(unsubscribeOrders)
    } catch (error) {
      console.log('error subscribing order', error.message)
    }
  }

  const fetchMoreOrdersFunc = () => {
    if (networkStatusOrders === 7) {
      fetchMoreOrders({
        variables: { offset: dataOrders.orders.length + 1 }
      })
    }
  }

  return (
    <OrdersContext.Provider
      value={{
        loadingOrders: loadingOrders && calledOrders,
        errorOrders,
        orders: dataOrders && dataOrders.orders ? dataOrders.orders : [],
        reFetchOrders,
        fetchMoreOrdersFunc,
        networkStatusOrders
      }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const OrdersConsumer = OrdersContext.Consumer
export default OrdersContext
