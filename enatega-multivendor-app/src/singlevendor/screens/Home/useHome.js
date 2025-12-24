import { useQuery } from '@apollo/client'
import { Get_Restaurant_Categories_Single_Vendor } from '../../apollo/queries'

const useHome = () => {
  const { loading, data, error } = useQuery(Get_Restaurant_Categories_Single_Vendor)
  return {
    loading,
    data,
    error
  }
}

export default useHome
