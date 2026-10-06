import { useApolloClient, useMutation } from '@apollo/client'
import { UPDATE_USER_CART_COUNT } from '../apollo/mutations'
import { GET_USER_CART } from '../apollo/queries'
import useCartStore from '../stores/useCartStore'
import useCartQueueStore from '../stores/useCartQueueStore'
import useCartQueue from './useCartQueue'

// True when another request for this item is still waiting in the queue,
// meaning the local optimistic quantity is newer than this response.
const hasQueuedTaskFor = (itemId) => !!itemId && useCartQueueStore.getState().queue.slice(1).some((task) => task?.__itemId === itemId)

// Resolve the server cart-line id when the request actually runs, so a +/- tapped
// right after "Add" uses the id returned by the add instead of the optimistic placeholder.
const resolveInput = (input) => {
  const food = useCartStore.getState().items.find((item) => item?.foodId === input.foodId)
  const variation = food?.variations?.find((v) => v?.variationId === input.variationId || v?._id === input.variation_id)
  if (!variation || variation.isOptimistic) return input
  return {
    ...input,
    variation_id: variation._id || input.variation_id,
    categoryId: input.categoryId || food?.categoryId
  }
}

const useUpdateUserCartCount = ({ onSuccess, onError } = {}) => {
  const updateCartItemQuantity = useCartStore((state) => state.updateCartItemQuantity)
  const setCartFromServer = useCartStore((state) => state.setCartFromServer)
  const { enqueueTask } = useCartQueue()
  const client = useApolloClient()

  const reconcileCart = () =>
    client
      .query({ query: GET_USER_CART, fetchPolicy: 'network-only' })
      .then(({ data }) => data?.getUserCart && setCartFromServer(data.getUserCart))
      .catch((reconcileError) => console.error('Error reconciling cart:', reconcileError))

  const [mutate, { loading, error }] = useMutation(UPDATE_USER_CART_COUNT, {
    onCompleted: (data, options) => {
      const result = data?.updateUserCartCount
      const input = options?.variables?.input || {}
      if (!result?.success) {
        // The server rejected the change, so bring the optimistic cart back in line.
        reconcileCart()
        return
      }

      // Callers key the queue by either the product variation id or the cart
      // line id; a newer tap queued under either must win over this reply.
      const stillQueued = hasQueuedTaskFor(`${input.foodId}_${input.variationId}`) ||
        hasQueuedTaskFor(`${input.foodId}_${input.variation_id}`)
      if (!stillQueued) {
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
      }

      onSuccess?.(result, options)
    },
    onError: (err) => {
      console.error('Error updating cart:', err)
      reconcileCart()
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
      __replaceable: true,
      run: () => mutate({ variables: { input: resolveInput(input) } })
    }

    if (itemId) {
      enqueueTask(task, itemId)
      return
    }

    return mutate({ variables: { input: resolveInput(input) } })
  }

  return { updateUserCartCount, loading, error }
}

export default useUpdateUserCartCount
