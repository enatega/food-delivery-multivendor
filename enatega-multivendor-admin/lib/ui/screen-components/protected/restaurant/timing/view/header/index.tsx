// Components
import HeaderText from '@/lib/ui/useable-components/header-text';

const TimingHeader = () => {
  return (
    <div className="w-full flex-shrink-0">
      <div className="flex w-full justify-between">
        <HeaderText className="heading" text="Timing" />
      </div>
    </div>
  );
};

export default TimingHeader;
