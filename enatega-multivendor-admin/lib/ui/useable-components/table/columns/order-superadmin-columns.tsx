import { IExtendedOrder } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

export const ORDER_SUPER_ADMIN_COLUMNS = () => {
  const t = useTranslations();

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  };

  return [
    {
      headerName: t('Order ID'),
      propertyName: 'orderId',
    },
    {
      headerName: t('Items'),
      propertyName: 'items',
      body: (rowData: IExtendedOrder) => {
        if (rowData.items && rowData.items.length > 0) {
          return <span>{rowData.items.length} items</span>;
        }
        return <span>No items</span>;
      },
    },
    {
      headerName: t('Payment'),
      propertyName: 'paymentMethod',
    },
    {
      headerName: t('Order Status'),
      propertyName: 'orderStatus',
    },
    {
      headerName: t('Created At'),
      propertyName: 'createdAt',
      body: (rowData: IExtendedOrder) => {
        let date: Date | null = rowData?.createdAt ? new Date(rowData.createdAt) : null;
        if (date) {
          const newDate = date.toLocaleDateString(
            'en-US',
            dateOptions
          );
          return <span className="text-center">{newDate}</span>;
        }
        return <span>-</span>;
      },
    },
    {
      headerName: t('Restaurant'),
      propertyName: 'restaurant.name',
      body: (rowData: IExtendedOrder) => rowData.restaurant?.name || 'N/A',
    },
    {
      headerName: t('Delivery Address'),
      propertyName: 'deliveryAddress.deliveryAddress',
      body: (rowData: IExtendedOrder) => rowData.deliveryAddress?.deliveryAddress || 'N/A',
    },
  ];
};
