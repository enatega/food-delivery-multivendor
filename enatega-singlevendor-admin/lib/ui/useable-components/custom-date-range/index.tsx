import CustomLoader from '@/lib/ui/useable-components/custom-progress-indicator';
import CustomDateInput from '@/lib/ui/useable-components/date-input';
import { IDashboardDateFilterComponentsProps } from '@/lib/utils/interfaces/dashboard.interface';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function CustomDateRange({
  dateFilter,
  setDateFilter,
}: IDashboardDateFilterComponentsProps) {
  // Hooks
  const t = useTranslations();

  // State
  const [localDateFilter, setLocalDateFilter] = useState({
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const onApply = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDateFilter({ dateKeyword: 'Custom', ...localDateFilter });
      setIsLoading(false);
    }, 1000); // 1 second delay
  };

  if (dateFilter.dateKeyword !== 'Custom') return <></>;

  return (
    <div className="flex items-center justify-center p-3">
      <div className="w-full rounded-lg bg-white dark:bg-dark-950 shadow-lg">
        <div className="rounded-t-lg bg-primary-color py-2 text-center text-white">
          <h2 className="text-lg font-semibold">{t("Graph Filter")}</h2>
        </div>
        <div className="flex flex-col items-center justify-between space-y-4 p-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold dark:text-white">{t("Start Date")}</label>
            <div className="relative">
              <CustomDateInput
                value={localDateFilter?.startDate ?? ''}
                onChange={(value) =>
                  setLocalDateFilter({ ...localDateFilter, startDate: value })
                }
              />
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              />
            </div>
          </div>
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold">{t("End Date")}</label>
            <div className="relative">
              <CustomDateInput
                value={localDateFilter?.endDate ?? ''}
                onChange={(value) =>
                  setLocalDateFilter({ ...localDateFilter, endDate: value })
                }
              />
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              />
            </div>
          </div>
          <div className="w-4rem flex flex-col">
            {isLoading ? (
              <div className="mt-8 flex items-center justify-center">
                <CustomLoader />
              </div>
            ) : (
              <button
                className="mt-8 w-full rounded-full border dark:border-dark-600  bg-black px-6 py-2 font-semibold text-white"
                onClick={onApply}
              >
                {t("APPLY")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
