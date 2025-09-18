import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import {
  mostOrderedRestaurantsQuery,
  recentOrderRestaurantsQuery,
  restaurantListPreview,
  topRatedVendorsInfo
} from '../../apollo/queries'

const RESTAURANTS = gql`
  ${restaurantListPreview}
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

const getResult = (queryType, data, setRestaurantData, setAllData, selectedType) => {
  switch (queryType) {
    case 'orderAgain':
      setRestaurantData(data?.recentOrderRestaurantsPreview)
      setAllData(data?.recentOrderRestaurantsPreview)
      break
    case 'topPicks':
      setRestaurantData(data?.mostOrderedRestaurantsPreview)
      setAllData(data?.mostOrderedRestaurantsPreview)
      break
    case 'topBrands':
      if (selectedType === 'restaurant') {
        const restaurantBrands = data?.topRatedVendorsPreview?.filter(
          (item) => item.shopType === 'restaurant'
        )
        setRestaurantData(restaurantBrands)
        setAllData(restaurantBrands)
      } else if (selectedType === 'grocery') {
        const groceryBrands = data?.topRatedVendorsPreview?.filter(
          (item) => item.shopType === 'grocery'
        )
        setRestaurantData(groceryBrands)
        setAllData(groceryBrands)
      } else {
        setRestaurantData(data?.topRatedVendorsPreview)
        setAllData(data?.topRatedVendorsPreview)
      }
      break
    default:
      setRestaurantData(data?.nearByRestaurantsPreview?.restaurants)
      setAllData(data?.nearByRestaurantsPreview?.restaurants)
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
  const [allData, setAllData] = useState(null)
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
      getResult(queryType, data, setRestaurantData, setAllData, selectedType)
    },
    fetchPolicy: 'network-only'
  })

  const handleRefresh = () => {
    if (networkStatus === 7) {
      refetch().then((result) => {
        if (result.data) {
          const data = result.data
          getResult(queryType, data, setRestaurantData, setAllData, selectedType)
        } else {
          console.log('Refetch returned no data')
        }
      }).catch((error) => {
        console.error('Refetch error:', error)
      })
    } else {
      console.log('Network status is not 7, current status:', networkStatus)
    }
  }

  return {
    restaurantData,
    loading,
    error,
    refetch: handleRefresh,
    data,
    networkStatus,
    setRestaurantData,
    allData,
    heading: HEADING[queryType],
    subHeading: SUB_HEADING[queryType]
  }
}
