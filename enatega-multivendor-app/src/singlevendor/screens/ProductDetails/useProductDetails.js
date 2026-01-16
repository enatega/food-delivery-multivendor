import { useMutation, useQuery } from '@apollo/client'
import { GET_FOOD_DETAILS } from '../../apollo/queries'
import { useContext } from 'react'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { UPDATE_USER_CART } from '../../apollo/mutations'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import useCartStore from '../../stores/useCartStore'

const useProductDetails = ({ foodId }) => {
  // Todo: need to fix variations related data.
  const { data, loading, error } = useQuery(GET_FOOD_DETAILS, {
    variables: { foodId },fetchPolicy:'network-only'
  })
  console.log('products details:', data)

  const { setCartFromServer } = useCartStore()

  const [updateUserCart, { loading: updateUserCartLoading, error: updateUserCartError }] = useMutation(UPDATE_USER_CART, {
    onCompleted: (data) => {
      console.log('Cart updated:', data?.userCartData)
      const response = data?.userCartData
      console.log('response:response', response)

      if (!response?.success) {
        if (response?.message) {
          FlashMessage({ message: response?.message || 'Failed to Add item in cart' })
        }
        return
      }

      // if (response?.foods && response?.foods?.length > 0) {
      // console.log('response?.foods:', response?.foods)
      // const latestCartItem = response?.foods[response?.foods?.length - 1] ?? null
      // if (latestCartItem) {
      //   console.log('latest item in cart', latestCartItem)
      //   addOrUpdateCartFoodFromServer(latestCartItem)
      // }
      setCartFromServer({
        cartId: response.cartId,
        foods: response.foods,
        grandTotal: response.discountedGrandTotal,
        maxOrderAmount: response.maxOrderAmount,
        minOrderAmount: response.minOrderAmount,
        isBelowMinimumOrder: response.isBelowMinimumOrder,
        lowOrderFees: response.lowOrderFees
      })
      // }

      // updateCartMetaFromServer({
      //   grandTotal: response?.actualGrandTotal,
      //   isBelowMinimumOrder: response?.isBelowMinimumOrder,
      //   lowOrderFees: response?.lowOrderFees,
      //   maxOrderAmount: response?.maxOrderAmount,
      //   minOrderAmount: response?.minOrderAmount
      // })

      FlashMessage({ message: t('itemAddedToCart') })
    },
    onError: (error) => {
      console.error('Error updating cart:', error)
    }
  })

  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const addItemToCart = (foodId, categoryId, variationId, addons, count) => {
    const addItemsToCartVariable = {
      input: {
        food: [
          {
            _id: foodId,
            categoryId: categoryId,
            variation: {
              _id: variationId,
              addons: addons,
              count: count
            }
          }
        ]
      }
    }
    console.log('add Item To Cart:', JSON.stringify(addItemsToCartVariable))
    updateUserCart({
      variables: addItemsToCartVariable
    })
  }

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

  return { data, loading, error, currentTheme, t, productInfoData, productOtherDetails, updateUserCartLoading, addItemToCart }
}

export default useProductDetails
