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

export const ORDER_COLUMNS = () => {
  // Hooks
  const t = useTranslations();
  return [
    {
      headerName: t('Order ID'),
      propertyName: 'orderId',
    },
    {
      propertyName: 'itemsTitle',
      headerName: t('Items'),
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
      propertyName: 'DateCreated',
      body: (rowData: IExtendedOrder) => {
        const formatedDate = new Date(
          Number(rowData?.createdAt)
        ).toLocaleDateString('en-US', dateOptions);
        return <span>{formatedDate}</span>;
      },
    },
    {
      headerName: t('Delivery Address'),
      propertyName: 'OrderdeliveryAddress',
    },
  ];
};
