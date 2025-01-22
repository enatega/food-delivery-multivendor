import { IActionMenuProps, IAddon } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { useTranslations } from 'next-intl';

export const ADDON_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IAddon>['items'];
}) => {
  // Hooks
  const t = useTranslations();
  return [
    { headerName: t('Title'), propertyName: 'title' },
    { headerName: t('Description'), propertyName: 'description' },
    { headerName: t('Minimum'), propertyName: 'quantityMinimum' },
    { headerName: t('Maximum'), propertyName: 'quantityMaximum' },
    {
      propertyName: 'actions',
      body: (option: IAddon) => <ActionMenu items={menuItems} data={option} />,
    },
  ];
};
