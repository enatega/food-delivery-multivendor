//screen components
import UserCreditsForm from '@/lib/ui/screen-components/protected/super-admin/user-credits/form';
import UserCreditsScreenHeader from '@/lib/ui/screen-components/protected/super-admin/user-credits/view/header/screen-header';
import UserCreditsMain from '@/lib/ui/screen-components/protected/super-admin/user-credits/view/main';
import { IEditState } from '@/lib/utils/interfaces';
import { ICreditHistory } from '@/lib/utils/interfaces/user-credits.interface';
//hooks
import { useState } from 'react';
import { useRef } from 'react';

export default function UserCreditsScreen() {
  //states
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<IEditState<ICreditHistory>>({
    bool: false,
    data: {
      _id: '',
      userId: { _id: '', name: '', email: '' },
      amount: 0,
      orderId: '',
      recordType: 'credit',
      createdAt: '',
      updatedAt: '',
    },
  });

  const refetchRef = useRef<(() => void) | null>(null);

  //toggle visibility
  const handleButtonClick = () => {
    setIsEditing({
      bool: false,
      data: {
        _id: '',
        userId: { _id: '', name: '', email: '' },
        amount: 0,
        orderId: '',
        recordType: 'credit',
        createdAt: '',
        updatedAt: '',
      },
    });
    setOpen(true);
  };

  const handleSetRefetch = (refetch: () => void) => {
    refetchRef.current = refetch;
  };

  const handleRefetch = () => {
    if (refetchRef.current) {
      refetchRef.current();
    }
  };

  return (
    <div className="screen-container">
      <UserCreditsScreenHeader handleButtonClick={handleButtonClick} />
      <UserCreditsMain
        setEditData={(data) => {
          setIsEditing({
            bool: true,
            data: data || {
              _id: '',
              userId: { _id: '', name: '', email: '' },
              amount: 0,
              orderId: '',
              recordType: 'credit',
              createdAt: '',
              updatedAt: '',
            },
          });
        }}
        setOpen={setOpen}
        refetch={handleSetRefetch}
      />
      <UserCreditsForm
        open={open}
        onClose={() => setOpen(false)}
        refetch={handleRefetch}
        editData={isEditing.bool ? isEditing.data : null}
      />
    </div>
  );
}
