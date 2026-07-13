import { IActionMenuProps, IZoneResponse } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { useTranslations } from 'next-intl';

export const ZONE_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IZoneResponse>['items'];
}) => {
  // Hooks
  const t = useTranslations();
  return [
    { headerName: t('Title'), propertyName: 'title' },
    { headerName: t('Description'), propertyName: 'description' },
    {
      propertyName: 'actions',
      body: (zone: IZoneResponse) => (
        <ActionMenu items={menuItems} data={zone} />
      ),
    },
  ];
};
