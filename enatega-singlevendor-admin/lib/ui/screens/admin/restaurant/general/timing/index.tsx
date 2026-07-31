'use client';
import TimingAddForm from '@/lib/ui/screen-components/protected/restaurant/timing/add-form';
import TimingHeader from '@/lib/ui/screen-components/protected/restaurant/timing/view/header';
import ScheduleOrderHeader from '@/lib/ui/screen-components/protected/restaurant/schedule-order-management/view/header';
import ScheduleOrderMain from '@/lib/ui/screen-components/protected/restaurant/schedule-order-management/view/main';

const TimingScreen = () => {
  return (
    <div className="flex  flex-col overflow-y-auto h-[calc(100vh-5rem)] p-3">
      <TimingHeader />
      <TimingAddForm />

      {/* Schedule Order Management Section */}
      <div className="mt-8">
        <ScheduleOrderHeader />
        <ScheduleOrderMain />
      </div>
    </div>
  );
};

export default TimingScreen;
