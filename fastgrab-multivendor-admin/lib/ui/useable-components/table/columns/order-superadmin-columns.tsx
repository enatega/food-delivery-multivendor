import { IExtendedOrder } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';
const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
};

export const ORDER_SUPER_ADMIN_COLUMNS = () => {
  // Hooks
  const t = useTranslations();
  return [
    {
      headerName: t('Order ID'),
      propertyName: 'orderId',
    },
    {
      headerName: t('Items'),
      propertyName: 'itemsTitle',
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
      headerName: t('Reason'),
      propertyName: 'reason',
      body: (rowData: IExtendedOrder) => {
        if (!rowData.reason) {
          return <span>-</span>;
        }
        return <span>{rowData.reason}</span>;
      },
    },
    {
      headerName: t('Created At'),
      propertyName: 'DateCreated',
      body: (rowData: IExtendedOrder) => {
        let date: string | number | Date = Number(rowData?.createdAt || null);
        if (date) {
          const newDate = new Date(date).toLocaleDateString(
            'en-US',
            dateOptions
          );
          return <span className="text-center">{newDate}</span>;
        }
      },
    },
    {
      headerName: t('Delivery Address'),
      propertyName: 'OrderdeliveryAddress',
    },
  ];
};
