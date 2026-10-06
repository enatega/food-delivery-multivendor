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
  defaultQuantity = 0
}) => {
  const items = useCartStore((state) => state.items)
  const updateOptimisticCartItemQuantity = useCartStore((state) => state.updateOptimisticCartItemQuantity)
  const loadingItemIds = useCartQueueStore((state) => state.loadingItemIds)
  const { addItemToCart } = useAddToCart({ foodId })
  const { updateUserCartCount } = useUpdateUserCartCount()

  const itemId = useMemo(() => `${foodId}_${variationId}`, [foodId, variationId])
  const cartQuantity = useMemo(() => {
    const result = getCartVariation(items, foodId, variationId)
    return result?.variation ? Number(result.variation.quantity || 0) : null
  }, [items, foodId, variationId])

  const [quantity, setQuantity] = useState(cartQuantity ?? defaultQuantity)
  const quantityRef = useRef(cartQuantity ?? defaultQuantity)
  const isInteractingRef = useRef(false)
  const isSyncingRef = useRef(false)
  const pendingVariationRef = useRef(null)
  const debounceRef = useRef(null)

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
        addItemToCart(foodId, categoryId, variationId, addons, nextQuantity)
        return
      }

      isSyncingRef.current = false
    },
    [addItemToCart, categoryId, foodId, itemId, updateUserCartCount, variationId, addons]
  )

  const scheduleCommit = useCallback(
    (nextQuantity) => {
      clearDebounce()
      debounceRef.current = setTimeout(() => {
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
    updateOptimisticCartItemQuantity({ foodId, variationId, quantity: nextQuantity })
    scheduleCommit(nextQuantity)
  }, [foodId, scheduleCommit, updateOptimisticCartItemQuantity, variationId])

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
    updateOptimisticCartItemQuantity({ foodId, variationId, quantity: nextQuantity })
    if (nextQuantity === 0) commitQuantity(nextQuantity)
    else scheduleCommit(nextQuantity)
  }, [categoryId, commitQuantity, foodId, scheduleCommit, updateOptimisticCartItemQuantity, variationId])

  useEffect(() => {
    if (isInteractingRef.current) return
    const nextQuantity = cartQuantity ?? defaultQuantity
    quantityRef.current = nextQuantity
    setQuantity(nextQuantity)
  }, [cartQuantity, defaultQuantity])

  useEffect(() => {
    if (isSyncingRef.current && !loadingItemIds[itemId]) {
      isSyncingRef.current = false
      isInteractingRef.current = false
      const nextQuantity = cartQuantity ?? defaultQuantity
      quantityRef.current = nextQuantity
      setQuantity(nextQuantity)
    }
  }, [cartQuantity, defaultQuantity, itemId, loadingItemIds])

  useEffect(() => () => clearDebounce(), [])

  const isLoading = !!loadingItemIds[itemId]

  return { quantity, increase, decrease, isLoading }
}

export default useDebouncedCartQuantity
