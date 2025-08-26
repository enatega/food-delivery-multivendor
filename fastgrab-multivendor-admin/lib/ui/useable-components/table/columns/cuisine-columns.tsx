// Interfaces
import { IActionMenuProps } from '@/lib/utils/interfaces';
import { ICuisine } from '@/lib/utils/interfaces/cuisine.interface';

// Components
import ActionMenu from '../../action-menu';
import Image from 'next/image';

// Hooks
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

export const CUISINE_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<ICuisine>['items'];
}) => {
  // Hooks
  const t = useTranslations();

  // Cuisine Columns
  const cuisine_columns = useMemo(
    () => [
      {
        headerName: t('Image'),
        propertyName: 'image',
        body: (data: ICuisine) => (
          <div className="flex h-8 w-8 items-center justify-start overflow-hidden rounded-md">
            <Image
              src={
                data?.image ||
                'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              }
              alt={data?.description ?? t('Cuisine')}
              width={100}
              height={100}
            />
          </div>
        ),
      },
      {
        headerName: t('Name'),
        propertyName: 'name',
      },
      {
        headerName: t('Description'),
        propertyName: 'description',
      },
      {
        headerName: t('Shop Category'),
        propertyName: 'shopType',
      },
      {
        headerName: t('Actions'),
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
