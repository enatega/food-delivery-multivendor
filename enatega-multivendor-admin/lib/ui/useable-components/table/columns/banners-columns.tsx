// Core
import Image from 'next/image';

// Custom Components
import ActionMenu from '@/lib/ui/useable-components/action-menu';

// Interfaces and Types
import { IActionMenuProps } from '@/lib/utils/interfaces/action-menu.interface';
import { IBannersResponse } from '@/lib/utils/interfaces/banner.interface';

// Interfaces and Types
export const BANNERS_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IBannersResponse>['items'];
}) => {
  return [
    {
      headerName: 'Image',
      propertyName: 'image',
      body: (product: IBannersResponse) => {
        return (
          <Image
            width={40}
            height={40}
            alt="Banner"
            src={
              product.file
                ? product.file
                : 'https://images.unsplash.com/photo-1595418917831-ef942bd9f9ec?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
          />
        );
      },
    },
    { headerName: 'Title', propertyName: 'title' },
    { headerName: 'Description', propertyName: 'description' },
    { headerName: 'Screen Name', propertyName: 'screen' },
    { headerName: 'Action', propertyName: 'action' },
    {
      propertyName: 'actions',
      body: (banner: IBannersResponse) => (
        <ActionMenu items={menuItems} data={banner} />
      ),
    },
  ];
};
