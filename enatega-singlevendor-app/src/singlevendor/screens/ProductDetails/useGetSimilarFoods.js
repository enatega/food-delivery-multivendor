import { useQuery } from '@apollo/client'
import { GET_SIMILAR_FOODS } from '../../apollo/queries'

const useGetSimilarFoods = ({ foodId }) => {
  const { data, loading, error } = useQuery(GET_SIMILAR_FOODS, {
    variables: {
      foodId,
      skip: 0,
      limit: 10
    }
  })
  return { data, loading, error }
}

export default useGetSimilarFoods
