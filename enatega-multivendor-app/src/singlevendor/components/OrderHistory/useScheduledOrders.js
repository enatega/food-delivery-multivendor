import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { GET_SCHEDULED_ORDERS } from '../../apollo/queries'

const SCHEDULED_ORDERS_QUERY = gql`
  ${GET_SCHEDULED_ORDERS}
`

const useScheduledOrders = ({
  offset = 0,
  limit = 10,
  skipQuery = false,
} = {}) => {
  const { data, loading, error, refetch } = useQuery(
    SCHEDULED_ORDERS_QUERY,
    {
      variables: {
        offset,
        limit,
      },
      skip: skipQuery,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
    }
  )

  const orders = data?.scheduledOrders || []
  const ordersLength = orders.length
  // If we got full limit, there might be more
  const hasMore = ordersLength === limit
  const isEndReached = !hasMore || ordersLength < limit
  const nextOffset = offset + ordersLength

  return {
    loading,
    data,
    error,
    refetch,
    orders,
    pageInfo: {
      offset,
      limit,
      hasMore,
      nextOffset,
      isEndReached,
      canShowMore: !isEndReached,
    },
  }
}

export default useScheduledOrders
