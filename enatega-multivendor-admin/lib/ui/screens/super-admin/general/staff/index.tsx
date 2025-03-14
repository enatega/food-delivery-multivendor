'use client';
// Core
import { useState } from 'react';

// Components
import StaffAddForm from '@/lib/ui/screen-components/protected/super-admin/staff/add-form';
import StaffHeader from '@/lib/ui/screen-components/protected/super-admin/staff/view/header/screen-header';
import StaffMain from '@/lib/ui/screen-components/protected/super-admin/staff/view/main';

// Interfaces and Types
import { IStaffResponse } from '@/lib/utils/interfaces';

export default function StaffScreen() {
  // State
  const [isAddRiderVisible, setIsAddStaffVisible] = useState(false);
  const [staff, setStaff] = useState<null | IStaffResponse>(null);

  return (
    <div className="screen-container">
      <StaffHeader setIsAddStaffVisible={setIsAddStaffVisible} />
      <StaffMain
        setIsAddStaffVisible={setIsAddStaffVisible}
        setStaff={setStaff}
      />

      <StaffAddForm
        staff={staff}
        onHide={() => {
          setIsAddStaffVisible(false);
          // setStaff(null);
        }}
        isAddStaffVisible={isAddRiderVisible}
      />
    </div>
  );
}
