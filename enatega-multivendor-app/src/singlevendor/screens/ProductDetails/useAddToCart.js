import { useMutation } from '@apollo/client'
import { useContext, useRef } from 'react'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { UPDATE_USER_CART } from '../../apollo/mutations'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import useCartStore from '../../stores/useCartStore'
import UserContext from '../../../context/User'
import { useNavigation } from '@react-navigation/native'
import useCartQueueStore from '../../stores/useCartQueueStore'
import useUpdateUserCartCount from '../../hooks/useUpdateUserCartCount'
import useCartQueue from '../../hooks/useCartQueue'
const useAddToCart = ({ foodId, onCartUpdateSuccess }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const { isLoggedIn } = useContext(UserContext)
  const { setCartFromServer, items } = useCartStore()
  const navigation = useNavigation()
  const { updateUserCartCount } = useUpdateUserCartCount()

  const loadingItemIds = useCartQueueStore((state) => state.loadingItemIds)
  const { enqueueTask } = useCartQueue()

  const onCartUpdateSuccessRef = useRef(onCartUpdateSuccess)
  onCartUpdateSuccessRef.current = onCartUpdateSuccess

  const [updateUserCart, { loading: updateUserCartLoading, error: updateUserCartError }] = useMutation(UPDATE_USER_CART, {
    onCompleted: (data) => {
      const response = data?.userCartData
      console.log('response_response', JSON.stringify(response, null, 2))

      if (!response?.success) {
        if (response?.message) {
          FlashMessage({ message: response?.message || 'Failed to Add item in cart' })
        }
        return
      }

      setCartFromServer({
        cartId: response.cartId,
        foods: response.foods,
        grandTotal: response.discountedGrandTotal,
        maxOrderAmount: response.maxOrderAmount,
        minOrderAmount: response.minOrderAmount,
        isBelowMinimumOrder: response.isBelowMinimumOrder,
        lowOrderFees: response.lowOrderFees
      })

      FlashMessage({ message: t('itemAddedToCart') })
      onCartUpdateSuccessRef.current?.(response)
    },
    onError: (error) => {
      console.error('Error updating cart:', error)
    }
  })

  const addItemToCart = (foodId, categoryId, variationId, addons, count, orderItems) => {
    if (!isLoggedIn) {
      navigation.navigate('CreateAccount')
      return
    }

    const existingItem = items?.find((item) => item?.foodId === foodId && Array.isArray(item?.variations) && item.variations.some((v) => v?.variationId === variationId || v?._id === variationId))

    if (existingItem) {
      const existingVariation = existingItem.variations.find((v) => v?.variationId === variationId || v?._id === variationId)

      const nextCount = typeof count === 'number' ? count : existingVariation?.quantity

      if (typeof nextCount === 'number') {
        const action = nextCount === 0 ? 'delete' : nextCount > (existingVariation?.quantity || 0) ? 'increase' : 'decrease'

        updateUserCartCount({
          variation_id: existingVariation?._id || variationId,
          foodId,
          categoryId,
          variationId: existingVariation?.variationId || variationId,
          action,
          count: nextCount
        })
        return
      }
    }

    const itemId = `${foodId}_${variationId}`

    const singleItemList = [
      {
        _id: foodId,
        categoryId: '123',
        variation: {
          _id: variationId,
          addons,
          count
        }
      }
    ]

    console.log('singleItemList____Json', JSON.stringify(singleItemList, null, 2))
    console.log('orderItems____Json', JSON.stringify(orderItems, null, 2))

    // If orderItems is provided (array case), use it; otherwise use single object case
    const foodArray = orderItems && Array.isArray(orderItems) && orderItems.length > 0 ? orderItems : singleItemList

    console.log('foodArray____Json', JSON.stringify(foodArray, null, 2))

    enqueueTask(
      {
        __itemId: itemId,
        run: () => {
          console.log('Adding To Cart with itemId:', itemId)
          return updateUserCart({
            variables: {
              input: {
                food: foodArray
              }
            }
          })
        }
      },
      itemId
    )
  }

  // const addItemToCart = (foodId, categoryId, variationId, addons, count) => {
  //   if (!isLoggedIn) {
  //     navigation.navigate('CreateAccount')
  //   } else {
  //     const addItemsToCartVariable = {
  //       input: {
  //         food: [
  //           {
  //             _id: foodId,
  //             categoryId: '123',
  //             variation: {
  //               _id: variationId,
  //               addons: addons,
  //               count: count
  //             }
  //           }
  //         ]
  //       }
  //     }
  //     console.log('add Item To Cart:', JSON.stringify(addItemsToCartVariable))
  //     updateUserCart({
  //       variables: addItemsToCartVariable
  //     })
  //   }
  // }

  return { currentTheme, t, loadingItemIds, addItemToCart, updateUserCartLoading }
}

export default useAddToCart
