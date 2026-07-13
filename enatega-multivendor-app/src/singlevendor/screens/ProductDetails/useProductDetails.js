import { useQuery } from '@apollo/client'
import { GET_FOOD_DETAILS } from '../../apollo/queries'


const useProductDetails = ({ foodId, categoryId }) => {
  // Todo: need to fix variations related data.
  console.log('foodId______',foodId);
  console.log('categoryId______',categoryId);
  
  const { data, loading, error } = useQuery(GET_FOOD_DETAILS, {
    variables: { foodId, categoryId },fetchPolicy:'network-only'
  })
  console.log('products details:', JSON.stringify(data,null,2))

  
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
    selectedVariations: data?.getFoodDetails?.selectedVariationsIds || [],
    nutritions: data?.getFoodDetails?.nutritions || [],
    usage: data?.getFoodDetails?.usage ?? '',
    ingredients: data?.getFoodDetails?.ingredients ?? '',
    nutritionDetail: data?.getFoodDetails?.nutritionDetail ?? '',

  }

  // Todo need to get the required data from backend.
  const productOtherDetails = {
    description: data?.getFoodDetails?.description,
    ingredients: data?.getFoodDetails?.ingredients ?? '',
    usage: data?.getFoodDetails?.usage ?? '',
    nutritionFacts: data?.getFoodDetails?.nutritions || []
  }

  return { data, loading, error,  productInfoData, productOtherDetails }
}

export default useProductDetails
