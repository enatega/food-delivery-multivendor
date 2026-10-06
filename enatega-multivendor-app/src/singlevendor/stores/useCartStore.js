import { create } from 'zustand'

const useCartStore = create((set) => ({
  cartId: null,
  cartRevision: 1,
  items: [],
  grandTotal: 0,
  loading: false,
  error: null,
  maxOrderAmount: 10,
  minOrderAmount: 1,
  isBelowMinimumOrder: true,
  lowOrderFees: 2,
  hasFetchedCart: false,

  // Set full cart from server (initial load / refetch)
  setCartFromServer: (cart) =>
    set({
      cartId: cart.cartId,
      cartRevision: cart.cartRevision || 1,
      items: cart.foods || [],
      grandTotal: cart.grandTotal,
      loading: false,
      error: null,
      maxOrderAmount: cart.maxOrderAmount,
      minOrderAmount: cart.minOrderAmount,
      isBelowMinimumOrder: cart.isBelowMinimumOrder,
      lowOrderFees: cart.lowOrderFees
    }),

  // Update a single food item after API response
  updateCartItem: (updatedItem) =>
    set((state) => ({
      items: state.items.map((item) => (item.foodId === updatedItem.foodId ? updatedItem : item))
    })),

  clearCart: () =>
    set({
      cartId: null,
      cartRevision: 1,
      items: [],
      grandTotal: 0,
      error: null,
      isBelowMinimumOrder: true
    }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Update the local cart immediately while the server mutation runs in the background.
  addOptimisticCartItem: ({ foodId, categoryId, variationId, addons = [], quantity = 1, foodTitle, foodImage, variationTitle, unitPrice }) =>
    set((state) => {
      const foodIndex = state.items.findIndex((item) => item?.foodId === foodId)
      const optimisticVariation = {
        _id: variationId,
        variationId,
        variationTitle,
        addons,
        quantity,
        unitPrice: Number(unitPrice || 0),
        itemTotal: Number(unitPrice || 0) * quantity
      }

      if (foodIndex === -1) {
        return {
          items: [
            ...state.items,
            {
              foodId,
              categoryId,
              foodTitle,
              foodImage,
              variations: [optimisticVariation],
              foodTotal: optimisticVariation.itemTotal
            }
          ]
        }
      }

      const items = [...state.items]
      const food = items[foodIndex]
      const variationIndex = food.variations?.findIndex((variation) => variation?.variationId === variationId || variation?._id === variationId) ?? -1

      if (variationIndex === -1) {
        items[foodIndex] = {
          ...food,
          variations: [...(food.variations || []), optimisticVariation],
          foodTotal: Number(food.foodTotal || 0) + optimisticVariation.itemTotal
        }
      }

      return { items }
    }),

  restoreItems: (items) => set({ items }),

  updateOptimisticCartItemQuantity: ({ foodId, variationId, quantity }) =>
    set((state) => ({
      items: state.items
        .map((item) => {
          if (item?.foodId !== foodId) return item

          const variations = (item.variations || [])
            .map((variation) =>
              variation?.variationId === variationId || variation?._id === variationId
                ? { ...variation, quantity }
                : variation
            )
            .filter((variation) => Number(variation?.quantity || 0) > 0)

          return variations.length > 0 ? { ...item, variations } : null
        })
        .filter(Boolean)
    })),

  updateCartItemQuantity: ({ _id, foodId, variationId, quantity, foodTotal, itemTotal, grandTotal, isBelowMinimumOrder }) => {
    set((state) => {
      // 1️⃣ Create new items array
      const newItems = state.items
        .map((item) => {
          if (item.variations[0]._id !== _id) return item

          const updatedVariations = item.variations.map((v) => (v._id === _id ? { ...v, quantity, itemTotal } : v)).filter((v) => v.quantity > 0)

          // Remove food if no variations left
          if (updatedVariations.length === 0) return null

          return {
            ...item,
            variations: updatedVariations,
            foodTotal
          }
        })
        .filter(Boolean)

      // 2️⃣ Set new state
      return {
        items: newItems,
        grandTotal,
        isBelowMinimumOrder
      }
    })
  },

  addOrUpdateCartFoodFromServer: (food) =>
    set((state) => {
      const existingFoodIndex = state.items.findIndex((f) => f.foodId === food.foodId)

      const newItems = [...state.items]

      if (existingFoodIndex !== -1) {
        // Replace entire food (server is source of truth)
        newItems[existingFoodIndex] = food
      } else {
        // Add new food
        newItems.push(food)
      }

      return {
        items: newItems
      }
    }),

  removeCartFood: (foodId) =>
    set((state) => ({
      items: state.items.filter((f) => f.foodId !== foodId)
    })),

  updateCartMetaFromServer: ({ grandTotal, isBelowMinimumOrder, lowOrderFees, maxOrderAmount, minOrderAmount }) =>
    set({
      grandTotal,
      isBelowMinimumOrder,
      lowOrderFees,
      maxOrderAmount,
      minOrderAmount
    }),

  setHasFetchedCart: (hasFetched) => set({ hasFetchedCart: hasFetched })
}))

export default useCartStore
