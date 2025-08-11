"use client"
import TimingAddForm from '@/lib/ui/screen-components/protected/restaurant/timing/add-form';
import TimingHeader from '@/lib/ui/screen-components/protected/restaurant/timing/view/header';


const TimingScreen = () => {


  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden p-3">
      <TimingHeader />
      <TimingAddForm />
    </div>
  );
};

export default TimingScreen;
