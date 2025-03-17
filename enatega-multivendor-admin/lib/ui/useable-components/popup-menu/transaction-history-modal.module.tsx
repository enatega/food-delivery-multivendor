import React from 'react';
import { Dialog } from 'primereact/dialog';
import { ITransactionHistory } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

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
      className="w-full max-w-2xl"
    >
      <div className="space-y-6 p-4">
        {/* Basic Transaction Info */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 text-lg font-semibold">
            {t('Transaction Information')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">{t('Amount')}</p>
              <p className="font-medium">{`${transaction?.amountCurrency} ${transaction.amountTransferred.toFixed(2)}`}</p>
            </div>
            <div>
              <p className="text-gray-600">{t('Status')}</p>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${
                  transaction.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-800'
                    : transaction.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {transaction?.status}
              </span>
            </div>
            <div>
              <p className="text-gray-600">{t('Date')}</p>
              <p className="font-medium">
                {new Date(transaction?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">{t('User Type')}</p>
              <p className="font-medium">{transaction?.userType}</p>
            </div>
          </div>
        </div>

        {/* Bank Transfer Details */}
        {transaction.toBank && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">{t('Bank Details')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">{t('Account Name')}</p>
                <p className="font-medium">
                  {transaction?.toBank?.accountName}
                </p>
              </div>
              <div>
                <p className="text-gray-600">{t('Bank Name')}</p>
                <p className="font-medium">{transaction?.toBank?.bankName}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('Account Number')}</p>
                <p className="font-medium">
                  {transaction?.toBank?.accountNumber}
                </p>
              </div>
              <div>
                <p className="text-gray-600">{t('Account Code')}</p>
                <p className="font-medium">
                  {transaction?.toBank?.accountCode}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rider Details */}
        {transaction.rider && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">{t('Rider Details')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">{t('Name')}</p>
                <p className="font-medium">{transaction?.rider?.name}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('Email')}</p>
                <p className="font-medium">{transaction?.rider?.email}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('Phone')}</p>
                <p className="font-medium">{transaction?.rider?.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('Account Number')}</p>
                <p className="font-medium">
                  {transaction?.rider?.accountNumber}
                </p>
              </div>
              <div>
                <p className="text-gray-600">{t('Current Wallet Amount')}</p>
                <p className="font-medium">
                  ${transaction?.rider?.currentWalletAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">{t('Total Earnings')}</p>
                <p className="font-medium">
                  ${transaction?.rider?.totalWalletAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Store Details */}
        {transaction.store && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">{t('Store Details')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">{t('Store Name')}</p>
                <p className="font-medium">{transaction?.store?.name}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('Store ID')}</p>
                <p className="font-medium">
                  {transaction?.store?.unique_restaurant_id}
                </p>
              </div>
              <div>
                <p className="text-gray-600">{t('Rating')}</p>
                <p className="font-medium">
                  {transaction?.store?.rating?.toFixed(1)} ⭐
                </p>
              </div>
              <div>
                <p className="text-gray-600">{t('Phone')}</p>
                <p className="font-medium">{transaction?.store?.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('Location')}</p>
                <p className="font-medium">{`${transaction?.store?.city}, ${transaction?.store?.postCode}`}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('Status')}</p>
                <div className="space-x-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      transaction?.store?.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction?.store?.isActive ? t('Active') : t('Inactive')}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      transaction?.store?.isAvailable
                        ? 'bg-green-100 text-green-800'
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
