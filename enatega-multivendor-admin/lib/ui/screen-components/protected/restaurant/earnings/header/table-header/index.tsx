import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import {
  IEarningTableHeaderProps,
  OrderTypeEnum,
  PaymentMethodEnum,
} from '@/lib/utils/interfaces/earnings.interface';
import { useTranslations } from 'next-intl';

export default function EarningRestaurantTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
  dateFilters,
  setDateFilters,
}: IEarningTableHeaderProps) {
  // Hooks
  const t = useTranslations();

  // States
  const [errors, setErrors] = useState({ startDate: '', endDate: '' });

  const orderTypes = [
    { label: t('All'), value: OrderTypeEnum.ALL },
    { label: t('Delivery'), value: OrderTypeEnum.RIDER },
    { label: t('Pickup'), value: OrderTypeEnum.STORE },
  ];

  const paymentTypes = [
    { label: t('All'), value: PaymentMethodEnum.ALL },
    { label: t('COD'), value: PaymentMethodEnum.COD },
    { label: t('PayPal'), value: PaymentMethodEnum.PAYPAL },
    { label: t('Stripe'), value: PaymentMethodEnum.STRIPE },
  ];

  const handleStartDateChange = (e: { value: Date | null }) => {
    const newStartDate = e.value ? e.value.toISOString() : '';
    if (
      dateFilters.endingDate &&
      new Date(newStartDate) > new Date(dateFilters.endingDate)
    ) {
      setErrors((prev) => ({
        ...prev,
        startDate: `${t('Start date cannot be after the end date')}.`,
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
        endDate: `${t('End date cannot be before the start date')}.`,
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, endDate: '' }));
    setDateFilters((prev) => ({ ...prev, endingDate: newEndDate }));
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-4">
        <span className="p-input-icon-left w-full md:w-auto">
          <i className="pi pi-search" />
          <InputText
            className="rounded border-2 border-dashed border-gray-400 p-2"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={t('Search')}
          />
        </span>
        <div className="flex flex-col">
          <Calendar
            className="rounded border-2 border-dashed border-gray-400 p-2 text-sm"
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
            <small className="mt-1 text-xs text-red-500">
              {errors.startDate}
            </small>
          )}
        </div>
        <div className="flex flex-col">
          <Calendar
            className="w-18 rounded border-2 border-dashed border-gray-400 p-2 text-sm"
            placeholder={t('End Date')}
            value={
              dateFilters.endingDate ? new Date(dateFilters.endingDate) : null
            }
            onChange={(e) => handleEndDateChange(e as { value: Date | null })}
            dateFormat="dd/mm/yy"
            showIcon
          />
          {errors.endDate && (
            <small className="mt-1 text-xs text-red-500">
              {errors.endDate}
            </small>
          )}
        </div>
        <Dropdown
          className="h-10 rounded border-2 border-dashed border-gray-400 text-sm"
          options={orderTypes}
          value={dateFilters.orderType}
          onChange={(e) =>
            setDateFilters((prev) => ({ ...prev, orderType: e.value }))
          }
          placeholder={`${t('Select')} ${t('Order')} ${t('Type')}`}
        />
        <Dropdown
          className="h-10 rounded border-2 border-dashed border-gray-400 text-sm"
          options={paymentTypes}
          value={dateFilters.paymentMethod}
          onChange={(e) =>
            setDateFilters((prev) => ({ ...prev, paymentMethod: e.value }))
          }
          placeholder={`${t('Select')} ${t('Payment Method')})`}
        />
      </div>
    </div>
  );
}
