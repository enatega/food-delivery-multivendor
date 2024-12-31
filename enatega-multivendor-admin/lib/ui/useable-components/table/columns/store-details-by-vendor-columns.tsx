// Interfaces and Types
import { IVendorStoreDetails } from '@/lib/utils/interfaces';

export const VENDOR_STORE_DETAILS_COLUMN = () => {
  return [
    { headerName: 'Store Name', propertyName: 'restaurantName' },
    {
      headerName: 'Total Orders',
      propertyName: 'totalOrders',
      body: (store: IVendorStoreDetails) => store.totalOrders.toLocaleString(),
    },
    {
      headerName: 'Total Sales',
      propertyName: 'totalSales',
      body: (store: IVendorStoreDetails) => `$${store.totalSales.toFixed(2)}`,
    },
    {
      headerName: 'Pickup Orders',
      propertyName: 'pickUpCount',
      body: (store: IVendorStoreDetails) => store.pickUpCount.toLocaleString(),
    },
    {
      headerName: 'Delivery Orders',
      propertyName: 'deliveryCount',
      body: (store: IVendorStoreDetails) =>
        store.deliveryCount.toLocaleString(),
    },
  ];
};
