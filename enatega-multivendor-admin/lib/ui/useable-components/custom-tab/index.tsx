// Interface
import { ICustomTabProps } from '@/lib/utils/interfaces';
import OrdersDashboardDateFilter from '../orders-date-filter';
import { useTranslations } from 'next-intl';

const CustomTab = ({
  options,
  selectedTab,
  setSelectedTab,
  dateFilter,
  setDateFilter,
}: ICustomTabProps) => {
  // Hooks
  const t = useTranslations();
  return (
    <div>
      <div className="flex h-10 w-fit space-x-2 rounded bg-gray-100 p-1">
        {options.map((option) => (
          <div
            key={String(option)}
            className={`flex cursor-pointer items-center justify-center rounded px-4 ${
              selectedTab === option
                ? 'bg-white text-black shadow'
                : 'text-gray-500'
            }`}
            onClick={() => setSelectedTab(option)}
          >
            {t(option)}
          </div>
        ))}
      </div>
      {selectedTab === 'Custom' && (
        <OrdersDashboardDateFilter
          dateFilter={
            dateFilter ?? {
              startDate: new Date().getDate().toString(),
              endDate: new Date().getDate().toString(),
              dateKeyword: 'Today',
            }
          }
          setDateFilter={setDateFilter ?? function () {}}
        />
      )}
    </div>
  );
};

export default CustomTab;
