// Interface
import { IDateFilterCustomTabProps } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

const DateFilterCustomTab = ({
  options,
  selectedTab,
  setSelectedTab,
}: IDateFilterCustomTabProps) => {
  const t = useTranslations();

  return (
    <div className="flex h-10 w-fit space-x-2 rounded bg-gray-100 border border-none dark:border-dark-600 dark:bg-dark-900 p-1">
      {options.map((option) => (
        <div
          key={String(option)}
          className={`flex cursor-pointer items-center justify-center rounded px-4 ${
            selectedTab === option
              ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow'
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setSelectedTab(option)}
        >
         {t(option)}
        </div>
      ))}
    </div>
  );
};

export default DateFilterCustomTab;
