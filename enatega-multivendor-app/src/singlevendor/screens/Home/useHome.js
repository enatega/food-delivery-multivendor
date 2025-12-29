import { useQuery } from '@apollo/client'
import { GET_RESTAURANT_CATEGORIES_SINGLE_VENDOR } from '../../apollo/queries'

const useHome = () => {
  const { loading, data, error } = useQuery(GET_RESTAURANT_CATEGORIES_SINGLE_VENDOR)
  return {
    loading,
    data,
    error
  }
}

export default useHome
