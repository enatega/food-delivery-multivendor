'use client';

// Component
import GrowthOverView from '@/lib/ui/screen-components/protected/super-admin/home/growth-overview';
import StatesTable from '@/lib/ui/screen-components/protected/super-admin/home/stats-table';
import UserStats from '@/lib/ui/screen-components/protected/super-admin/home/user-stats';

export default function Home() {
  return (
    <div className="screen-container">
      <UserStats />
      <GrowthOverView />
      <StatesTable />
    </div>
  );
}
