import {
  GET_DASHBOARD_ORDERS_BY_TYPE,
  GET_DASHBOARD_SALES_BY_TYPE,
} from '@/lib/api/graphql/queries/dashboard';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import DashboardStatsTable from '@/lib/ui/useable-components/dashboard-stats-table';
import {
  IDashboardOrdersByTypeResponseGraphQL,
  IDashboardSalesByTypeResponseGraphQL,
  IQueryResult,
} from '@/lib/utils/interfaces';
import React, { useMemo } from 'react';

export default function StatesTable() {
  // COntext
  const { CURRENCY_CODE } = useConfiguration();

  const { data, loading } = useQueryGQL(GET_DASHBOARD_ORDERS_BY_TYPE, {
    fetchPolicy: 'network-only',
    debounceMs: 300,
  }) as IQueryResult<
    IDashboardOrdersByTypeResponseGraphQL | undefined,
    undefined
  >;

  const { data: salesData, loading: salesLoading } = useQueryGQL(
    GET_DASHBOARD_SALES_BY_TYPE,
    {
      fetchPolicy: 'network-only',
      debounceMs: 300,
    }
  ) as IQueryResult<
    IDashboardSalesByTypeResponseGraphQL | undefined,
    undefined
  >;

  // Memoize the data
  const dashboardOrdersByType = useMemo(() => {
    if (!data) return null;
    return data?.getDashboardOrdersByType;
  }, [data]);

  const dashboardSalesByType = useMemo(() => {
    if (!salesData) return null;
    return salesData?.getDashboardSalesByType;
  }, [salesData]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 p-3">
      <DashboardStatsTable
        loading={loading}
        title="Orders"
        data={dashboardOrdersByType ?? []}
        amountConfig={{ format: 'number', currency: CURRENCY_CODE ?? 'USD' }}
      />
      <DashboardStatsTable
        loading={salesLoading}
        title="Sales"
        data={dashboardSalesByType ?? []}
        amountConfig={{ format: 'currency', currency: CURRENCY_CODE ?? 'USD' }}
      />
    </div>
  );
}
