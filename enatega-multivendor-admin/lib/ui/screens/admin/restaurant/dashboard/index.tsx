'use client';

// Component
import GrowthOverView from '@/lib/ui/screen-components/protected/restaurant/dashboard/growth-overview';
import OrderStats from '@/lib/ui/screen-components/protected/restaurant/dashboard/order-stats';
import RestaurantStatesTable from '@/lib/ui/screen-components/protected/restaurant/dashboard/restaurant-stats-table';
import DashboardDateFilter from '@/lib/ui/useable-components/date-filter';
import { IDateFilter } from '@/lib/utils/interfaces';
import { useState } from 'react';

export default function AdminRestaurantDashboard() {
  const [dateFilter, setDateFilter] = useState<IDateFilter>({
    startDate: `${new Date().getFullYear()}-01-01`, // Current year, January 1st
    endDate: `${new Date().getFullYear()}-${String(new Date().getMonth()).padStart(2, '0')}-${String(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()).padStart(2, '0')}`, // Last day of previous month
  });

  return (
    <div className="screen-container">
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
