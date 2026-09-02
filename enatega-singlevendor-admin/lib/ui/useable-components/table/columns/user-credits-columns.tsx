// Interfaces
import { IActionMenuProps } from '@/lib/utils/interfaces';
import { ICreditHistory } from '@/lib/utils/interfaces/user-credits.interface';

// Components
import ActionMenu from '../../action-menu';

// Hooks
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

export const USER_CREDITS_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<ICreditHistory>['items'];
}) => {
  // Hooks
  const t = useTranslations();

  // Columns
  const user_credits_columns = useMemo(
    () => [
      {
        headerName: t('User Name'),
        propertyName: 'userName',
        body: (rowData: ICreditHistory) => {
          return <span>{rowData.userId?.name || '-'}</span>;
        },
      },
      {
        headerName: t('User Email'),
        propertyName: 'userEmail',
        body: (rowData: ICreditHistory) => {
          return <span>{rowData.userId?.email || '-'}</span>;
        },
      },
      {
        headerName: t('Amount'),
        propertyName: 'amount',
        body: (rowData: ICreditHistory) => {
          const isCredit = rowData.recordType === 'credit';
          return (
            <span
              className={isCredit ? 'text-green-500' : 'text-red-500'}
            >
              {isCredit ? '+' : '-'}
              {rowData.amount.toFixed(2)}
            </span>
          );
        },
      },
      {
        headerName: t('Order ID'),
        propertyName: 'orderId',
        body: (rowData: ICreditHistory) => {
          return <span>{rowData.orderId || '-'}</span>;
        },
      },
      {
        headerName: t('Date'),
        propertyName: 'createdAt',
        body: (rowData: ICreditHistory) => {
          const date = new Date(Number(rowData.createdAt));
          return (
            <span>
              {date.toLocaleDateString()}
            </span>
          );
        },
      },
      {
        headerName: t('Actions'),
        propertyName: 'actions',
        body: (rowData: ICreditHistory) => {
          return <ActionMenu data={rowData} items={menuItems} />;
        },
      },
    ],
    [menuItems, t]
  );

  return user_credits_columns;
};
