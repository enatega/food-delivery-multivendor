// Components
import StatsCard from '@/lib/ui/useable-components/stats-card';

// GraphQL Queries
import { GET_DASHBOARD_USERS } from '@/lib/api/graphql';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';

// Icons
import {
  IDashboardUsersResponseGraphQL,
  IQueryResult,
} from '@/lib/utils/interfaces';

import {
  faMotorcycle,
  faStore,
  faUsers,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function UserStats() {
  // Queries
  const { data, loading } = useQueryGQL(GET_DASHBOARD_USERS, {
    fetchPolicy: 'network-only',
    debounceMs: 300,
  }) as IQueryResult<IDashboardUsersResponseGraphQL | undefined, undefined>;

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

  return (
    <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 cursor-pointer">
      <StatsCard
        label={t('Total Users')}
        total={dashboardUsers?.usersCount ?? 0}
        description={t('8.5% up from yesterday')}
        icon={faUsers}
        route="/general/users"
        loading={loading}
      />
      <StatsCard
        label={t('Total Vendors')}
        total={dashboardUsers?.vendorsCount ?? 0}
        description={t('2.4% up from yesterday')}
        icon={faStore}
        route="/general/vendors"
        loading={loading}
      />
      <StatsCard
        label={t('Total Stores')}
        total={dashboardUsers?.restaurantsCount ?? 0}
        description={t('6.1% down from yesterday')}
        icon={faUtensils}
        route="/general/stores"
        loading={loading}
      />
      <StatsCard
        label={t('Total Riders')}
        total={dashboardUsers?.ridersCount ?? 0}
        description={t('1.9% up from yesterday')}
        icon={faMotorcycle}
        route="/general/riders"
        loading={loading}
      />
    </div>
  );
}
