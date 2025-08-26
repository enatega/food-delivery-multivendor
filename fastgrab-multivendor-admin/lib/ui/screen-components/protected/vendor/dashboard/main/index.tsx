import RestaurantStats from '@/lib/ui/screen-components/protected/vendor/dashboard/restaurant-stats';
import VendorGrowthOverView from '@/lib/ui/screen-components/protected/vendor/dashboard/growth-overview';

// Interface
import { IDashboardMainComponentProps } from '@/lib/utils/interfaces';
import VendorLiveMonitor from '../live-monitor';

export default function VendorDashboardMain({
  isStoreView,
  dateFilter,
}: IDashboardMainComponentProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 border-t">
      <div className="w-full lg:w-[70%]">
        <RestaurantStats dateFilter={dateFilter} />
        <VendorGrowthOverView
          isStoreView={isStoreView}
          dateFilter={dateFilter}
        />
      </div>
      <div className="w-full lg:w-[30%] bg-white border-l p-2 lg:p-4">
        <VendorLiveMonitor dateFilter={dateFilter} />
      </div>
    </div>
  );
}
