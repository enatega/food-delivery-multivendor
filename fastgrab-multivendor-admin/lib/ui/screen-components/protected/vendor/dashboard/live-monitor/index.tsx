import { GET_VENDOR_LIVE_MONITOR } from '@/lib/api/graphql';
import { VendorLayoutContext } from '@/lib/context/vendor/layout-vendor.context';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import {
  IQueryResult,
  IVendorLiveMonitor,
  IVendorLiveMonitorProps,
  IVendorLiveMonitorResponseGraphQL,
} from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';
import React, { useContext } from 'react';

export default function VendorLiveMonitor({
  dateFilter,
}: IVendorLiveMonitorProps) {
  // Hooks
  const t = useTranslations();

  // Contexts
  const {
    vendorLayoutContextData: { vendorId },
  } = useContext(VendorLayoutContext);

  // Queries
  const { data } = useQueryGQL(
    GET_VENDOR_LIVE_MONITOR,
    {
      id: vendorId,
      dateKeyword: dateFilter.dateKeyword,
      starting_date: dateFilter?.startDate,
      ending_date: dateFilter?.endDate,
    },
    {
      fetchPolicy: 'network-only',
      enabled: !!vendorId,
      pollInterval: 15000,
    }
  ) as IQueryResult<IVendorLiveMonitorResponseGraphQL | undefined, undefined>;

  // Constants
  const {
    online_stores = 0,
    cancelled_orders = 0,
    delayed_orders = 0,
    ratings,
  } = data?.getLiveMonitorData ?? ({} as IVendorLiveMonitor);

  return (
    <div className="mx-auto max-w-md p-2 lg:p-4">
      <h1 className="text-base font-semibold lg:text-lg">
        {t('Live Monitor')}
      </h1>
      <p className="mb-2 text-sm text-gray-500 lg:mb-4 lg:text-base">
        {t('Track the health of your business')}
      </p>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-4">
        <div className="flex items-center rounded-lg border p-2 lg:p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#CED111] text-white lg:h-10 bg-[#CED111] lg:w-10">
            <span className="text-base font-semibold lg:text-lg">
              {online_stores ?? 0}
            </span>
          </div>
          <div className="ml-2 lg:ml-4">
            <h2 className="lg:text-md text-sm font-semibold">{t('Stores')}</h2>
            <p className="text-xs text-gray-500 lg:text-sm">
              {dateFilter.dateKeyword}
            </p>
          </div>
        </div>
        <div className="flex items-center rounded-lg border p-2 lg:p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-500 text-white bg-red-500 lg:h-10 lg:w-10">
            <span className="text-base font-semibold lg:text-lg">
              {cancelled_orders ?? 0}
            </span>
          </div>
          <div className="ml-2 lg:ml-4">
            <h2 className="lg:text-md text-sm font-semibold">
              {t('Cancelled Orders')}
            </h2>
            <p className="text-xs text-gray-500 lg:text-sm">
              {dateFilter.dateKeyword}
            </p>
          </div>
        </div>
        <div className="flex items-center rounded-lg border p-2 lg:p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-500 text-white bg-gray-500 lg:h-10 lg:w-10">
            <span className="text-base font-semibold lg:text-lg">
              {delayed_orders ?? 0}
            </span>
          </div>
          <div className="ml-2 lg:ml-4">
            <h2 className="lg:text-md text-sm font-semibold">
              {t('Delayed Orders')}
            </h2>
            <p className="text-xs text-gray-500 lg:text-sm">
              {dateFilter.dateKeyword}
            </p>
          </div>
        </div>
        <div className="flex items-center rounded-lg border p-2 lg:p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-black text-white lg:h-10 lg:w-10">
            <span className="text-base font-semibold lg:text-lg">
              {ratings ?? 0}
            </span>
          </div>
          <div className="ml-2 lg:ml-4">
            <h2 className="lg:text-md text-sm font-semibold">{t('Ratings')}</h2>
            <p className="text-xs text-gray-500 lg:text-sm">
              {dateFilter.dateKeyword}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
