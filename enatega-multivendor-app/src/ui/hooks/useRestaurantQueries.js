import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import {
  mostOrderedRestaurantsQuery,
  recentOrderRestaurantsQuery,
  restaurantList,
  topRatedVendorsInfo
} from '../../apollo/queries'

const RESTAURANTS = gql`
  ${restaurantList}
`

const TOP_BRANDS = gql`
  ${topRatedVendorsInfo}
`

const getQuery = (queryType) => {
  switch (queryType) {
    case 'orderAgain':
      return recentOrderRestaurantsQuery
    case 'topPicks':
      return mostOrderedRestaurantsQuery
    case 'topBrands':
      return TOP_BRANDS
    default:
      return RESTAURANTS
  }
}

const getResult = (queryType, data, setRestaurantData) => {
  switch (queryType) {
    case 'orderAgain':
      setRestaurantData(data?.recentOrderRestaurants)
      break
    case 'topPicks':
      setRestaurantData(data?.mostOrderedRestaurants)
      break
    case 'topBrands':
      setRestaurantData(data?.topRatedVendors)
      break
    default:
      setRestaurantData(data?.nearByRestaurants?.restaurants)
  }
}

const HEADING = {
  orderAgain: 'Order Again',
  topPicks: 'Top Picks',
  topBrands: 'Top Brands',
  grocery: 'All Grocery',
  restaurant: 'All Restaurant'
}

const SUB_HEADING = {
  orderAgain: 'From your previous orders',
  topPicks: 'Top picked restaurants for you',
  topBrands: 'Top brands in your area',
  grocery: 'Most ordered grocery stores',
  restaurant: 'Most ordered restaurants'
}

export const useRestaurantQueries = (queryType, location, selectedType) => {
  const [restaurantData, setRestaurantData] = useState(null)
  const query = getQuery(queryType)

  const queryVariables = {
    longitude: location.longitude || null,
    latitude: location.latitude || null
  }

  if (['grocery', 'restaurant'].includes(queryType)) {
    queryVariables.shopType = selectedType || null
    queryVariables.ip = null
  }

  const { data, refetch, networkStatus, loading, error } = useQuery(query, {
    variables: queryVariables,
    onCompleted: (data) => {
      getResult(queryType, data, setRestaurantData)
    },
    fetchPolicy: 'network-only'
  })

  return {
    restaurantData,
    loading,
    error,
    refetch,
    data,
    networkStatus,
    setRestaurantData,
    heading: HEADING[queryType],
    subHeading: SUB_HEADING[queryType]
  }
}
