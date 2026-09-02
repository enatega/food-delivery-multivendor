// Interface
import { IVendorCustomTabProps } from '@/lib/utils/interfaces';

const VendorCustomTab = ({
  options,
  selectedTab,
  setSelectedTab,
}: IVendorCustomTabProps) => {
  return (
    <div className="flex h-10 w-fit space-x-2 rounded bg-gray-100 p-1">
      {options.map((option) => (
        <div
          key={String(option)}
          className={`flex cursor-pointer items-center justify-center rounded px-4 ${
            selectedTab === option
              ? 'bg-white dark:bg-dark-950 text-black dark:text-white shadow'
              : 'text-gray-500'
          }`}
          onClick={() => setSelectedTab(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default VendorCustomTab;
