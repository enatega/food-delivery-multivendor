import { useQuery, gql } from '@apollo/client'
import { popularFoodItems } from '../../apollo/queries'
import { fetchCategoryDetailsByStore } from '../../apollo/queries'

// Convert the query strings to gql objects
const POPULAR_FOOD_ITEMS = gql`
  ${popularFoodItems}
`
const FETCH_CATEGORY_DETAILS = gql`
  ${fetchCategoryDetailsByStore}
`

export const useRestaurantQueries = (restaurantId) => {
  // Query for popular food items
  const {
    data: popularItemsData,
    loading: popularItemsLoading,
    error: popularItemsError,
    refetch: refetchPopularItems
  } = useQuery(POPULAR_FOOD_ITEMS, {
    variables: { restaurantId },
    skip: !restaurantId
  })

  // Query for category details
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
    refetch: refetchCategories
  } = useQuery(FETCH_CATEGORY_DETAILS, {
    variables: { storeId: restaurantId }
  })
  return {
    // Popular Items Query
    popularItems: {
      data: popularItemsData?.popularFoodItems,
      loading: popularItemsLoading,
      error: popularItemsError,
      refetch: refetchPopularItems
    },
    // Category Details Query
    categories: {
      data: categoryData?.fetchCategoryDetailsByStoreIdForMobile,
      loading: categoryLoading,
      error: categoryError,
      refetch: refetchCategories
    }
  }
}
