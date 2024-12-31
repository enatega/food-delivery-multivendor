// Core
import { useEffect, useMemo, useState } from 'react';

// Prime React
import { Chart } from 'primereact/chart';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { GET_DASHBOARD_USERS_BY_YEAR } from '@/lib/api/graphql';
import {
  IDashboardUsersByYearResponseGraphQL,
  IQueryResult,
} from '@/lib/utils/interfaces';
import DashboardUsersByYearStatsSkeleton from '@/lib/ui/useable-components/custom-skeletons/dasboard.user.year.stats.skeleton';

// Dummy

export default function GrowthOverView() {
  // States
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  // Query
  const { data, loading } = useQueryGQL(
    GET_DASHBOARD_USERS_BY_YEAR,
    {
      year: new Date().getFullYear(),
    },
    {
      fetchPolicy: 'network-only',
      debounceMs: 300,
    }
  ) as IQueryResult<
    IDashboardUsersByYearResponseGraphQL | undefined,
    undefined
  >;

  const dashboardUsersByYear = useMemo(() => {
    if (!data) return null;
    return {
      usersCount: data?.getDashboardUsersByYear?.usersCount ?? [],
      vendorsCount: data?.getDashboardUsersByYear?.vendorsCount ?? [],
      restaurantsCount: data?.getDashboardUsersByYear?.restaurantsCount ?? [],
      ridersCount: data?.getDashboardUsersByYear?.ridersCount ?? 0,
    };
  }, [data]);

  // Handlers
  const onChartDataChange = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const data = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      datasets: [
        {
          label: 'Stores',
          data: dashboardUsersByYear?.restaurantsCount ?? [],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          backgroundColor: documentStyle.getPropertyValue('--pink-100'),
          tension: 0.5,
        },
        {
          label: 'Vendors',
          data: dashboardUsersByYear?.vendorsCount ?? [],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          backgroundColor: documentStyle.getPropertyValue('--blue-100'),
          tension: 0.5,
        },
        {
          label: 'Riders',
          data: dashboardUsersByYear?.ridersCount ?? [],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--yellow-500'),
          backgroundColor: documentStyle.getPropertyValue('--yellow-100'),
          tension: 0.5,
        },
        {
          label: 'Users',
          data: dashboardUsersByYear?.usersCount ?? [],
          fill: true,

          borderColor: 'rgba(90, 193, 47, 1)',
          backgroundColor: 'rgba(201, 232, 189, 0.2)',
          tension: 0.5,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,

      plugins: {
        legend: {
          marginBottom: '20px',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            backgroundColor: textColor,
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  };
  // Use Effect
  useEffect(() => {
    onChartDataChange();
  }, [dashboardUsersByYear]);

  return (
    <div className={`w-full p-3`}>
      <h2 className="text-lg font-semibold">Growth Overview</h2>
      <p className="text-gray-500">
        Tracking Stackholders Growth Over the Year
      </p>
      <div className="mt-4">
        {loading ? (
          <DashboardUsersByYearStatsSkeleton />
        ) : (
          <Chart type="line" data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
