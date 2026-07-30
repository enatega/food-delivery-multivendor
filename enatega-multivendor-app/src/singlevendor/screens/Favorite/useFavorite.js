import { useMutation, useQuery } from '@apollo/client'
import { TOGGLE_FAVORITE_ITEM_SINGLE_VENDOR } from '../../apollo/mutations'
import { GET_FAVORITE_FOODS_STATUS } from '../../apollo/queries'
import { useEffect, useState } from 'react'

const useFavorite = ({ id }) => {
  const [isFavorite, setIsFavorite] = useState(false)

  const [mutate, { loading, error }] = useMutation(TOGGLE_FAVORITE_ITEM_SINGLE_VENDOR, {
    onCompleted: (data) => {
      setIsFavorite(data?.toggleFavoriteFoodSingleVendor?.isFavorite)
    },
    refetchQueries: [
      GET_FAVORITE_FOODS_STATUS
    ]
  })

  console.log("errorr in favourite ::", error)

  const { data: isFav, loading: isFavLoading } = useQuery(GET_FAVORITE_FOODS_STATUS, {
    variables: { foodId: id }
  })

  const handleMutate = () => {
    mutate({
      variables: {
        toggleFavoriteFoodSingleVendorId: id
      }
    })
  }

  useEffect(() => {
    if (isFav?.getFavoriteFoodsStatus?.isFavorite) {
      setIsFavorite(isFav?.getFavoriteFoodsStatus?.isFavorite)
    }
  }, [isFav])

  return {
    mutate,
    loading: loading || isFavLoading,
    error,
    handleMutate,
    isFavorite
  }
}

export default useFavorite
