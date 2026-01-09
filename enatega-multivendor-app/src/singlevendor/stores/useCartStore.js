import { create } from 'zustand'

const useCartStore = create((set) => ({
  cartId: null,
  items: [],
  grandTotal: 0,
  loading: false,
  error: null,

  // Set full cart from server (initial load / refetch)
  setCartFromServer: (cart) =>
    set({
      cartId: cart.cartId,
      items: cart.foods || [],
      grandTotal: cart.grandTotal || 0,
      loading: false,
      error: null
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
      error: null
    }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  updateCartItemQuantity: ({ foodId, variationId, quantity, foodTotal, itemTotal, grandTotal }) => {
    set((state) => {
      // 1️⃣ Create new items array
      const newItems = state.items
        .map((item) => {
          if (item.foodId !== foodId) return item

          const updatedVariations = item.variations.map((v) => (v.variationId === variationId ? { ...v, quantity,itemTotal } : v)).filter((v) => v.quantity > 0)

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
        grandTotal
      }
    })
  }
}))

export default useCartStore
