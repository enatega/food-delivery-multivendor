import { useQuery } from '@apollo/client'
import { GET_FOOD_DETAILS } from '../../apollo/queries'


const useProductDetails = ({ foodId, categoryId }) => {
  // Todo: need to fix variations related data.
  const { data, loading, error } = useQuery(GET_FOOD_DETAILS, {
    variables: { foodId, categoryId },fetchPolicy:'network-only'
  })
  console.log('products details:', JSON.stringify(data?.getFoodDetails))

  
  console.log('useProductDetails data',data?.getFoodDetails?.variations, error, foodId)
  const productInfoData = {
    id: data?.getFoodDetails?.id,
    image: data?.getFoodDetails?.image,
    title: data?.getFoodDetails?.title,
    description: data?.getFoodDetails?.description,
    isPopular: data?.getFoodDetails?.isPopular,
    // Todo: need to change this price, according to variations.
    price: data?.getFoodDetails?.variations[0].price,
    variations: data?.getFoodDetails?.variations,
    addons: data?.getFoodDetails?.addons || [],
    categoryId: data?.getFoodDetails?.categoryId,
    cartQuantity: data?.getFoodDetails?.cartQuantity || 0,
    selectedAddons: data?.getFoodDetails?.selectedAddonsId || [],
    selectedVariations: data?.getFoodDetails?.selectedVariationsIds || []
  }

  // Todo need to get the required data from backend.
  const productOtherDetails = {
    description: data?.getFoodDetails?.description,
    ingredients: null,
    usage: null,
    nutritionFacts: null
  }

  return { data, loading, error,  productInfoData, productOtherDetails }
}

export default useProductDetails
