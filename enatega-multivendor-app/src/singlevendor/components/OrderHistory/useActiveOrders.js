import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { GET_USERS_ACTIVE_ORDERS } from '../../apollo/queries'
import useOrderHistoryStore from '../../stores/orderHistoryStore'

const ACTIVE_ORDERS_QUERY = gql`
  ${GET_USERS_ACTIVE_ORDERS}
`
const EMPTY_ORDERS = []

const useActiveOrders = ({
  page = 1,
  limit = 20,
  skipQuery = false,
} = {}) => {
  const setActiveOrders = useOrderHistoryStore((state) => state.setActiveOrders)

  const { data, loading, error, refetch } = useQuery(
    ACTIVE_ORDERS_QUERY,
    {
      variables: {
        page,
        limit,
      },
      skip: skipQuery,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
    }
  )

  const orders = data?.getUsersActiveOrders || EMPTY_ORDERS

  useEffect(() => {
    if (!skipQuery && data) {
      setActiveOrders(orders, { replace: page === 1 })
    }
  }, [skipQuery, data?.getUsersActiveOrders, setActiveOrders, page])

  const ordersLength = orders.length
  // If we got full limit, there might be more
  const hasMore = ordersLength === limit
  const isEndReached = !hasMore || ordersLength < limit
  const nextPage = page + 1

  return {
    loading,
    data,
    error,
    refetch,
    orders,
    pageInfo: {
      page,
      limit,
      hasMore,
      nextPage,
      isEndReached,
      canShowMore: !isEndReached,
    },
  }
}

export default useActiveOrders
