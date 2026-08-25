// Core
import { useEffect, useMemo, useState } from 'react';

// Prime React
import { Chart } from 'primereact/chart';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import {
  GET_DASHBOARD_USERS_BY_YEAR,
  GET_SINGLE_VENDOR_DASHBOARD_CATALOG,
} from '@/lib/api/graphql';
import {
  IDashboardUsersByYearResponseGraphQL,
  IQueryResult,
  ISingleVendorDashboardCatalogResponseGraphQL,
} from '@/lib/utils/interfaces';
import DashboardUsersByYearStatsSkeleton from '@/lib/ui/useable-components/custom-skeletons/dasboard.user.year.stats.skeleton';
import { useTranslations } from 'next-intl';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { getSingleVendorDashboardMetrics } from '../single-vendor-dashboard-metrics';

// Dummy

export default function GrowthOverView() {
  // Hooks
  const t = useTranslations();
  const { IS_FETCHING_CONFIGURATION, IS_MULTIVENDOR } = useConfiguration();
  const isSingleVendor = IS_MULTIVENDOR === false;
  const currentYear = new Date().getFullYear();

  // States
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  // Query
  const { data, loading } = useQueryGQL(
    GET_DASHBOARD_USERS_BY_YEAR,
    {
      year: currentYear,
    },
    {
      fetchPolicy: 'network-only',
      debounceMs: 300,
    }
  ) as IQueryResult<
    IDashboardUsersByYearResponseGraphQL | undefined,
    undefined
  >;

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

  const dashboardUsersByYear = useMemo(() => {
    if (!data) return null;
    return {
      usersCount: data?.getDashboardUsersByYear?.usersCount ?? [],
      vendorsCount: data?.getDashboardUsersByYear?.vendorsCount ?? [],
      restaurantsCount: data?.getDashboardUsersByYear?.restaurantsCount ?? [],
      ridersCount: data?.getDashboardUsersByYear?.ridersCount ?? [],
    };
  }, [data]);

  const catalogMetrics = useMemo(
    () => getSingleVendorDashboardMetrics(catalogData, currentYear),
    [catalogData, currentYear]
  );

  // Handlers
  const onChartDataChange = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = '#4b5563'; // tailwind gray-600
    const data = {
      labels: [
        t('January'),
        t('February'),
        t('March'),
        t('April'),
        t('May'),
        t('June'),
        t('July'),
        t('August'),
        t('September'),
        t('October'),
        t('November'),
        t('December'),
      ],
      datasets: [
        {
          label: t(isSingleVendor ? 'Categories' : 'Stores'),
          data: isSingleVendor
            ? catalogMetrics.categoriesByMonth
            : (dashboardUsersByYear?.restaurantsCount ?? []),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          backgroundColor: documentStyle.getPropertyValue('--pink-100'),
          tension: 0.5,
        },
        {
          label: t(isSingleVendor ? 'Products' : 'Vendors'),
          data: isSingleVendor
            ? catalogMetrics.productsByMonth
            : (dashboardUsersByYear?.vendorsCount ?? []),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          backgroundColor: documentStyle.getPropertyValue('--blue-100'),
          tension: 0.5,
        },
        {
          label: t('Riders'),
          data: dashboardUsersByYear?.ridersCount ?? [],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--yellow-500'),
          backgroundColor: documentStyle.getPropertyValue('--yellow-100'),
          tension: 0.5,
        },
        {
          label: t(isSingleVendor ? 'Customers' : 'Users'),
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
  }, [catalogMetrics, dashboardUsersByYear, isSingleVendor, t]);

  return (
    <div className={`w-full p-3`}>
      <h2 className="text-lg font-semibold">{t('Growth Overview')}</h2>
      <p className="text-gray-500">
        {IS_FETCHING_CONFIGURATION
          ? '\u00A0'
          : t(
              isSingleVendor
                ? 'Tracking Business Growth Over the Year'
                : 'Tracking Stakeholders Growth Over the Year'
            )}
      </p>
      <div className="mt-4 bg-white dark:bg-dark-950">
        {loading ||
        IS_FETCHING_CONFIGURATION ||
        (isSingleVendor && catalogLoading) ? (
          <DashboardUsersByYearStatsSkeleton />
        ) : (
          <Chart type="line" data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
