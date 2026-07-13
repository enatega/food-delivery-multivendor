import { useQuery } from '@apollo/client'
import { GET_RECOMMENDED_FOODS } from '../../apollo/queries'

const useGetRecommendedFoods = ({ foodId }) => {
  const { data, loading, error } = useQuery(GET_RECOMMENDED_FOODS, {
    variables: {
      foodId,
      skip: 0,
      limit: 10
    }
  })
  return { data, loading, error }
}

export default useGetRecommendedFoods
