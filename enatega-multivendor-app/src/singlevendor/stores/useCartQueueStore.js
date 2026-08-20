import { create } from 'zustand'

const useCartQueueStore = create((set, get) => ({
  queue: [],
  isProcessing: false,

  // 🔥 plain object instead of Set
  loadingItemIds: {},

  enqueue: (task, itemId) =>
    set((state) => {
      const queue = [...state.queue]
      const replaceFrom = state.isProcessing ? 1 : 0
      const existingIndex = itemId
        ? queue.findIndex((queued, index) => index >= replaceFrom && queued?.__itemId === itemId)
        : -1

      if (existingIndex >= 0) queue[existingIndex] = task
      else queue.push(task)

      return {
        queue,
        loadingItemIds: {
          ...state.loadingItemIds,
          ...(itemId ? { [itemId]: true } : {})
        }
      }
    }),

  dequeue: () =>
    set((state) => {
      const [finished] = state.queue
      const nextLoading = { ...state.loadingItemIds }

      const remaining = state.queue.slice(1)
      if (
        finished?.__itemId &&
        !remaining.some(task => task?.__itemId === finished.__itemId)
      ) {
        delete nextLoading[finished.__itemId]
      }

      return {
        queue: remaining,
        loadingItemIds: nextLoading
      }
    }),

  startProcessing: () => set({ isProcessing: true }),
  stopProcessing: () => set({ isProcessing: false })
}))

export default useCartQueueStore
