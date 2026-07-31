// Interfaces
import { IActionMenuProps, IToast } from '@/lib/utils/interfaces';
import { IDeal } from '@/lib/ui/screens/super-admin/management/deals';

// Components
import ActionMenu from '../../action-menu';
import CustomInputSwitch from '../../custom-input-switch';

// Utils
import { formatNumberWithCurrency } from '@/lib/utils/methods/currency';

interface IDealsTableColumnsProps {
  menuItems: IActionMenuProps<IDeal>['items'];
  t: (key: string) => string;
  showToast: (config: IToast) => void;
  editDealLoading: { _id: string; bool: boolean };
  handleStatusChange: (rowData: IDeal) => void;
}

export const DEALS_TABLE_COLUMNS = ({
  menuItems,
  t,
  editDealLoading,
  handleStatusChange,
}: IDealsTableColumnsProps) => {
  // Columns
  return [
    {
      headerName: t('Deal Name'),
      propertyName: 'dealName',
      body: (rowData: IDeal) => (
        <span>{rowData.title ?? rowData.dealName ?? '-'}</span>
      ),
    },
    {
      headerName: t('Product'),
      propertyName: 'productName',
      body: (rowData: IDeal) => (
        <span>{rowData.foodTitle ?? rowData.productName ?? '-'}</span>
      ),
    },
    {
      headerName: t('Variation'),
      propertyName: 'variationTitle',
      body: (rowData: IDeal) => <span>{rowData.variationTitle ?? '-'}</span>,
    },
    {
      headerName: t('Deal Type'),
      propertyName: 'dealType',
      body: (rowData: IDeal) => {
        const dealType = rowData.discountType ?? rowData.dealType;
        const displayType = dealType;
        return <span className="capitalize">{displayType.toLowerCase()}</span>;
      },
    },
    {
      headerName: t('Discount'),
      propertyName: 'discount',
      body: (rowData: IDeal) => {
        const discountValue = rowData.discountValue ?? rowData.discount ?? 0;
        const dealType = rowData.discountType ?? rowData.dealType;
        const isPercentage =
          dealType === 'PERCENTAGE' || dealType === 'percentage_off';
        return (
          <span>
            {isPercentage
              ? `${discountValue}%`
              : formatNumberWithCurrency(discountValue, 'EUR')}
          </span>
        );
      },
    },
    {
      headerName: t('Start Date'),
      propertyName: 'startDate',
      body: (rowData: IDeal) => {
        const date = new Date(
          typeof rowData.startDate === 'string' &&
          !isNaN(Number(rowData.startDate))
            ? Number(rowData.startDate)
            : rowData.startDate
        );
        return date.toLocaleDateString();
      },
    },
    {
      headerName: t('End Date'),
      propertyName: 'endDate',
      body: (rowData: IDeal) => {
        const date = new Date(
          typeof rowData.endDate === 'string' && !isNaN(Number(rowData.endDate))
            ? Number(rowData.endDate)
            : rowData.endDate
        );
        return date.toLocaleDateString();
      },
    },
    {
      headerName: t('Status'),
      propertyName: 'isActive',
      body: (rowData: IDeal) => (
        <div className="flex w-full items-center justify-between gap-2">
          <CustomInputSwitch
            isActive={rowData.isActive || false}
            className={
              rowData?.isActive ? 'p-inputswitch-checked mb-1' : 'mb-1'
            }
            onChange={() => handleStatusChange(rowData)}
            loading={
              rowData._id === editDealLoading._id && editDealLoading.bool
            }
          />
          <ActionMenu data={rowData} items={menuItems} />
        </div>
      ),
    },
  ];
};
