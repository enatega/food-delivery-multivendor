import { create } from 'zustand'

const useSupportStore = create((set) => {
  return {
    supportMessages: [],
    hasActiveTicket: false,
    addMessage: (message) =>
      set((state) => ({
        supportMessages: [message, ...state.supportMessages]
      })),
    setSupportMessages: (messages) => set({ supportMessages: messages }),
    setHasActiveTicket: (hasActiveTicket) => set({ hasActiveTicket })
  }
})

export default useSupportStore
