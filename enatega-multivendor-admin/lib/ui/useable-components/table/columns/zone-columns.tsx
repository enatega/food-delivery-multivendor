import { IActionMenuProps, IZoneResponse } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';

export const ZONE_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IZoneResponse>['items'];
}) => {
  return [
    { headerName: 'Title', propertyName: 'title' },
    { headerName: 'Description', propertyName: 'description' },
    {
      propertyName: 'actions',
      body: (zone: IZoneResponse) => (
        <ActionMenu items={menuItems} data={zone} />
      ),
    },
  ];
};
