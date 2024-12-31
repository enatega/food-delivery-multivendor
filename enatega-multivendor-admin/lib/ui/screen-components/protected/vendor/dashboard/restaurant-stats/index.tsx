import { useContext, useMemo } from 'react';
// Component
import { GET_VENDOR_DASHBOARD_STATS_CARD_DETAILS } from '@/lib/api/graphql/queries/dashboard';
import StatsCard from '@/lib/ui/useable-components/stats-card';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { useConfiguration } from '@/lib/hooks/useConfiguration';

// Interface & Types
import {
  IDashboardOrderStatsComponentsProps,
  IQueryResult,
  IVendorDashboardStatsCardDetailsResponseGraphQL,
} from '@/lib/utils/interfaces';

// Icons
import {
  faShoppingCart,
  faShop,
  faTruck,
} from '@fortawesome/free-solid-svg-icons';

// Context
import { VendorLayoutContext } from '@/lib/context/vendor/layout-vendor.context';

export default function RestaurantStats({
  dateFilter,
}: IDashboardOrderStatsComponentsProps) {
  // Context
  const {
    vendorLayoutContextData: { vendorId },
  } = useContext(VendorLayoutContext);
  // COntext
  const { CURRENCY_CODE } = useConfiguration();

  const { data, loading } = useQueryGQL(
    GET_VENDOR_DASHBOARD_STATS_CARD_DETAILS,
    {
      vendorId,
      dateKeyword: dateFilter.dateKeyword,
      starting_date: dateFilter?.startDate,
      ending_date: dateFilter?.endDate,
    },
    {
      fetchPolicy: 'network-only',
      debounceMs: 300,
    }
  ) as IQueryResult<
    IVendorDashboardStatsCardDetailsResponseGraphQL | undefined,
    undefined
  >;

  const dashboardStats = useMemo(() => {
    if (!data) return null;
    return {
      totalOrders: data?.getVendorDashboardStatsCardDetails?.totalOrders ?? 0,
      totalSales: data?.getVendorDashboardStatsCardDetails?.totalSales ?? 0,
      totalDeliveries:
        data?.getVendorDashboardStatsCardDetails?.totalDeliveries ?? 0,
      totalRestaurants:
        data?.getVendorDashboardStatsCardDetails?.totalRestaurants ?? 0,
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 items-center gap-6 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <StatsCard
        label="Total Stores"
        total={dashboardStats?.totalRestaurants ?? 0}
        icon={faShop}
        route=""
        loading={loading}
        amountConfig={{ format: 'number', currency: 'USD' }}
      />

      <StatsCard
        label="Total Sales"
        total={dashboardStats?.totalSales ?? 0}
        icon={faShop}
        route=""
        loading={loading}
        amountConfig={{ format: 'currency', currency: CURRENCY_CODE ?? 'USD' }}
      />

      <StatsCard
        label="Total Orders"
        total={dashboardStats?.totalOrders ?? 0}
        icon={faShoppingCart}
        route=""
        loading={loading}
        amountConfig={{ format: 'number', currency: 'USD' }}
      />

      <StatsCard
        label="Total Deliveries"
        total={dashboardStats?.totalDeliveries ?? 0}
        icon={faTruck}
        route=""
        loading={loading}
        amountConfig={{ format: 'number', currency: 'USD' }}
      />
    </div>
  );
}
