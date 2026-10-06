import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_FOOD_DETAILS } from '../../apollo/queries'
import { getProductPreview } from '../../utils/productPreviewCache'

const useProductDetails = ({ foodId, categoryId }) => {
  const variables = categoryId ? { foodId, categoryId } : { foodId }

  // Render cached details instantly, then refresh stock/cart/deal data in the background.
  const { data, loading, error } = useQuery(GET_FOOD_DETAILS, {
    variables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    skip: !foodId
  })

  const details = data?.getFoodDetails
  // Until details arrive, fall back to the data the tapped product card already had.
  const preview = useMemo(() => (details ? null : getProductPreview(foodId)), [details, foodId])
  const food = details || preview
  const isDetailsLoaded = !!details

  const productInfoData = useMemo(
    () => ({
      id: food?.id ?? foodId,
      image: food?.image,
      title: food?.title,
      description: food?.description,
      isPopular: food?.isPopular,
      isOutOfStock: food?.isOutOfStock || false,
      // Todo: need to change this price, according to variations.
      price: food?.variations?.[0]?.price ?? 0,
      variations: food?.variations,
      addons: food?.addons || [],
      categoryId: food?.categoryId ?? categoryId,
      cartQuantity: food?.cartQuantity || 0,
      selectedAddons: food?.selectedAddonsId || [],
      selectedVariations: food?.selectedVariationsIds || [],
      nutritions: food?.nutritions || [],
      usage: food?.usage ?? '',
      ingredients: food?.ingredients ?? '',
      nutritionDetail: food?.nutritionDetail ?? ''
    }),
    [food, foodId, categoryId]
  )

  // Todo need to get the required data from backend.
  const productOtherDetails = useMemo(
    () => ({
      description: food?.description,
      ingredients: food?.ingredients ?? '',
      usage: food?.usage ?? '',
      nutritionFacts: food?.nutritions || []
    }),
    [food]
  )

  return {
    data,
    // Only block the screen when there is nothing at all to show.
    loading: loading && !food,
    isDetailsLoaded,
    error,
    productInfoData,
    productOtherDetails
  }
}

export default useProductDetails
