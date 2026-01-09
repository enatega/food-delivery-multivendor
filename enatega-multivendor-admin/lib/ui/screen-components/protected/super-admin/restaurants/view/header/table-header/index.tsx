// Custom Components
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomMultiSelectComponent from '@/lib/ui/useable-components/custom-multi-select';

// Interfaces
import { IRestaurantsTableHeaderProps } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

export default function RestaurantsTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
}: IRestaurantsTableHeaderProps) {
  // Hooks
  const t = useTranslations();

  const shopCategoryOptions = [
    { id: 1, label: 'Category1', code: 'category1' },
    { id: 2, label: 'Category2', code: 'category2' },
    { id: 3, label: 'Category3', code: 'category3' },
  ];

  const shopStatusOptions = [
    { id: 1, label: t('active'), code: 'active' },
    { id: 2, label: t('inactive'), code: 'inactive' },
  ];

  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex-colm:flex-row flex w-fit flex-wrap items-center gap-2">
        <div className="w-60">
          <CustomTextField
            type="text"
            name="vendorFilter"
            maxLength={35}
            showLabel={false}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={t('Keyword Search')}
            className="h-12"
          />
        </div>
        <div>
          <CustomMultiSelectComponent
            name="shop_category"
            options={shopCategoryOptions}
            selectedItems={[]}
            setSelectedItems={() => []}
            placeholder={t('Shop Category')}
            className=" w-min border dark:border-dark-600 rounded-md py-1"
            multiSelectClassName="border-none"
          />
        </div>
        <div>
          <CustomMultiSelectComponent
            name="shop_status"
            options={shopStatusOptions}
            selectedItems={[]}
            setSelectedItems={() => []}
            placeholder={t('Shop Status')}
            className=" w-min border dark:border-dark-600 rounded-md py-1"
            multiSelectClassName="border-none"
          />
        </div>
      </div>
    </div>
  );
}
