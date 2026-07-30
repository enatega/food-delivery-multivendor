import { create } from 'zustand'

const useCartQueueStore = create((set, get) => ({
  queue: [],
  isProcessing: false,

  // 🔥 plain object instead of Set
  loadingItemIds: {},

  enqueue: (task, itemId) =>
    set((state) => ({
      queue: [...state.queue, task],
      loadingItemIds: {
        ...state.loadingItemIds,
        [itemId]: true
      }
    })),

  dequeue: () =>
    set((state) => {
      const [finished] = state.queue
      const nextLoading = { ...state.loadingItemIds }

      if (finished?.__itemId) {
        delete nextLoading[finished.__itemId]
      }

      return {
        queue: state.queue.slice(1),
        loadingItemIds: nextLoading
      }
    }),

  startProcessing: () => set({ isProcessing: true }),
  stopProcessing: () => set({ isProcessing: false })
}))

export default useCartQueueStore
