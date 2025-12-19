import { create } from 'zustand';

const useVendorModeStore = create((set) => ({
  vendorMode: 'MULTI', // or 'MULTI'
  setVendorMode: (mode) => set({ vendorMode: mode }),
}));

export default useVendorModeStore;