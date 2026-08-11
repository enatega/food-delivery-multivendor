import { create } from 'zustand';

const useVendorModeStore = create((set) => ({
  vendorMode: 'SINGLE', // or 'MULTI'
  setVendorMode: (mode) => set({ vendorMode: mode }),
}));

export default useVendorModeStore;