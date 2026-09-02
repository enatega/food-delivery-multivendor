'use client';

// Components
import DealsHeader from '@/lib/ui/screen-components/protected/super-admin/deals/view/header';
import DealsMain from '@/lib/ui/screen-components/protected/super-admin/deals/view/main';
import DealsForm from '@/lib/ui/screen-components/protected/super-admin/deals/form';

// Hooks
import { useState } from 'react';

// Interfaces
import { IEditState } from '@/lib/utils/interfaces';

export interface IDeal {
  _id: string;
  id?: string;
  __typename?: string;
  dealName?: string;
  title?: string;
  productId?: string;
  food?: string;
  variationId?: string;
  variation?: string;
  productName?: string;
  foodTitle?: string;
  variationTitle?: string;
  vendor?: string;
  vendorId?: string;
  restaurant?: string;
  dealType: 'PERCENTAGE' | 'FIXED' | 'percentage_off' | 'fixed_amount_off';
  discountType?: string;
  discount?: number;
  discountValue?: number;
  startDate: string;
  endDate: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function DealsScreen() {
  // States
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState<IEditState<IDeal>>({
    bool: false,
    data: {
      __typename: '',
      _id: '',
      vendor: '',
      vendorId: '',
      dealType: 'PERCENTAGE',
      discount: 0,
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  // Toggle visibility
  const handleButtonClick = () => {
    setVisible(true);
    setIsEditing({
      bool: false,
      data: {
        __typename: '',
        _id: '',
        vendor: '',
        vendorId: '',
        dealType: 'PERCENTAGE',
        discount: 0,
        startDate: '',
        endDate: '',
        description: '',
      },
    });
  };

  return (
    <div className="screen-container">
      <DealsHeader handleButtonClick={handleButtonClick} />
      <DealsMain
        setVisible={setVisible}
        visible={visible}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <DealsForm
        isEditing={isEditing}
        visible={visible}
        setIsEditing={setIsEditing}
        setVisible={setVisible}
      />
    </div>
  );
}
