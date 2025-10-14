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
        let date: Date | null = null;
        console.log("rowData.createdAt", rowData.createdAt)
        if (rowData?.createdAt) {
          const createdAt = rowData.createdAt;
          if (typeof createdAt === 'number') {

            date = new Date(createdAt);
          } else if (typeof createdAt === 'string') {

            const numericTimestamp = Number(createdAt);
            if (!isNaN(numericTimestamp) && createdAt.trim().length >= 10) {

              date = new Date(numericTimestamp);
            } else if (!isNaN(Date.parse(createdAt))) {

              date = new Date(createdAt);
            }
          }
        }

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
      body: (rowData: IExtendedOrder) => (
        <div
          className="max-w-[250px] truncate"
          title={rowData.deliveryAddress?.deliveryAddress || 'N/A'}
        >
          {rowData.deliveryAddress?.deliveryAddress || 'N/A'}
        </div>
      ),

    },

  ];
};
