'use client';

// Component
import GrowthOverView from '@/lib/ui/screen-components/protected/restaurant/dashboard/growth-overview';
import OrderStats from '@/lib/ui/screen-components/protected/restaurant/dashboard/order-stats';
import RestaurantStatesTable from '@/lib/ui/screen-components/protected/restaurant/dashboard/restaurant-stats-table';
import DashboardSubHeader from '@/lib/ui/screen-components/protected/restaurant/dashboard/sub-header';
import DashboardDateFilter from '@/lib/ui/useable-components/date-filter';

import { IDateFilter } from '@/lib/utils/interfaces';
import { useState } from 'react';

export default function AdminRestaurantDashboard() {
  const [dateFilter, setDateFilter] = useState<IDateFilter>({
    dateKeyword: 'All',
    startDate: `${new Date().getFullYear()}-01-01`, // Current year, January 1st
    endDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()).padStart(2, '0')}`, // Last day of the current month
  });

  const handleDateFilter = (dateFilter: IDateFilter) => {
    console.log("dateFilter.....", dateFilter);
    setDateFilter({
      ...dateFilter,
      dateKeyword: dateFilter.dateKeyword ?? '',
    });
  };

  return (
    <div className="screen-container">
      <DashboardSubHeader
        dateFilter={dateFilter}
        handleDateFilter={handleDateFilter}
      />
      <DashboardDateFilter
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      <OrderStats dateFilter={dateFilter} />
      <GrowthOverView />
      <RestaurantStatesTable dateFilter={dateFilter} />
    </div>
  );
}
