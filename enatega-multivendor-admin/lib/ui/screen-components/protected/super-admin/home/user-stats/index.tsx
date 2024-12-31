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

export default function UserStats() {
  const { data, loading } = useQueryGQL(GET_DASHBOARD_USERS, {
    fetchPolicy: 'network-only',
    debounceMs: 300,
  }) as IQueryResult<IDashboardUsersResponseGraphQL | undefined, undefined>;

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
    <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3">
      <StatsCard
        label="Total User"
        total={dashboardUsers?.usersCount ?? 0}
        description="8.5% up from yesterday"
        icon={faUsers}
        route="/general/users"
        loading={loading}
      />
      <StatsCard
        label="Total Vendors"
        total={dashboardUsers?.vendorsCount ?? 0}
        description="2.4% up from yesterday"
        icon={faStore}
        route="/general/vendors"
        loading={loading}
      />
      <StatsCard
        label="Total Stores"
        total={dashboardUsers?.restaurantsCount ?? 0}
        description="6.1% down from yesterday"
        icon={faUtensils}
        route="/general/restaurants"
        loading={loading}
      />
      <StatsCard
        label="Total Riders"
        total={dashboardUsers?.ridersCount ?? 0}
        description="1.9% up from yesterday"
        icon={faMotorcycle}
        route="/general/riders"
        loading={loading}
      />
    </div>
  );
}
