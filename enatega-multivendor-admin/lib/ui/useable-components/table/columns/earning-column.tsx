import { IActionMenuProps } from '@/lib/utils/interfaces';
import { IEarning } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

export const EARNING_COLUMNS = ({
  isSuperAdmin = false,
}: {
  menuItems: IActionMenuProps<IEarning>['items'];
  isSuperAdmin?: boolean;
}) => {
  // Hooks
  const t = useTranslations();

  console.log({ isSuperAdmin });

  // Columns
  return [
    {
      headerName: t('Order ID'),
      propertyName: 'orderId',
    },
    {
      headerName: t('Created At'),
      propertyName: 'createdAt',
      body: (earning: IEarning) => {
        const date = new Date(earning?.createdAt);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return <div>{formattedDate}</div>;
      },
    },
    {
      headerName: t('Order Type'),
      propertyName: 'orderType',
    },
    {
      headerName: t('Payment Method'),
      propertyName: 'paymentMethod',
    },
    {
      headerName: t('Platform Earnings'),
      propertyName: 'platformEarnings.totalEarnings',
      hidden: !isSuperAdmin,
      body: (earning: IEarning) =>
        isSuperAdmin ? (
          <div>${earning?.platformEarnings?.totalEarnings?.toFixed(2)}</div>
        ) : (
          <span>-</span>
        ),
    },
    {
      headerName: t('Store') + ' ID',
      propertyName: 'storeEarnings.storeId.username',
      body: (earning: IEarning) => (
        <div>{earning?.storeEarnings?.storeId?.username}</div>
      ),
    },
    {
      headerName: t('Store Earnings'),
      propertyName: 'storeEarnings.totalEarnings.',

      body: (earning: IEarning) => (
        <div>${earning?.storeEarnings?.totalEarnings?.toFixed(2)}</div>
      ),
    },
    {
      headerName: t('Rider') + ' ID',
      propertyName: 'riderEarnings.riderId.username',
      hidden: !isSuperAdmin,
      body: (earning: IEarning) => (
        <div>{earning?.riderEarnings?.riderId?.username}</div>
      ),
    },
    {
      headerName: t('Riders') + ' ' + t('Earnings'),
      propertyName: 'riderEarnings.totalEarnings',
      hidden: !isSuperAdmin,
      body: (earning: IEarning) => (
        <div>${earning?.riderEarnings?.totalEarnings?.toFixed(2)}</div>
      ),
    },
  ];
};
