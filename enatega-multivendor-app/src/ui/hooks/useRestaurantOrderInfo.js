import { useQuery } from '@apollo/client'
import { useContext } from 'react'
import {
  recentOrderRestaurantsQuery,
  mostOrderedRestaurantsQuery
} from '../../apollo/queries'
import { LocationContext } from '../../context/Location'
import UserContext from '../../context/User'

export default function useRestaurantOrderInfo() {
  const { location } = useContext(LocationContext)
  const { isLoggedIn } = useContext(UserContext)

  const recentOrderRestaurants = useQuery(recentOrderRestaurantsQuery, {
    variables: { latitude: location.latitude, longitude: location.longitude },
    skip: !isLoggedIn
  })

  const mostOrderedRestaurants = useQuery(mostOrderedRestaurantsQuery, {
    variables: { latitude: location.latitude, longitude: location.longitude }
  })

  const orderLoading =
    recentOrderRestaurants.loading || mostOrderedRestaurants.loading

  const orderError =
    recentOrderRestaurants.error || mostOrderedRestaurants.error

  let orderData = {
    recentOrderRestaurants: null,
    mostOrderedRestaurants: null
  }

  if (!orderLoading && !orderError) {
    orderData = {
      recentOrderRestaurants:
        recentOrderRestaurants.data?.recentOrderRestaurants,
      mostOrderedRestaurants:
        mostOrderedRestaurants.data?.mostOrderedRestaurants
    }
  }

  return { orderLoading, orderError, orderData }
}
