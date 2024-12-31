import { IActionMenuProps, IOptions } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';

export const OPTION_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IOptions>['items'];
}) => {
  return [
    { headerName: 'Title', propertyName: 'title' },
    { headerName: 'Price', propertyName: 'price' },
    { headerName: 'Description', propertyName: 'description' },
    {
      propertyName: 'actions',
      body: (option: IOptions) => (
        <ActionMenu items={menuItems} data={option} />
      ),
    },
  ];
};
