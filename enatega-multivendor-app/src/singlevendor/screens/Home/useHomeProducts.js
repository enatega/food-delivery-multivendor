import { useQuery } from '@apollo/client'
import { Get_Category_Items_Single_Vendor } from '../../apollo/queries'

const useHomeProducts = ({categoryId}) => {

  // Todo: fix product card information as per design, e.g price
  const {data, loading, error, refetch} = useQuery(Get_Category_Items_Single_Vendor, {
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
