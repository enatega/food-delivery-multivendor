// import { useQuery } from '@apollo/client'
// import { GET_CATEGORY_ITEMS_SINGLE_VENDOR } from '../../apollo/queries'

// const useHomeProducts = ({categoryId,skip,limit,search}) => {
//   console.log("useHome::",categoryId,skip,limit,search)
//   // Todo: fix product card information as per design, e.g price
//   const {data, loading, error, refetch} = useQuery(GET_CATEGORY_ITEMS_SINGLE_VENDOR, {
//     variables: {
//       categoryId: categoryId,
//       skip: skip?skip: 0,
//       limit: limit?limit: 10,
//       search: search?search:''
//     }
//   })
//   return {
//     loading,
//     data,
//     error,
//     refetch
//   }
// }

// export default useHomeProducts


import { useQuery } from '@apollo/client'
import { GET_CATEGORY_ITEMS_SINGLE_VENDOR } from '../../apollo/queries'

const useHomeProducts = ({
  categoryId,
  skip = 0,
  limit = 10,
  search = '',
  skipQuery = false, // 👈 NEW (optional)
} = {}) => {

  const { data, loading, error, refetch } = useQuery(
    GET_CATEGORY_ITEMS_SINGLE_VENDOR,
    {
      variables: {
        categoryId,
        skip,
        limit,
        search,
      },
      skip: skipQuery || !categoryId, // 👈 prevents auto execution
      notifyOnNetworkStatusChange: true,
    }
  )

  return {
    loading,
    data,
    error,
    refetch,
  }
}

export default useHomeProducts
