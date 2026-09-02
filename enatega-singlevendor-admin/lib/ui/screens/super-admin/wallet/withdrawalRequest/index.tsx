import WithdrawRequestForm from '@/lib/ui/screen-components/protected/super-admin/withdraw-requests/form';
import WithdrawRequestSuperAdminHeader from '@/lib/ui/screen-components/protected/super-admin/withdraw-requests/view/header/screen-header';
import WithdrawRequestsSuperAdminMain from '@/lib/ui/screen-components/protected/super-admin/withdraw-requests/view/main';
import { useState } from 'react';
import { IWithDrawRequest } from '@/lib/utils/interfaces/withdraw-request.interface';

export default function WithDrawRequestSuperAdminScreen() {
  const [visible, setVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<IWithDrawRequest | undefined>();

  return (
    <div className="screen-container">
      <WithdrawRequestSuperAdminHeader />
      <WithdrawRequestsSuperAdminMain 
        setVisible={setVisible}
        setSelectedRequest={setSelectedRequest}
      />
      <WithdrawRequestForm 
        setVisible={setVisible} 
        visible={visible}
        selectedRequest={selectedRequest}
      />
    </div>
  );
}