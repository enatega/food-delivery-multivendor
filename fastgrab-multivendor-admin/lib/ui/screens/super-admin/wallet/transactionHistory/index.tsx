'use client';
import TransactionHistorySuperAdminHeader from "@/lib/ui/screen-components/protected/super-admin/transactionhistory/view/header/screen-header";
import TransactionHistoryMain from "@/lib/ui/screen-components/protected/super-admin/transactionhistory/view/main";
export default function TransactionSuperAdminScreen() {
  return (
    <div className="screen-container">
        <TransactionHistorySuperAdminHeader/>
        <TransactionHistoryMain/>
    </div>
  );
}
