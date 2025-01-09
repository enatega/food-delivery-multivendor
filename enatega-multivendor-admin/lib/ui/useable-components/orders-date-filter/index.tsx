import CustomLoader from '@/lib/ui/useable-components/custom-progress-indicator';
import CustomDateInput from '@/lib/ui/useable-components/date-input';
import { IDashboardDateFilterComponentsProps } from '@/lib/utils/interfaces/dashboard.interface';
import sortDate from '@/lib/utils/methods/date.sorter';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export default function OrdersDashboardDateFilter({
  dateFilter,
  setDateFilter,
  className,
}: IDashboardDateFilterComponentsProps) {
  // State
  const [localDateFilter, setLocalDateFilter] = useState({
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const onApply = () => {
    if (
      dateFilter.startDate === localDateFilter.startDate &&
      dateFilter.endDate === localDateFilter.endDate
    ) {
      return;
    }
    const { startDate, endDate } = sortDate(
      'Custom',
      localDateFilter.startDate,
      localDateFilter.endDate
    );
    setIsLoading(true);
    setTimeout(() => {
      setDateFilter({
        dateKeyword: 'Custom',
        startDate: startDate.toDateString(),
        endDate: endDate.toDateString(),
      });
      setIsLoading(false);
    }, 1000); // 1 second delay
  };

  return (
    <div
      className={`flex justify-center items-center p-3 absoulte z-10 ${className} `}
    >
      <div className="bg-white rounded-lg shadow-lg w-full">
        <div className="bg-primary-color text-white text-center py-2 rounded-t-lg">
          <h2 className="text-lg font-semibold">Date Filter</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-col w-full">
            <label className="font-semibold mb-2">Start Date</label>
            <div className="relative">
              <CustomDateInput
                value={localDateFilter?.startDate ?? ''}
                onChange={(value) =>
                  setLocalDateFilter({ ...localDateFilter, startDate: value })
                }
              />
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label className="font-semibold mb-2">End Date</label>
            <div className="relative">
              <CustomDateInput
                value={localDateFilter?.endDate ?? ''}
                onChange={(value) =>
                  setLocalDateFilter({ ...localDateFilter, endDate: value })
                }
              />
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div className="flex flex-col w-4rem">
            {isLoading ? (
              <div className="flex justify-center items-center  mt-8">
                <CustomLoader />
              </div>
            ) : (
              <button
                className="bg-black text-white font-semibold py-2 px-6 rounded-full w-full mt-8"
                onClick={onApply}
              >
                APPLY
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
