'use client';

// Components
import SubscriptionHeader from '@/lib/ui/screen-components/protected/super-admin/subscription/view/header';
import SubscriptionMain from '@/lib/ui/screen-components/protected/super-admin/subscription/view/main';
import SubscriptionForm from '@/lib/ui/screen-components/protected/super-admin/subscription/form';

// Hooks
import { useState } from 'react';

// Interfaces
import { IEditState } from '@/lib/utils/interfaces';

export interface ISubscriptionPlan {
  id: string;
  amount: number;
  interval: string;
  intervalCount: number;
  productName?: string;
  productId?: string;
  // UI legacy fields - keeping strictly if needed, but better to migrate
}

export default function SubscriptionScreen() {
  // States
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState<IEditState<ISubscriptionPlan>>({
    bool: false,
    data: {
      id: '',
      amount: 0,
      interval: 'month',
      intervalCount: 1,
    },
  });

  // Toggle visibility
  const handleButtonClick = () => {
    setVisible(true);
    setIsEditing({
      bool: false,
      data: {
        id: '',
        amount: 0,
        interval: 'month',
        intervalCount: 1,
      },
    });
  };

  return (
    <div className="screen-container">
      <SubscriptionHeader handleButtonClick={handleButtonClick} />
      <SubscriptionMain
        setVisible={setVisible}
        visible={visible}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <SubscriptionForm
        isEditing={isEditing}
        visible={visible}
        setIsEditing={setIsEditing}
        setVisible={setVisible}
      />
    </div>
  );
}
