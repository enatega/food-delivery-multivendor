// React and third-party imports
import React, { useContext, useMemo } from 'react';
import { Divider } from 'primereact/divider';

// API and context imports
import { GET_DASHBOARD_ORDER_SALES_DETAILS_BY_PAYMENT_METHOD } from '@/lib/api/graphql/queries/dashboard';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import {
  IDashboardOrderSalesDetailsByPaymentMethodResponseGraphQL,
  IDashboardRestaurantStatesTableComponentsProps,
  IQueryResult,
} from '@/lib/utils/interfaces';

// Component imports
import DashboardRestaurantStatsTable from '@/lib/ui/useable-components/dashboard-restaurant-stats-table';
import HeaderText from '@/lib/ui/useable-components/header-text';

// Constants
import { DASHBOARD_PAYMENT_METHOD } from '@/lib/utils/constants';
import DashboardStatsTableSkeleton from '@/lib/ui/useable-components/custom-skeletons/dashboard.stats.table.skeleton';

// Hooks
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { useTranslations } from 'next-intl';

export default function RestaurantStatesTable({
  dateFilter,
}: IDashboardRestaurantStatesTableComponentsProps) {
  // Hooks
  const t = useTranslations();
  const { CURRENCY_CODE } = useConfiguration();

  // Context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);

  // API
  const { data: salesDetailsData, loading: salesDetailsLoading } = useQueryGQL(
    GET_DASHBOARD_ORDER_SALES_DETAILS_BY_PAYMENT_METHOD,
    {
      restaurant: restaurantLayoutContextData?.restaurantId ?? '',
      dateKeyword: dateFilter?.dateKeyword,
      starting_date: dateFilter.startDate,
      ending_date: dateFilter.endDate,
    },
    {
      fetchPolicy: 'network-only',
      debounceMs: 300,
      enabled: !!restaurantLayoutContextData?.restaurantId,
    }
  ) as IQueryResult<
    IDashboardOrderSalesDetailsByPaymentMethodResponseGraphQL | undefined,
    undefined
  >;

  // Memo
  const dashboardOrderSalesDetailsByPaymentMethod = useMemo(() => {
    if (!salesDetailsData) return null;
    return (
      salesDetailsData?.getDashboardOrderSalesDetailsByPaymentMethod ?? null
    );
  }, [salesDetailsData]);

  // Constants
  const paymentMethod = Object.keys(
    dashboardOrderSalesDetailsByPaymentMethod ?? {}
  );

  if (!dashboardOrderSalesDetailsByPaymentMethod) return;

  return (
    <div className="p-3 bg-gray-50 rounded-lg shadow-md space-y-6">
      {paymentMethod.map((method: string) => {
        const key: keyof typeof dashboardOrderSalesDetailsByPaymentMethod =
          method as keyof typeof dashboardOrderSalesDetailsByPaymentMethod;

        if (key !== 'all' && key !== 'cod' && key !== 'card') return;

        return (
          <>
            <div className="flex flex-col space-y-2">
              <HeaderText text={t(DASHBOARD_PAYMENT_METHOD[key])} />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {salesDetailsLoading ? (
                  <div className="flex justify-center items-center">
                    {new Array(9).fill(0).map((_, index) => {
                      return <DashboardStatsTableSkeleton key={index} />;
                    })}
                  </div>
                ) : (
                  dashboardOrderSalesDetailsByPaymentMethod[
                    method as keyof typeof dashboardOrderSalesDetailsByPaymentMethod
                  ]?.map((item, index) => {
                    return (
                      <DashboardRestaurantStatsTable
                        key={index}
                        loading={salesDetailsLoading}
                        title={item._type}
                        data={item.data}
                        amountConfig={{ currency: CURRENCY_CODE ?? 'USD' }}
                      />
                    );
                  })
                )}
              </div>
            </div>
            <Divider className="my-4 border-t border-gray-300" />
          </>
        );
      })}
    </div>
  );
}
