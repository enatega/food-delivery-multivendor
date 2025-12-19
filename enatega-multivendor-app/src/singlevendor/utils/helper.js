import useVendorModeStore from '../stores/useVendorModeStore'

export const isSingleVendor = () => {
  const { vendorMode } = useVendorModeStore.getState()
  console.log('Vendor Mode:', vendorMode)
    return vendorMode === 'SINGLE'
}
