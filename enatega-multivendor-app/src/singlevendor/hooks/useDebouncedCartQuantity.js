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
  const loadingItemIds = useCartQueueStore((state) => state.loadingItemIds)
  const { addItemToCart } = useAddToCart({ foodId })
  const { updateUserCartCount } = useUpdateUserCartCount()

  const itemId = useMemo(() => `${foodId}_${variationId}`, [foodId, variationId])
  const cartQuantity = useMemo(() => {
    const result = getCartVariation(items, foodId, variationId)
    return result?.variation?.quantity || 0
  }, [items, foodId, variationId])

  const [quantity, setQuantity] = useState(cartQuantity || defaultQuantity)
  const isInteractingRef = useRef(false)
  const debounceRef = useRef(null)

  const clearDebounce = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
  }

  const commitQuantity = useCallback(
    (nextQuantity) => {
      const currentItems = useCartStore.getState().items
      const result = getCartVariation(currentItems, foodId, variationId)
      const existingQuantity = result?.variation?.quantity || 0

      if (result?.variation) {
        const resolvedCategoryId = categoryId || result?.cartItem?.categoryId
        const resolvedVariationId = result.variation?.variationId || variationId
        const resolvedVariationInternalId = result.variation?._id || variationId

        if (!foodId || !resolvedVariationInternalId || !resolvedVariationId) {
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

      if (nextQuantity > 0) {
        addItemToCart(foodId, categoryId, variationId, addons, nextQuantity)
      }
    },
    [addItemToCart, categoryId, foodId, itemId, updateUserCartCount, variationId, addons]
  )

  const scheduleCommit = useCallback(
    (nextQuantity) => {
      clearDebounce()
      debounceRef.current = setTimeout(() => {
        commitQuantity(nextQuantity)
        isInteractingRef.current = false
      }, 500)
    },
    [commitQuantity]
  )

  const increase = useCallback(() => {
    const nextQuantity = quantity + 1
    isInteractingRef.current = true
    setQuantity(nextQuantity)
    scheduleCommit(nextQuantity)
  }, [quantity, scheduleCommit])

  const decrease = useCallback(() => {
    const nextQuantity = Math.max(0, quantity - 1)
    isInteractingRef.current = true
    setQuantity(nextQuantity)
    scheduleCommit(nextQuantity)
  }, [quantity, scheduleCommit])

  useEffect(() => {
    if (isInteractingRef.current) return
    setQuantity(cartQuantity || defaultQuantity)
  }, [cartQuantity, defaultQuantity])

  useEffect(() => () => clearDebounce(), [])

  const isLoading = !!loadingItemIds[itemId]

  return { quantity, increase, decrease, isLoading }
}

export default useDebouncedCartQuantity
