import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useAddToCart from '../screens/ProductDetails/useAddToCart'
import useCartStore from '../stores/useCartStore'
import useCartQueueStore from '../stores/useCartQueueStore'
import useUpdateUserCartCount from './useUpdateUserCartCount'

const getCartVariation = (items, foodId, variationId) => {
  if (!foodId || !variationId || !Array.isArray(items)) return null
  const cartItem = items.find((item) => item?.foodId === foodId)
  if (!cartItem?.variations) return null
  const variation = cartItem.variations.find((v) => v?.variationId === variationId || v?._id === variationId)
  if (!variation) return null
  return { cartItem, variation }
}

const useDebouncedCartQuantity = ({
  foodId,
  categoryId,
  variationId,
  addons = [],
  defaultQuantity = 0,
  product = null
}) => {
  const itemId = useMemo(() => `${foodId}_${variationId}`, [foodId, variationId])
  // Subscribe to this item's quantity and sync flag only, so a tap on one card
  // doesn't re-render every other card on screen.
  const cartQuantity = useCartStore((state) => {
    const result = getCartVariation(state.items, foodId, variationId)
    return result?.variation ? Number(result.variation.quantity || 0) : null
  })
  const isItemSyncing = useCartQueueStore((state) => !!state.loadingItemIds[itemId])
  const updateOptimisticCartItemQuantity = useCartStore((state) => state.updateOptimisticCartItemQuantity)
  const { addItemToCart } = useAddToCart({ foodId })
  const { updateUserCartCount } = useUpdateUserCartCount()

  const [quantity, setQuantity] = useState(cartQuantity ?? defaultQuantity)
  const quantityRef = useRef(cartQuantity ?? defaultQuantity)
  const isInteractingRef = useRef(false)
  const isSyncingRef = useRef(false)
  const pendingVariationRef = useRef(null)
  const debounceRef = useRef(null)
  const pendingCommitRef = useRef(null)

  const clearDebounce = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
  }

  const commitQuantity = useCallback(
    (nextQuantity) => {
      isSyncingRef.current = true
      const currentItems = useCartStore.getState().items
      const result = getCartVariation(currentItems, foodId, variationId)
      const existingQuantity = result?.variation?.quantity || 0

      if (result?.variation) {
        const resolvedCategoryId = categoryId || result?.cartItem?.categoryId
        const resolvedVariationId = result.variation?.variationId || variationId
        const resolvedVariationInternalId = result.variation?._id || variationId

        if (!foodId || !resolvedVariationInternalId || !resolvedVariationId) {
          isSyncingRef.current = false
          return
        }

        const action =
          nextQuantity === 0 ? 'delete' : nextQuantity > existingQuantity ? 'increase' : 'decrease'
        // Cart badge/totals catch up once per burst of taps instead of on every tap.
        updateOptimisticCartItemQuantity({ foodId, variationId, quantity: nextQuantity })
        updateUserCartCount(
          {
            variation_id: resolvedVariationInternalId,
            foodId,
            categoryId: resolvedCategoryId,
            variationId: resolvedVariationId,
            action,
            count: nextQuantity
          },
          { itemId }
        )
        return
      }

      // The optimistic delete removes the variation locally, so retain its
      // server id to send the delete mutation immediately.
      if (nextQuantity === 0 && pendingVariationRef.current) {
        const pendingVariation = pendingVariationRef.current
        updateUserCartCount(
          {
            variation_id: pendingVariation.internalId,
            foodId,
            categoryId: pendingVariation.categoryId || categoryId,
            variationId: pendingVariation.variationId || variationId,
            action: 'delete',
            count: 0
          },
          { itemId }
        )
        return
      }

      if (nextQuantity > 0) {
        const added = addItemToCart(foodId, categoryId, variationId, addons, nextQuantity, undefined, '', product)
        if (added === false) {
          // Not logged in: nothing was added, so undo the local count.
          isSyncingRef.current = false
          isInteractingRef.current = false
          quantityRef.current = 0
          setQuantity(0)
        }
        return
      }

      isSyncingRef.current = false
    },
    [addItemToCart, categoryId, foodId, itemId, updateUserCartCount, updateOptimisticCartItemQuantity, variationId, addons, product]
  )

  const scheduleCommit = useCallback(
    (nextQuantity) => {
      clearDebounce()
      pendingCommitRef.current = () => commitQuantity(nextQuantity)
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null
        pendingCommitRef.current = null
        commitQuantity(nextQuantity)
      }, 400)
    },
    [commitQuantity]
  )

  const increase = useCallback(() => {
    const nextQuantity = quantityRef.current + 1
    isInteractingRef.current = true
    quantityRef.current = nextQuantity
    setQuantity(nextQuantity)
    const isInCart = !!getCartVariation(useCartStore.getState().items, foodId, variationId)
    if (!isInCart) {
      // First add goes out immediately so the cart badge and totals update at once.
      clearDebounce()
      commitQuantity(nextQuantity)
      return
    }
    scheduleCommit(nextQuantity)
  }, [commitQuantity, foodId, scheduleCommit, variationId])

  const decrease = useCallback(() => {
    const nextQuantity = Math.max(0, quantityRef.current - 1)
    isInteractingRef.current = true
    quantityRef.current = nextQuantity
    const currentResult = getCartVariation(useCartStore.getState().items, foodId, variationId)
    const currentVariation = currentResult?.variation
    if (currentVariation) {
      pendingVariationRef.current = {
        internalId: currentVariation._id || variationId,
        variationId: currentVariation.variationId || variationId,
        categoryId: categoryId || currentResult?.cartItem?.categoryId
      }
    }
    setQuantity(nextQuantity)
    if (nextQuantity === 0) {
      // Removing the item is applied to the cart immediately.
      clearDebounce()
      updateOptimisticCartItemQuantity({ foodId, variationId, quantity: 0 })
      commitQuantity(0)
    } else {
      scheduleCommit(nextQuantity)
    }
  }, [categoryId, commitQuantity, foodId, scheduleCommit, updateOptimisticCartItemQuantity, variationId])

  useEffect(() => {
    if (isInteractingRef.current) return
    const nextQuantity = cartQuantity ?? defaultQuantity
    quantityRef.current = nextQuantity
    setQuantity(nextQuantity)
  }, [cartQuantity, defaultQuantity])

  useEffect(() => {
    // Wait for any pending debounced change before adopting the server quantity.
    if (isSyncingRef.current && !isItemSyncing && !debounceRef.current) {
      isSyncingRef.current = false
      isInteractingRef.current = false
      const nextQuantity = cartQuantity ?? defaultQuantity
      quantityRef.current = nextQuantity
      setQuantity(nextQuantity)
    }
  }, [cartQuantity, defaultQuantity, isItemSyncing])

  // Leaving the screen mid-debounce still sends the latest quantity.
  useEffect(
    () => () => {
      if (!debounceRef.current) return
      clearDebounce()
      pendingCommitRef.current?.()
    },
    []
  )

  return { quantity, increase, decrease, isLoading: isItemSyncing }
}

export default useDebouncedCartQuantity
