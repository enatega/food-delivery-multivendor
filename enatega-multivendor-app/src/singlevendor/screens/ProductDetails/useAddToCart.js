import { useMutation } from '@apollo/client'
import { useCallback, useContext, useRef } from 'react'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { UPDATE_USER_CART } from '../../apollo/mutations'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import useCartStore from '../../stores/useCartStore'
import UserContext from '../../../context/User'
import { useNavigation } from '@react-navigation/native'
import useCartQueueStore from '../../stores/useCartQueueStore'
const useAddToCart = ({ foodId, onCartUpdateSuccess }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const { isLoggedIn } = useContext(UserContext)
  const { setCartFromServer } = useCartStore()
  const navigation = useNavigation()

  const loadingItemIds = useCartQueueStore(
    (state) => state.loadingItemIds
  )

  const onCartUpdateSuccessRef = useRef(onCartUpdateSuccess)
  onCartUpdateSuccessRef.current = onCartUpdateSuccess

  const [updateUserCart, { loading: updateUserCartLoading, error: updateUserCartError }] = useMutation(UPDATE_USER_CART, {
    onCompleted: (data) => {
      const response = data?.userCartData
      console.log('response_response', JSON.stringify(response,null,2))

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

  // 🔥 SINGLE QUEUE PROCESSOR
  const processQueue = useCallback(async () => {
    const store = useCartQueueStore.getState()

    if (store.isProcessing) {
      // setUpdateUserCartLoading(true)
      return
    }
    if (store.queue.length === 0) {
      // setUpdateUserCartLoading(false)
      return
    }

    store.startProcessing()

    const task = store.queue[0]

    try {
      await updateUserCart({ variables: task })
    } finally {
      const latestStore = useCartQueueStore.getState()
      latestStore.dequeue()
      latestStore.stopProcessing()

      // process next item safely
      setTimeout(processQueue, 0)
    }
  }, [updateUserCart])

  const addItemToCart = (foodId, categoryId, variationId, addons, count, orderItems) => {
    if (!isLoggedIn) {
      navigation.navigate('CreateAccount')
      return
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

    console.log('singleItemList____Json', JSON.stringify(singleItemList,null,2));
    console.log('orderItems____Json', JSON.stringify(orderItems,null,2));

    // If orderItems is provided (array case), use it; otherwise use single object case
    const foodArray = orderItems && Array.isArray(orderItems) && orderItems.length > 0
      ? orderItems
      : singleItemList

        console.log('foodArray____Json', JSON.stringify(foodArray,null,2));
        

    useCartQueueStore.getState().enqueue(
      {
        __itemId: itemId, // 🔥 internal tracking
        input: {
          food: foodArray
        }
      },
      itemId
    )
    processQueue()
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
