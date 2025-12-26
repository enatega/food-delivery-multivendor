import { useQuery } from '@apollo/client'
import { GET_CATEGORY_ITEMS_SINGLE_VENDOR } from '../../apollo/queries'

const useHomeProducts = ({categoryId}) => {

  // Todo: fix product card information as per design, e.g price
  const {data, loading, error, refetch} = useQuery(GET_CATEGORY_ITEMS_SINGLE_VENDOR, {
    variables: {
      categoryId: categoryId,
      skip: 0,
      limit: 10
    }
  })
  return {
    loading,
    data,
    error,
    refetch
  }
}

export default useHomeProducts
