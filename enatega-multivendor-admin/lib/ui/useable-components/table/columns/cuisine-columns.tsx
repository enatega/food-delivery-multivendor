// Interfaces
import { IActionMenuProps } from '@/lib/utils/interfaces';
import { ICuisine } from '@/lib/utils/interfaces/cuisine.interface';

// Components
import ActionMenu from '../../action-menu';
import Image from 'next/image';

// Hooks
import { useMemo } from 'react';

export const CUISINE_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<ICuisine>['items'];
}) => {
  const cuisine_columns = useMemo(
    () => [
      {
        headerName: 'Image',
        propertyName: 'image',
        body: (data: ICuisine) => (
          <div className="flex h-8 w-8 items-center justify-start overflow-hidden rounded-md">
            <Image
              src={
                data?.image ||
                'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              }
              alt={data?.description ?? 'cuisine'}
              width={100}
              height={100}
            />
          </div>
        ),
      },
      {
        headerName: 'Name',
        propertyName: 'name',
      },
      {
        headerName: 'Description',
        propertyName: 'description',
      },
      {
        headerName: 'Shop Category',
        propertyName: 'shopType',
      },
      {
        headerName: 'Action',
        propertyName: 'action',
        body: (rowData: ICuisine) => (
          <div className="three-dots">
            <ActionMenu data={rowData} items={menuItems} />
          </div>
        ),
      },
    ],
    [menuItems]
  );
  return cuisine_columns;
};
