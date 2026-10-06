import { useQuery } from '@apollo/client'
import { GET_SIMILAR_FOODS } from '../../apollo/queries'

const useGetSimilarFoods = ({ foodId }) => {
  const { data, loading, error } = useQuery(GET_SIMILAR_FOODS, {
    variables: {
      foodId,
      skip: 0,
      limit: 10
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    skip: !foodId
  })
  // Keep showing cached items while a background refresh runs.
  return { data, loading: loading && !data, error }
}

export default useGetSimilarFoods
