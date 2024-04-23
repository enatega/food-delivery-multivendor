import { useQuery } from '@apollo/client'
import { useContext } from 'react'
import {
  recentOrderRestaurantsPreviewQuery,
  mostOrderedRestaurantsPreviewQuery
} from '../../apollo/queries'
import { LocationContext } from '../../context/Location'
import UserContext from '../../context/User'

export default function useHomeRestaurants() {
  const { location } = useContext(LocationContext)
  const { isLoggedIn } = useContext(UserContext)

  const recentOrderRestaurants = useQuery(recentOrderRestaurantsPreviewQuery, {
    variables: { latitude: location.latitude, longitude: location.longitude },
    skip: !isLoggedIn,
    onError: (err)=>{
      console.log('recentOrderRestaurantsPreviewQuery error => ', JSON.stringify(err, null, 3))
    }
  })

  const mostOrderedRestaurants = useQuery(mostOrderedRestaurantsPreviewQuery, {
    variables: { latitude: location.latitude, longitude: location.longitude },
    onError: (err)=>{
      console.log('mostOrderedRestaurantsPreviewQuery error => ', JSON.stringify(err, null, 3))
    }
  })

  const orderLoading =
    recentOrderRestaurants.loading || mostOrderedRestaurants.loading

  const orderError =
    recentOrderRestaurants.error || mostOrderedRestaurants.error

  return {
    orderLoading,
    orderError,
    orderData: {
      recentOrderRestaurants:
        recentOrderRestaurants?.data?.recentOrderRestaurants,
      mostOrderedRestaurants:
        mostOrderedRestaurants?.data?.mostOrderedRestaurants
    }
  }
}
