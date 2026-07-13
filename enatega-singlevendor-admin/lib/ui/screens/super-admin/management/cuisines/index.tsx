'use client';
import CuisineForm from '@/lib/ui/screen-components/protected/super-admin/cuisines/form';
//screen components
import CuisineScreenHeader from '@/lib/ui/screen-components/protected/super-admin/cuisines/view/header/screen-header';
import CuisinesMain from '@/lib/ui/screen-components/protected/super-admin/cuisines/view/main';
import { IEditState } from '@/lib/utils/interfaces';
import { ICuisine } from '@/lib/utils/interfaces/cuisine.interface';

//hooks
import { useState } from 'react';

export default function CuisinesScreen() {
  //states
  const [visible, setVisible] = useState(false);
  //toggle visibility
  const handleButtonClick = () => {
    setVisible(true);
  };
  const [isEditing, setIsEditing] = useState<IEditState<ICuisine>>({
    bool: false,
    data: {
      _id: '',
      __typename: '',
      description: '',
      name: '',
      shopType: '',
      image: '',
    },
  });

  return (
    <div className="screen-container">
      <CuisineScreenHeader handleButtonClick={handleButtonClick} />
      <CuisinesMain
        setVisible={setVisible}
        visible={visible}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <CuisineForm
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setVisible={setVisible}
        visible={visible}
      />
    </div>
  );
}
