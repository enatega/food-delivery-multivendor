// Component
import {
  GET_RESTAURANT_DASHBOARD_ORDER_SALES_DETAILS_BY_PAYMENT_METHOD,
} from '@/lib/api/graphql/queries/dashboard';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import {
  IDashboardOrderStatsComponentsProps,
  IDashboardRestaurantOrdersSalesStatsResponseGraphQL,
  IQueryResult,
} from '@/lib/utils/interfaces';
import StatsCard from '@/lib/ui/useable-components/stats-card';

// Interface & Types
import {
  faCashRegister,
  faShoppingCart,
  faTruck,
} from '@fortawesome/free-solid-svg-icons';
import { useContext, useMemo } from 'react';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { useTranslations } from 'next-intl';

export default function UserStats({
  dateFilter,
}: IDashboardOrderStatsComponentsProps) {
  // Hooks
  const t = useTranslations();

  // Context
  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);
  // COntext
  const { CURRENCY_CODE } = useConfiguration();

  const { data, loading } = useQueryGQL(
    GET_RESTAURANT_DASHBOARD_ORDER_SALES_DETAILS_BY_PAYMENT_METHOD,
    {
      restaurant: restaurantId,
      dateKeyword: dateFilter?.dateKeyword,
      starting_date: dateFilter?.startDate,
      ending_date: dateFilter?.endDate,
    },
    {
      fetchPolicy: 'cache-and-network',
      debounceMs: 300,
      enabled: !!restaurantId,
    }
  ) as IQueryResult<
    IDashboardRestaurantOrdersSalesStatsResponseGraphQL | undefined,
    undefined
  >;

  const dashboardUsers = useMemo(() => {
    if (!data) return null;
    const stats =
      data?.getRestaurantDashboardOrderSalesDetailsByPaymentMethod ?? {};
    const totalOrders =
      stats.total_orders ?? stats.all?.[0]?.data?.total_orders ?? 0;
    const pickupOrders =
      stats.pickup_total_orders ??
      stats.pickup_orders ??
      stats.pickup?.total_orders ??
      0;
    const deliveryOrders =
      stats.delivery_total_orders ??
      stats.delivery_orders ??
      stats.delivery?.total_orders ??
      Math.max(totalOrders - pickupOrders, 0);
    return {
      totalOrders,
      pickupOrders,
      deliveryOrders,
      totalSales: stats.total_sales ?? stats.all?.[0]?.data?.total_sales ?? 0,
    };
  }, [data]);

  return (
    <div className="p-3 grid grid-cols-1 items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <StatsCard
        label={t('Total Orders')}
        total={dashboardUsers?.totalOrders ?? 0}
        icon={faShoppingCart}
        route="/admin/store/orders"
        loading={loading}
        amountConfig={{ format: 'number', currency: 'USD' }}
      />

      <StatsCard
        label={t('Pickup Orders')}
        total={dashboardUsers?.pickupOrders ?? 0}
        icon={faShoppingCart}
        route="/admin/store/orders"
        loading={loading}
        amountConfig={{ format: 'number', currency: 'USD' }}
      />

      <StatsCard
        label={t('Delivery Orders')}
        total={dashboardUsers?.deliveryOrders ?? 0}
        icon={faTruck}
        route="/admin/store/orders"
        loading={loading}
        amountConfig={{ format: 'number', currency: 'USD' }}
      />

      <StatsCard
        label={t('Total Sales')}
        total={dashboardUsers?.totalSales ?? 0}
        icon={faCashRegister}
        route="/admin/store/orders"
        loading={loading}
        amountConfig={{ format: 'currency', currency: CURRENCY_CODE ?? 'USD' }}
      />
    </div>
  );
}
