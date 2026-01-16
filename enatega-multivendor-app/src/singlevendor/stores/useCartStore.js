import { create } from 'zustand'

const useCartStore = create((set) => ({
  cartId: null,
  items: [],
  grandTotal: 0,
  loading: false,
  error: null,
  maxOrderAmount: 0,
  minOrderAmount: 0,
  isBelowMinimumOrder: false,
  lowOrderFees: 0,

  // Set full cart from server (initial load / refetch)
  setCartFromServer: (cart) =>
    set({
      cartId: cart.cartId,
      items: cart.foods || [],
      grandTotal: cart.grandTotal || 0,
      loading: false,
      error: null,
      maxOrderAmount: cart.maxOrderAmount || 0,
      minOrderAmount: cart.minOrderAmount || 0,
      isBelowMinimumOrder: cart.isBelowMinimumOrder || false,
      lowOrderFees: cart.lowOrderFees || 0
    }),

  // Update a single food item after API response
  updateCartItem: (updatedItem) =>
    set((state) => ({
      items: state.items.map((item) => (item.foodId === updatedItem.foodId ? updatedItem : item))
    })),

  clearCart: () =>
    set({
      cartId: null,
      items: [],
      grandTotal: 0,
      error: null,
      maxOrderAmount: 0,
      minOrderAmount: 0,
      isBelowMinimumOrder: false,
      lowOrderFees: 0
    }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  updateCartItemQuantity: ({ foodId, variationId, quantity, foodTotal, itemTotal, grandTotal, isBelowMinimumOrder }) => {
    set((state) => {
      // 1️⃣ Create new items array
      const newItems = state.items
        .map((item) => {
          if (item.foodId !== foodId) return item

          const updatedVariations = item.variations.map((v) => (v.variationId === variationId ? { ...v, quantity, itemTotal } : v)).filter((v) => v.quantity > 0)

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

      let newItems = [...state.items]

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
    })
}))

export default useCartStore
