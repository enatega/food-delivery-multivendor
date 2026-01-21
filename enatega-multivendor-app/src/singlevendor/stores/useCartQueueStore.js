// // useCartQueueStore.js
// import { create } from 'zustand'

// const useCartQueueStore = create((set, get) => ({
//   queue: [],
//   isProcessing: false,

//   enqueue: (task) =>
//     set((state) => ({
//       queue: [...state.queue, task]
//     })),

//   dequeue: () =>
//     set((state) => ({
//       queue: state.queue.slice(1)
//     })),

//   startProcessing: () => set({ isProcessing: true }),
//   stopProcessing: () => set({ isProcessing: false })
// }))

// export default useCartQueueStore


// useCartQueueStore.js
import { create } from 'zustand'

const useCartQueueStore = create((set, get) => ({
  queue: [],
  isProcessing: false,
  loadingItemIds: new Set(), 

  enqueue: (task, itemId) =>
    set((state) => ({
      queue: [...state.queue, task],
      loadingItemIds: new Set(state.loadingItemIds).add(itemId)
    })),

  dequeue: () =>
    set((state) => {
      const [finished] = state.queue
      const nextLoading = new Set(state.loadingItemIds)
      if (finished?.__itemId) {
        nextLoading.delete(finished.__itemId)
      }

      return {
        queue: state.queue.slice(1),
        loadingItemIds: nextLoading
      }
    }),

  startProcessing: () => set({ isProcessing: true }),
  stopProcessing: () => set({ isProcessing: false }),

  isItemLoading: (itemId) => get().loadingItemIds.has(itemId)
}))

export default useCartQueueStore
