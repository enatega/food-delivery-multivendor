import { useMutation, useQuery } from '@apollo/client'
import { GET_FOOD_DETAILS } from '../../apollo/queries'
import { useContext } from 'react'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { UPDATE_USER_CART } from '../../apollo/mutations'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import useCartStore from '../../stores/useCartStore'
import UserContext from '../../../context/User'
import { useNavigation } from '@react-navigation/native'

const useAddToCart = ({ foodId }) => {
  const { isLoggedIn } = useContext(UserContext)
  const { setCartFromServer } = useCartStore()
  const navigation = useNavigation()
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
    if (!isLoggedIn) {
      navigation.navigate('CreateAccount')
    } else {
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
  }

  return { currentTheme, t, updateUserCartLoading, addItemToCart }
}

export default useAddToCart
