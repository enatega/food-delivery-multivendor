import React from 'react';
import { Dialog } from 'primereact/dialog';
import { ITransactionHistory } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';
import { Rating } from 'primereact/rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

interface ITransactionDetailModalProps {
  visible: boolean;
  onHide: () => void;
  transaction: ITransactionHistory | null;
}

const TransactionDetailModal: React.FC<ITransactionDetailModalProps> = ({
  visible,
  onHide,
  transaction,
}) => {
  // Hooks
  const t = useTranslations();

  if (!transaction) return null;

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Transaction Details #${transaction.transactionId}`}
      className="w-full max-w-2xl dark:bg-dark-950 dark:border dark:border-dark-600 dark:text-white"
      headerClassName='dark:bg-dark-950 dark:border dark:border-dark-600 dark:text-white'
      contentClassName='dark:bg-dark-950 dark:border dark:border-dark-600 dark:text-white'
      
      
    >
      <div className="space-y-6 p-4">
        {/* Basic Transaction Info */}
        <div className="rounded-lg bg-gray-50 dark:bg-dark-900 p-4">
          <h3 className="mb-3 text-lg font-semibold">
            {t('Transaction Information')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 dark:text-white">{t('Amount')}</p>
              <p className="font-medium">{`${transaction?.amountCurrency} ${transaction.amountTransferred.toFixed(2)}`}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-white">{t('Status')}</p>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${
                  transaction.status === 'COMPLETED'
                    ? 'bg-primary-color text-white'
                    : transaction.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {transaction?.status}
              </span>
            </div>
            <div>
              <p className="text-gray-600 dark:text-white">{t('Date')}</p>
              <p className="font-medium">
                {new Date(transaction?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-white">{t('User Type')}</p>
              <p className="font-medium">{transaction?.userType}</p>
            </div>
          </div>
        </div>

        {/* Bank Transfer Details */}
        {transaction.toBank && (
          <div className="rounded-lg bg-gray-50 dark:bg-dark-900 p-4">
            <h3 className="mb-3 text-lg font-semibold">{t('Bank Details')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-white">{t('Account Name')}</p>
                <p className="font-medium">
                  {transaction?.toBank?.accountName}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">{t('Bank Name')}</p>
                <p className="font-medium">{transaction?.toBank?.bankName}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">{t('Account Number')}</p>
                <p className="font-medium">
                  {transaction?.toBank?.accountNumber}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">{t('Account Code')}</p>
                <p className="font-medium">
                  {transaction?.toBank?.accountCode}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rider Details */}
        {transaction.rider && (
          <div className="rounded-lg bg-gray-50 dark:bg-dark-900 p-4">
            <h3 className="mb-3 text-lg font-semibold">{t('Rider Details')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-white">{t('Name')}</p>
                <p className="font-medium">{transaction?.rider?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">{t('Username')}</p>
                <p className="font-medium">{transaction?.rider?.username}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">{t('Phone')}</p>
                <p className="font-medium">{transaction?.rider?.phone}</p>
              </div>
              {/* <div>
                <p className="text-gray-600">{t('Account Number')}</p>
                <p className="font-medium">
                  {transaction?.rider?.accountNumber}
                </p>
              </div> */}
              <div>
                <p className="text-gray-600 dark:text-white">{t('Current Wallet Amount')}</p>
                <p className="font-medium">
                  ${transaction?.rider?.currentWalletAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">{t('Total Earnings')}</p>
                <p className="font-medium">
                  ${transaction?.rider?.totalWalletAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Store Details */}
        {transaction.store && (
          <div className="rounded-lg bg-gray-50 dark:bg-dark-900 p-4">
            <h3 className="mb-3 text-lg font-semibold">{t('Store Details')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-white">{t('Store Name')}</p>
                <p className="font-medium">{transaction?.store?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">{t('Store ID')}</p>
                <p className="font-medium">
                  {transaction?.store?.unique_restaurant_id}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">{t('Rating')}</p>
                <p className="font-medium">
                  <Rating
                    value={transaction?.store?.reviewAverage}
                    onIcon={
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-500"
                      />
                    } // Filled Star
                    offIcon={
                      <FontAwesomeIcon
                        icon={faStarHalfAlt}
                        className="text-yellow-500"
                      />
                    } // Empty Star
                    readOnly
                    cancel={false}
                  />
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">{t('Phone')}</p>
                <p className="font-medium">{transaction?.store?.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">{t('Location')}</p>
                <p className="font-medium">{transaction?.store?.address}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">{t('Status')}</p>
                <div className="space-x-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      transaction?.store?.isActive
                        ? 'bg-primary-color text-white'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction?.store?.isActive ? t('Active') : t('Inactive')}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      transaction?.store?.isAvailable
                        ? 'bg-primary-color text-white'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction?.store?.isAvailable
                      ? t('Available')
                      : t('Unavailable')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default TransactionDetailModal;
