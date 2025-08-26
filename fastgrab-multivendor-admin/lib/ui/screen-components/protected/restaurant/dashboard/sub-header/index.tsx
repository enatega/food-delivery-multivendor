import DateFilterCustomTab from '@/lib/ui/useable-components/date-filter-custom-tab';
import { IDashboardSubHeaderComponentsProps } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

export default function DashboardSubHeader({
  dateFilter,
  handleDateFilter,
}: IDashboardSubHeaderComponentsProps) {
  // Hooks
  const t = useTranslations();
  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 bg-white rounded-lg ">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('Business Overview')}
        </h2>
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
        selectedTab={dateFilter?.dateKeyword ?? 'All'}
        setSelectedTab={(tab: string) =>
          handleDateFilter({ ...dateFilter, dateKeyword: tab })
        }
      />
    </div>
  );
}
