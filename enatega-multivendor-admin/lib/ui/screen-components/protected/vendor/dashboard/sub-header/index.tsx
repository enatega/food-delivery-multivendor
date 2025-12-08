import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';
import DateFilterCustomTab from '@/lib/ui/useable-components/date-filter-custom-tab';
import { IDashboardSubHeaderComponentsProps } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

export default function DashboardSubHeader({
  isStoreView,
  handleViewChange,
  dateFilter,
  handleDateFilter,
}: IDashboardSubHeaderComponentsProps) {
  // Hooks
  const t = useTranslations();

  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 bg-white dark:bg-dark-950 rounded-lg ">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('Business Overview')}
        </h2>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm leading-5 font-medium font-inter ${!isStoreView ? 'text-black dark:text-white' : 'text-[#71717A]'}`}
          >
            {t('Graph View')}
          </span>
          {handleViewChange && (
            <CustomInputSwitch
              isActive={isStoreView ?? false}
              onChange={handleViewChange}
            />
          )}
          <span
            className={`text-sm leading-5 font-medium font-inter ${isStoreView ? 'text-black dark:text-white' : 'text-[#71717A]'}`}
          >
            {t('Store View')}
          </span>
        </div>
      </div>
      <DateFilterCustomTab
        options={[
          t('All'),
          t('Today'),
          t('Week'),
          t('Month'),
          t('Year'),
          'Custom',
        ]}
        selectedTab={dateFilter?.dateKeyword ?? ''}
        setSelectedTab={(tab: string) =>
          handleDateFilter({ ...dateFilter, dateKeyword: tab })
        }
      />
    </div>
  );
}
