// Components
import StatsCard from '@/lib/ui/useable-components/stats-card';

// GraphQL Queries
import {
  GET_DASHBOARD_USERS,
  GET_SINGLE_VENDOR_DASHBOARD_CATALOG,
} from '@/lib/api/graphql';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';

// Icons
import {
  IDashboardUsersResponseGraphQL,
  IQueryResult,
  ISingleVendorDashboardCatalogResponseGraphQL,
} from '@/lib/utils/interfaces';

import {
  faMotorcycle,
  faLayerGroup,
  faStore,
  faUsers,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { getSingleVendorDashboardMetrics } from '../single-vendor-dashboard-metrics';

export default function UserStats() {
  // Queries
  const { data, loading } = useQueryGQL(
    GET_DASHBOARD_USERS,
    {},
    {
      fetchPolicy: 'network-only',
      debounceMs: 300,
    }
  ) as IQueryResult<IDashboardUsersResponseGraphQL | undefined, undefined>;

  const { IS_FETCHING_CONFIGURATION, IS_MULTIVENDOR } = useConfiguration();
  const isSingleVendor = IS_MULTIVENDOR === false;
  const { data: catalogData, loading: catalogLoading } = useQueryGQL(
    GET_SINGLE_VENDOR_DASHBOARD_CATALOG,
    {},
    {
      enabled: isSingleVendor,
      fetchPolicy: 'network-only',
      debounceMs: 300,
    }
  ) as IQueryResult<
    ISingleVendorDashboardCatalogResponseGraphQL | undefined,
    undefined
  >;

  // Hooks
  const t = useTranslations();

  const dashboardUsers = useMemo(() => {
    if (!data) return null;
    return {
      usersCount: data?.getDashboardUsers?.usersCount ?? 0,
      vendorsCount: data?.getDashboardUsers?.vendorsCount ?? 0,
      restaurantsCount: data?.getDashboardUsers?.restaurantsCount ?? 0,
      ridersCount: data?.getDashboardUsers?.ridersCount ?? 0,
    };
  }, [data]);

  const catalogMetrics = useMemo(
    () => getSingleVendorDashboardMetrics(catalogData),
    [catalogData]
  );
  const isLoading =
    loading ||
    Boolean(IS_FETCHING_CONFIGURATION) ||
    (isSingleVendor && catalogLoading);

  return (
    <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 cursor-pointer">
      <StatsCard
        label={t(isSingleVendor ? 'Total Customers' : 'Total Users')}
        total={dashboardUsers?.usersCount ?? 0}
        description={
          isSingleVendor ? undefined : t('eight_point_five_up_from_yesterday')
        }
        icon={faUsers}
        route="/general/users"
        loading={isLoading}
      />
      <StatsCard
        label={t(isSingleVendor ? 'Total Products' : 'Total Vendors')}
        total={
          isSingleVendor
            ? catalogMetrics.productsCount
            : (dashboardUsers?.vendorsCount ?? 0)
        }
        description={
          isSingleVendor ? undefined : t('two_point_four_up_from_yesterday')
        }
        icon={isSingleVendor ? faUtensils : faStore}
        route={isSingleVendor ? '/general/stores' : '/general/vendors'}
        loading={isLoading}
      />
      <StatsCard
        label={t(isSingleVendor ? 'Total Categories' : 'Total Stores')}
        total={
          isSingleVendor
            ? catalogMetrics.categoriesCount
            : (dashboardUsers?.restaurantsCount ?? 0)
        }
        description={
          isSingleVendor ? undefined : t('six_point_one_down_from_yesterday')
        }
        icon={isSingleVendor ? faLayerGroup : faUtensils}
        route="/general/stores"
        loading={isLoading}
      />
      <StatsCard
        label={t('Total Riders')}
        total={dashboardUsers?.ridersCount ?? 0}
        description={
          isSingleVendor ? undefined : t('one_point_nine_up_from_yesterday')
        }
        icon={faMotorcycle}
        route="/general/riders"
        loading={isLoading}
      />
    </div>
  );
}
