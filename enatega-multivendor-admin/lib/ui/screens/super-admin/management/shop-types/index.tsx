//screen components
import ShopTypesScreenHeader from '@/lib/ui/screen-components/protected/super-admin/shop-types/view/header/screen-header';
import ShopTypesForm from '@/lib/ui/screen-components/protected/super-admin/shop-types/form';
import ShopTypesMain from '@/lib/ui/screen-components/protected/super-admin/shop-types/view/main';

// Interface
import { IShopType, IEditState } from '@/lib/utils/interfaces';

//hooks
import { useState } from 'react';

export default function CouponsScreen() {
  //states
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState<IEditState<IShopType>>({
    bool: false,
    data: {
      __typename: '',
      _id: '',
      isActive: false,
      image: '',
      name: '',
    },
  });

  //toggle visibility
  const handleButtonClick = () => {
    setVisible(true);
    setIsEditing({
      bool: false,
      data: {
        __typename: ' ',
        _id: '',
        isActive: false,
        image: '',
        name: '',
      },
    });
  };

  return (
    <div className="screen-container">
      <ShopTypesScreenHeader handleButtonClick={handleButtonClick} />
      <ShopTypesMain
        setVisible={setVisible}
        visible={visible}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <ShopTypesForm
        isEditing={isEditing}
        visible={visible}
        setIsEditing={setIsEditing}
        setVisible={setVisible}
      />
    </div>
  );
}
