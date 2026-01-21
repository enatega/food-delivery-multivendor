import { useMutation } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { UPDATE_USER_CART } from '../../apollo/mutations'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import useCartStore from '../../stores/useCartStore'
import UserContext from '../../../context/User'
import { useNavigation } from '@react-navigation/native'
import useCartQueueStore from '../../stores/useCartQueueStore'
const useAddToCart = ({ foodId }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const { isLoggedIn } = useContext(UserContext)
  const { setCartFromServer } = useCartStore()
  const navigation = useNavigation()
  // const [updateUserCartLoading, setUpdateUserCartLoading] = useState(false)
  const isItemLoading = useCartQueueStore((s) => s.isItemLoading)
  // const updateUserCartLoading = useCartQueueStore((state) => state.isProcessing || state.queue.length > 0)
  const [updateUserCart, { error: updateUserCartError }] = useMutation(UPDATE_USER_CART, {
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

  const addItemToCart = (foodId, categoryId, variationId, addons, count) => {
    if (!isLoggedIn) {
      navigation.navigate('CreateAccount')
      return
    }
    const itemId = `${foodId}_${variationId}`

    // useCartQueueStore.getState().enqueue(variables)

    useCartQueueStore.getState().enqueue(
      {
        __itemId: itemId, // 🔥 internal tracking
        input: {
          food: [
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

  return { currentTheme, t, isItemLoading, addItemToCart }
}

export default useAddToCart
