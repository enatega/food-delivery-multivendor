'use client';
import TransactionHistoryRestaurantHeader from '@/lib/ui/screen-components/protected/restaurant/transaction-history/header/screen-header';
import TransactionHistoryStoreMain from '@/lib/ui/screen-components/protected/restaurant/transaction-history/main';
export default function TransactionRestaurantScreen() {
  return (
    <div className="screen-container">
      <TransactionHistoryRestaurantHeader />
      <TransactionHistoryStoreMain />
    </div>
  );
}
