import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { GET_USERS_PAST_ORDERS } from '../../apollo/queries'

const PAST_ORDERS_QUERY = gql`
  ${GET_USERS_PAST_ORDERS}
`

const usePastOrders = ({
  page = 1,
  limit = 10,
  skipQuery = false,
} = {}) => {
  const { data, loading, error, refetch } = useQuery(
    PAST_ORDERS_QUERY,
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

  const orders = data?.getUsersPastOrders || []
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

export default usePastOrders
