import { useCallback } from 'react'
import { useApolloClient } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import { GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_ONLY_SEE_ALL_SINGLE_VENDOR, GET_CATEGORY_PRODUCTS } from '../apollo/queries'

export const CATEGORY_PRODUCTS_PAGE_SIZE = 20

export const categoryProductsVariables = (categoryId, offset = 0) => ({
  categoryId,
  limit: CATEGORY_PRODUCTS_PAGE_SIZE,
  offset
})

const silently = (promise) => promise.catch(() => null)

// Warms the Apollo cache for a single category page. Identical in-flight
// requests are deduplicated, so ProductPage reuses this request when it mounts.
export const prefetchCategoryProducts = (client, categoryId) => {
  if (!client || !categoryId) return Promise.resolve(null)
  return silently(client.query({
    query: GET_CATEGORY_PRODUCTS,
    variables: categoryProductsVariables(categoryId)
  }))
}

// Warms the cache for the "See All" screen: the category bar plus the first
// page of the category that will open (the requested one, or the first one).
export const prefetchProductExplorer = (client, categoryId) => {
  if (!client) return Promise.resolve(null)
  if (categoryId) prefetchCategoryProducts(client, categoryId)

  return silently(client.query({ query: GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_ONLY_SEE_ALL_SINGLE_VENDOR })).then((result) => {
    const firstCategoryId = result?.data?.getAllCategoriesWithSubCategoriesOnlySeeAllSingleVendor?.[0]?.categoryId
    if (!categoryId && firstCategoryId) prefetchCategoryProducts(client, firstCategoryId)
    return result
  })
}

// Starts the requests before the navigation transition so data is usually
// already in the cache by the time the screen renders.
export const useOpenProductExplorer = () => {
  const client = useApolloClient()
  const navigation = useNavigation()

  return useCallback((categoryId) => {
    prefetchProductExplorer(client, categoryId)
    navigation.navigate('ProductExplorer', categoryId ? { categoryId } : undefined)
  }, [client, navigation])
}
