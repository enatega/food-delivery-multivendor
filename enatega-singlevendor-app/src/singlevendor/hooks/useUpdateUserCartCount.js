import { useMutation } from '@apollo/client'
import { UPDATE_USER_CART_COUNT } from '../apollo/mutations'
import useCartStore from '../stores/useCartStore'
import useCartQueue from './useCartQueue'

const useUpdateUserCartCount = ({ onSuccess, onError } = {}) => {
  const { updateCartItemQuantity } = useCartStore()
  const { enqueueTask } = useCartQueue()

  const [mutate, { loading, error }] = useMutation(UPDATE_USER_CART_COUNT, {
    onCompleted: (data, options) => {
      const result = data?.updateUserCartCount
      console.log('Cart count updated:', result, options)
      if (!result?.success) return

      const input = options?.variables?.input || {}

      updateCartItemQuantity({
        _id: input.variation_id,
        foodId: input.foodId,
        variationId: input.variationId,
        quantity: result.quantity,
        foodTotal: result.foodTotal,
        itemTotal: result.itemTotal,
        grandTotal: result.grandTotal,
        isBelowMinimumOrder: result.isBelowMinimumOrder
      })

      onSuccess?.(result, options)
    },
    onError: (err) => {
      console.error('Error updating cart:', err)
      onError?.(err)
    }
  })

  const updateUserCartCount = (payload, options = {}) => {
    const input = payload?.variables?.input || payload
    const itemId =
      options.itemId ||
      (input?.foodId && (input?.variationId || input?.variation_id)
        ? `${input.foodId}_${input.variationId || input.variation_id}`
        : undefined)

    const task = {
      __itemId: itemId,
      run: () => mutate({ variables: { input } })
    }

    if (itemId) {
      enqueueTask(task, itemId)
      return
    }

    return mutate({ variables: { input } })
  }

  return { updateUserCartCount, loading, error }
}

export default useUpdateUserCartCount
