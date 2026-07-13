import { useState } from 'react';
import WithdrawRequestAdminHeader from '@/lib/ui/screen-components/protected/restaurant/withdraw-requests/view/header/screen-header';
import WithdrawRequestsAdminMain from '@/lib/ui/screen-components/protected/restaurant/withdraw-requests/view/main';
import WithdrawRequestAddForm from '@/lib/ui/screen-components/protected/restaurant/withdraw-requests/form';

export default function WithDrawRequestAdminScreen() {
  const [isAddWithdrawRequestVisible, setIsAddWithdrawRequestVisible] =
    useState(false);

  return (
    <div className="screen-container">
      <WithdrawRequestAdminHeader
        setIsAddWithdrawRequestVisible={setIsAddWithdrawRequestVisible}
      />
      <WithdrawRequestsAdminMain />
      <WithdrawRequestAddForm
        onHide={() => setIsAddWithdrawRequestVisible(false)}
        isAddWithdrawRequestVisible={isAddWithdrawRequestVisible}
      />
    </div>
  );
}
