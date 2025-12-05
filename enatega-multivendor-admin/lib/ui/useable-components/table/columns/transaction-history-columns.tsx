import { IActionMenuProps } from '@/lib/utils/interfaces/action-menu.interface';
import { ITransactionHistory } from '@/lib/utils/interfaces';
import ActionMenu from '@/lib/ui/useable-components/action-menu';
import { useTranslations } from 'next-intl';

export const TRANSACTION_HISTORY_COLUMNS = ({
  menuItems,
  openMenuId, // NEW: Track which menu is open
  setOpenMenuId, // NEW: Function to set the open menu
}: {
  menuItems: IActionMenuProps<ITransactionHistory>['items'];
  openMenuId: string;
  setOpenMenuId: (id: string) => void;
}) => {
  // Hooks
  const t = useTranslations();

  // Columns
  return [
    {
      headerName: t('Transaction ID'),
      propertyName: 'transactionId',
    },
    {
      headerName: t('User Type'),
      propertyName: 'userType',
    },
    {
      headerName: t('User'),
      propertyName: 'user',
      body: (transaction: ITransactionHistory) => {
        if (transaction.userType === 'RIDER' && transaction.rider) {
          return transaction.rider.name;
        }
        if (transaction.userType === 'STORE' && transaction.store) {
          return transaction.store.name;
        }
        return '-';
      },
    },
    {
      headerName: t('Amount'),
      propertyName: 'amount',
      body: (transaction: ITransactionHistory) =>
        `${transaction.amountCurrency} ${transaction.amountTransferred?.toFixed(2)}`,
    },
    {
      headerName: t('Created At'),
      propertyName: 'createdAt',
      body: (transaction: ITransactionHistory) => {
        const date = new Date(transaction.createdAt);
        const formattedDate = date?.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        return <div>{formattedDate}</div>;
      },
    },
    {
      headerName: t('Status'),
      propertyName: 'status',
      body: (transaction: ITransactionHistory) => (
        <span
          className={`rounded-full px-2 py-1 text-sm ${
            transaction.status === 'COMPLETED'
              ? 'bg-primary-color text-white'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {transaction.status}
        </span>
      ),
    },
    {
      propertyName: 'actions',
      body: (transaction: ITransactionHistory) => (
        <ActionMenu
          items={menuItems}
          data={transaction}
          isOpen={openMenuId === transaction._id} // CHANGE 3: Simplified menu open state check
          onToggle={() =>
            setOpenMenuId(openMenuId === transaction._id ? '' : transaction._id)
          }
        />
      ),
    },
  ];
};
