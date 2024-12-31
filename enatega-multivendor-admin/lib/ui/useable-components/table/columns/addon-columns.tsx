import { IActionMenuProps, IAddon } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';

export const ADDON_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IAddon>['items'];
}) => {
  return [
    { headerName: 'Title', propertyName: 'title' },
    { headerName: 'Description', propertyName: 'description' },
    { headerName: 'Minimum', propertyName: 'quantityMinimum' },
    { headerName: 'Maximum', propertyName: 'quantityMaximum' },
    {
      propertyName: 'actions',
      body: (option: IAddon) => <ActionMenu items={menuItems} data={option} />,
    },
  ];
};
