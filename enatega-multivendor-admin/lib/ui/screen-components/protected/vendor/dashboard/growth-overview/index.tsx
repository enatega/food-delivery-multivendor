'use client';
// Core
import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

// Prime React
import { Chart } from 'primereact/chart';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import {
  GET_STORE_DETAILS_BY_VENDOR_ID,
  GET_VENDOR_DASHBOARD_GROWTH_DETAILS_BY_YEAR,
} from '@/lib/api/graphql';
import {
  IDashboardGrowthOverviewComponentsProps,
  IDashboardVendorGrowthOverViewTabularComponentsProps,
  IGetVendorDashboardGrowthDetailsByYearResponseGraphQL,
  IQueryResult,
  IVendorStoreDetails,
  IVendorStoreDetailsResponseGraphQL,
} from '@/lib/utils/interfaces';
import DashboardUsersByYearStatsSkeleton from '@/lib/ui/useable-components/custom-skeletons/dasboard.user.year.stats.skeleton';
import { VendorLayoutContext } from '@/lib/context/vendor/layout-vendor.context';
import Table from '@/lib/ui/useable-components/table';
import { VENDOR_STORE_DETAILS_COLUMN } from '@/lib/ui/useable-components/table/columns/store-details-by-vendor-columns';
import { DataTableRowClickEvent } from 'primereact/datatable';
import { onUseLocalStorage } from '@/lib/utils/methods';
import { generateVendorStoreDetails } from '@/lib/utils/dummy';

// Dummy

const VendorGrowthOverViewGraph = () => {
  // Context
  const {
    vendorLayoutContextData: { vendorId },
  } = useContext(VendorLayoutContext);

  // States
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  // Query
  const { data, loading } = useQueryGQL(
    GET_VENDOR_DASHBOARD_GROWTH_DETAILS_BY_YEAR,
    {
      vendorId,
      year: new Date().getFullYear(),
    },
    {
      fetchPolicy: 'network-only',
      debounceMs: 300,
    }
  ) as IQueryResult<
    IGetVendorDashboardGrowthDetailsByYearResponseGraphQL | undefined,
    undefined
  >;

  const dashboardVendorDetailsByYear = useMemo(() => {
    if (!data) return null;
    return {
      totalRestaurants:
        data?.getVendorDashboardGrowthDetailsByYear.totalRestaurants ?? [],
      totalOrders:
        data?.getVendorDashboardGrowthDetailsByYear?.totalOrders ?? [],
      totalSales: data?.getVendorDashboardGrowthDetailsByYear?.totalSales ?? [],
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
          label: 'Restaurants',
          data: dashboardVendorDetailsByYear?.totalRestaurants ?? [],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          backgroundColor: documentStyle.getPropertyValue('--pink-100'),
          tension: 0.5,
        },
        {
          label: 'Orders',
          data: dashboardVendorDetailsByYear?.totalOrders ?? [],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          backgroundColor: documentStyle.getPropertyValue('--blue-100'),
          tension: 0.5,
        },
        {
          label: 'Sales',
          data: dashboardVendorDetailsByYear?.totalSales ?? [],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--yellow-500'),
          backgroundColor: documentStyle.getPropertyValue('--yellow-100'),
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
  }, [dashboardVendorDetailsByYear]);

  return (
    <div className={`w-full p-3`}>
      <h2 className="text-lg font-semibold">Growth Overview</h2>
      <p className="text-gray-500">
        Tracking Vendor Growth Over the Year ({new Date().getFullYear()})
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
};

const VendorGrowthOverViewTabular = ({
  dateFilter,
}: IDashboardVendorGrowthOverViewTabularComponentsProps) => {
  const {
    vendorLayoutContextData: { vendorId },
  } = useContext(VendorLayoutContext);

  // Hooks
  const router = useRouter();

  const { data, loading } = useQueryGQL(
    GET_STORE_DETAILS_BY_VENDOR_ID,
    {
      id: vendorId,
      dateKeyword: dateFilter?.dateKeyword,
      starting_date: dateFilter?.startDate ?? '',
      ending_date: dateFilter?.endDate ?? '',
    },
    {
      fetchPolicy: 'network-only',
      enabled: !!vendorId,
    }
  ) as IQueryResult<IVendorStoreDetailsResponseGraphQL | undefined, undefined>;

  // Handler
  const handleRowClick = (event: DataTableRowClickEvent) => {
    const details = event.data as IVendorStoreDetails;
    onUseLocalStorage('save', 'restaurantId', details._id);
    router.push(`/admin/restaurant/`);
  };

  return (
    <div className="p-3">
      <Table
        data={
          data?.getStoreDetailsByVendorId ||
          (loading ? generateVendorStoreDetails() : [])
        }
        setSelectedData={() => {}}
        selectedData={[]}
        columns={VENDOR_STORE_DETAILS_COLUMN()}
        loading={loading}
        handleRowClick={handleRowClick}
      />
    </div>
  );
};

export default function VendorGrowthOverView({
  isStoreView,
  dateFilter,
}: IDashboardGrowthOverviewComponentsProps) {
  // Add keyword filter to the VendorGrowthOverViewGraphq
  return isStoreView ? (
    <VendorGrowthOverViewTabular dateFilter={dateFilter} />
  ) : (
    <VendorGrowthOverViewGraph />
  );
}
