'use client';

import { LayoutContext } from '@/lib/context/global/layout.context';
// Component
import GrowthOverView from '@/lib/ui/screen-components/protected/super-admin/home/growth-overview';
import StatesTable from '@/lib/ui/screen-components/protected/super-admin/home/stats-table';
import UserStats from '@/lib/ui/screen-components/protected/super-admin/home/user-stats';
import { useContext } from 'react';

export default function Home() {
  const { isSuperAdminSidebarVisible } = useContext(LayoutContext);
  return (
    <>
      <div
        className={`flex flex-col ${isSuperAdminSidebarVisible ? 'w-[99%]' : 'w-[100%]'}  overflow-x-hidden p-3 h-full bg-white dark:bg-dark-950`}
      >
        <UserStats />
        <GrowthOverView />
        <StatesTable />
      </div>
    </>
  );
}
