import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import {
  IQueryResult,
  IStoreRidersResponse,
  UserTypeEnum,
} from '@/lib/utils/interfaces';
import { useMemo, useState } from 'react';
import {
  IEarningTableHeaderProps,
  OrderTypeEnum,
  PaymentMethodEnum,
} from '@/lib/utils/interfaces/';
import { useTranslations } from 'use-intl';

import { useQueryGQL } from '@/lib/hooks/useQueryQL';

import { GET_STORE_RIDER } from '@/lib/api/graphql/queries/concurrent';

export default function EarningTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
  dateFilters,
  setDateFilters,
}: IEarningTableHeaderProps) {
  const [errors, setErrors] = useState({ startDate: '', endDate: '' });
  const [userType, setUserType] = useState<UserTypeEnum>();
  // Hooks
  const t = useTranslations();

  // Query
  const { data } = useQueryGQL(GET_STORE_RIDER, {
    fetchPolicy: 'network-only',
  }) as IQueryResult<IStoreRidersResponse | undefined, undefined>;

  const storesDropdown = useMemo(
    () =>
      data?.restaurants?.map((store) => {
        return { label: store.name, value: store._id };
      }),
    [data?.restaurants]
  );

  const ridersDropdown = useMemo(
    () =>
      data?.riders.map((rider) => {
        return { label: rider.name, value: rider._id };
      }),
    [data?.riders]
  );

  // Constants
  const userTypes = [
    { label: t('All'), value: UserTypeEnum.ALL },
    { label: t('Rider'), value: UserTypeEnum.RIDER },
    { label: t('Store'), value: UserTypeEnum.STORE },
  ];

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

  // Handlers
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
    <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-4">
        <span className="p-input-icon-left w-full md:w-auto">
          <i className="pi pi-search" />
          <InputText
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={t('Search')}
          />
        </span>
        <div className="flex flex-col">
          <Calendar
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-sm"
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
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-sm"
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
          className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-sm"
          options={userTypes}
          value={userType}
          onChange={(e) => {
            if (e.value === UserTypeEnum.ALL) {
              setDateFilters((prev) => ({
                ...prev,
                userType: e.value,
                userId: undefined,
              }));
            } else {
              setUserType(e.value);
            }
          }}
          placeholder={`${t('Select')} ${t('User')} ${t('Type')}`}
        />
        {userType !== undefined && userType !== 'ALL' && (
          <Dropdown
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-sm"
            options={userType === 'RIDER' ? ridersDropdown : storesDropdown}
            value={dateFilters.userId}
            onChange={(e) =>
              setDateFilters((prev) => ({ ...prev, userType, userId: e.value }))
            }
            placeholder={t('Select User ID')}
          />
        )}
        <Dropdown
          className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-sm"
          options={orderTypes}
          value={dateFilters.orderType}
          onChange={(e) =>
            setDateFilters((prev) => ({ ...prev, orderType: e.value }))
          }
          placeholder={`${t('Select')} ${t('Order')} ${t('Type')}`}
        />
        <Dropdown
          className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-sm"
          options={paymentTypes}
          value={dateFilters.paymentMethod}
          onChange={(e) =>
            setDateFilters((prev) => ({ ...prev, paymentMethod: e.value }))
          }
          placeholder={t(`${t('Select')} ${t('Payment Method')}`)}
        />
      </div>
    </div>
  );
}
