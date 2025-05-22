//screen components
import CouponForm from '@/lib/ui/screen-components/protected/super-admin/coupons/form';
import CouponScreenHeader from '@/lib/ui/screen-components/protected/super-admin/coupons/view/header/screen-header';
import CouponsMain from '@/lib/ui/screen-components/protected/super-admin/coupons/view/main';
import { IEditState } from '@/lib/utils/interfaces';
import { ICoupon } from '@/lib/utils/interfaces/coupons.interface';
//hooks
import { useState } from 'react';

export default function CouponsScreen() {
  //states
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState<IEditState<ICoupon>>({
    bool: false,
    data: {
      __typename: '',
      _id: '',
      discount: 0,
      enabled: false,
      title: '',
      endDate: null,
      lifeTimeActive: false,
    },
  });

  //toggle visibility
  const handleButtonClick = () => {
    setVisible(true);
  };

  return (
    <div className="screen-container">
      <CouponScreenHeader handleButtonClick={handleButtonClick} />
      <CouponsMain
        setVisible={setVisible}
        visible={visible}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <CouponForm
        isEditing={isEditing}
        visible={visible}
        setIsEditing={setIsEditing}
        setVisible={setVisible}
      />
    </div>
  );
}
