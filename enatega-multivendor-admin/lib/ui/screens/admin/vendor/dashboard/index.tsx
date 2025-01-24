import { useState } from 'react';

import DashboardHeader from '@/lib/ui/screen-components/protected/vendor/dashboard/header';

import DashboardDateFilter from '@/lib/ui/useable-components/date-filter';
import DashboardSubHeader from '@/lib/ui/screen-components/protected/vendor/dashboard/sub-header';
import { IDateFilter } from '@/lib/utils/interfaces';
import VendorDashboardMain from '@/lib/ui/screen-components/protected/vendor/dashboard/main';

export default function VendorDashboardScreen() {
  // State
  const [isStoreView, setIsStoreView] = useState(false);
  const [dateFilter, setDateFilter] = useState<IDateFilter>({
    dateKeyword: 'All',
    startDate: `${new Date().getFullYear()}-01-01`, // Current year, January 1st
    endDate: `${new Date().getFullYear()}-${String(new Date().getMonth()).padStart(2, '0')}-${String(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()).padStart(2, '0')}`, // Last day of previous month
  });

  const handleDateFilter = (dateFilter: IDateFilter) => {
    setDateFilter({
      dateKeyword: dateFilter.dateKeyword ?? '',
      endDate: dateFilter.endDate ?? new Date().toDateString(),
      startDate: dateFilter.startDate ?? new Date().toDateString(),
    });
  };

  const handleViewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsStoreView(e.target.checked);
  };

  return (
    <div className="screen-container">
      <DashboardHeader />
      <DashboardSubHeader
        isStoreView={isStoreView}
        handleViewChange={handleViewChange}
        dateFilter={dateFilter}
        handleDateFilter={handleDateFilter}
      />
      <DashboardDateFilter
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
      <VendorDashboardMain isStoreView={isStoreView} dateFilter={dateFilter} />
    </div>
  );
}
