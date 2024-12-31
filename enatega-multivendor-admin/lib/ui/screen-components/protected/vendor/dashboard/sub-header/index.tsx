import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';
import VendorCustomTab from '@/lib/ui/useable-components/vendor-custom-tab';
import { IDashboardSubHeaderComponentsProps } from '@/lib/utils/interfaces';

export default function DashboardSubHeader({
  isStoreView,
  handleViewChange,
  dateFilter,
  handleDateFilter,
}: IDashboardSubHeaderComponentsProps) {
  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 bg-white rounded-lg ">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Business Overview
        </h2>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm leading-5 font-medium font-inter ${!isStoreView ? 'text-black' : 'text-[#71717A]'}`}
          >
            Graph View
          </span>
          <CustomInputSwitch
            isActive={isStoreView}
            onChange={handleViewChange}
          />
          <span
            className={`text-sm leading-5 font-medium font-inter ${isStoreView ? 'text-black' : 'text-[#71717A]'}`}
          >
            Store View
          </span>
        </div>
      </div>
      <VendorCustomTab
        options={['All', 'Today', 'Week', 'Month', 'Year', 'Custom']}
        selectedTab={dateFilter.dateKeyword}
        setSelectedTab={(tab: string) =>
          handleDateFilter({ ...dateFilter, dateKeyword: tab })
        }
      />
    </div>
  );
}
