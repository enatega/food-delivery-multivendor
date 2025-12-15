import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { ITransactionHistoryTableHeaderProps } from '@/lib/utils/interfaces';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TransactionHistoryTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
  dateFilters,
  setDateFilters,
}: ITransactionHistoryTableHeaderProps) {
  // Hooks
  const t = useTranslations();

  // States
  const [errors, setErrors] = useState({ startDate: '', endDate: '' });

  const userTypes = [
    { label: t('All'), value: 'ALL' },
    { label: t('Rider'), value: 'RIDER' },
    { label: t('Store'), value: 'STORE' },
  ];

  const handleStartDateChange = (e: { value: Date | null }) => {
    const newStartDate = e.value ? e.value.toISOString() : '';
    if (
      dateFilters.endingDate &&
      new Date(newStartDate) > new Date(dateFilters.endingDate)
    ) {
      setErrors((prev) => ({
        ...prev,
        startDate: t('Start date cannot be after the end date'),
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, startDate: '' }));
    setDateFilters((prev) => ({ ...prev, startingDate: newStartDate }));
  };

  const handleEndDateChange = (e: { value: Date | null }) => {
    const newEndDate = e.value ? e.value.toISOString() : '';
    if (
      dateFilters.startingDate &&
      new Date(newEndDate) < new Date(dateFilters.startingDate)
    ) {
      setErrors((prev) => ({
        ...prev,
        endDate: t('End date cannot be before the start date'),
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, endDate: '' }));
    setDateFilters((prev) => ({ ...prev, endingDate: newEndDate }));
  };

  return (
    <div className="flex flex-row gap-4 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-row gap-4 md:flex-row">
        <div className="flex flex-col">
          <Calendar
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-black dark:text-white"
            placeholder={t('Start Date')}
            value={
              dateFilters.startingDate
                ? new Date(dateFilters.startingDate)
                : null
            }
            onChange={(e) => handleStartDateChange(e as { value: Date | null })}
            dateFormat="dd/mm/yy"
            showIcon
          />
          {errors.startDate && (
            <small className="p-error">{errors.startDate}</small>
          )}
        </div>
        <div className="flex flex-col">
          <Calendar
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-black dark:text-white"
            placeholder={t('End Date')}
            value={
              dateFilters.endingDate ? new Date(dateFilters.endingDate) : null
            }
            onChange={(e) => handleEndDateChange(e as { value: Date | null })}
            dateFormat="dd/mm/yy"
            showIcon
          />
          {errors.endDate && (
            <small className="p-error">{errors.endDate}</small>
          )}
        </div>
        <div className="mx-8">
          <Dropdown
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem]  text-black dark:text-white"
            options={userTypes}
            value={dateFilters.userType || null}
            onChange={(e) =>
              setDateFilters((prev) => ({
                ...prev,
                userType: e.value,
              }))
            }
            placeholder={`${t('Select')} ${t('User')} ${t('Type')}`}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            className="w-[14rem] h-10 border-[1px] font-light border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-black dark:text-white"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={t('Search')}
          />
        </span>
      </div>
    </div>
  );
}
